package com.budget.tracker.controller;

import com.budget.tracker.dto.BudgetResponse;
import com.budget.tracker.model.Budget;
import com.budget.tracker.model.Category;
import com.budget.tracker.model.User;
import com.budget.tracker.repository.BudgetRepository;
import com.budget.tracker.repository.CategoryRepository;
import com.budget.tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetRepository budgetRepo;
    private final CategoryRepository catRepo;
    private final UserRepository userRepo;

    public BudgetController(BudgetRepository budgetRepo, CategoryRepository catRepo, UserRepository userRepo) {
        this.budgetRepo = budgetRepo;
        this.catRepo = catRepo;
        this.userRepo = userRepo;
    }

    private Long getUserId(Authentication auth) {
        return (Long) auth.getCredentials();
    }

    /** Get all budgets for a given month/year. */
    @GetMapping("/{year}/{month}")
    public ResponseEntity<List<BudgetResponse>> getByMonth(
            @PathVariable int year, @PathVariable int month, Authentication auth) {
        return ResponseEntity.ok(
            budgetRepo.findByUserIdAndMonthAndYear(getUserId(auth), month, year)
                      .stream().map(BudgetResponse::from).toList()
        );
    }

    /** Create or update a budget for a category+month+year. */
    @PostMapping
    public ResponseEntity<BudgetResponse> upsert(@RequestBody Map<String, Object> body, Authentication auth) {
        Long userId = Objects.requireNonNull(getUserId(auth));
        User user = userRepo.findById(userId).orElseThrow();
        Long categoryId = Long.parseLong(body.get("categoryId").toString());
        int month = Integer.parseInt(body.get("month").toString());
        int year = Integer.parseInt(body.get("year").toString());
        BigDecimal limitAmount = new BigDecimal(body.get("limitAmount").toString());

        Category cat = catRepo.findById(categoryId).orElseThrow();

        Budget budget = budgetRepo.findByUserIdAndCategoryIdAndMonthAndYear(userId, categoryId, month, year)
            .map(existing -> {
                existing.setLimitAmount(limitAmount);
                return existing;
            })
            .orElse(Budget.builder()
                .user(user)
                .category(cat)
                .limitAmount(limitAmount)
                .month(month)
                .year(year)
                .build());

        return ResponseEntity.ok(BudgetResponse.from(budgetRepo.save(budget)));
    }

    /** Delete a budget by ID (only if owned by the user). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        return budgetRepo.findById(id)
            .filter(b -> b.getUser().getId().equals(getUserId(auth)))
            .<ResponseEntity<Void>>map(b -> { budgetRepo.delete(b); return ResponseEntity.<Void>noContent().build(); })
            .orElse(ResponseEntity.<Void>notFound().build());
    }
}

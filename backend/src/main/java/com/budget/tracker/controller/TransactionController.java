package com.budget.tracker.controller;

import com.budget.tracker.dto.TransactionResponse;
import com.budget.tracker.model.Transaction;
import com.budget.tracker.model.Transaction.TransactionType;
import com.budget.tracker.model.Category;
import com.budget.tracker.model.User;
import com.budget.tracker.repository.TransactionRepository;
import com.budget.tracker.repository.CategoryRepository;
import com.budget.tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository txRepo;
    private final CategoryRepository catRepo;
    private final UserRepository userRepo;

    public TransactionController(TransactionRepository txRepo, CategoryRepository catRepo, UserRepository userRepo) {
        this.txRepo = txRepo;
        this.catRepo = catRepo;
        this.userRepo = userRepo;
    }

    private Long getUserId(Authentication auth) {
        return (Long) auth.getCredentials();
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(Authentication auth) {
        return ResponseEntity.ok(
            txRepo.findByUserIdOrderByDateDesc(getUserId(auth))
                  .stream().map(TransactionResponse::from).toList()
        );
    }

    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<TransactionResponse>> getByMonth(
            @PathVariable int year, @PathVariable int month, Authentication auth) {
        return ResponseEntity.ok(
            txRepo.findByUserIdAndMonthAndYear(getUserId(auth), month, year)
                  .stream().map(TransactionResponse::from).toList()
        );
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestBody Map<String, Object> body, Authentication auth) {
        Long userId = Objects.requireNonNull(getUserId(auth));
        User user = userRepo.findById(userId).orElseThrow();
        Category cat = catRepo.findById(Long.parseLong(body.get("categoryId").toString())).orElseThrow();

        Transaction tx = Transaction.builder()
            .amount(new BigDecimal(body.get("amount").toString()))
            .description(body.get("description").toString())
            .date(LocalDate.parse(body.get("date").toString()))
            .type(TransactionType.valueOf(body.get("type").toString()))
            .category(cat)
            .user(user)
            .build();

        return ResponseEntity.ok(TransactionResponse.from(Objects.requireNonNull(txRepo.save(tx))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(@PathVariable @NonNull Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        return txRepo.findById(id)
            .filter(tx -> tx.getUser().getId().equals(Objects.requireNonNull(getUserId(auth))))
            .map(tx -> {
                tx.setAmount(new BigDecimal(body.get("amount").toString()));
                tx.setDescription(body.get("description").toString());
                tx.setDate(LocalDate.parse(body.get("date").toString()));
                tx.setType(TransactionType.valueOf(body.get("type").toString()));
                catRepo.findById(Long.parseLong(body.get("categoryId").toString()))
                    .ifPresent(tx::setCategory);
                return ResponseEntity.ok(TransactionResponse.from(Objects.requireNonNull(txRepo.save(tx))));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @NonNull Long id, Authentication auth) {
        ResponseEntity<Void> notFound = ResponseEntity.<Void>notFound().build();
        return txRepo.findById(id)
            .filter(tx -> tx.getUser().getId().equals(Objects.requireNonNull(getUserId(auth))))
            .<ResponseEntity<Void>>map(tx -> { txRepo.delete(tx); return ResponseEntity.<Void>noContent().build(); })
            .orElse(notFound);
    }
}

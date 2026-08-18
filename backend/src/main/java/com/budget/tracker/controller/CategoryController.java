package com.budget.tracker.controller;

import com.budget.tracker.dto.CategoryResponse;
import com.budget.tracker.model.Category;
import com.budget.tracker.model.User;
import com.budget.tracker.repository.CategoryRepository;
import com.budget.tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository catRepo;
    private final UserRepository userRepo;

    public CategoryController(CategoryRepository catRepo, UserRepository userRepo) {
        this.catRepo = catRepo;
        this.userRepo = userRepo;
    }

    private Long getUserId(Authentication auth) {
        return (Long) auth.getCredentials();
    }

    /** Returns all categories visible to the user (global + user-owned). */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll(Authentication auth) {
        return ResponseEntity.ok(
            catRepo.findByUserIdOrUserIsNull(getUserId(auth))
                   .stream().map(CategoryResponse::from).toList()
        );
    }

    /** Creates a user-owned category. */
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody Map<String, Object> body, Authentication auth) {
        Long userId = Objects.requireNonNull(getUserId(auth));
        User user = userRepo.findById(userId).orElseThrow();

        Category cat = Category.builder()
            .name(body.get("name").toString())
            .icon(body.containsKey("icon") ? body.get("icon").toString() : null)
            .color(body.containsKey("color") ? body.get("color").toString() : null)
            .type(Category.CategoryType.valueOf(body.get("type").toString()))
            .user(user)
            .build();

        return ResponseEntity.ok(CategoryResponse.from(catRepo.save(cat)));
    }

    /** Deletes a user-owned category (cannot delete global categories). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        return catRepo.findById(id)
            .filter(cat -> cat.getUser() != null && cat.getUser().getId().equals(getUserId(auth)))
            .<ResponseEntity<Void>>map(cat -> { catRepo.delete(cat); return ResponseEntity.<Void>noContent().build(); })
            .orElse(ResponseEntity.<Void>notFound().build());
    }
}

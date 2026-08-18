package com.budget.tracker.dto;

import com.budget.tracker.model.Transaction;
import com.budget.tracker.model.Category;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
    Long id,
    BigDecimal amount,
    String description,
    LocalDate date,
    String type,
    Long categoryId,
    String categoryName,
    String categoryIcon,
    String categoryColor,
    Long userId,
    LocalDateTime createdAt
) {
    public static TransactionResponse from(Transaction t) {
        Category cat = t.getCategory();
        return new TransactionResponse(
            t.getId(),
            t.getAmount(),
            t.getDescription(),
            t.getDate(),
            t.getType().name(),
            cat != null ? cat.getId() : null,
            cat != null ? cat.getName() : null,
            cat != null ? cat.getIcon() : null,
            cat != null ? cat.getColor() : null,
            t.getUser().getId(),
            t.getCreatedAt()
        );
    }
}

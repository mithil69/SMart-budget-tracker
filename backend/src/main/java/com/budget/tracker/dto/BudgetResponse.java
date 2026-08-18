package com.budget.tracker.dto;

import com.budget.tracker.model.Budget;
import java.math.BigDecimal;

public record BudgetResponse(
    Long id,
    Long categoryId,
    String categoryName,
    String categoryIcon,
    String categoryColor,
    BigDecimal limitAmount,
    Integer month,
    Integer year
) {
    public static BudgetResponse from(Budget b) {
        return new BudgetResponse(
            b.getId(),
            b.getCategory().getId(),
            b.getCategory().getName(),
            b.getCategory().getIcon(),
            b.getCategory().getColor(),
            b.getLimitAmount(),
            b.getMonth(),
            b.getYear()
        );
    }
}

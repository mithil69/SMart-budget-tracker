package com.budget.tracker.dto;

import com.budget.tracker.model.Category;

public record CategoryResponse(
    Long id,
    String name,
    String icon,
    String color,
    String type,
    boolean isGlobal
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
            c.getId(),
            c.getName(),
            c.getIcon(),
            c.getColor(),
            c.getType().name(),
            c.getUser() == null
        );
    }
}

package com.budget.tracker.config;

import com.budget.tracker.model.Category;
import com.budget.tracker.repository.CategoryRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    ApplicationRunner seedDefaultCategories(CategoryRepository catRepo) {
        return args -> {
            if (catRepo.count() == 0) {
                catRepo.saveAll(List.of(
                    category("Salary",      "💼", "#22c55e", Category.CategoryType.INCOME),
                    category("Freelance",   "💻", "#16a34a", Category.CategoryType.INCOME),
                    category("Investment",  "📈", "#15803d", Category.CategoryType.INCOME),
                    category("Other Income","💰", "#4ade80", Category.CategoryType.INCOME),
                    category("Food",        "🍔", "#ef4444", Category.CategoryType.EXPENSE),
                    category("Transport",   "🚗", "#f97316", Category.CategoryType.EXPENSE),
                    category("Shopping",    "🛍️", "#a855f7", Category.CategoryType.EXPENSE),
                    category("Health",      "💊", "#06b6d4", Category.CategoryType.EXPENSE),
                    category("Housing",     "🏠", "#3b82f6", Category.CategoryType.EXPENSE),
                    category("Education",   "📚", "#eab308", Category.CategoryType.EXPENSE),
                    category("Entertainment","🎬","#ec4899", Category.CategoryType.EXPENSE),
                    category("Utilities",   "💡", "#64748b", Category.CategoryType.EXPENSE)
                ));
            }
        };
    }

    private Category category(String name, String icon, String color, Category.CategoryType type) {
        return Category.builder().name(name).icon(icon).color(color).type(type).build();
    }
}

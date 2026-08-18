package com.budget.tracker.controller;

import com.budget.tracker.model.Transaction.TransactionType;
import com.budget.tracker.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TransactionRepository txRepo;

    public DashboardController(TransactionRepository txRepo) {
        this.txRepo = txRepo;
    }

    private Long getUserId(Authentication auth) {
        return (Long) auth.getCredentials();
    }

    @GetMapping("/stats/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlyStats(
            @PathVariable int year, @PathVariable int month, Authentication auth) {
        Long uid = getUserId(auth);
        BigDecimal income = txRepo.sumByUserIdAndTypeAndMonthAndYear(uid, TransactionType.INCOME, month, year);
        BigDecimal expense = txRepo.sumByUserIdAndTypeAndMonthAndYear(uid, TransactionType.EXPENSE, month, year);
        income = income == null ? BigDecimal.ZERO : income;
        expense = expense == null ? BigDecimal.ZERO : expense;

        Map<String, Object> stats = new HashMap<>();
        stats.put("income", income);
        stats.put("expense", expense);
        stats.put("balance", income.subtract(expense));
        stats.put("month", month);
        stats.put("year", year);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/trend")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTrend(Authentication auth) {
        Long uid = getUserId(auth);
        List<Map<String, Object>> trend = new ArrayList<>();
        YearMonth now = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            int m = ym.getMonthValue();
            int y = ym.getYear();
            BigDecimal income = txRepo.sumByUserIdAndTypeAndMonthAndYear(uid, TransactionType.INCOME, m, y);
            BigDecimal expense = txRepo.sumByUserIdAndTypeAndMonthAndYear(uid, TransactionType.EXPENSE, m, y);
            income = income == null ? BigDecimal.ZERO : income;
            expense = expense == null ? BigDecimal.ZERO : expense;
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", ym.getMonth().name().substring(0, 3));
            entry.put("income", income);
            entry.put("expense", expense);
            entry.put("balance", income.subtract(expense));
            trend.add(entry);
        }
        return ResponseEntity.ok(trend);
    }
}

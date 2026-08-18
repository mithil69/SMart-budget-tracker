package com.budget.tracker.repository;

import com.budget.tracker.model.Transaction;
import com.budget.tracker.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND FUNCTION('MONTH', t.date) = :month " +
           "AND FUNCTION('YEAR', t.date) = :year " +
           "ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndMonthAndYear(
        @Param("userId") Long userId,
        @Param("month") int month,
        @Param("year") int year
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type " +
           "AND FUNCTION('MONTH', t.date) = :month " +
           "AND FUNCTION('YEAR', t.date) = :year")
    java.math.BigDecimal sumByUserIdAndTypeAndMonthAndYear(
        @Param("userId") Long userId,
        @Param("type") TransactionType type,
        @Param("month") int month,
        @Param("year") int year
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type " +
           "AND t.category.id = :categoryId " +
           "AND FUNCTION('MONTH', t.date) = :month " +
           "AND FUNCTION('YEAR', t.date) = :year")
    java.math.BigDecimal sumByCategoryAndMonth(
        @Param("userId") Long userId,
        @Param("categoryId") Long categoryId,
        @Param("type") TransactionType type,
        @Param("month") int month,
        @Param("year") int year
    );
}

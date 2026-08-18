package com.budget.tracker.repository;

import com.budget.tracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserIdOrUserIsNull(Long userId);

    @Query("SELECT c FROM Category c WHERE (c.user.id = :userId OR c.user IS NULL) AND c.type = :type")
    List<Category> findByUserIdOrUserIsNullAndType(@Param("userId") Long userId, @Param("type") Category.CategoryType type);
}

package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select c from Category c order by c.id limit 3")
    List<Category> findThreeCategory();
}

package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.Category;
import com.project.shop_online_be.Model.Product;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query(value = "(SELECT * FROM product WHERE category_id = :cate1 ORDER BY id FETCH FIRST 10 ROWS ONLY)" +
            "UNION ALL" +
            "(SELECT * FROM product WHERE category_id = :cate2 ORDER BY id FETCH FIRST 10 ROWS ONLY)" +
            "UNION ALL" +
            "(SELECT * FROM product WHERE category_id = :cate3 ORDER BY id FETCH FIRST 10 ROWS ONLY)"
    , nativeQuery = true)
    List<Product> findTop10ProductsFromFirst3Categories(Long cate1, Long cate2, Long cate3);


    @Query(value = "select * from product p where p.category_id = :categoryId and p.id != :productId limit 12" ,
            nativeQuery = true)
    List<Product> findByCategory(Long categoryId, Long productId);

    @Query("select p from Product p join ProductDetail pd on p = pd.product order by  pd.price limit 15")
    List<Product> findHotDealProduct();
}

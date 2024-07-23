package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Response.ProductInHomePageResponse;
import com.project.shop_online_be.Response.ProductResponse;
import com.project.shop_online_be.Service.ProductDetailService;
import com.project.shop_online_be.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/product")
public class ProductController {
    private final ProductService productService;
    private final ProductDetailService productDetailService;
    @GetMapping()
    public ResponseEntity<?> findAllProduct(
            @RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "0") Integer orderBy,
            PagedResourcesAssembler assembler) {
        return ResponseEntity.ok(assembler.toModel(productService.getProducts(page,orderBy)));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Float> attributes,
            @RequestParam(required = false, defaultValue = "0") Integer orderBy,
            @RequestParam(defaultValue = "0") Integer page,
            PagedResourcesAssembler assembler) {
        return ResponseEntity.ok(
                assembler.toModel(
                        productService.searchProduct(minPrice, maxPrice, keyword,attributes,orderBy,page)
                )
        );
    }

    @GetMapping("/by-category")
    public ResponseEntity<?> searchByCategory(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) List<Float> attributes,
            @RequestParam(required = false, defaultValue = "0") Integer orderBy,
            @RequestParam(defaultValue = "0") Integer page,
            PagedResourcesAssembler assembler) {
        return ResponseEntity.ok(
                assembler.toModel(
                        productService.getProductByCategory(minPrice, maxPrice, categoryId,attributes,orderBy,page)
                )
        );
    }

    @GetMapping("/same-cate")
    public ResponseEntity<?> findByCategory(
            @RequestParam Long categoryId, @RequestParam Long productId) {
        return ResponseEntity.ok((productService.getTheSameProduct(categoryId,productId)));
    }

    @GetMapping("/detail")
    public ResponseEntity<?> findProductById(@RequestParam Long id) {
        try {
            return ResponseEntity.ok(productService.getDetailProduct(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/home")
    public ResponseEntity<List<ProductInHomePageResponse>> findAllProductInHome() {
        return ResponseEntity.ok(productService.findProductInHome());

    }

    @GetMapping("/hot-deal")
    public ResponseEntity<List<ProductResponse>> findHotDeal() {
        return ResponseEntity.ok(productService.findHotDeal());
    }

    @GetMapping("/value-for-filter")
    public ResponseEntity<?> findValueForFilter() {
        return ResponseEntity.ok(productDetailService.findValueForFilter());
    }





}

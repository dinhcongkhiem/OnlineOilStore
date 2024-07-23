package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.Attribute;
import com.project.shop_online_be.Model.Category;
import com.project.shop_online_be.Model.Product;
import com.project.shop_online_be.Model.ProductDetail;
import com.project.shop_online_be.Repository.AttributeRepository;
import com.project.shop_online_be.Repository.ProductRepository;
import com.project.shop_online_be.Repository.Specification.ProductSpecification;
import com.project.shop_online_be.Response.*;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final AttributeRepository attributeRepository;
    private final ProductDetailService productDetailService;

    public Page<ProductResponse> getProducts(Integer page, Integer orderby) {
        Pageable pageRequest = PageRequest.of(page, 20, getSortDirection(orderby));
        Page<Product> pageProduct = productRepository.findAll(pageRequest);
        return pageProduct.map(this::convertToProductResponse);

    }

    public Page<ProductResponse> searchProduct(BigDecimal minPrice,
                                       BigDecimal maxPrice,
                                       String key,
                                       List<Float> weights,
                                       Integer orderBy,
                                       Integer page) {
        Pageable pageable = PageRequest.of(page, 20, getSortDirection(orderBy));
        if (minPrice == null && maxPrice == null && weights.isEmpty()) {
            return searchByKeyword(key, pageable).map(this::convertToProductResponse);
        } else if (weights.isEmpty()) {
            return searchByPriceAndKeyword(minPrice, maxPrice, key, pageable).map(this::convertToProductResponse);

        } else {
            return searchByPriceAndAttribute(minPrice, maxPrice, key, weights, pageable).map(this::convertToProductResponse);
        }
    }

    public Page<ProductResponse> getProductByCategory(BigDecimal minPrice,
                                              BigDecimal maxPrice,
                                              Long categoryId,
                                              List<Float> weights,
                                              Integer orderBy,
                                              Integer page) {
        Pageable pageable = PageRequest.of(page, 20, getSortDirection(orderBy));
        if (minPrice == null && maxPrice == null && weights.isEmpty()) {
            return searchByCategory(categoryId, pageable).map(this::convertToProductResponse);
        } else if (weights.isEmpty()) {
            return searchByPriceAndCategory(minPrice, maxPrice, categoryId, pageable).map(this::convertToProductResponse);

        } else {
            return searchByCategoryAndAttribute(minPrice, maxPrice, categoryId, weights, pageable).map(this::convertToProductResponse);
        }
    }

    public List<ProductResponse> getTheSameProduct(Long categoryId, Long productId) {
        return productRepository.findByCategory(categoryId, productId)
                .stream()
                .map(this::convertToProductResponse).toList();
    }

    public ProductResponse convertToProductResponse(Product product) {
        List<ProductDetail> productDetails = product.getProductDetails();
        BigDecimal maxPrice = productDetails.stream()
                .max(Comparator.comparing(ProductDetail::getPrice))
                .map(ProductDetail::getPrice)
                .orElseThrow(NoSuchElementException::new);

        BigDecimal minPrice = productDetails.stream()
                .min(Comparator.comparing(ProductDetail::getPrice))
                .map(ProductDetail::getPrice)
                .orElseThrow(NoSuchElementException::new);


        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .maxPrice(maxPrice)
                .minPrice(minPrice)
                .image(productDetails.get(0).getImages().get(0))
                .category(product.getCategory())
                .build();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public ProductInfoResponse getDetailProduct(Long id) {
        Product product = this.findById(id);

        return ProductInfoResponse.builder()
                .productId(product.getId())
                .name(product.getName())
                .availableQuantity(product.getAvailableQuantity())
                .category(product.getCategory())
                .description(product.getDescription())
                .productDetails(product.getProductDetails().stream().map(productDetailService::convertToResponse).toList())
                .build();

    }

    public List<ProductInHomePageResponse> findProductInHome() {
        List<Category> categories = categoryService.findThree();
        List<Product> products = productRepository
                .findTop10ProductsFromFirst3Categories(
                        categories.get(0).getId(), categories.get(1).getId(), categories.get(2).getId()
                );
        Map<Long, List<Product>> categoryProductMap = products.stream()
                .collect(Collectors.groupingBy(product -> product.getCategory().getId()));


        return categories.stream()
                .map(category -> {

                    List<Product> productList = categoryProductMap.getOrDefault(category.getId(), new ArrayList<>());
                    List<ProductResponse> productResponses = new ArrayList<>();

                    productList.forEach(p -> {
                        productResponses.add(this.convertToProductResponse(p));
                    });
                    return ProductInHomePageResponse.builder()
                            .categoryId(category.getId())
                            .categoryName(category.getName())
                            .categoryBannerUrl(category.getBannerUrl())
                            .products(productResponses)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ProductResponse> findHotDeal() {
        List<Product> products = productRepository.findHotDealProduct();

        return products.stream().map(this::convertToProductResponse).toList();
    }


    private Sort getSortDirection(Integer orderby) {
        return switch (orderby) {
            case 1 -> Sort.by(Sort.Direction.ASC, "createDate");
            case 2 -> Sort.by(Sort.Direction.ASC, "productDetails.price");
            case 3 -> Sort.by(Sort.Direction.DESC, "productDetails.price");
            default -> Sort.by(Sort.Direction.ASC, "id");
        };
    }

    public Page<Product> searchByKeyword(String keyword, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.hasKeyword(keyword);
        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchByPriceAndKeyword(BigDecimal minPrice, BigDecimal maxPrice, String keyword, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasKeyword(keyword));
        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchByPriceAndAttribute(BigDecimal minPrice, BigDecimal maxPrice, String keyword, List<Float> attributes, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasWeight(attributes))
                .and(ProductSpecification.hasKeyword(keyword));
        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchByCategory(Long categoryId, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.hasCategory(categoryId);
        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchByPriceAndCategory(BigDecimal minPrice, BigDecimal maxPrice, Long categoryId, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasCategory(categoryId));
        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchByCategoryAndAttribute(BigDecimal minPrice, BigDecimal maxPrice, Long categoryId, List<Float> attributes, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasWeight(attributes))
                .and(ProductSpecification.hasCategory(categoryId));
        return productRepository.findAll(spec, pageable);
    }

}

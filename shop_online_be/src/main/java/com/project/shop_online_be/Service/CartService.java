package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.*;
import com.project.shop_online_be.Repository.AttributeValueRepository;
import com.project.shop_online_be.Repository.CartRepository;
import com.project.shop_online_be.Request.AddToCartRequest;
import com.project.shop_online_be.Response.CartResponse;
import com.project.shop_online_be.Response.ProductInCartResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.util.Optionals;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserService userService;

    public List<CartResponse> findCarts() {
        return cartRepository.findByUser(userService.getCurrentStudent())
                .stream().map(cart -> {
                    ProductDetail p = cart.getProductDetail();
                    return CartResponse
                            .builder()
                            .id(cart.getId())
                            .productDetail(ProductInCartResponse
                                    .builder()
                                    .id(p.getId())
                                    .price(p.getPrice())
                                    .nameProduct(p.getProduct().getName())
                                    .availableQuantity(p.getProduct().getAvailableQuantity())
                                    .weight(p.getWeight())
                                    .color(p.getColor())
                                    .images(p.getImages())
                                    .build())
                            .quantity(cart.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public void addToCart(AddToCartRequest request) {
        Cart cart;
        User user = userService.getCurrentStudent();
        Optional<Cart> existsCart = cartRepository.findByUserAndProductDetail(user, request.getProductDetail());
        System.out.println(existsCart.isPresent());
        if (existsCart.isPresent()) {
            cart = existsCart.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
        } else {
            cart = new Cart();
            cart.setUser(user);
            cart.setProductDetail(request.getProductDetail());
            cart.setQuantity(request.getQuantity());
        }
        cartRepository.save(cart);

    }

    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public void updateQuantity(Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(NoSuchElementException::new);
        cart.setQuantity(quantity);
        cartRepository.save(cart);
    }

    public Cart findById(Long cartId) {
        return cartRepository.findById(cartId).orElseThrow(NoSuchElementException::new);
    }
}

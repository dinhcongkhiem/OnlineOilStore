package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Model.Cart;
import com.project.shop_online_be.Request.AddToCartRequest;
import com.project.shop_online_be.Response.CartResponse;
import com.project.shop_online_be.Service.CartService;
import com.project.shop_online_be.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;
    @GetMapping
    public ResponseEntity<List<CartResponse>> findCarts () {
        return ResponseEntity.ok(cartService.findCarts());
    }

    @PostMapping()
    public ResponseEntity<?> addToCart (@RequestBody AddToCartRequest request){
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok().build();
        }catch(NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PatchMapping()
    public ResponseEntity<?>  updateQuantityProductInCart(@RequestParam Long cartId, @RequestParam Integer quantity) {
        try {
            cartService.updateQuantity(cartId, quantity);
            return ResponseEntity.ok().build();
        }catch(NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @DeleteMapping()
    public ResponseEntity<?> removeFromCart (@RequestParam Long cartId){
        try {
            cartService.removeFromCart(cartId);
            return ResponseEntity.ok().build();
        }catch(NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

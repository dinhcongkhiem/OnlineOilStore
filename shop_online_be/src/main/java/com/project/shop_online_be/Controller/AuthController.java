package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Exception.UserAlreadyExistsException;
import com.project.shop_online_be.Request.*;
import com.project.shop_online_be.Response.AuthenticationResponse;
import com.project.shop_online_be.Service.AuthenticationService;
import com.project.shop_online_be.Service.OTPService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationService authenticationService;
    @Value("${client.url}")
    private String clientUrl;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            authenticationService.register(request);
            log.info("User " + request.getEmail() + "register");
            return ResponseEntity.ok("Please check your email to active account");
        } catch (UserAlreadyExistsException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User with email " + request.getEmail() + " already exists");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, @RequestParam Boolean isRemember, HttpServletResponse httpServletResponse) {
        try {
            AuthenticationResponse response = authenticationService.login(request);
            log.info("User " + request.getEmail() + " login into system");
            ResponseCookie authCookie = ResponseCookie.from("accessToken", response.getAccessToken())
                    .httpOnly(true)
                    .secure(false) // Đặt thành true nếu sử dụng HTTPS
                    .path("/")
                    .domain(clientUrl.substring(7, 16))
                    .maxAge(isRemember ? 24 * 60 * 60 : -1)
                    .sameSite("Strict")
                    .build();

            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam String verifyKey) {
        return authenticationService.verifyAccount(verifyKey) ?
                ResponseEntity.ok("Your account has been verified") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Your email verification time has passed, We sent new email");

    }

    @PostMapping("/refresh_token")
    public ResponseEntity<?> refreshJwtToken(
            @RequestBody RefreshAccessTokenRequest accessTokenRequest,
            @RequestParam Boolean isRemember,
            HttpServletResponse httpServletResponse) {
        try {
            AuthenticationResponse response = authenticationService
                    .refreshAccessToken(accessTokenRequest.getRefreshToken());
            ResponseCookie authCookie = ResponseCookie.from("accessToken", response.getAccessToken())
                    .httpOnly(true)
                    .secure(false) // Đặt thành true nếu sử dụng HTTPS
                    .path("/")
                    .domain(clientUrl.substring(7, 16))
                    .maxAge(isRemember ? 24 * 60 * 60 : -1)
                    .sameSite("Strict")
                    .build();

            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error refreshing access token");
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> forgetPassword(@RequestBody ForgetPasswordRequest request) {
        try {
            authenticationService.forgetPassword(request);
            return ResponseEntity.ok("Password reset instructions sent successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @PostMapping("/set-newpassword")
    public ResponseEntity<?> setNewPassword(@RequestBody ChangePasswordRequest request,
                                            @RequestParam String email, @RequestParam String otp) {
        try {
            authenticationService.setNewPassword(request, email,otp);
            return ResponseEntity.ok("Successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }


}

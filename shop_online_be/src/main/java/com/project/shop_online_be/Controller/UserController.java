package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Request.*;
import com.project.shop_online_be.Response.UserResponse;
import com.project.shop_online_be.Service.AuthenticationService;
import com.project.shop_online_be.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;
    @GetMapping()
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(
                userService.getUserInfor(userService.getCurrentStudent()));
    }

    @PatchMapping("/change-pass")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok().build();

        }catch (IllegalStateException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping()
    public ResponseEntity<?> update(@RequestBody UpdateUserRequest request) {
        try {
            return ResponseEntity.ok(userService.UpdateUserInfo(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user info: " + e.getMessage());
        }
    }
}

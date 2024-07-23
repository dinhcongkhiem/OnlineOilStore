package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.Address;
import com.project.shop_online_be.Model.User;
import com.project.shop_online_be.Repository.AddressRepository;
import com.project.shop_online_be.Repository.UserRepository;
import com.project.shop_online_be.Request.ChangePasswordRequest;
import com.project.shop_online_be.Request.UpdateUserRequest;
import com.project.shop_online_be.Response.AuthenticationResponse;
import com.project.shop_online_be.Response.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;
    private final AddressService addressService;

    public User getCurrentStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return (User) authentication.getPrincipal();

        }
        return null;
    }

    public UserResponse getUserInfor(User user){
        return UserResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNum(user.getPhoneNum())
                .role(user.getRole())
                .build();
    }

    public void changePassword(ChangePasswordRequest request){
        User user = getCurrentStudent();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalStateException("Password are not the same");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse UpdateUserInfo(UpdateUserRequest request) {
        User user = this.getCurrentStudent();
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getAddress() != null) {
            Address address = addressService.createAddress(request.getAddress());
            user.setAddress(address);
        }
        if (request.getPhoneNum() != null) {
            user.setPhoneNum(request.getPhoneNum());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        this.userRepository.save(user);
        return UserResponse.builder()
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .phoneNum(user.getPhoneNum())
                .address(user.getAddress())
                .build();

    }



}

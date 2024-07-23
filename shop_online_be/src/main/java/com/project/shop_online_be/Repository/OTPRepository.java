package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.OTPEntity;
import com.project.shop_online_be.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTPEntity, Long> {
    Optional<OTPEntity> findByOtpAndUser(String otp, User user);

}

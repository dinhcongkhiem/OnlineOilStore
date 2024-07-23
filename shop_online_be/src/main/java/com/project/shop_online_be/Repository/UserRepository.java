package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByRefreshToken(String email);
    Optional<User> findByVerifyKey(String verifykey);

}

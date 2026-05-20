package com.ecommerce.ecommerce.config;

import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ecommerce.ecommerce.dao.Role;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.RoleRepository;
import com.ecommerce.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements ApplicationRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final List<String> DEFAULT_ROLES = List.of("ROLE_USER", "ROLE_SHOP_OWNER", "ROLE_ADMIN");

    @Override
    public void run(ApplicationArguments args) {
        for (String name : DEFAULT_ROLES) {
            if (roleRepository.findByName(name).isEmpty()) {
                Role role = new Role();
                role.setName(name);
                roleRepository.save(role);
            }
        }
        String email = "admin@gmail.com";
        String pass = "admin123";
        if (userRepository.findByEmail(email) == null) {
            Role role = roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> new ResourceNotFound("ROLE_ADMIN not found"));
            User admin = new User();
            admin.setEmail(email);
            admin.getRoles().add(role);
            admin.setPassword(passwordEncoder.encode(pass));
            userRepository.save(admin);
        }
    }
}

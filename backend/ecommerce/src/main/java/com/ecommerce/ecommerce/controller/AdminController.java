package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.UserServiceImpl;
import com.ecommerce.ecommerce.util.status.RoleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserServiceImpl userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/assign")
    public ResponseObject<Void> assignRole(@PathVariable Long userId, @RequestParam RoleStatus roleStatus) {
        userService.assignRole(userId, roleStatus);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }
}

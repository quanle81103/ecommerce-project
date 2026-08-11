package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.UserDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.UserServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("/create")
    public ResponseObject<UserDto.UserResponse> createUser(@Valid @RequestBody UserDto.CreateUserRequest request) {
        return new ResponseObject<>(HttpStatus.CREATED, "Success", userService.createUser(request));
    }

    @DeleteMapping("/delete")
    public ResponseObject<Void> deleteUser() {
        userService.deleteUser(AuthUtil.getCurrentUserId());
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @GetMapping("/get")
    public ResponseObject<UserDto.UserResponse> getCurrentUser() {
        return new ResponseObject<>(HttpStatus.OK, "Success", userService.getUserById(AuthUtil.getCurrentUserId()));
    }

    @PutMapping("/update")
    public ResponseObject<UserDto.UserResponse> updateUser(@Valid @RequestBody UserDto.UpdateUser request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", userService.updateUser(request, AuthUtil.getCurrentUserId()));
    }
}

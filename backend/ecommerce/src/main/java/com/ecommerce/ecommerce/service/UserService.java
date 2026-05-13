package com.ecommerce.ecommerce.service;


import com.ecommerce.ecommerce.dto.UserDto;

public interface UserService {
    UserDto.UserResponse createUser(UserDto.CreateUserRequest request);
    UserDto.UserResponse getUserById(Long id);
    UserDto.UserResponse updateUser(UserDto.UpdateUser request, Long userId);
    void deleteUser(Long userId);

}

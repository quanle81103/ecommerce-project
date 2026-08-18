package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.Role;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.UserDto;
import com.ecommerce.ecommerce.exception.ResourceAlreadyExist;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.RoleRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.UserService;
import com.ecommerce.ecommerce.util.Mapper.MapperUtil;
import com.ecommerce.ecommerce.util.status.RoleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

//    @PersistenceContext
//    private EntityManager entityManager;

    @Override
    public UserDto.UserResponse createUser(UserDto.CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExist("User with email [%s] already exist in db".formatted(request.getEmail()));
        }
        Role userRole = roleRepository.findByRoleStatus(RoleStatus.CUSTOMER)
                .orElseThrow(() -> new IllegalStateException("ROLE_USER not seeded"));

        User user = new User();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPlace(request.getPlace());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        // Role customer
        user.getRoles().add(userRole);

        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);

        User saved = userRepository.save(user);
//        entityManager.detach(saved);
        return MapperUtil.mapObject(saved, UserDto.UserResponse.class);
    }

    @Override
    public UserDto.UserResponse getUserById(Long id) {
        return MapperUtil.mapObject(
                userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(id))),
                UserDto.UserResponse.class);
    }

    @Override
    public UserDto.UserResponse updateUser(UserDto.UpdateUser request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getWardCode() != null) user.setWardCode(request.getWardCode());
        if (request.getWardName() != null) user.setWardName(request.getWardName());
        if (request.getDistrictId() != null) user.setDistrictId(request.getDistrictId());
        if (request.getDistrictName() != null) user.setDistrictName(request.getDistrictName());
        if (request.getProvinceName() != null) user.setProvinceName(request.getProvinceName());
        if (request.getPassword() != null) user.setPassword(passwordEncoder.encode(request.getPassword()));

        return MapperUtil.mapObject(userRepository.save(user), UserDto.UserResponse.class);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));
        userRepository.delete(user);
    }


    @Transactional
    public void assignRole(Long userId, RoleStatus status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));

        Role role = roleRepository.findByRoleStatus(status).orElseThrow(() -> new ResourceNotFound("Role not found"));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Transactional
    // mainly for revoke shop owner role
    public void revokeRole(Long userId, RoleStatus status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));

        Role role = roleRepository.findByRoleStatus(status).orElseThrow(() -> new ResourceNotFound("Role not found"));

        user.getRoles().remove(role);

        userRepository.save(user);
    }
}

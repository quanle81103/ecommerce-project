package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.ResetToken;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.AuthDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.exception.TokenAlreadyUsed;
import com.ecommerce.ecommerce.exception.TokenExpiredException;
import com.ecommerce.ecommerce.repository.ResetTokenRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.response.AuthResponse;
import com.ecommerce.ecommerce.security.jwt.JwtUtils;
import com.ecommerce.ecommerce.util.RandomUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmailServiceImpl emailService;
    private final ResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse login(AuthDto.LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = jwtUtils.generateToken(auth);

        return new AuthResponse(token);
    }

    @Transactional
    public void passwordResetToken(AuthDto.ForgetPasswordRequest request) {
        User user = Optional.ofNullable(userRepository.findByEmail(request.getEmail())).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        String name = user.getFirstName() + user.getLastName();
        String token = RandomUtil.getResetToken();
        String hashToken = RandomUtil.sha256(token);
        ResetToken resetToken = new ResetToken();
        resetToken.setUser(user);
        resetToken.setUsed(false);
        LocalDateTime now = LocalDateTime.now();
        resetToken.setCreateAt(now);
        resetToken.setExpireAt(now.plusMinutes(15));
        resetToken.setTokenHash(hashToken);
        resetTokenRepository.save(resetToken);
        String link = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendResetPasswordToken(user.getEmail(), name, link);
    }

    @Transactional
    public void resetPassword(AuthDto.ResetPasswordRequest request) {

        String hashToken = RandomUtil.sha256(request.getRawToken());

        ResetToken resetToken = resetTokenRepository
                .findByHashToken(hashToken)
                .orElseThrow(() -> new ResourceNotFound("Token not found"));

        if (resetToken.getExpireAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token expired");
        }

        if (resetToken.isUsed()) {
            throw new TokenAlreadyUsed("Token already used");
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        resetToken.setUsed(true);

        userRepository.save(user);
        resetTokenRepository.save(resetToken);
    }
}

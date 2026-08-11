package com.ecommerce.ecommerce.security.config;

import com.ecommerce.ecommerce.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityFilterChainConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/payment/vnpay-ipn").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/payment/vnpay-callback").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/banners/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/banners/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/conversations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/conversations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/shops/shop/**").permitAll()
                        .requestMatchers("/api/v1/ghn/**").permitAll()
                        .requestMatchers("/api/v1/brands/all").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/payment/status").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}

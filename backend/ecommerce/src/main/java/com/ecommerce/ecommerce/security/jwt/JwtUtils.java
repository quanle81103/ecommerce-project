package com.ecommerce.ecommerce.security.jwt;

import com.ecommerce.ecommerce.security.user.ShopUserDetail;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class JwtUtils {
    @Value("${jwt.expirationtime}")
    private int expirationTime;

    @Value("${jwt.secretkey}")
    private String secretKey;

    private Key generateKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
    // Generate a jwt
    public String generateToken(Authentication authentication) {
        ShopUserDetail shopUserDetail = (ShopUserDetail) authentication.getPrincipal();
        // get all roles of a particular user

        List<String> roles = shopUserDetail.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .setSubject(shopUserDetail.getEmail())
                .claim("UserName", shopUserDetail.getUsername())
                .claim("Id", shopUserDetail.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(generateKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            if (!StringUtils.hasText(token)) {
                return false;
            }

            Jwts.parserBuilder().setSigningKey(generateKey()).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException |
                 IllegalArgumentException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        // subject: email
        return Jwts.parserBuilder().setSigningKey(generateKey()).build().parseClaimsJws(token).getBody().getSubject();
    }
}

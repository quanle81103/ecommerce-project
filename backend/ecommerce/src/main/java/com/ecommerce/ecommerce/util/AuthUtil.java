package com.ecommerce.ecommerce.util;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.ecommerce.ecommerce.security.user.ShopUserDetail;

public final class AuthUtil {
    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof ShopUserDetail principal)) {
            throw new AccessDeniedException("Authentication required");
        }
        return principal.getId();
    }
}

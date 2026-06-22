package com.ecommerce.ecommerce.exception;

public class TokenAlreadyUsed extends RuntimeException {
    public TokenAlreadyUsed(String message) {
        super(message);
    }
}

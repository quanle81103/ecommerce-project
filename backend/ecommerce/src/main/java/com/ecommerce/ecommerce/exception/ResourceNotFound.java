package com.ecommerce.ecommerce.exception;

// 404
public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound(String message) {
        super(message);
    }
}

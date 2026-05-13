package com.ecommerce.ecommerce.exception;

// 502 - failure when calling a third-party service (GHN, VNPay, S3, ...)
public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String message) {
        super(message);
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

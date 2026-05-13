package com.ecommerce.ecommerce.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

public class ResponseObject <T> extends ResponseEntity<ResponseObject.PayLoad<T>> {
    public ResponseObject(HttpStatusCode code, String message, T data) {
        super(new PayLoad<>(code.value(), message, data), code);
    }

    @Builder
    public static class PayLoad<T> {
        public int code;
        public String message;
        @JsonInclude(JsonInclude.Include.NON_NULL)
        public T data;
    }
}

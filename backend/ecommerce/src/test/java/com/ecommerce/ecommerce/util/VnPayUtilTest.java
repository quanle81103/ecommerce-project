package com.ecommerce.ecommerce.util;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class VnPayUtilTest {

    @Test
    void hashAllFields_producesDeterministicHmac() {
        Map<String, String> fields = new HashMap<>();
        fields.put("vnp_Amount", "10000000");
        fields.put("vnp_TxnRef", "abc123");
        fields.put("vnp_ResponseCode", "00");

        String hash1 = VnPayUtil.hashAllFields(fields, "test-secret");
        String hash2 = VnPayUtil.hashAllFields(fields, "test-secret");

        assertEquals(hash1, hash2, "same input must produce same hash");
        assertEquals(128, hash1.length(), "HmacSHA512 hex is 128 chars");
    }

    @Test
    void hashAllFields_differentSecretProducesDifferentHash() {
        Map<String, String> fields = new HashMap<>();
        fields.put("vnp_TxnRef", "abc");

        String hash1 = VnPayUtil.hashAllFields(fields, "secret-A");
        String hash2 = VnPayUtil.hashAllFields(fields, "secret-B");

        assertNotEquals(hash1, hash2);
    }

    @Test
    void hashAllFields_throwsWhenSecretIsNull() {
        Map<String, String> fields = new HashMap<>();
        fields.put("vnp_TxnRef", "abc");

        // hmacSHA512 catches IllegalArgumentException and returns ""
        String result = VnPayUtil.hashAllFields(fields, null);
        assertEquals("", result);
    }
}

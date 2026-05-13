package com.ecommerce.ecommerce.config.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.region}")
    private String region;

    // initialize the s3Amazon Client
    @Bean
    public S3Client s3Client() {
        return S3Client.builder().region(Region.of(region)).credentialsProvider(ProfileCredentialsProvider.builder().profileName("default").build()).build();
    }
}

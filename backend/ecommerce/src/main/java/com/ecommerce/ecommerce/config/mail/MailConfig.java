package com.ecommerce.ecommerce.config.mail;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Bean
    public static SimpleMailMessage orderSuccessTemplate () {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("""
            Xin chào %s,

            Đơn hàng %s đã thành công 🎉
            Tổng tiền: %s

            Cảm ơn bạn đã mua sắm
            """);
        return message;
    }

    @Bean
    public static SimpleMailMessage forgotPasswordTemplate () {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setText("Xin chào %s, Đây là link đăng nhập của bạn %s, Lưu ý sẽ hết hạn sau 15 minute");

        return message;
    }
}

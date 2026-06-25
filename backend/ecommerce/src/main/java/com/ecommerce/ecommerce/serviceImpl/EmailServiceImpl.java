package com.ecommerce.ecommerce.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl {
    private final SimpleMailMessage orderSuccessTemplate;
    private final SimpleMailMessage forgotPasswordTemplate;
    private final JavaMailSender mailSender;

    @Async
    public void sendOrderEmail(String to, String name, Long paymentId, String total) {
        assert orderSuccessTemplate.getText() != null;
        String text = String.format(orderSuccessTemplate.getText(), name, paymentId, total);
        SimpleMailMessage message = new SimpleMailMessage(orderSuccessTemplate);
        message.setTo(to);
        message.setText(text);
        message.setSubject("Order Email");
        mailSender.send(message);
    }

    public void sendResetPasswordToken(String to, String name, String link) {
        assert forgotPasswordTemplate.getText() != null;
        String text = String.format(forgotPasswordTemplate.getText(), name, link);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText(text);
        message.setTo(to);
        message.setSubject("Reset password");
        mailSender.send(message);
    }
}

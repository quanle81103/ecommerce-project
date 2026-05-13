package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.config.mail.MailConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl {
    private final SimpleMailMessage template;
    private final JavaMailSender mailSender;

    @Async
    public void sendOrderEmail(String to, String name, Long paymentId, String total) {
        assert template.getText() != null;
        String text = String.format(template.getText(), name, paymentId, total);
        SimpleMailMessage message = new SimpleMailMessage(template);
        message.setTo(to);
        message.setText(text);
        message.setSubject("Order Email");
        mailSender.send(message);
    }
}

package com.example.Mail.service;

import com.example.Mail.model.Mail;
import jakarta.mail.internet.MimeMessage;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mail;


    public Map<String, Object> enviarMail(Mail email){
        try{
            MimeMessage mimeMessage = mail.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true,"utf-8");
            helper.setText(email.getContent(), true);
            helper.setTo(email.getTo());
            helper.setSubject(email.getSubject());
            helper.setFrom("soportegaminghub@gmail.com");
            helper.setReplyTo("no-reply");
            mail.send(mimeMessage);
            Map<String, Object> response= new HashMap<>();
            response.put("send", true);
            response.put("datetime", LocalDateTime.now());
            return response;
        }catch(Exception ex){
            throw new RuntimeException("Error al enviar mail: "+ex);
        }
    }



}

package com.example.Mail.controller;


import com.example.Mail.model.Mail;
import com.example.Mail.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/GamingHub/v1/Mail")
public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> enviarMail(@RequestBody Mail mail){
        return ResponseEntity.ok(mailService.enviarMail(mail));
    }

}

package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Request.ContactRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RestController
@RequestMapping("api/v1/contact")
public class ContactController {
    @Autowired
    private  JavaMailSender mailSender;
    @Autowired
    private TemplateEngine templateEngine;
    @Value("${information.nameShop}")
    private String nameShop;
    @Value("${information.emailShop}")
    private String emailShop;

    @Value("${information.ccGmailShop}")
    private String ccGmailShop;
    @PostMapping
    public ResponseEntity<?> sendEmailContact (@RequestBody ContactRequest contactRequest)  {
        try {
            String emailFrom = nameShop + "<"+ emailShop +">";
            Context context = new Context() ;
            context.setVariable("contactRequest",contactRequest);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            String htmlContent = templateEngine.process("contactTemplate", context);

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(emailFrom);
            helper.setTo(emailShop);
            helper.setSubject("Shop contact");
            helper.setText(htmlContent, true);
            helper.setCc(ccGmailShop);

            mailSender.send(mimeMessage);
            return ResponseEntity.ok().build();
        }catch(MessagingException e){
            e.printStackTrace();
        }
        return null;
    }
}

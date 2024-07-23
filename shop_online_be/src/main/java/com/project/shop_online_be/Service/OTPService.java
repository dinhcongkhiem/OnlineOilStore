package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.OTPEntity;
import com.project.shop_online_be.Model.User;
import com.project.shop_online_be.Repository.OTPRepository;
import com.project.shop_online_be.Repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OTPService {
    private final TemplateEngine templateEngine;

    private final JavaMailSender mailSender;
    private final OTPRepository otpRepository;
    private final UserRepository userRepository;
    @Value("${client.url}")
    private String client_Url;
    @Value("${information.nameShop}")
    private String nameShop;
    @Value("${information.emailShop}")
    private String emailShop;

    @Value("${information.ccGmailShop}")
    private String ccGmailShop;

    public String generateOTP() {
        String otp = "";
        for (int i = 0; i < 6; i++) {
            otp += (int) (Math.random() * 10);
        }
        return otp;
    }

    public String createNewOTP(User user) {
        String newOTP = generateOTP();
        OTPEntity otpEntity = OTPEntity.builder()
                .otp(newOTP)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 5))
                .user(user)
                .build();
        otpRepository.save(otpEntity);
        return newOTP;
    }
    @Scheduled(fixedRate = 300000)
    public void scheduledTask() {
        List<OTPEntity> OTPentityList = otpRepository.findAll();
        for(OTPEntity otp : OTPentityList){
            if(otp.getExpiration().before(new Date())){
                otpRepository.delete(otp);
            }
        }
    }


    public boolean isValidOTP(String otp, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Optional<OTPEntity> otPentityOptional = otpRepository.findByOtpAndUser(otp, user);
        if (otPentityOptional.isEmpty()) {
            throw new NoSuchElementException("Invalid OTP or user combination");
        }
        OTPEntity otPentity = otPentityOptional.get();
        return otPentity.getExpiration().after(new Date());
    }

    public void sendOTPEmail(User user) {

        try {
            String emailFrom = nameShop + "<"+ emailShop +">";
            String subject = "Yêu cầu lấy lại mật khẩu";
            Context context = new Context() ;
            context.setVariable("user",user);
            context.setVariable("otp", this.createNewOTP(user));
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            String htmlContent = templateEngine.process("forgetPasswordTemplate", context);
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(emailFrom);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            helper.setCc(ccGmailShop);
            mailSender.send(mimeMessage);

        }catch(MessagingException e){
            e.printStackTrace();
        }
    }


}

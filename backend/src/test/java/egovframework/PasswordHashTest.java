package egovframework;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("admin123: " + encoder.encode("admin123"));
        System.out.println("survey123: " + encoder.encode("survey123"));
        System.out.println("user123: " + encoder.encode("user123"));
    }
} 
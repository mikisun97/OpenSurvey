package egovframework.survey.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";
        
        // 일반적인 비밀번호들 테스트
        String[] passwords = {"password", "hello", "admin", "test", "123456", "password123", "admin123"};
        
        System.out.println("=== BCrypt 해시 테스트 ===");
        System.out.println("해시: " + hash);
        System.out.println();
        
        for (String password : passwords) {
            boolean matches = encoder.matches(password, hash);
            System.out.println("비밀번호 '" + password + "': " + matches);
        }
        
        System.out.println();
        System.out.println("=== 새로운 password 해시 생성 ===");
        String newHash = encoder.encode("password");
        System.out.println("password에 대한 새 해시: " + newHash);
        
        // 검증
        boolean verify = encoder.matches("password", newHash);
        System.out.println("새 해시 검증 결과: " + verify);
    }
} 
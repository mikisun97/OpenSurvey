package egovframework.survey.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // password에 대한 새로운 BCrypt 해시 생성
        String password = "password";
        String hash = encoder.encode(password);
        
        System.out.println("=== 새로운 BCrypt 해시 생성 ===");
        System.out.println("평문 비밀번호: " + password);
        System.out.println("생성된 해시: " + hash);
        System.out.println();
        
        // 검증
        boolean matches = encoder.matches(password, hash);
        System.out.println("검증 결과: " + matches);
        System.out.println();
        
        // SQL 업데이트 쿼리 생성
        System.out.println("=== 데이터베이스 업데이트 SQL ===");
        System.out.println("UPDATE COMTNEMPLYRINFO SET PASSWORD = '" + hash + "' WHERE EMPLYR_ID = 'admin';");
        System.out.println("UPDATE COMTNEMPLYRINFO SET PASSWORD = '" + hash + "' WHERE EMPLYR_ID = 'user01';");
        System.out.println();
        
        // 추가로 몇 개 더 생성 (각각 다른 salt를 가지므로 다름)
        System.out.println("=== 추가 해시들 (참고용) ===");
        for (int i = 1; i <= 3; i++) {
            String additionalHash = encoder.encode(password);
            System.out.println("해시 " + i + ": " + additionalHash);
        }
    }
} 
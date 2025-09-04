package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 요청 VO")
public class LoginRequestVO {
    
    @Schema(description = "사용자 ID", example = "admin")
    private String userId;
    
    @Schema(description = "비밀번호", example = "admin123")
    private String password;
    
    // Getter/Setter
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
} 
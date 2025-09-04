package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 응답 VO")
public class LoginResponseVO {
    
    @Schema(description = "액세스 토큰")
    private String accessToken;
    
    @Schema(description = "업무사용자ID")
    private String userId;
    
    @Schema(description = "사용자명")
    private String userNm;
    
    @Schema(description = "권한코드")
    private String authorityCode;
    
    @Schema(description = "권한명")
    private String authorityNm;
    
    @Schema(description = "고유ID")
    private String esntlId;
    
    @Schema(description = "이메일주소")
    private String emailAdres;
    
    @Schema(description = "직위명")
    private String ofcpsNm;
    
    @Schema(description = "토큰 만료 시간(초)")
    private long expiresIn;
    
    // Getter/Setter
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUserNm() {
        return userNm;
    }
    
    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }
    
    public String getAuthorityCode() {
        return authorityCode;
    }
    
    public void setAuthorityCode(String authorityCode) {
        this.authorityCode = authorityCode;
    }
    
    public String getAuthorityNm() {
        return authorityNm;
    }
    
    public void setAuthorityNm(String authorityNm) {
        this.authorityNm = authorityNm;
    }
    
    public String getEsntlId() {
        return esntlId;
    }
    
    public void setEsntlId(String esntlId) {
        this.esntlId = esntlId;
    }
    
    public String getEmailAdres() {
        return emailAdres;
    }
    
    public void setEmailAdres(String emailAdres) {
        this.emailAdres = emailAdres;
    }
    
    public String getOfcpsNm() {
        return ofcpsNm;
    }
    
    public void setOfcpsNm(String ofcpsNm) {
        this.ofcpsNm = ofcpsNm;
    }
    
    public long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
} 
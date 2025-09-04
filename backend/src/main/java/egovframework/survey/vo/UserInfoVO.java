package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "사용자 정보 VO")
public class UserInfoVO {
    
    @Schema(description = "사용자 ID")
    private String userId;
    
    @Schema(description = "사용자명")
    private String userNm;
    
    @Schema(description = "비밀번호")
    private String password;
    
    @Schema(description = "이메일")
    private String email;
    
    @Schema(description = "전화번호")
    private String phone;
    
    @Schema(description = "부서명")
    private String deptNm;
    
    @Schema(description = "직급명")
    private String positionNm;
    
    @Schema(description = "권한코드")
    private String authorityCode;
    
    @Schema(description = "권한명")
    private String authorityNm;
    
    @Schema(description = "사용여부")
    private String useAt;
    
    @Schema(description = "등록일시")
    private LocalDateTime registDate;
    
    @Schema(description = "등록자")
    private String registUser;
    
    @Schema(description = "수정일시")
    private LocalDateTime updateDate;
    
    @Schema(description = "수정자")
    private String updateUser;
    
    // Getter/Setter
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getDeptNm() {
        return deptNm;
    }
    
    public void setDeptNm(String deptNm) {
        this.deptNm = deptNm;
    }
    
    public String getPositionNm() {
        return positionNm;
    }
    
    public void setPositionNm(String positionNm) {
        this.positionNm = positionNm;
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
    
    public String getUseAt() {
        return useAt;
    }
    
    public void setUseAt(String useAt) {
        this.useAt = useAt;
    }
    
    public LocalDateTime getRegistDate() {
        return registDate;
    }
    
    public void setRegistDate(LocalDateTime registDate) {
        this.registDate = registDate;
    }
    
    public String getRegistUser() {
        return registUser;
    }
    
    public void setRegistUser(String registUser) {
        this.registUser = registUser;
    }
    
    public LocalDateTime getUpdateDate() {
        return updateDate;
    }
    
    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }
    
    public String getUpdateUser() {
        return updateUser;
    }
    
    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }
} 
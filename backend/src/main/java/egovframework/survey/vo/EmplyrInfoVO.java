package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "업무사용자정보 VO")
public class EmplyrInfoVO {
    
    @Schema(description = "고유ID")
    private String esntlId;
    
    @Schema(description = "업무사용자ID")
    private String emplyrId;
    
    @Schema(description = "사용자명")
    private String userNm;
    
    @Schema(description = "비밀번호")
    private String password;
    
    @Schema(description = "주소")
    private String houseAdres;
    
    @Schema(description = "상세주소")
    private String detailAdres;
    
    @Schema(description = "우편번호")
    private String zipCode;
    
    @Schema(description = "회사전화번호")
    private String offmTelno;
    
    @Schema(description = "이동전화번호")
    private String mbtlnum;
    
    @Schema(description = "이메일주소")
    private String emailAdres;
    
    @Schema(description = "직위명")
    private String ofcpsNm;
    
    @Schema(description = "집전화번호")
    private String houseEndTelno;
    
    @Schema(description = "그룹ID")
    private String groupId;
    
    @Schema(description = "소속기관코드")
    private String pstinstCode;
    
    @Schema(description = "업무사용자상태코드")
    private String emplyrSttusCode;
    
    @Schema(description = "최초등록시점")
    private LocalDateTime frstRegistPnttm;
    
    @Schema(description = "최초등록자ID")
    private String frstRegisterId;
    
    @Schema(description = "최종수정시점")
    private LocalDateTime lastUpdtPnttm;
    
    @Schema(description = "최종수정자ID")
    private String lastUpdusrId;
    
    // 추가 필드 (권한 관련)
    @Schema(description = "권한코드")
    private String authorCode;
    
    @Schema(description = "권한명")
    private String authorNm;
    
    @Schema(description = "회원유형코드")
    private String mberTyCode;
    
    // Getter/Setter
    public String getEsntlId() {
        return esntlId;
    }
    
    public void setEsntlId(String esntlId) {
        this.esntlId = esntlId;
    }
    
    public String getEmplyrId() {
        return emplyrId;
    }
    
    public void setEmplyrId(String emplyrId) {
        this.emplyrId = emplyrId;
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
    
    public String getHouseAdres() {
        return houseAdres;
    }
    
    public void setHouseAdres(String houseAdres) {
        this.houseAdres = houseAdres;
    }
    
    public String getDetailAdres() {
        return detailAdres;
    }
    
    public void setDetailAdres(String detailAdres) {
        this.detailAdres = detailAdres;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getOffmTelno() {
        return offmTelno;
    }
    
    public void setOffmTelno(String offmTelno) {
        this.offmTelno = offmTelno;
    }
    
    public String getMbtlnum() {
        return mbtlnum;
    }
    
    public void setMbtlnum(String mbtlnum) {
        this.mbtlnum = mbtlnum;
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
    
    public String getHouseEndTelno() {
        return houseEndTelno;
    }
    
    public void setHouseEndTelno(String houseEndTelno) {
        this.houseEndTelno = houseEndTelno;
    }
    
    public String getGroupId() {
        return groupId;
    }
    
    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }
    
    public String getPstinstCode() {
        return pstinstCode;
    }
    
    public void setPstinstCode(String pstinstCode) {
        this.pstinstCode = pstinstCode;
    }
    
    public String getEmplyrSttusCode() {
        return emplyrSttusCode;
    }
    
    public void setEmplyrSttusCode(String emplyrSttusCode) {
        this.emplyrSttusCode = emplyrSttusCode;
    }
    
    public LocalDateTime getFrstRegistPnttm() {
        return frstRegistPnttm;
    }
    
    public void setFrstRegistPnttm(LocalDateTime frstRegistPnttm) {
        this.frstRegistPnttm = frstRegistPnttm;
    }
    
    public String getFrstRegisterId() {
        return frstRegisterId;
    }
    
    public void setFrstRegisterId(String frstRegisterId) {
        this.frstRegisterId = frstRegisterId;
    }
    
    public LocalDateTime getLastUpdtPnttm() {
        return lastUpdtPnttm;
    }
    
    public void setLastUpdtPnttm(LocalDateTime lastUpdtPnttm) {
        this.lastUpdtPnttm = lastUpdtPnttm;
    }
    
    public String getLastUpdusrId() {
        return lastUpdusrId;
    }
    
    public void setLastUpdusrId(String lastUpdusrId) {
        this.lastUpdusrId = lastUpdusrId;
    }
    
    public String getAuthorCode() {
        return authorCode;
    }
    
    public void setAuthorCode(String authorCode) {
        this.authorCode = authorCode;
    }
    
    public String getAuthorNm() {
        return authorNm;
    }
    
    public void setAuthorNm(String authorNm) {
        this.authorNm = authorNm;
    }
    
    public String getMberTyCode() {
        return mberTyCode;
    }
    
    public void setMberTyCode(String mberTyCode) {
        this.mberTyCode = mberTyCode;
    }
} 
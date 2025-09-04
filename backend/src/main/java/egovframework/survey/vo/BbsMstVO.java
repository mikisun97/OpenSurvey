package egovframework.survey.vo;

import java.time.LocalDateTime;

/**
 * 게시판 마스터 정보 VO
 * COMTNBBSMST 테이블과 매핑
 */
public class BbsMstVO {
    
    // 기본 정보
    private String bbsId;              // 게시판ID
    private String bbsNm;              // 게시판명
    private String bbsIntrcn;          // 게시판소개
    private String bbsTyCode;          // 게시판유형코드
    private String bbsAttrbCode;       // 게시판속성코드
    
    // 설정 정보
    private String replyPosblAt;       // 답글가능여부
    private String fileAtchPosblAt;    // 파일첨부가능여부
    private Integer atchPosblFileNumber; // 첨부가능파일숫자
    private Double atchPosblFileSize;  // 첨부가능파일사이즈
    private String useAt;              // 사용여부
    private String tmplatId;           // 템플릿ID
    
    // 구분 설정
    private String categoryCodeId;     // 사용할공통코드ID
    
    // 이미지 설정
    private String representImageUseAt;    // 대표이미지 사용여부
    private Integer representImageWidth;   // 대표이미지 권장 너비
    private Integer representImageHeight;  // 대표이미지 권장 높이
    private String mainImageUseAt;        // 메인화면이미지 사용여부
    private Integer mainImageWidth;       // 메인화면이미지 권장 너비
    private Integer mainImageHeight;      // 메인화면이미지 권장 높이
    private String multiImageUseAt;       // 다중이미지 사용여부
    private String multiImageDisplayName; // 다중이미지 표시명
    private Integer multiImageMaxCount;   // 다중이미지 최대개수
    private Integer multiImageWidth;      // 다중이미지 권장 너비
    private Integer multiImageHeight;     // 다중이미지 권장 높이
    
    // 등록/수정 정보
    private String frstRegisterId;     // 최초등록자ID
    private LocalDateTime frstRegistPnttm; // 최초등록시점
    private String lastUpdusrId;       // 최종수정자ID
    private LocalDateTime lastUpdtPnttm; // 최종수정시점
    
    // 생성자
    public BbsMstVO() {}
    
    // Getter & Setter
    public String getBbsId() {
        return bbsId;
    }
    
    public void setBbsId(String bbsId) {
        this.bbsId = bbsId;
    }
    
    public String getBbsNm() {
        return bbsNm;
    }
    
    public void setBbsNm(String bbsNm) {
        this.bbsNm = bbsNm;
    }
    
    public String getBbsIntrcn() {
        return bbsIntrcn;
    }
    
    public void setBbsIntrcn(String bbsIntrcn) {
        this.bbsIntrcn = bbsIntrcn;
    }
    
    public String getBbsTyCode() {
        return bbsTyCode;
    }
    
    public void setBbsTyCode(String bbsTyCode) {
        this.bbsTyCode = bbsTyCode;
    }
    
    public String getBbsAttrbCode() {
        return bbsAttrbCode;
    }
    
    public void setBbsAttrbCode(String bbsAttrbCode) {
        this.bbsAttrbCode = bbsAttrbCode;
    }
    
    public String getReplyPosblAt() {
        return replyPosblAt;
    }
    
    public void setReplyPosblAt(String replyPosblAt) {
        this.replyPosblAt = replyPosblAt;
    }
    
    public String getFileAtchPosblAt() {
        return fileAtchPosblAt;
    }
    
    public void setFileAtchPosblAt(String fileAtchPosblAt) {
        this.fileAtchPosblAt = fileAtchPosblAt;
    }
    
    public Integer getAtchPosblFileNumber() {
        return atchPosblFileNumber;
    }
    
    public void setAtchPosblFileNumber(Integer atchPosblFileNumber) {
        this.atchPosblFileNumber = atchPosblFileNumber;
    }
    
    public Double getAtchPosblFileSize() {
        return atchPosblFileSize;
    }
    
    public void setAtchPosblFileSize(Double atchPosblFileSize) {
        this.atchPosblFileSize = atchPosblFileSize;
    }
    
    public String getUseAt() {
        return useAt;
    }
    
    public void setUseAt(String useAt) {
        this.useAt = useAt;
    }
    
    public String getTmplatId() {
        return tmplatId;
    }
    
    public void setTmplatId(String tmplatId) {
        this.tmplatId = tmplatId;
    }
    
    public String getCategoryCodeId() {
        return categoryCodeId;
    }
    
    public void setCategoryCodeId(String categoryCodeId) {
        this.categoryCodeId = categoryCodeId;
    }
    
    // 이미지 관련 Getter & Setter
    public String getRepresentImageUseAt() {
        return representImageUseAt;
    }
    
    public void setRepresentImageUseAt(String representImageUseAt) {
        this.representImageUseAt = representImageUseAt;
    }
    
    public Integer getRepresentImageWidth() {
        return representImageWidth;
    }
    
    public void setRepresentImageWidth(Integer representImageWidth) {
        this.representImageWidth = representImageWidth;
    }
    
    public Integer getRepresentImageHeight() {
        return representImageHeight;
    }
    
    public void setRepresentImageHeight(Integer representImageHeight) {
        this.representImageHeight = representImageHeight;
    }
    
    public String getMainImageUseAt() {
        return mainImageUseAt;
    }
    
    public void setMainImageUseAt(String mainImageUseAt) {
        this.mainImageUseAt = mainImageUseAt;
    }
    
    public Integer getMainImageWidth() {
        return mainImageWidth;
    }
    
    public void setMainImageWidth(Integer mainImageWidth) {
        this.mainImageWidth = mainImageWidth;
    }
    
    public Integer getMainImageHeight() {
        return mainImageHeight;
    }
    
    public void setMainImageHeight(Integer mainImageHeight) {
        this.mainImageHeight = mainImageHeight;
    }
    
    public String getMultiImageUseAt() {
        return multiImageUseAt;
    }
    
    public void setMultiImageUseAt(String multiImageUseAt) {
        this.multiImageUseAt = multiImageUseAt;
    }
    
    public String getMultiImageDisplayName() {
        return multiImageDisplayName;
    }
    
    public void setMultiImageDisplayName(String multiImageDisplayName) {
        this.multiImageDisplayName = multiImageDisplayName;
    }
    
    public Integer getMultiImageMaxCount() {
        return multiImageMaxCount;
    }
    
    public void setMultiImageMaxCount(Integer multiImageMaxCount) {
        this.multiImageMaxCount = multiImageMaxCount;
    }
    
    public Integer getMultiImageWidth() {
        return multiImageWidth;
    }
    
    public void setMultiImageWidth(Integer multiImageWidth) {
        this.multiImageWidth = multiImageWidth;
    }
    
    public Integer getMultiImageHeight() {
        return multiImageHeight;
    }
    
    public void setMultiImageHeight(Integer multiImageHeight) {
        this.multiImageHeight = multiImageHeight;
    }
    
    public String getFrstRegisterId() {
        return frstRegisterId;
    }
    
    public void setFrstRegisterId(String frstRegisterId) {
        this.frstRegisterId = frstRegisterId;
    }
    
    public LocalDateTime getFrstRegistPnttm() {
        return frstRegistPnttm;
    }
    
    public void setFrstRegistPnttm(LocalDateTime frstRegistPnttm) {
        this.frstRegistPnttm = frstRegistPnttm;
    }
    
    public String getLastUpdusrId() {
        return lastUpdusrId;
    }
    
    public void setLastUpdusrId(String lastUpdusrId) {
        this.lastUpdusrId = lastUpdusrId;
    }
    
    public LocalDateTime getLastUpdtPnttm() {
        return lastUpdtPnttm;
    }
    
    public void setLastUpdtPnttm(LocalDateTime lastUpdtPnttm) {
        this.lastUpdtPnttm = lastUpdtPnttm;
    }
} 
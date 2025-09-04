package egovframework.survey.vo;

import java.time.LocalDateTime;

public class CommonCodeVO {
    
    private String codeId;
    private String codeIdNm;
    private String codeIdDc;
    private String useAt = "Y";
    private String clCode;
    private int codeOrder;
    
    /** 최초 등록 시점 */
    private LocalDateTime frstRegistPnttm;
    
    /** 최초 등록자 ID */
    private String frstRegisterId;
    
    /** 최종 수정 시점 */
    private LocalDateTime lastUpdtPnttm;
    
    /** 최종 수정자 ID */
    private String lastUpdusrId;
    
    // Getter/Setter
    public String getCodeId() { return codeId; }
    public void setCodeId(String codeId) { this.codeId = codeId; }
    
    public String getCodeIdNm() { return codeIdNm; }
    public void setCodeIdNm(String codeIdNm) { this.codeIdNm = codeIdNm; }
    
    public String getCodeIdDc() { return codeIdDc; }
    public void setCodeIdDc(String codeIdDc) { this.codeIdDc = codeIdDc; }
    
    public String getUseAt() { return useAt; }
    public void setUseAt(String useAt) { this.useAt = useAt; }
    
    public String getClCode() { return clCode; }
    public void setClCode(String clCode) { this.clCode = clCode; }
    
    public int getCodeOrder() { return codeOrder; }
    public void setCodeOrder(int codeOrder) { this.codeOrder = codeOrder; }
    
    public LocalDateTime getFrstRegistPnttm() { return frstRegistPnttm; }
    public void setFrstRegistPnttm(LocalDateTime frstRegistPnttm) { this.frstRegistPnttm = frstRegistPnttm; }
    
    public String getFrstRegisterId() { return frstRegisterId; }
    public void setFrstRegisterId(String frstRegisterId) { this.frstRegisterId = frstRegisterId; }
    
    public LocalDateTime getLastUpdtPnttm() { return lastUpdtPnttm; }
    public void setLastUpdtPnttm(LocalDateTime lastUpdtPnttm) { this.lastUpdtPnttm = lastUpdtPnttm; }
    
    public String getLastUpdusrId() { return lastUpdusrId; }
    public void setLastUpdusrId(String lastUpdusrId) { this.lastUpdusrId = lastUpdusrId; }
} 
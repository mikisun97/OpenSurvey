package egovframework.survey.vo;

import java.time.LocalDateTime;

public class CommonCodeDetailVO {
    
    private String codeId;
    private String code;
    private String codeNm;
    private String codeDc;
    private String useAt = "Y";
    private int codeOrder;
    private LocalDateTime frstRegistPnttm;
    private String frstRegisterId;
    private LocalDateTime lastUpdtPnttm;
    private String lastUpdusrId;
    
    // Getter/Setter
    public String getCodeId() { return codeId; }
    public void setCodeId(String codeId) { this.codeId = codeId; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getCodeNm() { return codeNm; }
    public void setCodeNm(String codeNm) { this.codeNm = codeNm; }
    
    public String getCodeDc() { return codeDc; }
    public void setCodeDc(String codeDc) { this.codeDc = codeDc; }
    
    public String getUseAt() { return useAt; }
    public void setUseAt(String useAt) { this.useAt = useAt; }
    
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
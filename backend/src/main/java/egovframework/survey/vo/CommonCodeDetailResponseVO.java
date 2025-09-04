package egovframework.survey.vo;

import java.util.List;

public class CommonCodeDetailResponseVO {
    
    private List<CommonCodeDetailVO> list;
    private PaginationInfo paginationInfo;
    private String resultCode;
    private String resultMessage;
    
    public CommonCodeDetailResponseVO() {}
    
    public CommonCodeDetailResponseVO(List<CommonCodeDetailVO> list, PaginationInfo paginationInfo) {
        this.list = list;
        this.paginationInfo = paginationInfo;
        this.resultCode = "SUCCESS";
        this.resultMessage = "정상 처리되었습니다.";
    }
    
    public CommonCodeDetailResponseVO(String resultCode, String resultMessage) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
    }
    
    // Getter/Setter
    public List<CommonCodeDetailVO> getList() { return list; }
    public void setList(List<CommonCodeDetailVO> list) { this.list = list; }
    
    public PaginationInfo getPaginationInfo() { return paginationInfo; }
    public void setPaginationInfo(PaginationInfo paginationInfo) { this.paginationInfo = paginationInfo; }
    
    public String getResultCode() { return resultCode; }
    public void setResultCode(String resultCode) { this.resultCode = resultCode; }
    
    public String getResultMessage() { return resultMessage; }
    public void setResultMessage(String resultMessage) { this.resultMessage = resultMessage; }
} 
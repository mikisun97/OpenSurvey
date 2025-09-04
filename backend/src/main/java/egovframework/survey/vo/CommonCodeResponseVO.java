package egovframework.survey.vo;

import java.util.List;

public class CommonCodeResponseVO {
    
    private List<CommonCodeVO> list;
    private PaginationInfo paginationInfo;
    private String resultCode;
    private String resultMessage;
    
    public CommonCodeResponseVO() {}
    
    public CommonCodeResponseVO(List<CommonCodeVO> list, PaginationInfo paginationInfo) {
        this.list = list;
        this.paginationInfo = paginationInfo;
        this.resultCode = "SUCCESS";
        this.resultMessage = "정상 처리되었습니다.";
    }
    
    public CommonCodeResponseVO(String resultCode, String resultMessage) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
    }
    
    // Getter/Setter
    public List<CommonCodeVO> getList() { return list; }
    public void setList(List<CommonCodeVO> list) { this.list = list; }
    
    public PaginationInfo getPaginationInfo() { return paginationInfo; }
    public void setPaginationInfo(PaginationInfo paginationInfo) { this.paginationInfo = paginationInfo; }
    
    public String getResultCode() { return resultCode; }
    public void setResultCode(String resultCode) { this.resultCode = resultCode; }
    
    public String getResultMessage() { return resultMessage; }
    public void setResultMessage(String resultMessage) { this.resultMessage = resultMessage; }
} 
package egovframework.survey.vo;

import java.util.List;

public class EgovResponseVO<T> {
    
    private String resultCode;
    private String resultMessage;
    private T data;
    private PaginationInfo paginationInfo;
    
    public EgovResponseVO() {}
    
    public EgovResponseVO(String resultCode, String resultMessage) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
    }
    
    public EgovResponseVO(String resultCode, String resultMessage, T data) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.data = data;
    }
    
    public EgovResponseVO(String resultCode, String resultMessage, T data, PaginationInfo paginationInfo) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.data = data;
        this.paginationInfo = paginationInfo;
    }
    
    // Getter/Setter
    public String getResultCode() { return resultCode; }
    public void setResultCode(String resultCode) { this.resultCode = resultCode; }
    
    public String getResultMessage() { return resultMessage; }
    public void setResultMessage(String resultMessage) { this.resultMessage = resultMessage; }
    
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    
    public PaginationInfo getPaginationInfo() { return paginationInfo; }
    public void setPaginationInfo(PaginationInfo paginationInfo) { this.paginationInfo = paginationInfo; }
    
    // 정적 팩토리 메서드
    public static <T> EgovResponseVO<T> success(T data) {
        return new EgovResponseVO<>("SUCCESS", "정상 처리되었습니다.", data);
    }
    
    public static <T> EgovResponseVO<T> success(T data, PaginationInfo paginationInfo) {
        return new EgovResponseVO<>("SUCCESS", "정상 처리되었습니다.", data, paginationInfo);
    }
    
    public static <T> EgovResponseVO<T> error(String message) {
        return new EgovResponseVO<>("ERROR", message);
    }
} 
package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * API 응답 VO
 */
@Schema(description = "API 응답 VO")
public class ApiResponse<T> {
    
    @Schema(description = "결과 코드", allowableValues = {"SUCCESS", "ERROR"})
    private String resultCode;
    
    @Schema(description = "결과 메시지")
    private String resultMessage;
    
    @Schema(description = "응답 데이터")
    private T data;
    
    @Schema(description = "페이지네이션 정보")
    private PaginationInfo paginationInfo;
    
    // 생성자
    public ApiResponse() {}
    
    public ApiResponse(String resultCode, String resultMessage, T data) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.data = data;
    }
    
    public ApiResponse(String resultCode, String resultMessage, T data, PaginationInfo paginationInfo) {
        this.resultCode = resultCode;
        this.resultMessage = resultMessage;
        this.data = data;
        this.paginationInfo = paginationInfo;
    }
    
    // 정적 팩토리 메서드
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("SUCCESS", message, data);
    }
    
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("SUCCESS", message, null);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("ERROR", message, null);
    }
    
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>("ERROR", message, data);
    }
    
    // Getter & Setter
    public String getResultCode() {
        return resultCode;
    }
    
    public void setResultCode(String resultCode) {
        this.resultCode = resultCode;
    }
    
    public String getResultMessage() {
        return resultMessage;
    }
    
    public void setResultMessage(String resultMessage) {
        this.resultMessage = resultMessage;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public PaginationInfo getPaginationInfo() {
        return paginationInfo;
    }
    
    public void setPaginationInfo(PaginationInfo paginationInfo) {
        this.paginationInfo = paginationInfo;
    }
} 
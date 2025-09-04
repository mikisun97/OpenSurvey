package egovframework.survey.vo;

import java.io.Serializable;

/**
 * 전자정부 프레임워크 표준 결과 응답 VO
 * 
 * @author OpenSurvey Team
 * @since 2024.01.01
 */
public class EgovResultVO<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /** 성공 여부 */
    private boolean success;
    
    /** 메시지 */
    private String message;
    
    /** 데이터 */
    private T data;
    
    /** 에러 코드 */
    private String errorCode;
    
    public EgovResultVO() {
        this.success = false;
    }
    
    public EgovResultVO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public EgovResultVO(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public static <T> EgovResultVO<T> success(String message) {
        return new EgovResultVO<>(true, message);
    }
    
    public static <T> EgovResultVO<T> success(String message, T data) {
        return new EgovResultVO<>(true, message, data);
    }
    
    public static <T> EgovResultVO<T> fail(String message) {
        return new EgovResultVO<>(false, message);
    }
    
    public static <T> EgovResultVO<T> fail(String message, String errorCode) {
        EgovResultVO<T> result = new EgovResultVO<>(false, message);
        result.setErrorCode(errorCode);
        return result;
    }
    
    // Getter/Setter
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
} 
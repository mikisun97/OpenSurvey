package egovframework.survey.vo;

import java.io.Serializable;
import java.util.List;
import org.egovframe.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;

/**
 * 전자정부 프레임워크 표준 페이징 응답 VO
 * 
 * @author OpenSurvey Team
 * @since 2024.01.01
 */
public class EgovPaginationResponseVO<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /** 성공 여부 */
    private boolean success = true;
    
    /** 메시지 */
    private String message = "조회가 완료되었습니다.";
    
    /** 데이터 목록 */
    private List<T> list;
    
    /** 페이징 정보 */
    private PaginationInfo paginationInfo;
    
    public EgovPaginationResponseVO() {
    }
    
    public EgovPaginationResponseVO(List<T> list, PaginationInfo paginationInfo) {
        this.list = list;
        this.paginationInfo = paginationInfo;
    }
    
    public EgovPaginationResponseVO(boolean success, String message, List<T> list, PaginationInfo paginationInfo) {
        this.success = success;
        this.message = message;
        this.list = list;
        this.paginationInfo = paginationInfo;
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
    
    public List<T> getList() {
        return list;
    }
    
    public void setList(List<T> list) {
        this.list = list;
    }
    
    public PaginationInfo getPaginationInfo() {
        return paginationInfo;
    }
    
    public void setPaginationInfo(PaginationInfo paginationInfo) {
        this.paginationInfo = paginationInfo;
    }
} 
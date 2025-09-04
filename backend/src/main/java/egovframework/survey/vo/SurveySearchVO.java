package egovframework.survey.vo;

import java.util.Date;

import lombok.Data;

@Data
public class SurveySearchVO {
    
    private String searchKeyword;
    private String searchCondition;
    private String status;
    private String useAt;
    private Date startDate;
    private Date endDate;
    
    // 페이징 관련 필드
    private int pageIndex = 1;
    private int pageUnit = 10;
    private int pageSize = 10;
    private int firstIndex = 0;
    private int lastIndex = 1;
    private int recordCountPerPage = 10;
} 
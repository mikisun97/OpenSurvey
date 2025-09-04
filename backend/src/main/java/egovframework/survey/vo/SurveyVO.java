package egovframework.survey.vo;

import java.util.Date;

import lombok.Data;

@Data
public class SurveyVO {
    
    private Long surveyId;
    private String surveyTitle;
    private String surveyDescription;
    private Date startDate;
    private Date endDate;
    private String status;
    private String useAt;
    private Date registDate;
    private String registUser;
    private Date updateDate;
    private String updateUser;
    
    // 페이징 관련 필드
    private int pageIndex = 1;
    private int pageUnit = 10;
    private int pageSize = 10;
    private int firstIndex = 0;
    private int lastIndex = 1;
    private int recordCountPerPage = 10;
} 
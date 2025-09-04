package egovframework.survey.service;

import java.util.List;

import egovframework.survey.vo.SurveyVO;

public interface SurveyService {
    
    List<SurveyVO> selectSurveyList(SurveyVO searchVO);
    
    SurveyVO selectSurvey(Long surveyId);
    
    void insertSurvey(SurveyVO surveyVO);
    
    void updateSurvey(SurveyVO surveyVO);
    
    void deleteSurvey(Long surveyId);
} 
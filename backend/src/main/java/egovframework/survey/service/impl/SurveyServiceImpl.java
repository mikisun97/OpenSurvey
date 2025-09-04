package egovframework.survey.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import egovframework.survey.service.SurveyService;
import egovframework.survey.vo.SurveyVO;

@Service
public class SurveyServiceImpl implements SurveyService {

    @Override
    public List<SurveyVO> selectSurveyList(SurveyVO searchVO) {
        // TODO: 실제 구현
        return null;
    }

    @Override
    public SurveyVO selectSurvey(Long surveyId) {
        // TODO: 실제 구현
        return null;
    }

    @Override
    public void insertSurvey(SurveyVO surveyVO) {
        // TODO: 실제 구현
    }

    @Override
    public void updateSurvey(SurveyVO surveyVO) {
        // TODO: 실제 구현
    }

    @Override
    public void deleteSurvey(Long surveyId) {
        // TODO: 실제 구현
    }
} 
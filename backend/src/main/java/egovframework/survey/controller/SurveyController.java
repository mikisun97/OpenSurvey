package egovframework.survey.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import egovframework.survey.service.SurveyService;
import egovframework.survey.vo.SurveyVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/survey")
@Tag(name = "Survey", description = "설문조사 API")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @GetMapping("/list")
    @Operation(summary = "설문조사 목록 조회", description = "설문조사 목록을 페이징하여 조회합니다.")
    public List<SurveyVO> getSurveyList() {
        SurveyVO searchVO = new SurveyVO();
        return surveyService.selectSurveyList(searchVO);
    }
} 
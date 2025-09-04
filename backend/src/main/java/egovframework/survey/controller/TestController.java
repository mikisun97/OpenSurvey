package egovframework.survey.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 테스트용 Controller
 * 
 * @author OpenSurvey Team
 * @since 2024.01.01
 */
@RestController
@RequestMapping("/test")
public class TestController {
    
    @GetMapping
    public String test() {
        return "Hello, eGovFrame Boot!";
    }
} 
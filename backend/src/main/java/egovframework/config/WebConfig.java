package egovframework.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 설정 클래스
 * 파일 업로드된 이미지를 정적 리소스로 서빙하기 위한 설정
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 파일을 정적 리소스로 서빙
        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations("file:" + uploadPath);
                
        // Railway 환경에서 /tmp/uploads/ 경로 추가 매핑
        registry.addResourceHandler("/api/files/**")
                .addResourceLocations("file:/tmp/uploads/");
    }
}

package egovframework.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI 설정
 * 전자정부 프레임워크 4.3.0 기반
 * 
 * @author OpenSurvey Team
 * @since 2024.01.01
 */
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("OpenSurvey API")
                        .description("전자정부 프레임워크 4.3.0 기반 설문조사 시스템 API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("OpenSurvey Team")
                                .email("admin@opensurvey.com")
                                .url("https://opensurvey.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT 토큰을 입력하세요. 로그인 API에서 받은 accessToken을 사용합니다.")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
} 
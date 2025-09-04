package egovframework;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "egovframework")
@MapperScan(basePackages = "egovframework.survey.mapper")
public class EgovBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(EgovBootApplication.class, args);
	}

} 
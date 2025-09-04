package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "공통코드 상세 검색 VO")
public class CommonCodeDetailSearchVO extends BaseSearchVO {
    
    // 공통 상세코드만의 고유 필드
    @Schema(description = "검색 조건", type = "string", allowableValues = {"code", "codeNm"}, defaultValue = "ALL")
    private String searchCondition = "ALL";
    
    // 기본값 설정 (생성자에서)
    public CommonCodeDetailSearchVO() {
        super();
        // 공통 상세코드 전용 기본값 설정
        setSortField("CODE_ORDER");
    }
    
    // Getter/Setter
    public String getSearchCondition() { return searchCondition; }
    public void setSearchCondition(String searchCondition) { this.searchCondition = searchCondition; }
    
    @Override
    public String toString() {
        return "CommonCodeDetailSearchVO{" +
                "searchCondition='" + searchCondition + '\'' +
                ", " + super.toString().substring(12) + // BaseSearchVO의 toString 결과에서 "BaseSearchVO{" 부분 제거
                '}';
    }
} 
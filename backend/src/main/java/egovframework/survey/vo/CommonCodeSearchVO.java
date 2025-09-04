package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "공통코드 검색 VO")
public class CommonCodeSearchVO extends BaseSearchVO {
    
    // 공통코드만의 고유 필드
    @Schema(description = "검색 조건", type = "string", allowableValues = {"codeId", "codeIdNm"}, defaultValue = "ALL")
    private String searchCondition = "ALL";
    
    @Schema(description = "분류 코드", type = "string", defaultValue = "")
    private String searchClCode = "";
    
    @Schema(description = "코드 ID", type = "string", defaultValue = "")
    private String codeId = "";
    
    @Schema(description = "코드", type = "string", defaultValue = "")
    private String code = "";
    
    // 기본값 설정 (생성자에서)
    public CommonCodeSearchVO() {
        super();
        // 공통코드 전용 기본값 설정
        setSortField("CODE_ID");
    }
    
    // Getter/Setter
    public String getSearchCondition() { return searchCondition; }
    public void setSearchCondition(String searchCondition) { this.searchCondition = searchCondition; }
    
    public String getSearchClCode() { return searchClCode; }
    public void setSearchClCode(String searchClCode) { this.searchClCode = searchClCode; }
    
    public String getCodeId() { return codeId; }
    public void setCodeId(String codeId) { this.codeId = codeId; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    @Override
    public String toString() {
        return "CommonCodeSearchVO{" +
                "searchCondition='" + searchCondition + '\'' +
                ", searchClCode='" + searchClCode + '\'' +
                ", codeId='" + codeId + '\'' +
                ", code='" + code + '\'' +
                ", " + super.toString().substring(12) + // BaseSearchVO의 toString 결과에서 "BaseSearchVO{" 부분 제거
                '}';
    }
} 
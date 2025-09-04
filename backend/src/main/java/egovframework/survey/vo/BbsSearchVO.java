package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "게시물 검색 VO")
public class BbsSearchVO extends BaseSearchVO {
    
    // 게시물만의 고유 필드
    @Schema(description = "게시판 ID", type = "string")
    private String bbsId;
    
    @Schema(description = "공지 여부", type = "string", allowableValues = {"Y", "N", "ALL"}, defaultValue = "ALL")
    private String searchNtceAt = "ALL";
    
    @Schema(description = "공개 여부", type = "string", allowableValues = {"Y", "N", "ALL"}, defaultValue = "ALL")
    private String searchExposureYn = "ALL";
    
    @Schema(description = "구분 코드", type = "string", defaultValue = "ALL")
    private String searchCategory = "ALL";
    
    // 기본값 설정 (생성자에서)
    public BbsSearchVO() {
        super();
        // 게시물 전용 기본값 설정
        setSortField("FRST_REGIST_PNTTM");
        setSortOrder("DESC");  // 최신순 기본 정렬
    }
    
    // Getter/Setter
    public String getBbsId() { return bbsId; }
    public void setBbsId(String bbsId) { this.bbsId = bbsId; }
    
    public String getSearchNtceAt() { return searchNtceAt; }
    public void setSearchNtceAt(String searchNtceAt) { this.searchNtceAt = searchNtceAt; }
    
    public String getSearchExposureYn() { return searchExposureYn; }
    public void setSearchExposureYn(String searchExposureYn) { this.searchExposureYn = searchExposureYn; }
    
    public String getSearchCategory() { return searchCategory; }
    public void setSearchCategory(String searchCategory) { this.searchCategory = searchCategory; }
    
    @Override
    public String toString() {
        return "BbsSearchVO{" +
                "bbsId='" + bbsId + '\'' +
                ", searchNtceAt='" + searchNtceAt + '\'' +
                ", searchExposureYn='" + searchExposureYn + '\'' +
                ", searchCategory='" + searchCategory + '\'' +
                ", " + super.toString().substring(12) + // BaseSearchVO의 toString 결과에서 "BaseSearchVO{" 부분 제거
                '}';
    }
} 
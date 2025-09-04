package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "게시판 마스터 검색 VO")
public class BbsMstSearchVO extends BaseSearchVO {
    
    // 게시판만의 고유 필드
    @Schema(description = "게시판 유형", type = "string", allowableValues = {"BBST01", "BBST02", "BBST03", "ALL"}, defaultValue = "ALL")
    private String searchBbsType = "ALL";
    
    @Schema(description = "댓글 허용 여부", type = "string", allowableValues = {"Y", "N", "ALL"}, defaultValue = "ALL")
    private String searchReplyPosbl = "ALL";
    
    @Schema(description = "파일 첨부 허용 여부", type = "string", allowableValues = {"Y", "N", "ALL"}, defaultValue = "ALL")
    private String searchFileAtchPosbl = "ALL";
    
    // 기본값 설정 (생성자에서)
    public BbsMstSearchVO() {
        super();
        // 게시판 전용 기본값 설정
        setSortField("BBS_ID");
    }
    
    // Getter/Setter
    public String getSearchBbsType() { return searchBbsType; }
    public void setSearchBbsType(String searchBbsType) { this.searchBbsType = searchBbsType; }
    
    public String getSearchReplyPosbl() { return searchReplyPosbl; }
    public void setSearchReplyPosbl(String searchReplyPosbl) { this.searchReplyPosbl = searchReplyPosbl; }
    
    public String getSearchFileAtchPosbl() { return searchFileAtchPosbl; }
    public void setSearchFileAtchPosbl(String searchFileAtchPosbl) { this.searchFileAtchPosbl = searchFileAtchPosbl; }
    
    @Override
    public String toString() {
        return "BbsMstSearchVO{" +
                "searchBbsType='" + searchBbsType + '\'' +
                ", searchReplyPosbl='" + searchReplyPosbl + '\'' +
                ", searchFileAtchPosbl='" + searchFileAtchPosbl + '\'' +
                ", " + super.toString().substring(12) + // BaseSearchVO의 toString 결과에서 "BaseSearchVO{" 부분 제거
                '}';
    }
} 
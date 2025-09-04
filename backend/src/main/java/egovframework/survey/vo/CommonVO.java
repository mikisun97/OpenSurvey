package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 공통 검색 및 페이징 VO
 */
@Schema(description = "공통 검색 및 페이징 VO")
public class CommonVO {
    
    // 검색 관련 필드
    @Schema(description = "검색 키워드", type = "string")
    private String searchKeyword;
    
    @Schema(description = "검색 조건", type = "string")
    private String searchCondition;
    
    @Schema(description = "사용 여부", type = "string", allowableValues = {"Y", "N", "ALL"})
    private String useAt;
    
    @Schema(description = "공지 여부", type = "string", allowableValues = {"Y", "N", "ALL"})
    private String ntceAt;
    
    @Schema(description = "공개 여부", type = "string", allowableValues = {"Y", "N", "ALL"})
    private String exposureYn;
    
    @Schema(description = "게시판ID", type = "string")
    private String bbsId;
    
    // 페이징 관련 필드
    @Schema(description = "페이지 인덱스", example = "1")
    private int pageIndex = 1;
    
    @Schema(description = "페이지 크기", example = "10")
    private int pageSize = 10;
    
    @Schema(description = "페이지 오프셋", example = "0")
    private int pageOffset = 0;
    
    // 정렬 관련 필드
    @Schema(description = "정렬 필드", type = "string")
    private String sortField;
    
    @Schema(description = "정렬 순서", allowableValues = {"ASC", "DESC"}, defaultValue = "DESC")
    private String sortOrder = "DESC";
    
    // 생성자
    public CommonVO() {
        updatePageOffset();
    }
    
    // 페이지 오프셋 업데이트 (pageIndex는 0부터 시작)
    private void updatePageOffset() {
        this.pageOffset = this.pageIndex * this.pageSize;
    }
    
    // Getter & Setter
    public String getSearchKeyword() {
        return searchKeyword;
    }
    
    public void setSearchKeyword(String searchKeyword) {
        this.searchKeyword = searchKeyword;
    }
    
    public String getSearchCondition() {
        return searchCondition;
    }
    
    public void setSearchCondition(String searchCondition) {
        this.searchCondition = searchCondition;
    }
    
    public String getUseAt() {
        return useAt;
    }
    
    public void setUseAt(String useAt) {
        this.useAt = useAt;
    }
    
    public String getNtceAt() {
        return ntceAt;
    }
    
    public void setNtceAt(String ntceAt) {
        this.ntceAt = ntceAt;
    }
    
    public String getExposureYn() {
        return exposureYn;
    }
    
    public void setExposureYn(String exposureYn) {
        this.exposureYn = exposureYn;
    }
    
    public String getBbsId() {
        return bbsId;
    }
    
    public void setBbsId(String bbsId) {
        this.bbsId = bbsId;
    }
    
    public int getPageIndex() {
        return pageIndex;
    }
    
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
        updatePageOffset();
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
        updatePageOffset();
    }
    
    public int getPageOffset() {
        return pageOffset;
    }
    
    public void setPageOffset(int pageOffset) {
        this.pageOffset = pageOffset;
    }
    
    public String getSortField() {
        return sortField;
    }
    
    public void setSortField(String sortField) {
        this.sortField = sortField;
    }
    
    public String getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }
} 
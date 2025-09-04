package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 공통 검색 및 페이징 기본 VO
 * 모든 목록 조회 API에서 공통으로 사용되는 필드들을 정의
 */
@Schema(description = "공통 검색 및 페이징 기본 VO")
public abstract class BaseSearchVO {
    
    // 페이징 관련 필드 (전자정부 프레임워크 표준)
    @Schema(description = "페이지 인덱스", example = "0")
    private int pageIndex = 0;
    
    @Schema(description = "페이지 단위", example = "10")
    private int pageUnit = 10;
    
    @Schema(description = "페이지 크기", example = "10")
    private int pageSize = 10;
    
    @Schema(description = "첫 번째 인덱스", example = "0")
    private int firstIndex = 0;
    
    @Schema(description = "마지막 인덱스", example = "1")
    private int lastIndex = 1;
    
    @Schema(description = "페이지당 레코드 수", example = "10")
    private int recordCountPerPage = 10;
    
    // 정렬 관련 필드 (전자정부 프레임워크 표준)
    @Schema(description = "정렬 필드", type = "string")
    private String sortField;
    
    @Schema(description = "정렬 방향", allowableValues = {"ASC", "DESC"}, defaultValue = "ASC")
    private String sortOrder = "ASC";
    
    // 검색 관련 필드 (공통)
    @Schema(description = "검색 키워드", type = "string", defaultValue = "")
    private String searchKeyword = "";
    
    @Schema(description = "사용 여부", type = "string", allowableValues = {"Y", "N", "ALL"}, defaultValue = "ALL")
    private String searchUseAt = "ALL";
    
    // Getter & Setter
    public int getPageIndex() { return pageIndex; }
    public void setPageIndex(int pageIndex) { this.pageIndex = pageIndex; }
    
    public int getPageUnit() { return pageUnit; }
    public void setPageUnit(int pageUnit) { this.pageUnit = pageUnit; }
    
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    
    public int getFirstIndex() { return firstIndex; }
    public void setFirstIndex(int firstIndex) { this.firstIndex = firstIndex; }
    
    public int getLastIndex() { return lastIndex; }
    public void setLastIndex(int lastIndex) { this.lastIndex = lastIndex; }
    
    public int getRecordCountPerPage() { return recordCountPerPage; }
    public void setRecordCountPerPage(int recordCountPerPage) { this.recordCountPerPage = recordCountPerPage; }
    
    public String getSortField() { return sortField; }
    public void setSortField(String sortField) { this.sortField = sortField; }
    
    public String getSortOrder() { return sortOrder; }
    public void setSortOrder(String sortOrder) { this.sortOrder = sortOrder; }
    
    public String getSearchKeyword() { return searchKeyword; }
    public void setSearchKeyword(String searchKeyword) { this.searchKeyword = searchKeyword; }
    
    public String getSearchUseAt() { return searchUseAt; }
    public void setSearchUseAt(String searchUseAt) { this.searchUseAt = searchUseAt; }
    
    @Override
    public String toString() {
        return "BaseSearchVO{" +
                "pageIndex=" + pageIndex +
                ", pageSize=" + pageSize +
                ", sortField='" + sortField + '\'' +
                ", sortOrder='" + sortOrder + '\'' +
                ", searchKeyword='" + searchKeyword + '\'' +
                ", searchUseAt='" + searchUseAt + '\'' +
                '}';
    }
} 
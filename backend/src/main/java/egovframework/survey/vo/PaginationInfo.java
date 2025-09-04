package egovframework.survey.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 페이지네이션 정보 VO
 */
@Schema(description = "페이지네이션 정보 VO")
public class PaginationInfo {
    
    @Schema(description = "현재 페이지 번호", example = "1")
    private int currentPageNo = 1;
    
    @Schema(description = "페이지당 레코드 수", example = "10")
    private int recordCountPerPage = 10;
    
    @Schema(description = "페이지 단위", example = "10")
    private int pageSize = 10;
    
    @Schema(description = "전체 레코드 수", example = "100")
    private int totalRecordCount = 0;
    
    @Schema(description = "전체 페이지 수", example = "10")
    private int totalPageCount = 0;
    
    @Schema(description = "첫 번째 페이지 번호", example = "1")
    private int firstPageNoOnPageList = 1;
    
    @Schema(description = "마지막 페이지 번호", example = "10")
    private int lastPageNoOnPageList = 1;
    
    @Schema(description = "첫 번째 레코드 인덱스", example = "0")
    private int firstRecordIndex = 0;
    
    @Schema(description = "마지막 레코드 인덱스", example = "9")
    private int lastRecordIndex = 0;
    
    // 생성자
    public PaginationInfo() {}
    
    // 페이지네이션 정보 계산
    public void setTotalRecordCount(int totalRecordCount) {
        this.totalRecordCount = totalRecordCount;
        
        if (totalRecordCount > 0) {
            // 전체 페이지 수 계산
            this.totalPageCount = (int) Math.ceil((double) totalRecordCount / recordCountPerPage);
            
            // 현재 페이지 번호 보정
            if (this.currentPageNo > this.totalPageCount) {
                this.currentPageNo = this.totalPageCount;
            }
            
            // 첫 번째, 마지막 페이지 번호 계산
            int pageGroupSize = this.pageSize;
            int currentGroup = (int) Math.ceil((double) this.currentPageNo / pageGroupSize);
            
            this.firstPageNoOnPageList = (currentGroup - 1) * pageGroupSize + 1;
            this.lastPageNoOnPageList = Math.min(currentGroup * pageGroupSize, this.totalPageCount);
            
            // 첫 번째, 마지막 레코드 인덱스 계산
            this.firstRecordIndex = (this.currentPageNo - 1) * this.recordCountPerPage;
            this.lastRecordIndex = Math.min(this.firstRecordIndex + this.recordCountPerPage - 1, 
                                           this.totalRecordCount - 1);
        } else {
            this.totalPageCount = 0;
            this.firstPageNoOnPageList = 1;
            this.lastPageNoOnPageList = 1;
            this.firstRecordIndex = 0;
            this.lastRecordIndex = 0;
        }
    }
    
    // Getter & Setter
    public int getCurrentPageNo() {
        return currentPageNo;
    }
    
    public void setCurrentPageNo(int currentPageNo) {
        this.currentPageNo = currentPageNo;
    }
    
    public int getRecordCountPerPage() {
        return recordCountPerPage;
    }
    
    public void setRecordCountPerPage(int recordCountPerPage) {
        this.recordCountPerPage = recordCountPerPage;
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    
    public int getTotalRecordCount() {
        return totalRecordCount;
    }
    
    public int getTotalPageCount() {
        return totalPageCount;
    }
    
    public void setTotalPageCount(int totalPageCount) {
        this.totalPageCount = totalPageCount;
    }
    
    public int getFirstPageNoOnPageList() {
        return firstPageNoOnPageList;
    }
    
    public void setFirstPageNoOnPageList(int firstPageNoOnPageList) {
        this.firstPageNoOnPageList = firstPageNoOnPageList;
    }
    
    public int getLastPageNoOnPageList() {
        return lastPageNoOnPageList;
    }
    
    public void setLastPageNoOnPageList(int lastPageNoOnPageList) {
        this.lastPageNoOnPageList = lastPageNoOnPageList;
    }
    
    public int getFirstRecordIndex() {
        return firstRecordIndex;
    }
    
    public void setFirstRecordIndex(int firstRecordIndex) {
        this.firstRecordIndex = firstRecordIndex;
    }
    
    public int getLastRecordIndex() {
        return lastRecordIndex;
    }
    
    public void setLastRecordIndex(int lastRecordIndex) {
        this.lastRecordIndex = lastRecordIndex;
    }
} 
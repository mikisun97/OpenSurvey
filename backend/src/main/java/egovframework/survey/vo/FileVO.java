package egovframework.survey.vo;

import java.time.LocalDateTime;

/**
 * 첨부파일 정보 VO
 * COMTNFILE + COMTNFILEDETAIL 테이블과 매핑 (전자정부 프레임워크 표준)
 */
public class FileVO {
    
    // 기본 정보 (COMTNFILEDETAIL 테이블)
    private String atchFileId;         // 첨부파일ID
    private Long fileSn;               // 파일순번
    private String fileStreCours;      // 파일저장경로
    private String streFileNm;         // 저장파일명
    private String orignlFileNm;       // 원파일명
    private String fileExtsn;          // 파일확장자
    private String fileCn;             // 파일내용
    private Long fileSize;             // 파일크기
    private Long fileOrder;            // 파일정렬순서
    
    // 마스터 정보 (COMTNFILE 테이블)
    private LocalDateTime creatDt;     // 생성일시
    private String useAt;              // 사용여부

    // 응답 편의를 위한 URL (비영속 필드)
    private String fileUrl;            // 접근 URL
    
    // 생성자
    public FileVO() {}
    
    // Getter & Setter
    public String getAtchFileId() {
        return atchFileId;
    }
    
    public void setAtchFileId(String atchFileId) {
        this.atchFileId = atchFileId;
    }
    
    public Long getFileSn() {
        return fileSn;
    }
    
    public void setFileSn(Long fileSn) {
        this.fileSn = fileSn;
    }
    
    public String getFileStreCours() {
        return fileStreCours;
    }
    
    public void setFileStreCours(String fileStreCours) {
        this.fileStreCours = fileStreCours;
    }
    
    public String getStreFileNm() {
        return streFileNm;
    }
    
    public void setStreFileNm(String streFileNm) {
        this.streFileNm = streFileNm;
    }
    
    public String getOrignlFileNm() {
        return orignlFileNm;
    }
    
    public void setOrignlFileNm(String orignlFileNm) {
        this.orignlFileNm = orignlFileNm;
    }
    
    public String getFileExtsn() {
        return fileExtsn;
    }
    
    public void setFileExtsn(String fileExtsn) {
        this.fileExtsn = fileExtsn;
    }
    
    public String getFileCn() {
        return fileCn;
    }
    
    public void setFileCn(String fileCn) {
        this.fileCn = fileCn;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public LocalDateTime getCreatDt() {
        return creatDt;
    }
    
    public void setCreatDt(LocalDateTime creatDt) {
        this.creatDt = creatDt;
    }
    
    public String getUseAt() {
        return useAt;
    }
    
    public void setUseAt(String useAt) {
        this.useAt = useAt;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public Long getFileOrder() {
        return fileOrder;
    }
    
    public void setFileOrder(Long fileOrder) {
        this.fileOrder = fileOrder;
    }
}

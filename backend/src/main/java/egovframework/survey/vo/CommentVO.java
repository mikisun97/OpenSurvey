package egovframework.survey.vo;

import java.time.LocalDateTime;

/**
 * 댓글 정보 VO
 * COMTNCOMMENT 테이블과 매핑
 */
public class CommentVO {
    
    // 기본 정보
    private int commentNo;             // 댓글번호
    private int nttId;                 // 게시글ID
    private String commentCn;          // 댓글내용
    private String commentWriterId;    // 댓글작성자ID
    private String commentWriterNm;    // 댓글작성자명
    private String commentPassword;    // 댓글비밀번호
    private String useAt;              // 사용여부
    
    // 등록/수정 정보
    private String frstRegisterId;     // 최초등록자ID
    private LocalDateTime frstRegistPnttm; // 최초등록시점
    private String lastUpdusrId;       // 최종수정자ID
    private LocalDateTime lastUpdtPnttm; // 최종수정시점
    
    // 생성자
    public CommentVO() {}
    
    // Getter & Setter
    public int getCommentNo() {
        return commentNo;
    }
    
    public void setCommentNo(int commentNo) {
        this.commentNo = commentNo;
    }
    
    public int getNttId() {
        return nttId;
    }
    
    public void setNttId(int nttId) {
        this.nttId = nttId;
    }
    
    public String getCommentCn() {
        return commentCn;
    }
    
    public void setCommentCn(String commentCn) {
        this.commentCn = commentCn;
    }
    
    public String getCommentWriterId() {
        return commentWriterId;
    }
    
    public void setCommentWriterId(String commentWriterId) {
        this.commentWriterId = commentWriterId;
    }
    
    public String getCommentWriterNm() {
        return commentWriterNm;
    }
    
    public void setCommentWriterNm(String commentWriterNm) {
        this.commentWriterNm = commentWriterNm;
    }
    
    public String getCommentPassword() {
        return commentPassword;
    }
    
    public void setCommentPassword(String commentPassword) {
        this.commentPassword = commentPassword;
    }
    
    public String getUseAt() {
        return useAt;
    }
    
    public void setUseAt(String useAt) {
        this.useAt = useAt;
    }
    
    public String getFrstRegisterId() {
        return frstRegisterId;
    }
    
    public void setFrstRegisterId(String frstRegisterId) {
        this.frstRegisterId = frstRegisterId;
    }
    
    public LocalDateTime getFrstRegistPnttm() {
        return frstRegistPnttm;
    }
    
    public void setFrstRegistPnttm(LocalDateTime frstRegistPnttm) {
        this.frstRegistPnttm = frstRegistPnttm;
    }
    
    public String getLastUpdusrId() {
        return lastUpdusrId;
    }
    
    public void setLastUpdusrId(String lastUpdusrId) {
        this.lastUpdusrId = lastUpdusrId;
    }
    
    public LocalDateTime getLastUpdtPnttm() {
        return lastUpdtPnttm;
    }
    
    public void setLastUpdtPnttm(LocalDateTime lastUpdtPnttm) {
        this.lastUpdtPnttm = lastUpdtPnttm;
    }
} 
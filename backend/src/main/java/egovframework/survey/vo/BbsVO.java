package egovframework.survey.vo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 게시글 정보 VO
 * COMTNBBS 테이블과 매핑
 */
public class BbsVO {
    
    // 기본 정보
    private Long nttId;                // 게시글ID
    private String bbsId;              // 게시판ID
    private Integer nttNo;             // 게시글번호
    private String nttSj;              // 게시글제목
    private String nttCn;              // 게시글내용
    
    // 답변/정렬 정보
    private String answerAt;           // 답변여부
    private Integer parntscttNo;       // 부모스크랩수
    private Integer answerLc;          // 답변위치
    private Integer sortOrdr;          // 정렬순서
    
    // 메타 정보
    private Integer rdcnt;             // 조회수
    private String useAt;              // 사용여부
    private String ntceAt;             // 공지여부
    private String exposureYn;         // 공개여부 (공개/비공개)
    private String atchFileId;         // 첨부파일ID
    
    // 작성자 정보
    private String frstRegisterId;     // 최초등록자ID
    private String ntcrnNm;            // 게시자명
    private String password;           // 패스워드
    
    // 등록/수정 정보
    private LocalDateTime frstRegistPnttm; // 최초등록시점
    private String lastUpdusrId;       // 최종수정자ID
    private LocalDateTime lastUpdtPnttm; // 최종수정시점
    
    // 연관 데이터
    private List<FileVO> fileList;     // 첨부파일 목록
    private List<CommentVO> commentList; // 댓글 목록
    
    // 게시판 정보 (조인용)
    private String bbsNm;              // 게시판명
    private String bbsTyCode;          // 게시판유형코드
    
    // 게시판별 추가 속성 (전자정부 프레임워크 표준)
    private String nttTag;             // 게시글태그 (블로그게시판용)
    private String nttCategory;        // 게시글카테고리 (FAQ, QNA게시판용)
    private Integer nttPriority;       // 게시글우선순위 (공지게시판용)
    private LocalDate nttExpiryDate;   // 게시글만료일 (공지게시판용)
    private Integer nttViewCount;      // 게시글조회수 (모든 게시판)
    private Integer nttLikeCount;      // 게시글좋아요수 (커뮤니티게시판용)
    private String nttStatusCode;      // 게시글상태코드
    
    // 대표이미지 정보 (추가)
    private String representImageId;     // 대표이미지 ID
    private String representImageName;   // 대표이미지 파일명
    private String representImageUrl;    // 대표이미지 URL
    private Long representImageSize;     // 대표이미지 크기
    
    // 메인화면이미지 정보 (추가)
    private String mainImageId;          // 메인화면이미지 ID
    private String mainImageName;        // 메인화면이미지 파일명
    private String mainImageUrl;         // 메인화면이미지 URL
    private Long mainImageSize;          // 메인화면이미지 크기

    // 다중이미지 정보 (업데이트 요청용)
    private List<String> multiImageIds;   // 다중이미지 저장파일명 목록
    private List<String> multiImageNames; // 다중이미지 원본파일명 목록
    private List<Integer> multiImageOrder; // 다중이미지 순서 목록

    // 다중이미지 상세 응답용 목록
    private List<FileVO> multiImageList;  // 다중이미지 목록
    
    // 생성자
    public BbsVO() {}

    // multiImageList getter/setter
    public List<FileVO> getMultiImageList() {
        return multiImageList;
    }

    public void setMultiImageList(List<FileVO> multiImageList) {
        this.multiImageList = multiImageList;
    }

    // Getter & Setter
    public Long getNttId() {
        return nttId;
    }
    
    public void setNttId(Long nttId) {
        this.nttId = nttId;
    }
    
    public String getBbsId() {
        return bbsId;
    }
    
    public void setBbsId(String bbsId) {
        this.bbsId = bbsId;
    }
    
    public Integer getNttNo() {
        return nttNo;
    }
    
    public void setNttNo(Integer nttNo) {
        this.nttNo = nttNo;
    }
    
    public String getNttSj() {
        return nttSj;
    }
    
    public void setNttSj(String nttSj) {
        this.nttSj = nttSj;
    }
    
    public String getNttCn() {
        return nttCn;
    }
    
    public void setNttCn(String nttCn) {
        this.nttCn = nttCn;
    }
    
    public String getAnswerAt() {
        return answerAt;
    }
    
    public void setAnswerAt(String answerAt) {
        this.answerAt = answerAt;
    }
    
    public Integer getParntscttNo() {
        return parntscttNo;
    }
    
    public void setParntscttNo(Integer parntscttNo) {
        this.parntscttNo = parntscttNo;
    }
    
    public Integer getAnswerLc() {
        return answerLc;
    }
    
    public void setAnswerLc(Integer answerLc) {
        this.answerLc = answerLc;
    }
    
    public Integer getSortOrdr() {
        return sortOrdr;
    }
    
    public void setSortOrdr(Integer sortOrdr) {
        this.sortOrdr = sortOrdr;
    }
    
    public Integer getRdcnt() {
        return rdcnt;
    }
    
    public void setRdcnt(Integer rdcnt) {
        this.rdcnt = rdcnt;
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
    
    public String getAtchFileId() {
        return atchFileId;
    }
    
    public void setAtchFileId(String atchFileId) {
        this.atchFileId = atchFileId;
    }
    
    public String getFrstRegisterId() {
        return frstRegisterId;
    }
    
    public void setFrstRegisterId(String frstRegisterId) {
        this.frstRegisterId = frstRegisterId;
    }
    
    public String getNtcrnNm() {
        return ntcrnNm;
    }
    
    public void setNtcrnNm(String ntcrnNm) {
        this.ntcrnNm = ntcrnNm;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
    
    public List<FileVO> getFileList() {
        return fileList;
    }
    
    public void setFileList(List<FileVO> fileList) {
        this.fileList = fileList;
    }
    
    public List<CommentVO> getCommentList() {
        return commentList;
    }
    
    public void setCommentList(List<CommentVO> commentList) {
        this.commentList = commentList;
    }
    
    public String getBbsNm() {
        return bbsNm;
    }
    
    public void setBbsNm(String bbsNm) {
        this.bbsNm = bbsNm;
    }
    
    public String getBbsTyCode() {
        return bbsTyCode;
    }
    
    public void setBbsTyCode(String bbsTyCode) {
        this.bbsTyCode = bbsTyCode;
    }
    
    // 새로운 필드들의 Getter & Setter
    public String getNttTag() {
        return nttTag;
    }
    
    public void setNttTag(String nttTag) {
        this.nttTag = nttTag;
    }
    
    public String getNttCategory() {
        return nttCategory;
    }
    
    public void setNttCategory(String nttCategory) {
        this.nttCategory = nttCategory;
    }
    
    public Integer getNttPriority() {
        return nttPriority;
    }
    
    public void setNttPriority(Integer nttPriority) {
        this.nttPriority = nttPriority;
    }
    
    public LocalDate getNttExpiryDate() {
        return nttExpiryDate;
    }
    
    public void setNttExpiryDate(LocalDate nttExpiryDate) {
        this.nttExpiryDate = nttExpiryDate;
    }
    
    public Integer getNttViewCount() {
        return nttViewCount;
    }
    
    public void setNttViewCount(Integer nttViewCount) {
        this.nttViewCount = nttViewCount;
    }
    
    public Integer getNttLikeCount() {
        return nttLikeCount;
    }
    
    public void setNttLikeCount(Integer nttLikeCount) {
        this.nttLikeCount = nttLikeCount;
    }
    
    public String getNttStatusCode() {
        return nttStatusCode;
    }
    
    public void setNttStatusCode(String nttStatusCode) {
        this.nttStatusCode = nttStatusCode;
    }
    
    // 대표이미지 필드들의 Getter & Setter
    public String getRepresentImageId() {
        return representImageId;
    }

    public void setRepresentImageId(String representImageId) {
        this.representImageId = representImageId;
    }

    public String getRepresentImageName() {
        return representImageName;
    }

    public void setRepresentImageName(String representImageName) {
        this.representImageName = representImageName;
    }

    public String getRepresentImageUrl() {
        return representImageUrl;
    }

    public void setRepresentImageUrl(String representImageUrl) {
        this.representImageUrl = representImageUrl;
    }

    public Long getRepresentImageSize() {
        return representImageSize;
    }

    public void setRepresentImageSize(Long representImageSize) {
        this.representImageSize = representImageSize;
    }

    // 메인화면이미지 필드들의 Getter & Setter
    public String getMainImageId() {
        return mainImageId;
    }

    public void setMainImageId(String mainImageId) {
        this.mainImageId = mainImageId;
    }

    public String getMainImageName() {
        return mainImageName;
    }

    public void setMainImageName(String mainImageName) {
        this.mainImageName = mainImageName;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public Long getMainImageSize() {
        return mainImageSize;
    }

    public void setMainImageSize(Long mainImageSize) {
        this.mainImageSize = mainImageSize;
    }

    // 다중이미지 필드들의 Getter & Setter
    public List<String> getMultiImageIds() {
        return multiImageIds;
    }

    public void setMultiImageIds(List<String> multiImageIds) {
        this.multiImageIds = multiImageIds;
    }

    public List<String> getMultiImageNames() {
        return multiImageNames;
    }

    public void setMultiImageNames(List<String> multiImageNames) {
        this.multiImageNames = multiImageNames;
    }
    
    public List<Integer> getMultiImageOrder() {
        return multiImageOrder;
    }
    
    public void setMultiImageOrder(List<Integer> multiImageOrder) {
        this.multiImageOrder = multiImageOrder;
    }
}

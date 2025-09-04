// 백엔드 API 응답 타입
export interface EgovResponseVO<T = unknown> {
  resultCode: 'SUCCESS' | 'ERROR';
  resultMessage: string;
  data: T;
  paginationInfo?: PaginationInfo;
}

export interface PaginationInfo {
  currentPageNo: number;
  pageSize: number;
  totalRecordCount: number;
  totalPageCount: number;
  firstPageNoOnPageList: number;
  lastPageNoOnPageList: number;
  firstRecordIndexOnPage: number;
  lastRecordIndexOnPage: number;
}

// 인증 관련 타입 (전자정부 표준)
export interface LoginRequest {
  userId: string;    // 업무사용자ID (emplyrId)
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;           // 업무사용자ID
  userNm: string;           // 사용자명  
  authorityCode: string;    // 권한코드
  authorityNm: string;      // 권한명
  esntlId: string;          // 고유ID
  emailAdres?: string;      // 이메일주소
  ofcpsNm?: string;         // 직위명
  expiresIn: number;        // 토큰 만료시간(초)
}

export interface EmplyrInfo {
  esntlId: string;          // 고유ID
  emplyrId: string;         // 업무사용자ID
  userNm: string;           // 사용자명
  password?: string;        // 비밀번호 (보안상 응답에서 제외)
  houseAdres?: string;      // 주소
  detailAdres?: string;     // 상세주소
  zipCode?: string;         // 우편번호
  offmTelno?: string;       // 회사전화번호
  mbtlnum?: string;         // 이동전화번호
  emailAdres?: string;      // 이메일주소
  ofcpsNm?: string;         // 직위명
  houseEndTelno?: string;   // 집전화번호
  groupId?: string;         // 그룹ID
  pstinstCode?: string;     // 소속기관코드
  emplyrSttusCode: string;  // 업무사용자상태코드 (P:신청, A:승인, D:삭제)
  frstRegistPnttm: string;  // 최초등록시점
  frstRegisterId?: string;  // 최초등록자ID
  lastUpdtPnttm?: string;   // 최종수정시점
  lastUpdusrId?: string;    // 최종수정자ID
  authorCode?: string;      // 권한코드
  authorNm?: string;        // 권한명
  mberTyCode?: string;      // 회원유형코드
}

// 기존 UserInfo 타입도 유지 (호환성을 위해)
export interface UserInfo {
  userId: string;
  userNm: string;
  email?: string;
  phone?: string;
  deptNm?: string;
  positionNm?: string;
  authorityCode: string;
  authorityNm?: string;
  useAt: string;
  registDate: string;
  registUser?: string;
  updateDate?: string;
  updateUser?: string;
}

// 공통코드 관련 타입
export interface CommonCodeSearchVO {
  searchKeyword?: string;
  searchCondition?: string;
  searchUseAt?: string;
  searchClCode?: string;
  codeId?: string;
  code?: string;
  pageIndex: number;
  pageUnit: number;
  pageSize: number;
  firstIndex: number;
  lastIndex: number;
  recordCountPerPage: number;
  // 정렬 관련 필드 (전자정부 프레임워크 표준)
  sortField?: string;
  sortOrder?: string;
}

export interface CommonCodeVO {
  codeId: string;
  codeIdNm: string;
  codeIdDc?: string;
  useAt: string;
  clCode?: string;
  codeOrder: number;
  frstRegistPnttm: string;        // 최초등록시점
  frstRegisterId?: string;        // 최초등록자ID
  lastUpdtPnttm?: string;         // 최종수정시점
  lastUpdusrId?: string;          // 최종수정자ID
}

export interface CommonCodeDetailVO {
  codeId: string;
  code: string;
  codeNm: string;
  codeDc?: string;
  useAt: string;
  codeOrder: number;
  frstRegistPnttm: string;        // 최초등록시점
  frstRegisterId?: string;        // 최초등록자ID
  lastUpdtPnttm?: string;         // 최종수정시점
  lastUpdusrId?: string;          // 최종수정자ID
  id?: string; // 드래그 기능을 위한 고유 ID
}

// 게시판 관련 타입 (전자정부 표준)
export interface BbsMstVO {
  bbsId: string;                    // 게시판ID
  bbsNm: string;                    // 게시판명
  bbsIntrcn?: string;               // 게시판소개
  bbsTyCode?: string;               // 게시판유형코드
  bbsAttrbCode?: string;            // 게시판속성코드
  replyPosblAt?: string;            // 답글가능여부
  fileAtchPosblAt?: string;         // 파일첨부가능여부
  atchPosblFileNumber?: number;     // 첨부가능파일숫자
  atchPosblFileSize?: number;       // 첨부가능파일사이즈
  useAt?: string;                   // 사용여부
  tmplatId?: string;                // 템플릿ID
  categoryCodeId?: string;           // 구분코드ID
  
  // 이미지 관련 설정
  representImageUseAt?: string;      // 대표이미지 사용여부
  representImageWidth?: number;      // 대표이미지 권장 너비
  representImageHeight?: number;     // 대표이미지 권장 높이
  mainImageUseAt?: string;          // 메인화면이미지 사용여부
  mainImageWidth?: number;          // 메인화면이미지 권장 너비
  mainImageHeight?: number;         // 메인화면이미지 권장 높이
  multiImageUseAt?: string;         // 다중이미지 사용여부
  multiImageDisplayName?: string;   // 다중이미지 표시명
  multiImageMaxCount?: number;      // 다중이미지 최대개수
  multiImageWidth?: number;         // 다중이미지 권장 너비
  multiImageHeight?: number;        // 다중이미지 권장 높이
  
  frstRegisterId?: string;          // 최초등록자ID
  frstRegistPnttm?: string;         // 최초등록시점
  lastUpdusrId?: string;            // 최종수정자ID
  lastUpdtPnttm?: string;           // 최종수정시점
}

export interface BbsVO {
  nttId?: number;                   // 게시글ID
  bbsId: string;                    // 게시판ID
  nttNo?: number;                   // 게시글번호
  nttSj: string;                    // 게시글제목
  nttCn: string;                    // 게시글내용
  answerAt?: string;                // 답변여부
  parntscttNo?: number;             // 부모스크랩수
  answerLc?: number;                // 답변위치
  sortOrdr?: number;                // 정렬순서
      rdcnt?: number;                   // 조회수
    useAt?: string;                   // 사용여부
    ntceAt?: string;                  // 공지여부
    exposureYn?: string;              // 공개여부 (공개/비공개)
    atchFileId?: string;              // 첨부파일ID
    nttCategory?: string;             // 구분코드
  frstRegisterId?: string;          // 최초등록자ID
  ntcrnNm?: string;                 // 게시자명
  password?: string;                // 패스워드
  frstRegistPnttm?: string;         // 최초등록시점
  lastUpdusrId?: string;            // 최종수정자ID
  lastUpdtPnttm?: string;           // 최종수정시점
  fileList?: FileVO[];              // 첨부파일목록
  commentList?: CommentVO[];        // 댓글목록
  bbsNm?: string;                   // 게시판명 (조인용)
  bbsTyCode?: string;               // 게시판유형코드 (조인용)
  
  // 대표이미지 관련 필드
  representImageId?: string;         // 대표이미지 ID (백엔드에서 필요)
  representImageUrl?: string;        // 대표이미지 URL
  representImageName?: string;       // 대표이미지 파일명
  representImageSize?: number;       // 대표이미지 파일크기
  
  // 메인화면이미지 관련 필드
  mainImageId?: string;              // 메인화면이미지 ID
  mainImageUrl?: string;             // 메인화면이미지 URL
  mainImageName?: string;            // 메인화면이미지 파일명
  mainImageSize?: number;            // 메인화면이미지 파일크기
  
  // 다중이미지 관련 필드
  multiImageList?: Array<{
    id?: string;                     // 이미지 ID
    atchFileId?: string;             // 첨부파일 ID
    name?: string;                   // 이미지 파일명
    orignlFileNm?: string;           // 원본 파일명
    url?: string;                    // 이미지 URL
    fileUrl?: string;                // 파일 URL
    size?: number;                   // 파일 크기
    fileSize?: number;               // 파일 크기 (별칭)
  }>;                               // 다중이미지 목록
}

export interface FileVO {
  atchFileId: string;               // 첨부파일ID
  fileSn: number;                   // 파일순번
  fileStreCours: string;            // 파일저장경로
  streFileNm: string;               // 저장파일명
  orignlFileNm: string;             // 원파일명
  fileExtsn?: string;               // 파일확장자
  fileCn?: string;                  // 파일내용
  fileSize?: number;                // 파일크기
  frstRegisterId?: string;          // 최초등록자ID
  frstRegistPnttm?: string;         // 최초등록시점
}

export interface CommentVO {
  commentNo?: number;               // 댓글번호
  nttId: number;                    // 게시글ID
  commentCn: string;                // 댓글내용
  commentWriterId?: string;         // 댓글작성자ID
  commentWriterNm?: string;         // 댓글작성자명
  commentPassword?: string;         // 댓글비밀번호
  useAt?: string;                   // 사용여부
  frstRegisterId?: string;          // 최초등록자ID
  frstRegistPnttm?: string;         // 최초등록시점
  lastUpdusrId?: string;            // 최종수정자ID
  lastUpdtPnttm?: string;           // 최종수정시점
}

// 게시판 검색 파라미터
export interface BbsSearchParams {
  bbsId?: string;
  pageIndex?: number;
  pageSize?: number;
  searchKeyword?: string;
  ntceAt?: string;
  sortField?: string;
  sortOrder?: string;
} 

// 공통 목록 조회 파라미터 타입 (전자정부 프레임워크 표준)
export interface CommonListParams {
  pageIndex?: number;
  pageSize?: number;
  searchKeyword?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// 공통코드 목록 조회 파라미터 타입
export interface CommonCodeListParams extends CommonListParams {
  searchCondition?: string;
  searchUseAt?: string;
}

// 게시판 목록 조회 파라미터 타입
export interface BbsListParams extends CommonListParams {
  searchUseAt?: string;
}

// 게시물 목록 조회 파라미터 타입
export interface BbsPostListParams extends CommonListParams {
  searchExposureYn?: string;
} 
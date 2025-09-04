-- =====================================================
-- OpenSurvey 프로젝트 전체 테이블 생성 스크립트
-- 전자정부 프레임워크 표준 구조 적용
-- =====================================================

-- =====================================================
-- 1. 사용자 관리 테이블
-- =====================================================

-- 사용자 정보 테이블
CREATE TABLE IF NOT EXISTS USER_INFO (
    USER_ID VARCHAR(20) PRIMARY KEY,                     -- 사용자ID
    USER_NM VARCHAR(60) NOT NULL,                        -- 사용자명
    PASSWORD VARCHAR(200) NOT NULL,                      -- 비밀번호 (암호화)
    EMAIL VARCHAR(100),                                  -- 이메일
    PHONE VARCHAR(20),                                   -- 전화번호
    DEPT_NM VARCHAR(100),                                -- 부서명
    POSITION_NM VARCHAR(50),                             -- 직급명
    AUTHORITY_CODE CHAR(6) DEFAULT 'USER01',             -- 권한코드
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    
    -- 등록/수정 정보
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 등록일시
    REGIST_USER VARCHAR(20),                             -- 등록자
    UPDATE_DATE TIMESTAMP,                               -- 수정일시
    UPDATE_USER VARCHAR(20)                              -- 수정자
);

COMMENT ON TABLE USER_INFO IS '사용자정보';
COMMENT ON COLUMN USER_INFO.USER_ID IS '사용자ID';
COMMENT ON COLUMN USER_INFO.USER_NM IS '사용자명';
COMMENT ON COLUMN USER_INFO.PASSWORD IS '비밀번호';
COMMENT ON COLUMN USER_INFO.EMAIL IS '이메일';
COMMENT ON COLUMN USER_INFO.AUTHORITY_CODE IS '권한코드';

-- =====================================================
-- 2. 공통코드 관리 테이블 (전자정부 표준)
-- =====================================================

-- 공통코드 그룹 테이블
CREATE TABLE IF NOT EXISTS COMTCCMMNCODE (
    CODE_ID VARCHAR(6) PRIMARY KEY,                      -- 코드ID
    CODE_ID_NM VARCHAR(60),                              -- 코드ID명
    CODE_ID_DC VARCHAR(200),                             -- 코드ID설명
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    CL_CODE VARCHAR(3),                                  -- 분류코드
    CODE_ORDER INTEGER DEFAULT 0,                        -- 정렬순서
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- 공통코드 상세 테이블
CREATE TABLE IF NOT EXISTS COMTCCMMNDETAILCODE (
    CODE_ID VARCHAR(6) NOT NULL,                         -- 코드ID
    CODE VARCHAR(15) NOT NULL,                           -- 코드
    CODE_NM VARCHAR(60),                                 -- 코드명
    CODE_DC VARCHAR(200),                                -- 코드설명
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    CODE_ORDER INTEGER DEFAULT 0,                        -- 정렬순서
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20),                          -- 최종수정자ID
    
    PRIMARY KEY (CODE_ID, CODE),
    CONSTRAINT FK_COMTCCMMNDETAILCODE_CODE FOREIGN KEY (CODE_ID) 
        REFERENCES COMTCCMMNCODE(CODE_ID) ON DELETE CASCADE
);

COMMENT ON TABLE COMTCCMMNCODE IS '공통코드';
COMMENT ON COLUMN COMTCCMMNCODE.CODE_ID IS '코드ID';
COMMENT ON COLUMN COMTCCMMNCODE.CODE_ID_NM IS '코드ID명';
COMMENT ON COLUMN COMTCCMMNCODE.CODE_ID_DC IS '코드ID설명';

COMMENT ON TABLE COMTCCMMNDETAILCODE IS '공통상세코드';
COMMENT ON COLUMN COMTCCMMNDETAILCODE.CODE_ID IS '코드ID';
COMMENT ON COLUMN COMTCCMMNDETAILCODE.CODE IS '코드';
COMMENT ON COLUMN COMTCCMMNDETAILCODE.CODE_NM IS '코드명';

-- =====================================================
-- 3. 게시판 관리 테이블 (전자정부 표준)
-- =====================================================

-- 게시판 마스터 테이블
CREATE TABLE IF NOT EXISTS COMTNBBSMST (
    BBS_ID VARCHAR(20) PRIMARY KEY,                      -- 게시판ID
    BBS_NM VARCHAR(255) NOT NULL,                        -- 게시판명
    BBS_INTRCN VARCHAR(2400),                            -- 게시판소개
    BBS_TY_CODE CHAR(6),                                 -- 게시판유형코드
    BBS_ATTRB_CODE CHAR(6),                              -- 게시판속성코드
    REPLY_POSBL_AT CHAR(1) DEFAULT 'Y' CHECK (REPLY_POSBL_AT IN ('Y', 'N')),  -- 답글가능여부
    FILE_ATCH_POSBL_AT CHAR(1) DEFAULT 'Y' CHECK (FILE_ATCH_POSBL_AT IN ('Y', 'N')), -- 파일첨부가능여부
    ATCH_POSBL_FILE_NUMBER INTEGER DEFAULT 3,            -- 첨부가능파일숫자
    ATCH_POSBL_FILE_SIZE DECIMAL(8,1) DEFAULT 0,         -- 첨부가능파일사이즈
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    TMPLAT_ID CHAR(20),                                  -- 템플릿ID
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                          -- 최종수정자ID  
    LAST_UPDT_PNTTM TIMESTAMP                            -- 최종수정시점
);

-- 게시판 사용 테이블
CREATE TABLE IF NOT EXISTS COMTNBBSUSE (
    BBS_ID VARCHAR(20) NOT NULL,                         -- 게시판ID
    TRGET_ID VARCHAR(20) NOT NULL,                       -- 대상ID (커뮤니티ID)
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    REGIST_SE_CODE CHAR(6),                              -- 등록구분코드
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                          -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    
    PRIMARY KEY (BBS_ID, TRGET_ID),
    CONSTRAINT FK_COMTNBBSUSE_BBS FOREIGN KEY (BBS_ID) 
        REFERENCES COMTNBBSMST(BBS_ID) ON DELETE CASCADE
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS COMTNBBS (
    NTT_ID BIGSERIAL PRIMARY KEY,                        -- 게시글ID
    BBS_ID VARCHAR(20) NOT NULL,                         -- 게시판ID
    NTT_NO INTEGER,                                      -- 게시글번호
    NTT_SJ VARCHAR(2000),                                -- 게시글제목
    NTT_CN TEXT,                                         -- 게시글내용
    ANSWER_AT CHAR(1) DEFAULT 'N' CHECK (ANSWER_AT IN ('Y', 'N')), -- 답변여부
    PARNTSCTT_NO INTEGER DEFAULT 0,                      -- 부모스크랩수
    ANSWER_LC INTEGER DEFAULT 0,                         -- 답변위치
    SORT_ORDR INTEGER DEFAULT 0,                         -- 정렬순서
    RDCNT INTEGER DEFAULT 0,                             -- 조회수
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    NTCE_AT CHAR(1) DEFAULT 'N' CHECK (NTCE_AT IN ('Y', 'N')), -- 공지여부
    ATCH_FILE_ID CHAR(20),                               -- 첨부파일ID
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    NTCRN_NM VARCHAR(20),                                -- 게시자명
    PASSWORD VARCHAR(200),                               -- 패스워드
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                          -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    
    CONSTRAINT FK_COMTNBBS_BBS FOREIGN KEY (BBS_ID) 
        REFERENCES COMTNBBSMST(BBS_ID) ON DELETE CASCADE
);

-- 첨부파일 정보 테이블
CREATE TABLE IF NOT EXISTS COMTNFILE (
    ATCH_FILE_ID CHAR(20) NOT NULL,                      -- 첨부파일ID
    FILE_SN DECIMAL(10) NOT NULL,                        -- 파일순번
    FILE_STRE_COURS VARCHAR(2000) NOT NULL,              -- 파일저장경로
    STRE_FILE_NM VARCHAR(255) NOT NULL,                  -- 저장파일명
    ORIGNL_FILE_NM VARCHAR(255),                         -- 원파일명
    FILE_EXTSN VARCHAR(20),                              -- 파일확장자
    FILE_CN TEXT,                                        -- 파일내용
    FILE_SIZE BIGINT,                                    -- 파일크기
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    
    PRIMARY KEY (ATCH_FILE_ID, FILE_SN)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS COMTNCOMMENT (
    COMMENT_NO BIGSERIAL PRIMARY KEY,                    -- 댓글번호
    NTT_ID BIGINT NOT NULL,                              -- 게시글ID
    COMMENT_CN VARCHAR(2400),                            -- 댓글내용
    COMMENT_WRITER_ID VARCHAR(20),                       -- 댓글작성자ID
    COMMENT_WRITER_NM VARCHAR(20),                       -- 댓글작성자명
    COMMENT_PASSWORD VARCHAR(200),                       -- 댓글비밀번호
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                          -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    
    CONSTRAINT FK_COMTNCOMMENT_NTT FOREIGN KEY (NTT_ID) 
        REFERENCES COMTNBBS(NTT_ID) ON DELETE CASCADE
);

COMMENT ON TABLE COMTNBBSMST IS '게시판마스터';
COMMENT ON TABLE COMTNBBSUSE IS '게시판사용';
COMMENT ON TABLE COMTNBBS IS '게시글';
COMMENT ON TABLE COMTNFILE IS '첨부파일';
COMMENT ON TABLE COMTNCOMMENT IS '댓글';

-- =====================================================
-- 4. 기존 게시판 테이블 (현재 사용 중)
-- =====================================================

-- 기존 게시판 테이블 (BoardVO 기반)
CREATE TABLE IF NOT EXISTS BOARD (
    BOARD_SEQ BIGSERIAL PRIMARY KEY,                     -- 게시글 번호
    BOARD_TYPE_CODE VARCHAR(20),                         -- 게시판 타입 코드
    BOARD_DETAIL_TYPE_CODE VARCHAR(20),                  -- 게시판 세부 분류 코드
    BOARD_SUBJECT VARCHAR(500),                          -- 제목
    BOARD_CONTENTS TEXT,                                 -- 내용 (HTML)
    
    -- 노출/표시 옵션
    EXPOSURE_YN CHAR(1) DEFAULT 'Y' CHECK (EXPOSURE_YN IN ('Y', 'N')), -- 노출여부
    TOP_YN CHAR(1) DEFAULT 'N' CHECK (TOP_YN IN ('Y', 'N')),           -- 상단고정여부
    COLOR_YN CHAR(1) DEFAULT 'N' CHECK (COLOR_YN IN ('Y', 'N')),       -- 색상표시여부
    COMMENT_YN CHAR(1) DEFAULT 'Y' CHECK (COMMENT_YN IN ('Y', 'N')),   -- 댓글허용여부
    
    -- 조회/통계
    READ_COUNT INTEGER DEFAULT 0,                        -- 조회수
    BOARD_COMMENT_COUNT INTEGER DEFAULT 0,               -- 댓글수
    
    -- 파일/미디어
    FILE_GROUP_ID VARCHAR(50),                           -- 첨부파일 그룹 ID
    MAIN_THUMBNAIL_URL VARCHAR(500),                     -- 메인 썸네일 URL
    THUMBNAIL_URL VARCHAR(500),                          -- 일반 썸네일 URL
    MEDIA_URL VARCHAR(500),                              -- 미디어 URL
    
    -- 작성자/수정자 정보
    REGIST_USER_ID VARCHAR(20),                          -- 등록자 ID
    REGIST_NAME VARCHAR(50),                             -- 등록자명
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 등록일
    MODIFY_USER_ID VARCHAR(20),                          -- 수정자 ID
    MODIFY_NAME VARCHAR(50),                             -- 수정자명
    MODIFY_DATE TIMESTAMP,                               -- 수정일
    
    -- 정렬/페이징용
    SORT_ORDER INTEGER DEFAULT 0                         -- 정렬순서
);

-- 기존 게시판 파일 테이블
CREATE TABLE IF NOT EXISTS BOARD_FILE (
    FILE_SEQ BIGSERIAL PRIMARY KEY,                      -- 파일 번호
    BOARD_SEQ BIGINT NOT NULL,                           -- 게시글 번호
    FILE_NAME VARCHAR(255),                              -- 파일명
    ORIGINAL_FILE_NAME VARCHAR(255),                     -- 원본 파일명
    FILE_PATH VARCHAR(500),                              -- 파일 경로
    FILE_SIZE BIGINT,                                    -- 파일 크기
    FILE_EXTENSION VARCHAR(10),                          -- 파일 확장자
    
    -- 등록/수정 정보
    REGIST_USER_ID VARCHAR(20),                          -- 등록자 ID
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 등록일
    
    CONSTRAINT FK_BOARD_FILE_BOARD FOREIGN KEY (BOARD_SEQ) 
        REFERENCES BOARD(BOARD_SEQ) ON DELETE CASCADE
);

-- 기존 게시판 댓글 테이블
CREATE TABLE IF NOT EXISTS BOARD_COMMENT (
    COMMENT_SEQ BIGSERIAL PRIMARY KEY,                   -- 댓글 번호
    BOARD_SEQ BIGINT NOT NULL,                           -- 게시글 번호
    COMMENT_CONTENT TEXT,                                -- 댓글 내용
    COMMENT_WRITER VARCHAR(50),                          -- 작성자명
    COMMENT_PASSWORD VARCHAR(200),                       -- 댓글 비밀번호
    
    -- 등록/수정 정보
    REGIST_USER_ID VARCHAR(20),                          -- 등록자 ID
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 등록일
    MODIFY_USER_ID VARCHAR(20),                          -- 수정자 ID
    MODIFY_DATE TIMESTAMP,                               -- 수정일
    
    CONSTRAINT FK_BOARD_COMMENT_BOARD FOREIGN KEY (BOARD_SEQ) 
        REFERENCES BOARD(BOARD_SEQ) ON DELETE CASCADE
);

COMMENT ON TABLE BOARD IS '게시판(기존)';
COMMENT ON TABLE BOARD_FILE IS '게시판파일(기존)';
COMMENT ON TABLE BOARD_COMMENT IS '게시판댓글(기존)';

-- =====================================================
-- 5. 설문조사 테이블
-- =====================================================

-- 설문조사 테이블
CREATE TABLE IF NOT EXISTS SURVEY (
    SURVEY_ID BIGSERIAL PRIMARY KEY,                     -- 설문조사 ID
    SURVEY_TITLE VARCHAR(200) NOT NULL,                  -- 설문조사 제목
    SURVEY_DESCRIPTION TEXT,                             -- 설문조사 설명
    START_DATE TIMESTAMP,                                -- 시작일
    END_DATE TIMESTAMP,                                  -- 종료일
    STATUS VARCHAR(20) DEFAULT 'DRAFT',                  -- 상태 (DRAFT, ACTIVE, CLOSED)
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    
    -- 등록/수정 정보
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 등록일
    REGIST_USER VARCHAR(20),                             -- 등록자
    UPDATE_DATE TIMESTAMP,                               -- 수정일
    UPDATE_USER VARCHAR(20)                              -- 수정자
);

COMMENT ON TABLE SURVEY IS '설문조사';

-- =====================================================
-- 6. 인덱스 생성
-- =====================================================

-- 사용자 테이블 인덱스
CREATE INDEX IF NOT EXISTS IDX_USER_INFO_EMAIL ON USER_INFO(EMAIL);
CREATE INDEX IF NOT EXISTS IDX_USER_INFO_AUTHORITY ON USER_INFO(AUTHORITY_CODE);

-- 공통코드 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTCCMMNCODE_CL_CODE ON COMTCCMMNCODE(CL_CODE);
CREATE INDEX IF NOT EXISTS IDX_COMTCCMMNCODE_USE_AT ON COMTCCMMNCODE(USE_AT);
CREATE INDEX IF NOT EXISTS IDX_COMTCCMMNDETAILCODE_USE_AT ON COMTCCMMNDETAILCODE(USE_AT);

-- 게시글 인덱스 (전자정부 표준)
CREATE INDEX IF NOT EXISTS IDX_COMTNBBS_BBS_ID ON COMTNBBS(BBS_ID, FRST_REGIST_PNTTM DESC);
CREATE INDEX IF NOT EXISTS IDX_COMTNBBS_NTCE_AT ON COMTNBBS(NTCE_AT, FRST_REGIST_PNTTM DESC);
CREATE INDEX IF NOT EXISTS IDX_COMTNBBS_USE_AT ON COMTNBBS(USE_AT, FRST_REGIST_PNTTM DESC);

-- 전문검색 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTNBBS_SEARCH ON COMTNBBS USING gin(
    to_tsvector('korean', COALESCE(NTT_SJ, '') || ' ' || COALESCE(NTT_CN, ''))
);

-- 댓글 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTNCOMMENT_NTT_ID ON COMTNCOMMENT(NTT_ID, FRST_REGIST_PNTTM ASC);

-- 첨부파일 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTNFILE_ATCH_FILE_ID ON COMTNFILE(ATCH_FILE_ID);

-- 기존 게시판 인덱스
CREATE INDEX IF NOT EXISTS IDX_BOARD_TYPE_CODE ON BOARD(BOARD_TYPE_CODE);
CREATE INDEX IF NOT EXISTS IDX_BOARD_EXPOSURE_YN ON BOARD(EXPOSURE_YN, REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_TOP_YN ON BOARD(TOP_YN, REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_FILE_BOARD_SEQ ON BOARD_FILE(BOARD_SEQ);
CREATE INDEX IF NOT EXISTS IDX_BOARD_COMMENT_BOARD_SEQ ON BOARD_COMMENT(BOARD_SEQ);

-- =====================================================
-- 7. 기본 공통코드 데이터
-- =====================================================

-- 관리자 권한 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM001', '관리자권한', '시스템 관리자 권한을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM001', 'SYSTEM_ADMIN', '시스템관리자', '시스템 전체 관리자', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM001', 'ADMIN', '일반관리자', '일반 관리자', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM001', 'USER', '일반사용자', '일반 사용자', 'Y', 3, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 게시판 유형 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM030', '게시판유형', '게시판의 유형을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM030', 'BBST01', '일반게시판', '일반적인 게시판', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST02', '공지게시판', '공지사항 전용 게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST03', 'FAQ게시판', '자주묻는질문 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST04', 'QNA게시판', '질문답변 게시판', 'Y', 4, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 게시판 속성 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM031', '게시판속성', '게시판의 속성을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM031', 'BBSA01', '일반속성', '일반적인 게시판 속성', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM031', 'BBSA02', '갤러리속성', '이미지 중심 게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM031', 'BBSA03', '블로그속성', '블로그 형태 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 기존 게시판 타입 공통코드 (현재 사용 중)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('BOARD_TYPE', '게시판타입', '기존 게시판의 타입을 구분하는 코드', 'Y', 'BRD', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('BOARD_TYPE', 'NOTICE', '공지사항', '공지사항 게시판', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'FREE', '자유게시판', '자유게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'FAQ', 'FAQ', '자주묻는질문', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'QNA', 'Q&A', '질문답변', 'Y', 4, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 기존 게시판 상세타입 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('BOARD_DETAIL_TYPE', '게시판상세타입', '기존 게시판의 상세타입을 구분하는 코드', 'Y', 'BRD', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('BOARD_DETAIL_TYPE', 'NORMAL', '일반', '일반 게시글', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'URGENT', '긴급', '긴급 게시글', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'IMPORTANT', '중요', '중요 게시글', 'Y', 3, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- =====================================================
-- 8. 기본 사용자 데이터
-- =====================================================

-- 기본 관리자 계정 생성
INSERT INTO USER_INFO (
    USER_ID, USER_NM, PASSWORD, EMAIL, DEPT_NM, POSITION_NM, 
    AUTHORITY_CODE, USE_AT, REGIST_DATE, REGIST_USER
) VALUES (
    'admin', '관리자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'admin@opensurvey.co.kr', '시스템관리팀', '팀장', 
    'SYSTEM_ADMIN', 'Y', CURRENT_TIMESTAMP, 'system'
), (
    'user01', '사용자1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'user01@opensurvey.co.kr', '운영팀', '사원', 
    'USER', 'Y', CURRENT_TIMESTAMP, 'system'
)
ON CONFLICT (USER_ID) DO NOTHING;

-- =====================================================
-- 9. 샘플 게시판 데이터
-- =====================================================

-- 샘플 게시판 생성 (전자정부 표준)
INSERT INTO COMTNBBSMST (
    BBS_ID, BBS_NM, BBS_INTRCN, BBS_TY_CODE, BBS_ATTRB_CODE,
    REPLY_POSBL_AT, FILE_ATCH_POSBL_AT, ATCH_POSBL_FILE_NUMBER,
    FRST_REGISTER_ID
) VALUES 
('BBSMSTR_000001', '공지사항', '시스템 공지사항을 게시하는 게시판입니다.', 'BBST02', 'BBSA01', 'N', 'Y', 5, 'admin'),
('BBSMSTR_000002', '자유게시판', '자유롭게 의견을 나누는 게시판입니다.', 'BBST01', 'BBSA01', 'Y', 'Y', 3, 'admin'),
('BBSMSTR_000003', 'FAQ', '자주 묻는 질문과 답변입니다.', 'BBST03', 'BBSA01', 'N', 'N', 0, 'admin'),
('BBSMSTR_000004', 'Q&A', '질문과 답변을 위한 게시판입니다.', 'BBST04', 'BBSA01', 'Y', 'Y', 2, 'admin')
ON CONFLICT (BBS_ID) DO NOTHING;

-- 샘플 게시판 사용 설정
INSERT INTO COMTNBBSUSE (
    BBS_ID, TRGET_ID, USE_AT, REGIST_SE_CODE, FRST_REGISTER_ID
) VALUES 
('BBSMSTR_000001', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000002', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000003', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000004', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin')
ON CONFLICT (BBS_ID, TRGET_ID) DO NOTHING;

-- 샘플 게시글 (전자정부 표준)
INSERT INTO COMTNBBS (
    BBS_ID, NTT_SJ, NTT_CN, NTCE_AT, FRST_REGISTER_ID, NTCRN_NM
) VALUES 
('BBSMSTR_000001', '시스템 점검 안내', '<p>시스템 점검으로 인한 서비스 일시 중단을 안내드립니다.</p><p>점검시간: 2024-01-01 02:00~04:00</p>', 'Y', 'admin', '관리자'),
('BBSMSTR_000001', '서비스 개선 사항 안내', '<p>더 나은 서비스 제공을 위한 기능 개선 사항을 안내드립니다.</p>', 'N', 'admin', '관리자'),
('BBSMSTR_000002', '자유게시판을 이용해주세요', '<p>자유롭게 의견을 나누는 공간입니다.</p>', 'N', 'user01', '사용자1'),
('BBSMSTR_000003', '로그인은 어떻게 하나요?', '<p>상단의 로그인 버튼을 클릭하여 로그인하실 수 있습니다.</p>', 'N', 'admin', '관리자'),
('BBSMSTR_000004', '게시판 이용 문의', '<p>게시판 이용에 대해 문의드립니다.</p>', 'N', 'user01', '사용자1')
ON CONFLICT DO NOTHING;

-- 샘플 게시글 (기존 구조)
INSERT INTO BOARD (
    BOARD_TYPE_CODE, BOARD_DETAIL_TYPE_CODE, BOARD_SUBJECT, BOARD_CONTENTS,
    EXPOSURE_YN, TOP_YN, REGIST_USER_ID, REGIST_NAME
) VALUES 
('NOTICE', 'IMPORTANT', '시스템 공지사항', '<p>시스템 관련 중요 공지사항입니다.</p>', 'Y', 'Y', 'admin', '관리자'),
('FREE', 'NORMAL', '자유게시판 첫 게시글', '<p>자유게시판에 오신 것을 환영합니다.</p>', 'Y', 'N', 'user01', '사용자1'),
('FAQ', 'NORMAL', '자주 묻는 질문', '<p>자주 묻는 질문에 대한 답변입니다.</p>', 'Y', 'N', 'admin', '관리자')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'OpenSurvey 전체 테이블 생성 완료!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '1. 사용자 관리: USER_INFO';
    RAISE NOTICE '2. 공통코드: COMTCCMMNCODE, COMTCCMMNDETAILCODE';
    RAISE NOTICE '3. 게시판(표준): COMTNBBSMST, COMTNBBSUSE, COMTNBBS';
    RAISE NOTICE '4. 파일/댓글(표준): COMTNFILE, COMTNCOMMENT';
    RAISE NOTICE '5. 게시판(기존): BOARD, BOARD_FILE, BOARD_COMMENT';
    RAISE NOTICE '6. 설문조사: SURVEY';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 기본 데이터:';
    RAISE NOTICE '- 관리자 계정: admin/admin (비밀번호: password)';
    RAISE NOTICE '- 사용자 계정: user01/password';
    RAISE NOTICE '- 기본 공통코드 및 샘플 게시글';
    RAISE NOTICE '========================================';
    RAISE NOTICE '다음 단계: 백엔드 서비스 재시작 필요';
    RAISE NOTICE '========================================';
END $$; 
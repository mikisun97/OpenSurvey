-- =====================================================
-- OpenSurvey 프로젝트 전체 테이블 생성 스크립트 (PostgreSQL 호환)
-- 전자정부 프레임워크 4.3.0 표준 명명규칙 적용
-- =====================================================

-- =====================================================
-- 1. 사용자 관리 테이블 (전자정부 표준)
-- =====================================================

-- 업무사용자 정보 테이블 (전자정부 표준)
CREATE TABLE IF NOT EXISTS COMTNEMPLYRINFO (
    ESNTL_ID VARCHAR(20) PRIMARY KEY,                    -- 고유ID
    EMPLYR_ID VARCHAR(20) NOT NULL UNIQUE,               -- 업무사용자ID
    USER_NM VARCHAR(60) NOT NULL,                        -- 사용자명
    PASSWORD VARCHAR(200) NOT NULL,                      -- 비밀번호
    HOUSE_ADRES VARCHAR(100),                            -- 주소
    DETAIL_ADRES VARCHAR(100),                           -- 상세주소
    ZIP_CODE VARCHAR(6),                                 -- 우편번호
    OFFM_TELNO VARCHAR(20),                              -- 회사전화번호
    MBTLNUM VARCHAR(20),                                 -- 이동전화번호
    EMAIL_ADRES VARCHAR(50),                             -- 이메일주소
    OFCPS_NM VARCHAR(50),                                -- 직위명
    HOUSE_END_TELNO VARCHAR(4),                          -- 집전화번호
    GROUP_ID VARCHAR(20),                                -- 그룹ID
    PSTINST_CODE VARCHAR(20),                            -- 소속기관코드
    EMPLYR_STTUS_CODE VARCHAR(1) NOT NULL DEFAULT 'P',   -- 업무사용자상태코드(P:신청,A:승인,D:삭제)
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- 일반회원 정보 테이블 (전자정부 표준)
CREATE TABLE IF NOT EXISTS COMTNGNRLMBER (
    MBER_ID VARCHAR(20) PRIMARY KEY,                     -- 회원ID
    PASSWORD VARCHAR(200) NOT NULL,                      -- 비밀번호
    PASSWORD_HINT VARCHAR(100),                          -- 비밀번호힌트
    PASSWORD_CNSR VARCHAR(100),                          -- 비밀번호정답
    IHIDNUM VARCHAR(200),                                -- 주민등록번호
    MBER_NM VARCHAR(50) NOT NULL,                        -- 회원명
    ZIP VARCHAR(6),                                      -- 우편번호
    ADRES VARCHAR(100),                                  -- 주소
    AREA_NO VARCHAR(4),                                  -- 지역번호
    MBER_STTUS VARCHAR(15),                              -- 회원상태
    DETAIL_ADRES VARCHAR(100),                           -- 상세주소
    END_TELNO VARCHAR(4),                                -- 끝전화번호
    MBTLNUM VARCHAR(20),                                 -- 이동전화번호
    GROUP_ID VARCHAR(20),                                -- 그룹ID
    MBER_FXNUM VARCHAR(20),                              -- 회원팩스번호
    MBER_EMAIL_ADRES VARCHAR(50),                        -- 회원이메일주소
    MIDDLE_TELNO VARCHAR(4),                             -- 중간전화번호
    SBSCRB_DE CHAR(20),                                  -- 가입일자
    SEXDSTN_CODE CHAR(1),                                -- 성별구분코드
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- 기업회원 정보 테이블 (전자정부 표준)
CREATE TABLE IF NOT EXISTS COMTNENTRPRSMBER (
    ENTRPRS_MBER_ID VARCHAR(20) PRIMARY KEY,             -- 기업회원ID
    ENTRPRS_SE_CODE VARCHAR(15),                         -- 기업구분코드
    BIZRNO VARCHAR(10),                                  -- 사업자등록번호
    JURIRNO VARCHAR(13),                                 -- 법인등록번호
    CMPNY_NM VARCHAR(60) NOT NULL,                       -- 회사명
    CXFC VARCHAR(50),                                    -- 대표자
    ZIP VARCHAR(6),                                      -- 우편번호
    ADRES VARCHAR(100),                                  -- 주소
    ENTRPRS_MIDDLE_TELNO VARCHAR(4),                     -- 기업중간전화번호
    FXNUM VARCHAR(20),                                   -- 팩스번호
    INDUTY_CODE VARCHAR(15),                             -- 업종코드
    APPLCNT_NM VARCHAR(50),                              -- 신청자명
    APPLCNT_IHIDNUM VARCHAR(200),                        -- 신청자주민등록번호
    SBSCRB_DE CHAR(20),                                  -- 가입일자
    ENTRPRS_MBER_STTUS VARCHAR(15),                      -- 기업회원상태
    ENTRPRS_MBER_PASSWORD VARCHAR(200) NOT NULL,         -- 기업회원비밀번호
    ENTRPRS_MBER_PASSWORD_HINT VARCHAR(100),             -- 기업회원비밀번호힌트
    ENTRPRS_MBER_PASSWORD_CNSR VARCHAR(100),             -- 기업회원비밀번호정답
    GROUP_ID VARCHAR(20),                                -- 그룹ID
    DETAIL_ADRES VARCHAR(100),                           -- 상세주소
    ENTRPRS_END_TELNO VARCHAR(4),                        -- 기업끝전화번호
    AREA_NO VARCHAR(4),                                  -- 지역번호
    APPLCNT_EMAIL_ADRES VARCHAR(50),                     -- 신청자이메일주소
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- =====================================================
-- 2. 권한 관리 테이블 (전자정부 표준)
-- =====================================================

-- 권한 정보 테이블
CREATE TABLE IF NOT EXISTS COMTNAUTHORINFO (
    AUTHOR_CODE VARCHAR(30) PRIMARY KEY,                 -- 권한코드
    AUTHOR_NM VARCHAR(60) NOT NULL,                      -- 권한명
    AUTHOR_DC VARCHAR(200),                              -- 권한설명
    AUTHOR_CREAT_DE CHAR(20) NOT NULL,                   -- 권한생성일
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- 업무사용자 보안설정 테이블
CREATE TABLE IF NOT EXISTS COMTNEMPLYRSCRTYESTBS (
    SCRTY_DTRMN_TRGET_ID VARCHAR(100) NOT NULL,          -- 보안결정대상ID
    MBER_TY_CODE VARCHAR(15),                            -- 회원유형코드
    AUTHOR_CODE VARCHAR(30) NOT NULL,                    -- 권한코드
    
    PRIMARY KEY (SCRTY_DTRMN_TRGET_ID, AUTHOR_CODE),
    CONSTRAINT FK_COMTNEMPLYRSCRTYESTBS_AUTHOR FOREIGN KEY (AUTHOR_CODE) 
        REFERENCES COMTNAUTHORINFO(AUTHOR_CODE)
);

-- 권한그룹 정보 테이블
CREATE TABLE IF NOT EXISTS COMTNAUTHORGROUPINFO (
    GROUP_ID VARCHAR(20) PRIMARY KEY,                    -- 그룹ID
    GROUP_NM VARCHAR(60) NOT NULL,                       -- 그룹명
    GROUP_CREAT_DE CHAR(20) NOT NULL,                    -- 그룹생성일
    GROUP_DC VARCHAR(200),                               -- 그룹설명
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- =====================================================
-- 3. 공통코드 관리 테이블 (전자정부 표준)
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

-- =====================================================
-- 4. 게시판 관리 테이블 (전자정부 표준)
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

-- =====================================================
-- 5. 설문조사 테이블 (프로젝트 전용)
-- =====================================================

-- 설문조사 테이블
CREATE TABLE IF NOT EXISTS COMTNSURVEY (
    SURVEY_ID BIGSERIAL PRIMARY KEY,                     -- 설문조사ID
    SURVEY_TITLE VARCHAR(200) NOT NULL,                  -- 설문조사제목
    SURVEY_DESCRIPTION TEXT,                             -- 설문조사설명
    START_DATE TIMESTAMP,                                -- 시작일
    END_DATE TIMESTAMP,                                  -- 종료일
    SURVEY_STTUS VARCHAR(20) DEFAULT 'DRAFT',            -- 설문상태 (DRAFT, ACTIVE, CLOSED)
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    
    -- 등록/수정 정보
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    FRST_REGISTER_ID VARCHAR(20),                        -- 최초등록자ID
    LAST_UPDT_PNTTM TIMESTAMP,                           -- 최종수정시점
    LAST_UPDUSR_ID VARCHAR(20)                           -- 최종수정자ID
);

-- =====================================================
-- 6. 인덱스 생성
-- =====================================================

-- 사용자 테이블 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTNEMPLYRINFO_EMAIL ON COMTNEMPLYRINFO(EMAIL_ADRES);
CREATE INDEX IF NOT EXISTS IDX_COMTNEMPLYRINFO_STTUS ON COMTNEMPLYRINFO(EMPLYR_STTUS_CODE);
CREATE INDEX IF NOT EXISTS IDX_COMTNGNRLMBER_EMAIL ON COMTNGNRLMBER(MBER_EMAIL_ADRES);
CREATE INDEX IF NOT EXISTS IDX_COMTNGNRLMBER_STTUS ON COMTNGNRLMBER(MBER_STTUS);

-- 권한 관리 인덱스
CREATE INDEX IF NOT EXISTS IDX_COMTNEMPLYRSCRTYESTBS_MBER_TY ON COMTNEMPLYRSCRTYESTBS(MBER_TY_CODE);

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

-- =====================================================
-- 7. 기본 권한 데이터
-- =====================================================

-- 기본 권한 정보 (PostgreSQL 호환)
INSERT INTO COMTNAUTHORINFO (AUTHOR_CODE, AUTHOR_NM, AUTHOR_DC, AUTHOR_CREAT_DE, FRST_REGISTER_ID) 
VALUES 
('ROLE_ADMIN', '시스템관리자', '시스템 전체 관리 권한', '20240101', 'system'),
('ROLE_USER', '일반사용자', '일반 사용자 권한', '20240101', 'system'),
('ROLE_ANONYMOUS', '익명사용자', '비회원 권한', '20240101', 'system')
ON CONFLICT (AUTHOR_CODE) DO NOTHING;

-- 권한 그룹 정보 (PostgreSQL 호환)
INSERT INTO COMTNAUTHORGROUPINFO (GROUP_ID, GROUP_NM, GROUP_CREAT_DE, GROUP_DC, FRST_REGISTER_ID) 
VALUES 
('GROUP_00000000000001', '전체관리자', '20240101', '시스템 전체 관리자 그룹', 'system'),
('GROUP_00000000000002', '부분관리자', '20240101', '부분 관리자 그룹', 'system'),
('GROUP_00000000000003', '일반사용자', '20240101', '일반 사용자 그룹', 'system')
ON CONFLICT (GROUP_ID) DO NOTHING;

-- =====================================================
-- 8. 기본 공통코드 데이터
-- =====================================================

-- 회원유형 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM013', '사용자유형', '사용자의 유형을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM013', 'USR01', '업무사용자', '업무사용자', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM013', 'USR02', '일반회원', '일반회원', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM013', 'USR03', '기업회원', '기업회원', 'Y', 3, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 업무사용자 상태 공통코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM014', '업무사용자상태', '업무사용자의 상태를 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM014', 'P', '신청', '가입신청상태', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM014', 'A', '승인', '가입승인상태', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM014', 'D', '삭제', '삭제상태', 'Y', 3, CURRENT_TIMESTAMP, 'system')
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

-- =====================================================
-- 9. 기본 사용자 데이터
-- =====================================================

-- 기본 업무사용자 계정 생성
INSERT INTO COMTNEMPLYRINFO (
    ESNTL_ID, EMPLYR_ID, USER_NM, PASSWORD, EMAIL_ADRES, OFCPS_NM, 
    EMPLYR_STTUS_CODE, FRST_REGISTER_ID
) VALUES (
    'USRCNFRM_00000000001', 'admin', '시스템관리자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'admin@opensurvey.co.kr', '시스템관리자', 'A', 'system'
), (
    'USRCNFRM_00000000002', 'user01', '일반사용자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'user01@opensurvey.co.kr', '사원', 'A', 'system'
)
ON CONFLICT (ESNTL_ID) DO NOTHING;

-- 사용자 권한 설정
INSERT INTO COMTNEMPLYRSCRTYESTBS (SCRTY_DTRMN_TRGET_ID, MBER_TY_CODE, AUTHOR_CODE) VALUES
('USRCNFRM_00000000001', 'USR01', 'ROLE_ADMIN'),
('USRCNFRM_00000000002', 'USR01', 'ROLE_USER')
ON CONFLICT (SCRTY_DTRMN_TRGET_ID, AUTHOR_CODE) DO NOTHING;

-- =====================================================
-- 10. 샘플 게시판 데이터
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
ON CONFLICT (NTT_ID) DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '전자정부 표준 테이블 생성 완료! (PostgreSQL 호환)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '1. 사용자 관리: COMTNEMPLYRINFO, COMTNGNRLMBER, COMTNENTRPRSMBER';
    RAISE NOTICE '2. 권한 관리: COMTNAUTHORINFO, COMTNEMPLYRSCRTYESTBS, COMTNAUTHORGROUPINFO';
    RAISE NOTICE '3. 공통코드: COMTCCMMNCODE, COMTCCMMNDETAILCODE';
    RAISE NOTICE '4. 게시판: COMTNBBSMST, COMTNBBSUSE, COMTNBBS';
    RAISE NOTICE '5. 파일/댓글: COMTNFILE, COMTNCOMMENT';
    RAISE NOTICE '6. 설문조사: COMTNSURVEY';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 기본 데이터:';
    RAISE NOTICE '- 관리자 계정: admin/password (ID: USRCNFRM_00000000001)';
    RAISE NOTICE '- 사용자 계정: user01/password (ID: USRCNFRM_00000000002)';
    RAISE NOTICE '- 기본 권한: ROLE_ADMIN, ROLE_USER, ROLE_ANONYMOUS';
    RAISE NOTICE '- 기본 공통코드 (COM013, COM014, COM030, COM031)';
    RAISE NOTICE '- 샘플 게시판 및 게시글';
    RAISE NOTICE '========================================';
    RAISE NOTICE '다음 단계: 백엔드 VO/Service/Controller 수정 필요';
    RAISE NOTICE '========================================';
END $$; 
-- =====================================================
-- 전자정부 프레임워크 표준 게시판 테이블 구조
-- OpenSurvey Project - eGovFramework Standard
-- =====================================================

-- =====================================================
-- 1. 게시판 마스터 테이블 (COMTNBBSMST)
-- =====================================================
CREATE TABLE IF NOT EXISTS COMTNBBSMST (
    BBS_ID VARCHAR(20) PRIMARY KEY,                        -- 게시판ID
    BBS_NM VARCHAR(255) NOT NULL,                          -- 게시판명
    BBS_INTRCN VARCHAR(2400),                              -- 게시판소개
    BBS_TY_CODE CHAR(6),                                   -- 게시판유형코드
    BBS_ATTRB_CODE CHAR(6),                                -- 게시판속성코드
    REPLY_POSBL_AT CHAR(1) DEFAULT 'Y' CHECK (REPLY_POSBL_AT IN ('Y', 'N')),  -- 답글가능여부
    FILE_ATCH_POSBL_AT CHAR(1) DEFAULT 'Y' CHECK (FILE_ATCH_POSBL_AT IN ('Y', 'N')), -- 파일첨부가능여부
    ATCH_POSBL_FILE_NUMBER INTEGER DEFAULT 3,              -- 첨부가능파일숫자
    ATCH_POSBL_FILE_SIZE DECIMAL(8,1) DEFAULT 0,           -- 첨부가능파일사이즈
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    TMPLAT_ID CHAR(20),                                    -- 템플릿ID
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                          -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                            -- 최종수정자ID  
    LAST_UPDT_PNTTM TIMESTAMP                              -- 최종수정시점
);

COMMENT ON TABLE COMTNBBSMST IS '게시판마스터';
COMMENT ON COLUMN COMTNBBSMST.BBS_ID IS '게시판ID';
COMMENT ON COLUMN COMTNBBSMST.BBS_NM IS '게시판명';
COMMENT ON COLUMN COMTNBBSMST.BBS_INTRCN IS '게시판소개';
COMMENT ON COLUMN COMTNBBSMST.BBS_TY_CODE IS '게시판유형코드';
COMMENT ON COLUMN COMTNBBSMST.REPLY_POSBL_AT IS '답글가능여부';
COMMENT ON COLUMN COMTNBBSMST.FILE_ATCH_POSBL_AT IS '파일첨부가능여부';

-- =====================================================
-- 2. 게시판 사용 테이블 (COMTNBBSUSE)
-- =====================================================
CREATE TABLE IF NOT EXISTS COMTNBBSUSE (
    BBS_ID VARCHAR(20) NOT NULL,                          -- 게시판ID
    TRGET_ID VARCHAR(20) NOT NULL,                         -- 대상ID (커뮤니티ID)
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    REGIST_SE_CODE CHAR(6),                                -- 등록구분코드
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                          -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                            -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                             -- 최종수정시점
    
    PRIMARY KEY (BBS_ID, TRGET_ID),
    CONSTRAINT FK_COMTNBBSUSE_BBS FOREIGN KEY (BBS_ID) 
        REFERENCES COMTNBBSMST(BBS_ID) ON DELETE CASCADE
);

COMMENT ON TABLE COMTNBBSUSE IS '게시판사용';
COMMENT ON COLUMN COMTNBBSUSE.BBS_ID IS '게시판ID';
COMMENT ON COLUMN COMTNBBSUSE.TRGET_ID IS '대상ID';
COMMENT ON COLUMN COMTNBBSUSE.USE_AT IS '사용여부';

-- =====================================================
-- 3. 게시글 테이블 (COMTNBBS)
-- =====================================================
CREATE TABLE IF NOT EXISTS COMTNBBS (
    NTT_ID BIGSERIAL PRIMARY KEY,                         -- 게시글ID
    BBS_ID VARCHAR(20) NOT NULL,                          -- 게시판ID
    NTT_NO INTEGER,                                       -- 게시글번호
    NTT_SJ VARCHAR(2000),                                 -- 게시글제목
    NTT_CN TEXT,                                          -- 게시글내용
    ANSWER_AT CHAR(1) DEFAULT 'N' CHECK (ANSWER_AT IN ('Y', 'N')), -- 답변여부
    PARNTSCTT_NO INTEGER DEFAULT 0,                       -- 부모스크랩수
    ANSWER_LC INTEGER DEFAULT 0,                          -- 답변위치
    SORT_ORDR INTEGER DEFAULT 0,                          -- 정렬순서
    RDCNT INTEGER DEFAULT 0,                              -- 조회수
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    NTCE_AT CHAR(1) DEFAULT 'N' CHECK (NTCE_AT IN ('Y', 'N')), -- 공지여부
    ATCH_FILE_ID CHAR(20),                                -- 첨부파일ID
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                         -- 최초등록자ID
    NTCRN_NM VARCHAR(20),                                 -- 게시자명
    PASSWORD VARCHAR(200),                                -- 패스워드
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                           -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                            -- 최종수정시점
    
    CONSTRAINT FK_COMTNBBS_BBS FOREIGN KEY (BBS_ID) 
        REFERENCES COMTNBBSMST(BBS_ID) ON DELETE CASCADE
);

COMMENT ON TABLE COMTNBBS IS '게시글';
COMMENT ON COLUMN COMTNBBS.NTT_ID IS '게시글ID';
COMMENT ON COLUMN COMTNBBS.BBS_ID IS '게시판ID';
COMMENT ON COLUMN COMTNBBS.NTT_SJ IS '게시글제목';
COMMENT ON COLUMN COMTNBBS.NTT_CN IS '게시글내용';
COMMENT ON COLUMN COMTNBBS.RDCNT IS '조회수';
COMMENT ON COLUMN COMTNBBS.NTCE_AT IS '공지여부';

-- =====================================================
-- 4. 첨부파일 정보 테이블 (COMTNFILE)
-- =====================================================
CREATE TABLE IF NOT EXISTS COMTNFILE (
    ATCH_FILE_ID CHAR(20) NOT NULL,                       -- 첨부파일ID
    FILE_SN DECIMAL(10) NOT NULL,                         -- 파일순번
    FILE_STRE_COURS VARCHAR(2000) NOT NULL,               -- 파일저장경로
    STRE_FILE_NM VARCHAR(255) NOT NULL,                   -- 저장파일명
    ORIGNL_FILE_NM VARCHAR(255),                          -- 원파일명
    FILE_EXTSN VARCHAR(20),                               -- 파일확장자
    FILE_CN TEXT,                                         -- 파일내용
    FILE_SIZE BIGINT,                                     -- 파일크기
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                         -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    
    PRIMARY KEY (ATCH_FILE_ID, FILE_SN)
);

COMMENT ON TABLE COMTNFILE IS '첨부파일';
COMMENT ON COLUMN COMTNFILE.ATCH_FILE_ID IS '첨부파일ID';
COMMENT ON COLUMN COMTNFILE.FILE_SN IS '파일순번';
COMMENT ON COLUMN COMTNFILE.ORIGNL_FILE_NM IS '원파일명';
COMMENT ON COLUMN COMTNFILE.FILE_SIZE IS '파일크기';

-- =====================================================
-- 5. 댓글 테이블 (COMTNCOMMENT)
-- =====================================================
CREATE TABLE IF NOT EXISTS COMTNCOMMENT (
    COMMENT_NO BIGSERIAL PRIMARY KEY,                     -- 댓글번호
    NTT_ID BIGINT NOT NULL,                               -- 게시글ID
    COMMENT_CN VARCHAR(2400),                             -- 댓글내용
    COMMENT_WRITER_ID VARCHAR(20),                        -- 댓글작성자ID
    COMMENT_WRITER_NM VARCHAR(20),                        -- 댓글작성자명
    COMMENT_PASSWORD VARCHAR(200),                        -- 댓글비밀번호
    USE_AT CHAR(1) DEFAULT 'Y' CHECK (USE_AT IN ('Y', 'N')), -- 사용여부
    
    -- 등록/수정 정보
    FRST_REGISTER_ID VARCHAR(20),                         -- 최초등록자ID
    FRST_REGIST_PNTTM TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 최초등록시점
    LAST_UPDUSR_ID VARCHAR(20),                           -- 최종수정자ID
    LAST_UPDT_PNTTM TIMESTAMP,                            -- 최종수정시점
    
    CONSTRAINT FK_COMTNCOMMENT_NTT FOREIGN KEY (NTT_ID) 
        REFERENCES COMTNBBS(NTT_ID) ON DELETE CASCADE
);

COMMENT ON TABLE COMTNCOMMENT IS '댓글';
COMMENT ON COLUMN COMTNCOMMENT.COMMENT_NO IS '댓글번호';
COMMENT ON COLUMN COMTNCOMMENT.NTT_ID IS '게시글ID';
COMMENT ON COLUMN COMTNCOMMENT.COMMENT_CN IS '댓글내용';

-- =====================================================
-- 6. 게시판 유형 공통코드 추가
-- =====================================================

-- 게시판 유형 상위코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM030', '게시판유형', '게시판의 유형을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 게시판 유형 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM030', 'BBST01', '일반게시판', '일반적인 게시판', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST02', '공지게시판', '공지사항 전용 게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST03', 'FAQ게시판', '자주묻는질문 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('COM030', 'BBST04', 'QNA게시판', '질문답변 게시판', 'Y', 4, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 게시판 속성 상위코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('COM031', '게시판속성', '게시판의 속성을 구분하는 코드', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 게시판 속성 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('COM031', 'BBSA01', '일반속성', '일반적인 게시판 속성', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('COM031', 'BBSA02', '갤러리속성', '이미지 중심 게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('COM031', 'BBSA03', '블로그속성', '블로그 형태 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- =====================================================
-- 7. 인덱스 생성
-- =====================================================

-- 게시글 인덱스
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
-- 8. 샘플 게시판 데이터
-- =====================================================

-- 샘플 게시판 생성
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

-- 샘플 게시판 사용 설정 (전체 대상)
INSERT INTO COMTNBBSUSE (
    BBS_ID, TRGET_ID, USE_AT, REGIST_SE_CODE, FRST_REGISTER_ID
) VALUES 
('BBSMSTR_000001', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000002', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000003', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin'),
('BBSMSTR_000004', 'SYSTEM_DEFAULT', 'Y', 'REGSE1', 'admin')
ON CONFLICT (BBS_ID, TRGET_ID) DO NOTHING;

-- 샘플 게시글
INSERT INTO COMTNBBS (
    BBS_ID, NTT_SJ, NTT_CN, NTCE_AT, FRST_REGISTER_ID, NTCRN_NM
) VALUES 
('BBSMSTR_000001', '시스템 점검 안내', '<p>시스템 점검으로 인한 서비스 일시 중단을 안내드립니다.</p><p>점검시간: 2024-01-01 02:00~04:00</p>', 'Y', 'admin', '관리자'),
('BBSMSTR_000001', '서비스 개선 사항 안내', '<p>더 나은 서비스 제공을 위한 기능 개선 사항을 안내드립니다.</p>', 'N', 'admin', '관리자'),
('BBSMSTR_000002', '자유게시판을 이용해주세요', '<p>자유롭게 의견을 나누는 공간입니다.</p>', 'N', 'user01', '사용자1'),
('BBSMSTR_000003', '로그인은 어떻게 하나요?', '<p>상단의 로그인 버튼을 클릭하여 로그인하실 수 있습니다.</p>', 'N', 'admin', '관리자'),
('BBSMSTR_000004', '게시판 이용 문의', '<p>게시판 이용에 대해 문의드립니다.</p>', 'N', 'user01', '사용자1')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '전자정부 표준 게시판 테이블이 생성되었습니다.';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '- COMTNBBSMST (게시판마스터)';
    RAISE NOTICE '- COMTNBBSUSE (게시판사용)';
    RAISE NOTICE '- COMTNBBS (게시글)';
    RAISE NOTICE '- COMTNFILE (첨부파일)';
    RAISE NOTICE '- COMTNCOMMENT (댓글)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '추가된 공통코드:';
    RAISE NOTICE '- COM030 (게시판유형)';
    RAISE NOTICE '- COM031 (게시판속성)';
    RAISE NOTICE '========================================';
END $$; 
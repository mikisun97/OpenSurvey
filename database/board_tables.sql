-- =====================================================
-- 게시판 관련 테이블 생성 스크립트 (PostgreSQL)
-- OpenSurvey Project
-- =====================================================

-- 1. 게시판 타입 공통코드 추가
-- 게시판 타입 상위코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('BOARD_TYPE', '게시판타입', '게시판 종류 관리', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 게시판 타입 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('BOARD_TYPE', 'NOTICE', '공지사항', '일반 공지사항 게시판', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'ADMIN_NOTICE', '관리자공지', '관리자 전용 공지사항', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'QNA', '문의게시판', '질문/답변 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'FAQ', '자주묻는질문', 'FAQ 게시판', 'Y', 4, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'NEWS', '소식/뉴스', '소식 및 뉴스 게시판', 'Y', 5, CURRENT_TIMESTAMP, 'system'),
('BOARD_TYPE', 'FREE', '자유게시판', '자유 게시판', 'Y', 6, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 게시판 세부분류 상위코드
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('BOARD_DETAIL_TYPE', '게시판세부분류', '게시판 세부 분류 관리', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 게시판 세부분류 코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('BOARD_DETAIL_TYPE', 'SYSTEM', '시스템관리', '시스템 관련 공지', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'ALL_NOTICE', '전체공지', '전체 사용자 대상 공지', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'URGENT', '긴급공지', '긴급 공지사항', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'EVENT', '이벤트', '이벤트 관련 소식', 'Y', 4, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'MAINTENANCE', '점검안내', '시스템 점검 안내', 'Y', 5, CURRENT_TIMESTAMP, 'system'),
('BOARD_DETAIL_TYPE', 'UPDATE', '업데이트', '기능 업데이트 안내', 'Y', 6, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- =====================================================
-- 2. 메인 게시판 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD (
    BOARD_SEQ BIGSERIAL PRIMARY KEY,                    -- 게시글 번호
    BOARD_TYPE_CODE VARCHAR(50) NOT NULL,               -- 게시판 타입 (notice, admin-notice, qna 등)
    BOARD_DETAIL_TYPE_CODE VARCHAR(50),                 -- 세부 분류 (시스템관리, 전체공지 등)
    BOARD_SUBJECT VARCHAR(200) NOT NULL,                -- 제목
    BOARD_CONTENTS TEXT,                                -- 내용 (HTML)
    
    -- 노출/표시 옵션
    EXPOSURE_YN CHAR(1) DEFAULT 'Y' CHECK (EXPOSURE_YN IN ('Y', 'N')),     -- 노출여부
    TOP_YN CHAR(1) DEFAULT 'N' CHECK (TOP_YN IN ('Y', 'N')),               -- 상단고정여부
    COLOR_YN CHAR(1) DEFAULT 'N' CHECK (COLOR_YN IN ('Y', 'N')),           -- 색상표시여부
    COMMENT_YN CHAR(1) DEFAULT 'Y' CHECK (COMMENT_YN IN ('Y', 'N')),       -- 댓글허용여부
    
    -- 조회/통계
    READ_COUNT INTEGER DEFAULT 0,                       -- 조회수 (rdcnt)
    BOARD_COMMENT_COUNT INTEGER DEFAULT 0,              -- 댓글수
    
    -- 파일/미디어
    FILE_GROUP_ID VARCHAR(50),                          -- 첨부파일 그룹 ID
    MAIN_THUMBNAIL_URL VARCHAR(500),                    -- 메인 썸네일 URL
    THUMBNAIL_URL VARCHAR(500),                         -- 일반 썸네일 URL
    MEDIA_URL VARCHAR(500),                             -- 미디어 URL
    
    -- 작성자/수정자 정보
    REGIST_USER_ID VARCHAR(50) NOT NULL,               -- 등록자 ID
    REGIST_NAME VARCHAR(100),                           -- 등록자명
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 등록일
    MODIFY_USER_ID VARCHAR(50),                         -- 수정자 ID
    MODIFY_NAME VARCHAR(100),                           -- 수정자명
    MODIFY_DATE TIMESTAMP,                              -- 수정일
    
    -- 정렬/페이징용
    SORT_ORDER INTEGER DEFAULT 0                        -- 정렬순서
);

-- 게시판 테이블 코멘트
COMMENT ON TABLE BOARD IS '게시판 메인 테이블';
COMMENT ON COLUMN BOARD.BOARD_SEQ IS '게시글 일련번호';
COMMENT ON COLUMN BOARD.BOARD_TYPE_CODE IS '게시판 타입 코드';
COMMENT ON COLUMN BOARD.BOARD_DETAIL_TYPE_CODE IS '게시판 세부 분류 코드';
COMMENT ON COLUMN BOARD.BOARD_SUBJECT IS '게시글 제목';
COMMENT ON COLUMN BOARD.BOARD_CONTENTS IS '게시글 내용(HTML)';
COMMENT ON COLUMN BOARD.EXPOSURE_YN IS '노출여부(Y/N)';
COMMENT ON COLUMN BOARD.TOP_YN IS '상단고정여부(Y/N)';
COMMENT ON COLUMN BOARD.COLOR_YN IS '색상표시여부(Y/N)';
COMMENT ON COLUMN BOARD.COMMENT_YN IS '댓글허용여부(Y/N)';
COMMENT ON COLUMN BOARD.READ_COUNT IS '조회수';
COMMENT ON COLUMN BOARD.BOARD_COMMENT_COUNT IS '댓글수';

-- =====================================================
-- 3. 첨부파일 관리 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_FILE (
    FILE_SEQ BIGSERIAL PRIMARY KEY,                     -- 파일 번호
    BOARD_SEQ BIGINT NOT NULL,                          -- 게시글 번호
    FILE_GROUP_ID VARCHAR(50),                          -- 파일 그룹 ID
    ORIGINAL_FILE_NAME VARCHAR(255) NOT NULL,           -- 원본 파일명
    STORED_FILE_NAME VARCHAR(255) NOT NULL,             -- 저장된 파일명
    FILE_PATH VARCHAR(500) NOT NULL,                    -- 파일 경로
    FILE_SIZE BIGINT,                                   -- 파일 크기 (byte)
    FILE_EXT VARCHAR(10),                               -- 파일 확장자
    MIME_TYPE VARCHAR(100),                             -- MIME 타입
    IS_THUMBNAIL CHAR(1) DEFAULT 'N' CHECK (IS_THUMBNAIL IN ('Y', 'N')), -- 썸네일 여부
    DOWNLOAD_COUNT INTEGER DEFAULT 0,                   -- 다운로드 횟수
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 등록일
    
    CONSTRAINT FK_BOARD_FILE_BOARD FOREIGN KEY (BOARD_SEQ) 
        REFERENCES BOARD(BOARD_SEQ) ON DELETE CASCADE
);

-- 첨부파일 테이블 코멘트
COMMENT ON TABLE BOARD_FILE IS '게시판 첨부파일 관리 테이블';
COMMENT ON COLUMN BOARD_FILE.FILE_SEQ IS '파일 일련번호';
COMMENT ON COLUMN BOARD_FILE.BOARD_SEQ IS '게시글 일련번호';
COMMENT ON COLUMN BOARD_FILE.FILE_GROUP_ID IS '파일 그룹 ID';
COMMENT ON COLUMN BOARD_FILE.ORIGINAL_FILE_NAME IS '원본 파일명';
COMMENT ON COLUMN BOARD_FILE.STORED_FILE_NAME IS '저장된 파일명';
COMMENT ON COLUMN BOARD_FILE.FILE_PATH IS '파일 저장 경로';
COMMENT ON COLUMN BOARD_FILE.FILE_SIZE IS '파일 크기(byte)';
COMMENT ON COLUMN BOARD_FILE.IS_THUMBNAIL IS '썸네일 여부(Y/N)';

-- =====================================================
-- 4. 댓글 관리 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_COMMENT (
    COMMENT_SEQ BIGSERIAL PRIMARY KEY,                  -- 댓글 번호
    BOARD_SEQ BIGINT NOT NULL,                          -- 게시글 번호
    PARENT_COMMENT_SEQ BIGINT,                          -- 부모 댓글 번호 (대댓글용)
    COMMENT_CONTENT TEXT NOT NULL,                      -- 댓글 내용
    COMMENT_DEPTH INTEGER DEFAULT 0,                    -- 댓글 깊이 (0: 댓글, 1: 대댓글)
    COMMENT_ORDER INTEGER DEFAULT 0,                    -- 댓글 순서
    
    -- 작성자 정보
    REGIST_USER_ID VARCHAR(50) NOT NULL,               -- 작성자 ID
    REGIST_NAME VARCHAR(100),                           -- 작성자명
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 작성일
    MODIFY_DATE TIMESTAMP,                              -- 수정일
    
    -- 상태
    USE_YN CHAR(1) DEFAULT 'Y' CHECK (USE_YN IN ('Y', 'N')),           -- 사용여부
    DELETE_YN CHAR(1) DEFAULT 'N' CHECK (DELETE_YN IN ('Y', 'N')),     -- 삭제여부
    
    CONSTRAINT FK_BOARD_COMMENT_BOARD FOREIGN KEY (BOARD_SEQ) 
        REFERENCES BOARD(BOARD_SEQ) ON DELETE CASCADE,
    CONSTRAINT FK_BOARD_COMMENT_PARENT FOREIGN KEY (PARENT_COMMENT_SEQ) 
        REFERENCES BOARD_COMMENT(COMMENT_SEQ) ON DELETE CASCADE
);

-- 댓글 테이블 코멘트
COMMENT ON TABLE BOARD_COMMENT IS '게시판 댓글 관리 테이블';
COMMENT ON COLUMN BOARD_COMMENT.COMMENT_SEQ IS '댓글 일련번호';
COMMENT ON COLUMN BOARD_COMMENT.BOARD_SEQ IS '게시글 일련번호';
COMMENT ON COLUMN BOARD_COMMENT.PARENT_COMMENT_SEQ IS '부모 댓글 번호';
COMMENT ON COLUMN BOARD_COMMENT.COMMENT_CONTENT IS '댓글 내용';
COMMENT ON COLUMN BOARD_COMMENT.COMMENT_DEPTH IS '댓글 깊이(0:댓글, 1:대댓글)';

-- =====================================================
-- 5. 인덱스 생성
-- =====================================================

-- 게시판 인덱스
CREATE INDEX IF NOT EXISTS IDX_BOARD_TYPE_DATE ON BOARD(BOARD_TYPE_CODE, REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_EXPOSURE_TOP ON BOARD(EXPOSURE_YN, TOP_YN, REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_DETAIL_TYPE ON BOARD(BOARD_DETAIL_TYPE_CODE, REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_REGIST_DATE ON BOARD(REGIST_DATE DESC);
CREATE INDEX IF NOT EXISTS IDX_BOARD_READ_COUNT ON BOARD(READ_COUNT DESC);

-- 전문 검색 인덱스 (제목 + 내용)
CREATE INDEX IF NOT EXISTS IDX_BOARD_SEARCH ON BOARD USING gin(
    to_tsvector('korean', COALESCE(BOARD_SUBJECT, '') || ' ' || COALESCE(BOARD_CONTENTS, ''))
);

-- 파일 인덱스
CREATE INDEX IF NOT EXISTS IDX_BOARD_FILE_GROUP ON BOARD_FILE(FILE_GROUP_ID);
CREATE INDEX IF NOT EXISTS IDX_BOARD_FILE_BOARD ON BOARD_FILE(BOARD_SEQ);

-- 댓글 인덱스
CREATE INDEX IF NOT EXISTS IDX_BOARD_COMMENT_BOARD ON BOARD_COMMENT(BOARD_SEQ, COMMENT_DEPTH, COMMENT_ORDER);
CREATE INDEX IF NOT EXISTS IDX_BOARD_COMMENT_PARENT ON BOARD_COMMENT(PARENT_COMMENT_SEQ);
CREATE INDEX IF NOT EXISTS IDX_BOARD_COMMENT_DATE ON BOARD_COMMENT(REGIST_DATE DESC);

-- =====================================================
-- 6. 트리거 함수 및 트리거 생성
-- =====================================================

-- 댓글 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_board_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE BOARD 
        SET BOARD_COMMENT_COUNT = (
            SELECT COUNT(*) 
            FROM BOARD_COMMENT 
            WHERE BOARD_SEQ = NEW.BOARD_SEQ AND DELETE_YN = 'N'
        )
        WHERE BOARD_SEQ = NEW.BOARD_SEQ;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE BOARD 
        SET BOARD_COMMENT_COUNT = (
            SELECT COUNT(*) 
            FROM BOARD_COMMENT 
            WHERE BOARD_SEQ = NEW.BOARD_SEQ AND DELETE_YN = 'N'
        )
        WHERE BOARD_SEQ = NEW.BOARD_SEQ;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE BOARD 
        SET BOARD_COMMENT_COUNT = (
            SELECT COUNT(*) 
            FROM BOARD_COMMENT 
            WHERE BOARD_SEQ = OLD.BOARD_SEQ AND DELETE_YN = 'N'
        )
        WHERE BOARD_SEQ = OLD.BOARD_SEQ;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 수 업데이트 트리거
DROP TRIGGER IF EXISTS tr_board_comment_count ON BOARD_COMMENT;
CREATE TRIGGER tr_board_comment_count
    AFTER INSERT OR UPDATE OR DELETE ON BOARD_COMMENT
    FOR EACH ROW EXECUTE FUNCTION update_board_comment_count();

-- 수정일 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_modify_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.MODIFY_DATE = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 게시판 수정일 자동 업데이트 트리거
DROP TRIGGER IF EXISTS tr_board_modify_date ON BOARD;
CREATE TRIGGER tr_board_modify_date
    BEFORE UPDATE ON BOARD
    FOR EACH ROW EXECUTE FUNCTION update_modify_date();

-- 댓글 수정일 자동 업데이트 트리거
DROP TRIGGER IF EXISTS tr_board_comment_modify_date ON BOARD_COMMENT;
CREATE TRIGGER tr_board_comment_modify_date
    BEFORE UPDATE ON BOARD_COMMENT
    FOR EACH ROW EXECUTE FUNCTION update_modify_date();

-- =====================================================
-- 7. 샘플 데이터 삽입
-- =====================================================

-- 샘플 게시글 데이터
INSERT INTO BOARD (
    BOARD_TYPE_CODE, BOARD_DETAIL_TYPE_CODE, BOARD_SUBJECT, BOARD_CONTENTS,
    EXPOSURE_YN, TOP_YN, COLOR_YN, COMMENT_YN,
    REGIST_USER_ID, REGIST_NAME
) VALUES 
-- 공지사항
('NOTICE', 'SYSTEM', '시스템 점검 안내', '<p>시스템 점검으로 인한 서비스 일시 중단 안내입니다.</p><p>점검 시간: 2024-01-01 02:00 ~ 04:00</p>', 'Y', 'Y', 'N', 'Y', 'admin', '관리자'),
('NOTICE', 'ALL_NOTICE', '서비스 개선 안내', '<p>더 나은 서비스 제공을 위한 기능 개선 사항을 안내드립니다.</p>', 'Y', 'N', 'N', 'Y', 'admin', '관리자'),
('NOTICE', 'EVENT', '신규 기능 출시 이벤트', '<p>새로운 기능 출시를 기념하여 이벤트를 진행합니다.</p>', 'Y', 'N', 'Y', 'Y', 'admin', '관리자'),

-- 관리자 공지
('ADMIN_NOTICE', 'SYSTEM', '관리자 전용 공지사항', '<p>관리자 전용 공지사항입니다.</p>', 'Y', 'N', 'N', 'N', 'admin', '관리자'),

-- FAQ
('FAQ', NULL, '자주 묻는 질문입니다', '<p>가장 많이 문의하시는 내용에 대한 답변입니다.</p>', 'Y', 'N', 'N', 'N', 'admin', '관리자'),

-- 자유게시판
('FREE', NULL, '자유게시판 첫 번째 글', '<p>자유롭게 의견을 나누는 공간입니다.</p>', 'Y', 'N', 'N', 'Y', 'user01', '사용자1')

ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '게시판 관련 테이블 생성이 완료되었습니다.';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '- BOARD (게시판 메인 테이블)';
    RAISE NOTICE '- BOARD_FILE (첨부파일 관리)';
    RAISE NOTICE '- BOARD_COMMENT (댓글 관리)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '추가된 공통코드:';
    RAISE NOTICE '- BOARD_TYPE (게시판타입)';
    RAISE NOTICE '- BOARD_DETAIL_TYPE (게시판세부분류)';
    RAISE NOTICE '========================================';
END $$; 
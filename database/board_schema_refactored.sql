-- =====================================================
-- 게시판 관리 시스템 - 올바른 테이블 구조 설계
-- OpenSurvey Project
-- =====================================================

-- =====================================================
-- 1. 게시판 설정 테이블 (BOARD_MASTER)
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_MASTER (
    BOARD_ID VARCHAR(50) PRIMARY KEY,                       -- 게시판 ID
    BOARD_NAME VARCHAR(100) NOT NULL,                       -- 게시판명
    BOARD_DESC VARCHAR(500),                                -- 게시판 설명
    BOARD_TYPE_CODE VARCHAR(50) NOT NULL,                   -- 게시판 타입 (NOTICE, QNA, FREE 등)
    
    -- 게시판별 기본 설정
    USE_YN CHAR(1) DEFAULT 'Y' CHECK (USE_YN IN ('Y', 'N')),               -- 사용여부
    COMMENT_YN CHAR(1) DEFAULT 'Y' CHECK (COMMENT_YN IN ('Y', 'N')),       -- 댓글 허용여부
    FILE_ATTACH_YN CHAR(1) DEFAULT 'Y' CHECK (FILE_ATTACH_YN IN ('Y', 'N')), -- 파일첨부 허용여부
    ANONYMOUS_YN CHAR(1) DEFAULT 'N' CHECK (ANONYMOUS_YN IN ('Y', 'N')),    -- 익명 작성 허용여부
    
    -- 권한 설정
    READ_AUTH_CODE VARCHAR(50),                             -- 읽기 권한 코드
    WRITE_AUTH_CODE VARCHAR(50),                            -- 쓰기 권한 코드
    COMMENT_AUTH_CODE VARCHAR(50),                          -- 댓글 권한 코드
    
    -- 페이징 설정
    PAGE_SIZE INTEGER DEFAULT 10,                           -- 페이지당 게시글 수
    
    -- 작성자/수정자 정보
    REGIST_USER_ID VARCHAR(50) NOT NULL,                   -- 등록자 ID
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- 등록일
    MODIFY_USER_ID VARCHAR(50),                             -- 수정자 ID
    MODIFY_DATE TIMESTAMP,                                  -- 수정일
    
    -- 정렬
    SORT_ORDER INTEGER DEFAULT 0                           -- 정렬순서
);

COMMENT ON TABLE BOARD_MASTER IS '게시판 설정 마스터 테이블';
COMMENT ON COLUMN BOARD_MASTER.BOARD_ID IS '게시판 고유 ID';
COMMENT ON COLUMN BOARD_MASTER.BOARD_NAME IS '게시판명';
COMMENT ON COLUMN BOARD_MASTER.BOARD_TYPE_CODE IS '게시판 타입 코드';

-- =====================================================
-- 2. 게시글 테이블 (BOARD_POST) - 순수 게시글 정보만
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_POST (
    POST_SEQ BIGSERIAL PRIMARY KEY,                        -- 게시글 번호
    BOARD_ID VARCHAR(50) NOT NULL,                         -- 게시판 ID
    POST_CATEGORY_CODE VARCHAR(50),                        -- 게시글 분류 코드 (공지사항의 세부분류 등)
    
    -- 게시글 내용
    POST_SUBJECT VARCHAR(200) NOT NULL,                    -- 제목
    POST_CONTENTS TEXT,                                    -- 내용 (HTML)
    
    -- 게시글별 개별 설정
    TOP_YN CHAR(1) DEFAULT 'N' CHECK (TOP_YN IN ('Y', 'N')),           -- 상단고정여부
    COLOR_YN CHAR(1) DEFAULT 'N' CHECK (COLOR_YN IN ('Y', 'N')),       -- 색상표시여부
    SECRET_YN CHAR(1) DEFAULT 'N' CHECK (SECRET_YN IN ('Y', 'N')),      -- 비밀글여부
    
    -- 조회/통계
    READ_COUNT INTEGER DEFAULT 0,                          -- 조회수
    COMMENT_COUNT INTEGER DEFAULT 0,                       -- 댓글수
    LIKE_COUNT INTEGER DEFAULT 0,                          -- 좋아요수
    
    -- 파일/미디어
    FILE_GROUP_ID VARCHAR(50),                             -- 첨부파일 그룹 ID
    THUMBNAIL_URL VARCHAR(500),                            -- 썸네일 URL
    
    -- 작성자 정보
    REGIST_USER_ID VARCHAR(50) NOT NULL,                  -- 작성자 ID
    REGIST_NAME VARCHAR(100),                              -- 작성자명
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- 작성일
    MODIFY_USER_ID VARCHAR(50),                            -- 수정자 ID
    MODIFY_NAME VARCHAR(100),                              -- 수정자명
    MODIFY_DATE TIMESTAMP,                                 -- 수정일
    
    -- 상태
    USE_YN CHAR(1) DEFAULT 'Y' CHECK (USE_YN IN ('Y', 'N')),           -- 사용여부
    DELETE_YN CHAR(1) DEFAULT 'N' CHECK (DELETE_YN IN ('Y', 'N')),     -- 삭제여부
    
    CONSTRAINT FK_BOARD_POST_MASTER FOREIGN KEY (BOARD_ID) 
        REFERENCES BOARD_MASTER(BOARD_ID) ON DELETE CASCADE
);

COMMENT ON TABLE BOARD_POST IS '게시글 정보 테이블';
COMMENT ON COLUMN BOARD_POST.POST_SEQ IS '게시글 일련번호';
COMMENT ON COLUMN BOARD_POST.BOARD_ID IS '게시판 ID';
COMMENT ON COLUMN BOARD_POST.POST_SUBJECT IS '게시글 제목';

-- =====================================================
-- 3. 첨부파일 테이블 (BOARD_FILE) - 기존과 동일
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_FILE (
    FILE_SEQ BIGSERIAL PRIMARY KEY,                       -- 파일 번호
    POST_SEQ BIGINT NOT NULL,                             -- 게시글 번호
    FILE_GROUP_ID VARCHAR(50),                            -- 파일 그룹 ID
    ORIGINAL_FILE_NAME VARCHAR(255) NOT NULL,             -- 원본 파일명
    STORED_FILE_NAME VARCHAR(255) NOT NULL,               -- 저장된 파일명
    FILE_PATH VARCHAR(500) NOT NULL,                      -- 파일 경로
    FILE_SIZE BIGINT,                                     -- 파일 크기 (byte)
    FILE_EXT VARCHAR(10),                                 -- 파일 확장자
    MIME_TYPE VARCHAR(100),                               -- MIME 타입
    IS_THUMBNAIL CHAR(1) DEFAULT 'N' CHECK (IS_THUMBNAIL IN ('Y', 'N')), -- 썸네일 여부
    DOWNLOAD_COUNT INTEGER DEFAULT 0,                     -- 다운로드 횟수
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- 등록일
    
    CONSTRAINT FK_BOARD_FILE_POST FOREIGN KEY (POST_SEQ) 
        REFERENCES BOARD_POST(POST_SEQ) ON DELETE CASCADE
);

-- =====================================================
-- 4. 댓글 테이블 (BOARD_COMMENT) - 기존과 동일
-- =====================================================
CREATE TABLE IF NOT EXISTS BOARD_COMMENT (
    COMMENT_SEQ BIGSERIAL PRIMARY KEY,                    -- 댓글 번호
    POST_SEQ BIGINT NOT NULL,                             -- 게시글 번호
    PARENT_COMMENT_SEQ BIGINT,                            -- 부모 댓글 번호 (대댓글용)
    COMMENT_CONTENT TEXT NOT NULL,                        -- 댓글 내용
    COMMENT_DEPTH INTEGER DEFAULT 0,                      -- 댓글 깊이 (0: 댓글, 1: 대댓글)
    COMMENT_ORDER INTEGER DEFAULT 0,                      -- 댓글 순서
    
    -- 작성자 정보
    REGIST_USER_ID VARCHAR(50) NOT NULL,                 -- 작성자 ID
    REGIST_NAME VARCHAR(100),                             -- 작성자명
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- 작성일
    MODIFY_DATE TIMESTAMP,                                -- 수정일
    
    -- 상태
    USE_YN CHAR(1) DEFAULT 'Y' CHECK (USE_YN IN ('Y', 'N')),           -- 사용여부
    DELETE_YN CHAR(1) DEFAULT 'N' CHECK (DELETE_YN IN ('Y', 'N')),     -- 삭제여부
    
    CONSTRAINT FK_BOARD_COMMENT_POST FOREIGN KEY (POST_SEQ) 
        REFERENCES BOARD_POST(POST_SEQ) ON DELETE CASCADE,
    CONSTRAINT FK_BOARD_COMMENT_PARENT FOREIGN KEY (PARENT_COMMENT_SEQ) 
        REFERENCES BOARD_COMMENT(COMMENT_SEQ) ON DELETE CASCADE
);

-- =====================================================
-- 5. 샘플 데이터
-- =====================================================

-- 게시판 마스터 데이터
INSERT INTO BOARD_MASTER (
    BOARD_ID, BOARD_NAME, BOARD_DESC, BOARD_TYPE_CODE,
    COMMENT_YN, FILE_ATTACH_YN, READ_AUTH_CODE, WRITE_AUTH_CODE,
    REGIST_USER_ID
) VALUES 
('NOTICE', '공지사항', '시스템 공지사항을 게시하는 게시판', 'NOTICE', 'Y', 'Y', 'USER', 'ADMIN', 'admin'),
('ADMIN_NOTICE', '관리자공지', '관리자 전용 공지사항', 'ADMIN_NOTICE', 'N', 'Y', 'ADMIN', 'ADMIN', 'admin'),
('QNA', '문의게시판', '질문과 답변을 위한 게시판', 'QNA', 'Y', 'Y', 'USER', 'USER', 'admin'),
('FAQ', '자주묻는질문', 'FAQ 게시판', 'FAQ', 'N', 'N', 'USER', 'ADMIN', 'admin'),
('FREE', '자유게시판', '자유롭게 의견을 나누는 게시판', 'FREE', 'Y', 'Y', 'USER', 'USER', 'admin')
ON CONFLICT (BOARD_ID) DO NOTHING;

-- 게시글 샘플 데이터
INSERT INTO BOARD_POST (
    BOARD_ID, POST_CATEGORY_CODE, POST_SUBJECT, POST_CONTENTS,
    TOP_YN, COLOR_YN, REGIST_USER_ID, REGIST_NAME
) VALUES 
-- 공지사항
('NOTICE', 'SYSTEM', '시스템 점검 안내', '<p>시스템 점검으로 인한 서비스 일시 중단 안내입니다.</p>', 'Y', 'N', 'admin', '관리자'),
('NOTICE', 'ALL_NOTICE', '서비스 개선 안내', '<p>더 나은 서비스 제공을 위한 기능 개선 사항을 안내드립니다.</p>', 'N', 'N', 'admin', '관리자'),
('NOTICE', 'EVENT', '신규 기능 출시 이벤트', '<p>새로운 기능 출시를 기념하여 이벤트를 진행합니다.</p>', 'N', 'Y', 'admin', '관리자'),

-- 관리자 공지
('ADMIN_NOTICE', 'SYSTEM', '관리자 전용 공지사항', '<p>관리자 전용 공지사항입니다.</p>', 'N', 'N', 'admin', '관리자'),

-- FAQ
('FAQ', NULL, '자주 묻는 질문입니다', '<p>가장 많이 문의하시는 내용에 대한 답변입니다.</p>', 'N', 'N', 'admin', '관리자'),

-- 자유게시판
('FREE', NULL, '자유게시판 첫 번째 글', '<p>자유롭게 의견을 나누는 공간입니다.</p>', 'N', 'N', 'user01', '사용자1')

ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '올바른 게시판 테이블 구조가 생성되었습니다.';
    RAISE NOTICE '========================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '- BOARD_MASTER (게시판 설정)';
    RAISE NOTICE '- BOARD_POST (게시글 정보)';
    RAISE NOTICE '- BOARD_FILE (첨부파일)';
    RAISE NOTICE '- BOARD_COMMENT (댓글)';
    RAISE NOTICE '========================================';
END $$; 
-- 사용자 테이블 생성 (기존 권한 구조 참조)
-- 기존 데이터 유지를 위한 고도화 프로젝트
-- 서버: 211.39.158.101:3306
-- 사용자: root
-- 스키마: opensurvey

-- 데이터베이스 사용 (PostgreSQL)
-- Neon PostgreSQL에서는 스키마를 사용하지 않으므로 생략

-- =============================================
-- 1. 사용자 기본 정보 테이블
-- =============================================

-- 사용자 정보 테이블 (기존 COMTNEMPLYRINFO와 호환)
CREATE TABLE IF NOT EXISTS USER_INFO (
    USER_ID VARCHAR(20) NOT NULL,
    USER_NM VARCHAR(60) NOT NULL,
    PASSWORD VARCHAR(200) NOT NULL,
    EMAIL VARCHAR(100),
    PHONE VARCHAR(20),
    DEPT_NM VARCHAR(100),
    POSITION_NM VARCHAR(50),
    AUTHORITY_CODE VARCHAR(50) NOT NULL,
    USE_AT CHAR(1) DEFAULT 'Y',
    REGIST_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    REGIST_USER VARCHAR(20),
    UPDATE_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_USER VARCHAR(20),
    PRIMARY KEY (USER_ID)
);

-- =============================================
-- 2. 사용자-권한 매핑 테이블 (기존 구조 참조)
-- =============================================

-- 사용자 권한 매핑 테이블 제거 (USER_INFO에서 직접 권한코드 참조)

-- =============================================
-- 3. 사용자 세션/로그인 정보 테이블
-- =============================================

-- 사용자 로그인 세션 테이블
CREATE TABLE IF NOT EXISTS USER_SESSION (
    SESSION_ID VARCHAR(100) NOT NULL,
    USER_ID VARCHAR(20) NOT NULL,
    LOGIN_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LOGOUT_DATE TIMESTAMP NULL,
    IP_ADDRESS VARCHAR(45),
    USER_AGENT TEXT,
    IS_ACTIVE CHAR(1) DEFAULT 'Y',
    PRIMARY KEY (SESSION_ID),
    FOREIGN KEY (USER_ID) REFERENCES USER_INFO(USER_ID)
);

-- =============================================
-- 4. 사용자 접근 로그 테이블
-- =============================================

-- 사용자 접근 로그 테이블
CREATE TABLE IF NOT EXISTS USER_ACCESS_LOG (
    LOG_ID BIGSERIAL NOT NULL,
    USER_ID VARCHAR(20),
    ACCESS_URL VARCHAR(500),
    ACCESS_METHOD VARCHAR(10),
    IP_ADDRESS VARCHAR(45),
    USER_AGENT TEXT,
    ACCESS_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RESPONSE_TIME INT,
    STATUS_CODE INT,
    PRIMARY KEY (LOG_ID)
);

-- =============================================
-- 5. 초기 데이터 삽입
-- =============================================

-- 관리자 사용자 생성 (비밀번호: admin123)
INSERT INTO USER_INFO (USER_ID, USER_NM, PASSWORD, EMAIL, DEPT_NM, POSITION_NM, AUTHORITY_CODE, USE_AT, REGIST_USER) VALUES
('admin', '시스템관리자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@opensurvey.com', '시스템관리팀', '시스템관리자', 'SYSTEM_ADMIN', 'Y', 'SYSTEM');

-- 설문 관리자 사용자 생성 (비밀번호: survey123)
INSERT INTO USER_INFO (USER_ID, USER_NM, PASSWORD, EMAIL, DEPT_NM, POSITION_NM, AUTHORITY_CODE, USE_AT, REGIST_USER) VALUES
('survey_admin', '설문관리자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'survey@opensurvey.com', '설문관리팀', '설문관리자', 'STAFF_ADMIN', 'Y', 'SYSTEM');

-- 일반 사용자 생성 (비밀번호: user123)
INSERT INTO USER_INFO (USER_ID, USER_NM, PASSWORD, EMAIL, DEPT_NM, POSITION_NM, AUTHORITY_CODE, USE_AT, REGIST_USER) VALUES
('user', '일반사용자', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user@opensurvey.com', '일반부서', '사원', 'ADMIN', 'Y', 'SYSTEM');

-- =============================================
-- 6. 사용자 권한 매핑 데이터 (USER_INFO에 직접 포함)
-- =============================================

-- 사용자 권한은 USER_INFO 테이블의 AUTHORITY_CODE 필드에 직접 저장됨

-- =============================================
-- 7. 인덱스 생성
-- =============================================

-- 사용자 정보 인덱스
CREATE INDEX IF NOT EXISTS IDX_USER_INFO_EMAIL ON USER_INFO(EMAIL);
CREATE INDEX IF NOT EXISTS IDX_USER_INFO_USE_AT ON USER_INFO(USE_AT);
CREATE INDEX IF NOT EXISTS IDX_USER_INFO_AUTHORITY_CODE ON USER_INFO(AUTHORITY_CODE);

-- 사용자 세션 인덱스
CREATE INDEX IF NOT EXISTS IDX_USER_SESSION_USER_ID ON USER_SESSION(USER_ID);
CREATE INDEX IF NOT EXISTS IDX_USER_SESSION_ACTIVE ON USER_SESSION(IS_ACTIVE);

-- 사용자 접근 로그 인덱스
CREATE INDEX IF NOT EXISTS IDX_USER_ACCESS_LOG_USER_ID ON USER_ACCESS_LOG(USER_ID);
CREATE INDEX IF NOT EXISTS IDX_USER_ACCESS_LOG_DATE ON USER_ACCESS_LOG(ACCESS_DATE);

COMMIT; 
-- 기존 테이블 구조 수정 (컬럼 길이 확장)
-- 참조 사이트와 동일한 구조로 변경
-- 서버: 211.39.158.101:3306
-- 사용자: root
-- 스키마: opensurvey

-- 데이터베이스 사용
USE opensurvey;

-- =============================================
-- 1. 공통코드 테이블 구조 수정
-- =============================================

-- COMTCCMMNCODE 테이블의 CODE_ID 컬럼 길이 확장
ALTER TABLE COMTCCMMNCODE MODIFY COLUMN CODE_ID VARCHAR(20);

-- COMTCCMMNDETAILCODE 테이블의 CODE_ID 컬럼 길이 확장
ALTER TABLE COMTCCMMNDETAILCODE MODIFY COLUMN CODE_ID VARCHAR(20);

-- COMTCCMMNDETAILCODE 테이블의 CODE 컬럼 길이 확장
ALTER TABLE COMTCCMMNDETAILCODE MODIFY COLUMN CODE VARCHAR(50);

-- =============================================
-- 2. 기존 데이터 삭제 (새로운 구조로 재생성)
-- =============================================

-- 기존 공통코드 상세 데이터 삭제
DELETE FROM COMTCCMMNDETAILCODE;

-- 기존 공통코드 그룹 데이터 삭제
DELETE FROM COMTCCMMNCODE;

-- =============================================
-- 3. 새로운 공통코드 데이터 삽입
-- =============================================

-- 공통코드 그룹 데이터 (참조 사이트와 동일한 구조)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('SURVEY_STATUS', '설문 상태', '설문조사의 상태 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('QUESTION_TYPE', '질문 유형', '설문 질문의 유형 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('RESPONSE_TYPE', '응답 유형', '설문 응답의 유형 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', '설문 카테고리', '설문조사의 카테고리 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('ADMIN_AUTHORITY', '관리자 권한', '관리자 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('USER_AUTHORITY', '사용자 권한', '일반 사용자 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', '설문 권한', '설문조사 관련 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM');

-- 설문 상태 코드 상세
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('SURVEY_STATUS', 'DRAFT', '임시저장', '설문 작성 중', 'Y', NOW(), 'SYSTEM'),
('SURVEY_STATUS', 'PUBLISHED', '배포중', '설문 배포 중', 'Y', NOW(), 'SYSTEM'),
('SURVEY_STATUS', 'CLOSED', '종료', '설문 종료', 'Y', NOW(), 'SYSTEM'),
('SURVEY_STATUS', 'ARCHIVED', '보관', '설문 보관', 'Y', NOW(), 'SYSTEM');

-- 질문 유형 코드 상세
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('QUESTION_TYPE', 'TEXT', '주관식', '자유 텍스트 입력', 'Y', NOW(), 'SYSTEM'),
('QUESTION_TYPE', 'RADIO', '객관식(단일)', '단일 선택 객관식', 'Y', NOW(), 'SYSTEM'),
('QUESTION_TYPE', 'CHECKBOX', '객관식(복수)', '복수 선택 객관식', 'Y', NOW(), 'SYSTEM'),
('QUESTION_TYPE', 'SCALE', '척도형', '1-5점 척도', 'Y', NOW(), 'SYSTEM'),
('QUESTION_TYPE', 'DATE', '날짜', '날짜 선택', 'Y', NOW(), 'SYSTEM'),
('QUESTION_TYPE', 'FILE', '파일업로드', '파일 업로드', 'Y', NOW(), 'SYSTEM');

-- 설문 카테고리 코드 상세
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('SURVEY_CATEGORY', 'CUSTOMER_SATISFACTION', '고객만족도', '고객 만족도 조사', 'Y', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', 'MARKET_RESEARCH', '시장조사', '시장 조사', 'Y', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', 'EMPLOYEE_SATISFACTION', '직원만족도', '직원 만족도 조사', 'Y', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', 'ACADEMIC_RESEARCH', '학술조사', '학술 연구 조사', 'Y', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', 'SOCIAL_RESEARCH', '사회조사', '사회 현상 조사', 'Y', NOW(), 'SYSTEM'),
('SURVEY_CATEGORY', 'ETC', '기타', '기타 설문조사', 'Y', NOW(), 'SYSTEM');

-- 관리자 권한 상세코드 (참조 사이트와 동일)
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('ADMIN_AUTHORITY', 'SYSTEM_ADMIN', '시스템 관리자', '시스템 전체 관리 권한', 'Y', NOW(), 'SYSTEM'),
('ADMIN_AUTHORITY', 'SUPER_ADMIN', '슈퍼 관리자', '슈퍼 관리자 권한', 'Y', NOW(), 'SYSTEM'),
('ADMIN_AUTHORITY', 'STAFF_ADMIN', '직원 관리자', '직원 관리 권한', 'Y', NOW(), 'SYSTEM'),
('ADMIN_AUTHORITY', 'ADMIN', '업무 관리자', '업무 관리 권한', 'Y', NOW(), 'SYSTEM');

-- 사용자 권한 상세코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('USER_AUTHORITY', 'USER', '일반사용자', '일반 사용자 권한', 'Y', NOW(), 'SYSTEM'),
('USER_AUTHORITY', 'GUEST', '게스트', '게스트 사용자 권한', 'Y', NOW(), 'SYSTEM');

-- 설문 권한 상세코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('SURVEY_AUTHORITY', 'SURVEY_CREATE', '설문생성', '설문조사 생성 권한', 'Y', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', 'SURVEY_EDIT', '설문수정', '설문조사 수정 권한', 'Y', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', 'SURVEY_DELETE', '설문삭제', '설문조사 삭제 권한', 'Y', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', 'SURVEY_VIEW', '설문조회', '설문조사 조회 권한', 'Y', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', 'SURVEY_RESPONSE', '설문응답', '설문조사 응답 권한', 'Y', NOW(), 'SYSTEM');

COMMIT; 
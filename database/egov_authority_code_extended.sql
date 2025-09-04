-- 참조 사이트와 동일한 권한 관리 구조
-- CODE_ID 컬럼 길이 확장하여 참조 사이트 데이터 호환
-- 서버: 211.39.158.101:3306
-- 사용자: root
-- 스키마: opensurvey

-- 데이터베이스 사용
USE opensurvey;

-- =============================================
-- 1. 기존 테이블 구조 수정 (CODE_ID 길이 확장)
-- =============================================

-- COMTCCMMNCODE 테이블의 CODE_ID 컬럼 길이 확장
ALTER TABLE COMTCCMMNCODE MODIFY COLUMN CODE_ID VARCHAR(20);

-- COMTCCMMNDETAILCODE 테이블의 CODE 컬럼 길이 확장
ALTER TABLE COMTCCMMNDETAILCODE MODIFY COLUMN CODE VARCHAR(50);

-- =============================================
-- 2. 참조 사이트와 동일한 권한 관련 공통코드 그룹 추가
-- =============================================

-- 관리자 권한 그룹 (참조 사이트와 동일)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('ADMIN_AUTHORITY', '관리자 권한', '관리자 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('USER_AUTHORITY', '사용자 권한', '일반 사용자 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM'),
('SURVEY_AUTHORITY', '설문 권한', '설문조사 관련 권한 구분', 'Y', 'SYS', NOW(), 'SYSTEM');

-- =============================================
-- 3. 참조 사이트와 동일한 권한 상세코드 추가
-- =============================================

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

-- =============================================
-- 4. 사용자-권한 매핑 테이블 수정
-- =============================================

-- 기존 COMTNEMPLYRSCRTYESTBS 테이블을 공통코드 방식으로 사용
-- SCRTY_DTRMN_TRGET_ID: 사용자ID
-- AUTHOR_CODE: 공통코드의 CODE 값 (참조 사이트와 동일)

-- 관리자 사용자에게 권한 부여
INSERT INTO COMTNEMPLYRSCRTYESTBS (SCRTY_DTRMN_TRGET_ID, MBER_TY_CODE, AUTHOR_CODE) VALUES
('admin', 'USR01', 'SYSTEM_ADMIN'),
('admin', 'USR01', 'SURVEY_CREATE'),
('admin', 'USR01', 'SURVEY_EDIT'),
('admin', 'USR01', 'SURVEY_DELETE'),
('admin', 'USR01', 'SURVEY_VIEW');

-- =============================================
-- 5. 테스트용 사용자 추가
-- =============================================

-- 설문 관리자 사용자 추가 (비밀번호: survey123)
INSERT INTO COMTNEMPLYRINFO (ESNTL_ID, EMPLYR_ID, USER_NM, PASSWORD, EMAIL_ADRES, OFCPS_NM, EMPLYR_STTUS_CODE, GROUP_ID, SBSCRB_DE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('USRCNFRM_00000000002', 'survey_admin', '설문관리자', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOe6g7uK7KqQqQqQqQqQqQqQqQqQqQqQq', 'survey@opensurvey.com', '설문관리자', 'P', 'GROUP_002', '20240804', NOW(), 'SYSTEM');

-- 설문 관리자 권한 부여
INSERT INTO COMTNEMPLYRSCRTYESTBS (SCRTY_DTRMN_TRGET_ID, MBER_TY_CODE, AUTHOR_CODE) VALUES
('survey_admin', 'USR01', 'STAFF_ADMIN'),
('survey_admin', 'USR01', 'SURVEY_CREATE'),
('survey_admin', 'USR01', 'SURVEY_EDIT'),
('survey_admin', 'USR01', 'SURVEY_VIEW');

-- 일반 사용자 추가 (비밀번호: user123)
INSERT INTO COMTNEMPLYRINFO (ESNTL_ID, EMPLYR_ID, USER_NM, PASSWORD, EMAIL_ADRES, OFCPS_NM, EMPLYR_STTUS_CODE, GROUP_ID, SBSCRB_DE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('USRCNFRM_00000000003', 'user', '일반사용자', '$2a$10$9L2q/b1eL2MYNJpFEDGrwPf7h8uL8LrRrRrRrRrRrRrRrRrRrRrRrRr', 'user@opensurvey.com', '일반사용자', 'P', 'GROUP_003', '20240804', NOW(), 'SYSTEM');

-- 일반 사용자 권한 부여
INSERT INTO COMTNEMPLYRSCRTYESTBS (SCRTY_DTRMN_TRGET_ID, MBER_TY_CODE, AUTHOR_CODE) VALUES
('user', 'USR01', 'USER'),
('user', 'USR01', 'SURVEY_VIEW'),
('user', 'USR01', 'SURVEY_RESPONSE'); 
-- OpenSurvey 데이터베이스 연결 테스트
-- 서버: 211.39.158.101:3306
-- 사용자: root
-- 스키마: opensurvey

-- 데이터베이스 연결 확인
SELECT 'Database connection successful' AS status;

-- 데이터베이스 목록 확인
SHOW DATABASES;

-- opensurvey 데이터베이스 사용
USE opensurvey;

-- 테이블 목록 확인
SHOW TABLES;

-- 설문조사 테이블 구조 확인
DESCRIBE survey;

-- 질문 테이블 구조 확인
DESCRIBE question;

-- 응답 테이블 구조 확인
DESCRIBE response;

-- 응답 상세 테이블 구조 확인
DESCRIBE response_detail;

-- 전자정부 시퀀스 테이블 확인
DESCRIBE COMTECOPSEQ;

-- 샘플 데이터 확인
SELECT * FROM survey;
SELECT * FROM question;
SELECT * FROM COMTECOPSEQ; 
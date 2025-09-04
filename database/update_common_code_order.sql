-- 공통코드 테이블에 CODE_ORDER 컬럼 추가
-- 실행일: 2025-01-07

-- PostgreSQL용

-- 1. 공통코드 그룹 테이블에 CODE_ORDER 컬럼 추가
ALTER TABLE COMTCCMMNCODE 
ADD COLUMN CODE_ORDER INTEGER DEFAULT 0;

-- 2. 공통코드 상세 테이블에 CODE_ORDER 컬럼 추가
ALTER TABLE COMTCCMMNDETAILCODE 
ADD COLUMN CODE_ORDER INTEGER DEFAULT 0;

-- 기존 SORT_ORDR 컬럼이 있다면 데이터 복사 (선택사항)
UPDATE COMTCCMMNDETAILCODE 
SET CODE_ORDER = SORT_ORDR 
WHERE SORT_ORDR IS NOT NULL;

-- 기존 SORT_ORDR 컬럼 삭제 (선택사항)
-- ALTER TABLE COMTCCMMNDETAILCODE DROP COLUMN SORT_ORDR;

-- 컬럼 추가 확인
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'comtccmmncode' 
AND column_name = 'code_order';

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'comtccmmndetailcode' 
AND column_name = 'code_order'; 
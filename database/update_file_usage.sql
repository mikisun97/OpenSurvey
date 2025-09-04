-- =====================================================
-- 기존 첨부파일 FILE_CN 업데이트 스크립트
-- =====================================================

-- 1. 기존 첨부파일들을 'ATTACHMENT'로 업데이트
UPDATE COMTNFILE 
SET FILE_CN = 'ATTACHMENT' 
WHERE FILE_CN = '' OR FILE_CN IS NULL;

-- 2. 업데이트 결과 확인
SELECT 
    FILE_CN, 
    COUNT(*) as count,
    '현재 상태' as status
FROM COMTNFILE 
GROUP BY FILE_CN

UNION ALL

SELECT 
    'TOTAL' as FILE_CN, 
    COUNT(*) as count,
    '전체 파일 수' as status
FROM COMTNFILE;

-- 3. 샘플 데이터 확인
SELECT 
    ATCH_FILE_ID,
    FILE_SN,
    ORIGNL_FILE_NM,
    FILE_EXTSN,
    FILE_CN,
    FILE_SIZE
FROM COMTNFILE 
ORDER BY ATCH_FILE_ID, FILE_SN
LIMIT 10; 
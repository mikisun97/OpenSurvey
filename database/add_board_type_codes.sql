-- =====================================================
-- 게시판 타입 공통코드 추가 (전자정부 프레임워크 표준)
-- OpenSurvey Project
-- =====================================================

-- 1. 게시판 타입 상위코드 추가 (BBST)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGIST_PNTTM, FRST_REGISTER_ID) 
VALUES ('BBST', '게시판타입', '게시판 타입 관리', 'Y', 'COM', CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 2. 게시판 타입 세부코드 추가
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGIST_PNTTM, FRST_REGISTER_ID) VALUES
('BBST', 'BBST01', '일반게시판', '일반적인 게시판', 'Y', 1, CURRENT_TIMESTAMP, 'system'),
('BBST', 'BBST02', '공지게시판', '공지사항 전용 게시판', 'Y', 2, CURRENT_TIMESTAMP, 'system'),
('BBST', 'BBST03', 'FAQ게시판', '자주묻는질문 게시판', 'Y', 3, CURRENT_TIMESTAMP, 'system'),
('BBST', 'BBST04', 'QNA게시판', '질문답변 게시판', 'Y', 4, CURRENT_TIMESTAMP, 'system'),
('BBST', 'BBST05', '갤러리게시판', '이미지 중심 게시판', 'Y', 5, CURRENT_TIMESTAMP, 'system'),
('BBST', 'BBST06', '블로그게시판', '블로그 형태 게시판', 'Y', 6, CURRENT_TIMESTAMP, 'system')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 3. 추가된 데이터 확인
SELECT 'BBST' as 코드ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER 
FROM COMTCCMMNDETAILCODE WHERE CODE_ID = 'BBST' ORDER BY CODE_ORDER; 
-- =====================================================
-- 전자정부 프레임워크 표준 게시판 공통코드 생성
-- OpenSurvey Project
-- =====================================================

-- 1. 게시판 유형 상위코드 (BBST)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGISTER_ID) 
VALUES ('BBST', '게시판유형', '게시판의 유형을 구분하는 코드', 'Y', 'COM', 'SYSTEM')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 2. 게시판 유형 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('BBST', 'BBST01', '일반게시판', '기본적인 게시판 기능을 제공하는 게시판', 'Y', 1, 'SYSTEM'),
('BBST', 'BBST02', '공지게시판', '공지사항을 관리하는 전용 게시판', 'Y', 2, 'SYSTEM'),
('BBST', 'BBST03', 'FAQ게시판', '자주묻는질문과 답변을 관리하는 게시판', 'Y', 3, 'SYSTEM'),
('BBST', 'BBST04', 'QNA게시판', '질문과 답변을 관리하는 게시판', 'Y', 4, 'SYSTEM'),
('BBST', 'BBST05', '갤러리게시판', '이미지를 중심으로 관리하는 게시판', 'Y', 5, 'SYSTEM'),
('BBST', 'BBST06', '블로그게시판', '블로그 형태로 관리하는 게시판', 'Y', 6, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 3. 게시판 속성 상위코드 (BBSA)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGISTER_ID) 
VALUES ('BBSA', '게시판속성', '게시판의 속성과 동작 방식을 정의하는 코드', 'Y', 'COM', 'SYSTEM')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 4. 게시판 속성 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('BBSA', 'BBSA01', '일반속성', '기본적인 게시판 동작 방식', 'Y', 1, 'SYSTEM'),
('BBSA', 'BBSA02', '공지속성', '공지사항 중심의 동작 방식', 'Y', 2, 'SYSTEM'),
('BBSA', 'BBSA03', '자료실속성', '파일 다운로드 중심의 동작 방식', 'Y', 3, 'SYSTEM'),
('BBSA', 'BBSA04', '갤러리속성', '이미지 갤러리 중심의 동작 방식', 'Y', 4, 'SYSTEM'),
('BBSA', 'BBSA05', '커뮤니티속성', '커뮤니티 중심의 동작 방식', 'Y', 5, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 5. 게시판 상태 상위코드 (BBSSTATUS)
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGISTER_ID) 
VALUES ('BBSSTATUS', '게시판상태', '게시판의 운영 상태를 관리하는 코드', 'Y', 'COM', 'SYSTEM')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 6. 게시판 상태 세부코드
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('BBSSTATUS', 'BBSSTATUS01', '운영중', '정상적으로 운영 중인 게시판', 'Y', 1, 'SYSTEM'),
('BBSSTATUS', 'BBSSTATUS02', '점검중', '점검 중인 게시판', 'Y', 2, 'SYSTEM'),
('BBSSTATUS', 'BBSSTATUS03', '운영중단', '운영이 중단된 게시판', 'Y', 3, 'SYSTEM'),
('BBSSTATUS', 'BBSSTATUS04', '개발중', '개발 중인 게시판', 'Y', 4, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 7. 생성된 공통코드 확인
SELECT '게시판 유형' as 구분, CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER
FROM COMTCCMMNDETAILCODE 
WHERE CODE_ID = 'BBST' 
ORDER BY CODE_ORDER;

SELECT '게시판 속성' as 구분, CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER
FROM COMTCCMMNDETAILCODE 
WHERE CODE_ID = 'BBSA' 
ORDER BY CODE_ORDER;

SELECT '게시판 상태' as 구분, CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER
FROM COMTCCMMNDETAILCODE 
WHERE CODE_ID = 'BBSSTATUS' 
ORDER BY CODE_ORDER; 
-- =====================================================
-- 게시판 구분용 공통코드 생성 (Neon 데이터베이스용)
-- OpenSurvey Project
-- =====================================================

-- 1. 게시판 구분 상위코드 생성
INSERT INTO COMTCCMMNCODE (CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT, CL_CODE, FRST_REGISTER_ID) VALUES
('BBS_CATEGORY', '게시판구분', '일반 게시판용 구분 코드', 'Y', 'COM', 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ구분', 'FAQ 전용 구분 코드', 'Y', 'COM', 'SYSTEM'),
('NOTICE_CATEGORY', '공지사항구분', '공지사항 전용 구분 코드', 'Y', 'COM', 'SYSTEM'),
('DATA_CATEGORY', '자료실구분', '자료실 전용 구분 코드', 'Y', 'COM', 'SYSTEM'),
('GALLERY_CATEGORY', '갤러리구분', '갤러리 전용 구분 코드', 'Y', 'COM', 'SYSTEM')
ON CONFLICT (CODE_ID) DO NOTHING;

-- 2. 일반 게시판 구분 하위코드 생성
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('BBS_CATEGORY', 'CAT001', '시정소식', '시정 관련 소식', 'Y', 1, 'SYSTEM'),
('BBS_CATEGORY', 'CAT002', '보도자료', '보도 관련 자료', 'Y', 2, 'SYSTEM'),
('BBS_CATEGORY', 'CAT003', '채용정보', '채용 관련 정보', 'Y', 3, 'SYSTEM'),
('BBS_CATEGORY', 'CAT004', '민원신청', '민원 신청 관련', 'Y', 4, 'SYSTEM'),
('BBS_CATEGORY', 'CAT005', '정보공개', '정보 공개 관련', 'Y', 5, 'SYSTEM'),
('BBS_CATEGORY', 'CAT006', '참여', '시민 참여 관련', 'Y', 6, 'SYSTEM'),
('BBS_CATEGORY', 'CAT007', '행사', '행사 관련 정보', 'Y', 7, 'SYSTEM'),
('BBS_CATEGORY', 'CAT008', '기타', '기타 일반 정보', 'Y', 8, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 3. FAQ 구분 하위코드 생성
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('FAQ_CATEGORY', 'FAQ001', '일반', '일반적인 질문', 'Y', 1, 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ002', '기술', '기술 관련 질문', 'Y', 2, 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ003', '업무', '업무 관련 질문', 'Y', 3, 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ004', '민원', '민원 관련 질문', 'Y', 4, 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ005', '행정', '행정 관련 질문', 'Y', 5, 'SYSTEM'),
('FAQ_CATEGORY', 'FAQ006', '기타', '기타 질문', 'Y', 6, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 4. 공지사항 구분 하위코드 생성
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('NOTICE_CATEGORY', 'NOT001', '중요공지', '중요한 공지사항', 'Y', 1, 'SYSTEM'),
('NOTICE_CATEGORY', 'NOT002', '일반공지', '일반적인 공지사항', 'Y', 2, 'SYSTEM'),
('NOTICE_CATEGORY', 'NOT003', '행사공지', '행사 관련 공지사항', 'Y', 3, 'SYSTEM'),
('NOTICE_CATEGORY', 'NOT004', '채용공지', '채용 관련 공지사항', 'Y', 4, 'SYSTEM'),
('NOTICE_CATEGORY', 'NOT005', '시정공지', '시정 관련 공지사항', 'Y', 5, 'SYSTEM'),
('NOTICE_CATEGORY', 'NOT006', '긴급공지', '긴급한 공지사항', 'Y', 6, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 5. 자료실 구분 하위코드 생성
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('DATA_CATEGORY', 'DATA001', '매뉴얼', '사용자 매뉴얼', 'Y', 1, 'SYSTEM'),
('DATA_CATEGORY', 'DATA002', '양식', '다운로드 양식', 'Y', 2, 'SYSTEM'),
('DATA_CATEGORY', 'DATA003', '법규', '관련 법규', 'Y', 3, 'SYSTEM'),
('DATA_CATEGORY', 'DATA004', '정책', '정책 자료', 'Y', 4, 'SYSTEM'),
('DATA_CATEGORY', 'DATA005', '보고서', '각종 보고서', 'Y', 5, 'SYSTEM'),
('DATA_CATEGORY', 'DATA006', '기타자료', '기타 자료', 'Y', 6, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 6. 갤러리 구분 하위코드 생성
INSERT INTO COMTCCMMNDETAILCODE (CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER, FRST_REGISTER_ID) VALUES
('GALLERY_CATEGORY', 'GAL001', '행사사진', '행사 관련 사진', 'Y', 1, 'SYSTEM'),
('GALLERY_CATEGORY', 'GAL002', '시설사진', '시설 관련 사진', 'Y', 2, 'SYSTEM'),
('GALLERY_CATEGORY', 'GAL003', '작품사진', '시민 작품 사진', 'Y', 3, 'SYSTEM'),
('GALLERY_CATEGORY', 'GAL004', '풍경사진', '지역 풍경 사진', 'Y', 4, 'SYSTEM'),
('GALLERY_CATEGORY', 'GAL005', '기념사진', '기념 관련 사진', 'Y', 5, 'SYSTEM'),
('GALLERY_CATEGORY', 'GAL006', '기타사진', '기타 사진', 'Y', 6, 'SYSTEM')
ON CONFLICT (CODE_ID, CODE) DO NOTHING;

-- 7. 생성된 공통코드 확인
SELECT '상위코드' as 구분, CODE_ID, CODE_ID_NM, CODE_ID_DC, USE_AT
FROM COMTCCMMNCODE 
WHERE CODE_ID LIKE '%CATEGORY%' 
ORDER BY CODE_ID;

-- 8. 생성된 상세코드 확인
SELECT '하위코드' as 구분, CODE_ID, CODE, CODE_NM, CODE_DC, USE_AT, CODE_ORDER
FROM COMTCCMMNDETAILCODE 
WHERE CODE_ID LIKE '%CATEGORY%' 
ORDER BY CODE_ID, CODE_ORDER;

-- 9. 전체 통계 확인
SELECT 
    '전체 통계' as 구분,
    COUNT(DISTINCT c.CODE_ID) as 상위코드수,
    COUNT(d.CODE) as 하위코드수
FROM COMTCCMMNCODE c
LEFT JOIN COMTCCMMNDETAILCODE d ON c.CODE_ID = d.CODE_ID
WHERE c.CODE_ID LIKE '%CATEGORY%'; 
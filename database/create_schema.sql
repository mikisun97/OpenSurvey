-- OpenSurvey 데이터베이스 스키마 생성
-- 서버: 211.39.158.101:3306
-- 사용자: root
-- 스키마: opensurvey

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS opensurvey 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 사용
USE opensurvey;

-- 설문조사 테이블
CREATE TABLE IF NOT EXISTS survey (
    survey_id VARCHAR(50) NOT NULL COMMENT '설문 ID',
    title VARCHAR(200) NOT NULL COMMENT '설문 제목',
    description TEXT COMMENT '설문 설명',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '설문 상태 (DRAFT, PUBLISHED, CLOSED)',
    start_date DATETIME COMMENT '시작일시',
    end_date DATETIME COMMENT '종료일시',
    anonymous BOOLEAN NOT NULL DEFAULT TRUE COMMENT '익명 여부',
    allow_duplicate BOOLEAN NOT NULL DEFAULT FALSE COMMENT '중복 응답 허용 여부',
    max_responses INT DEFAULT 1000 COMMENT '최대 응답 수',
    regist_id VARCHAR(50) COMMENT '등록자 ID',
    regist_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    update_id VARCHAR(50) COMMENT '수정자 ID',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (survey_id),
    INDEX idx_status (status),
    INDEX idx_regist_date (regist_date),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='설문조사 테이블';

-- 질문 테이블
CREATE TABLE IF NOT EXISTS question (
    question_id VARCHAR(50) NOT NULL COMMENT '질문 ID',
    survey_id VARCHAR(50) NOT NULL COMMENT '설문 ID',
    question_text TEXT NOT NULL COMMENT '질문 내용',
    question_type VARCHAR(20) NOT NULL COMMENT '질문 유형 (TEXT, RADIO, CHECKBOX, SCALE)',
    required BOOLEAN NOT NULL DEFAULT FALSE COMMENT '필수 여부',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '정렬 순서',
    options TEXT COMMENT '선택지 (JSON 형태)',
    min_value INT COMMENT '최소값 (척도형)',
    max_value INT COMMENT '최대값 (척도형)',
    regist_id VARCHAR(50) COMMENT '등록자 ID',
    regist_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    update_id VARCHAR(50) COMMENT '수정자 ID',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (question_id),
    FOREIGN KEY (survey_id) REFERENCES survey(survey_id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='질문 테이블';

-- 응답 테이블
CREATE TABLE IF NOT EXISTS response (
    response_id VARCHAR(50) NOT NULL COMMENT '응답 ID',
    survey_id VARCHAR(50) NOT NULL COMMENT '설문 ID',
    respondent_id VARCHAR(50) COMMENT '응답자 ID (익명인 경우 NULL)',
    respondent_name VARCHAR(100) COMMENT '응답자 이름',
    respondent_email VARCHAR(200) COMMENT '응답자 이메일',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    user_agent TEXT COMMENT '사용자 에이전트',
    regist_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '응답일시',
    deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (response_id),
    FOREIGN KEY (survey_id) REFERENCES survey(survey_id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id),
    INDEX idx_regist_date (regist_date),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='응답 테이블';

-- 응답 상세 테이블
CREATE TABLE IF NOT EXISTS response_detail (
    response_detail_id VARCHAR(50) NOT NULL COMMENT '응답 상세 ID',
    response_id VARCHAR(50) NOT NULL COMMENT '응답 ID',
    question_id VARCHAR(50) NOT NULL COMMENT '질문 ID',
    answer_text TEXT COMMENT '답변 내용',
    answer_value VARCHAR(500) COMMENT '답변 값',
    regist_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    PRIMARY KEY (response_detail_id),
    FOREIGN KEY (response_id) REFERENCES response(response_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    INDEX idx_response_id (response_id),
    INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='응답 상세 테이블';

-- 전자정부 프레임워크 공통 시퀀스 테이블
CREATE TABLE IF NOT EXISTS COMTECOPSEQ (
    TABLE_NAME VARCHAR(20) NOT NULL COMMENT '테이블명',
    NEXT_ID DECIMAL(30,0) NOT NULL COMMENT '다음 ID',
    PRIMARY KEY (TABLE_NAME)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='전자정부 프레임워크 시퀀스 테이블';

-- 시퀀스 초기 데이터
INSERT INTO COMTECOPSEQ (TABLE_NAME, NEXT_ID) VALUES 
('SURVEY_ID', 1),
('QUESTION_ID', 1),
('RESPONSE_ID', 1),
('RESPONSE_DETAIL_ID', 1)
ON DUPLICATE KEY UPDATE NEXT_ID = NEXT_ID;

-- 샘플 설문조사 데이터
INSERT INTO survey (survey_id, title, description, status, start_date, end_date, anonymous, allow_duplicate, max_responses, regist_id) VALUES
('SURVEY_001', '고객 만족도 조사', '서비스 이용 경험에 대한 고객 만족도를 조사합니다.', 'PUBLISHED', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, FALSE, 1000, 'admin');

-- 샘플 질문 데이터
INSERT INTO question (question_id, survey_id, question_text, question_type, required, sort_order, options) VALUES
('Q_001', 'SURVEY_001', '전반적인 서비스 만족도는 어떠신가요?', 'SCALE', TRUE, 1, '{"min": 1, "max": 5, "labels": {"1": "매우 불만족", "2": "불만족", "3": "보통", "4": "만족", "5": "매우 만족"}}'),
('Q_002', 'SURVEY_001', '서비스 개선을 위한 의견을 자유롭게 작성해주세요.', 'TEXT', FALSE, 2, NULL),
('Q_003', 'SURVEY_001', '가장 만족스러운 서비스는 무엇인가요? (복수 선택 가능)', 'CHECKBOX', FALSE, 3, '["웹사이트", "모바일 앱", "고객센터", "배송 서비스", "결제 시스템"]');

COMMIT; 
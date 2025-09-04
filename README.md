# OpenSurvey 🏛️

전자정부 프레임워크 기반 설문조사 시스템

## 📋 프로젝트 개요

OpenSurvey는 전자정부 프레임워크를 기반으로 구축된 현대적인 설문조사 관리 시스템입니다. Spring Boot 백엔드와 Next.js 프론트엔드로 구성되어 있으며, 게시판 관리, 설문 관리, 사용자 관리 등의 기능을 제공합니다.

## 🏗️ 프로젝트 구조

```
OpenSurvey/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/       # Next.js App Router
│   │   ├── components/ # 재사용 가능한 컴포넌트
│   │   ├── hooks/     # 커스텀 훅
│   │   ├── lib/       # 유틸리티 함수
│   │   └── types/     # TypeScript 타입 정의
│   ├── public/        # 정적 파일
│   └── package.json
├── backend/           # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/java/egovframework/
│   │   └── main/resources/
│   └── pom.xml
├── database/          # DB 스크립트
└── README.md
```

## 🚀 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - UI 컴포넌트 라이브러리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **React Query** - 서버 상태 관리

### Backend
- **Spring Boot 2.7** - Java 프레임워크
- **전자정부 프레임워크** - 표준 프레임워크
- **MyBatis** - ORM
- **Spring Security** - 인증/인가
- **Swagger** - API 문서화
- **PostgreSQL/MySQL** - 데이터베이스

## 🛠️ 개발 환경 설정

### 1. Frontend 설정

```bash
cd frontend
npm install
npm run dev
```

**접속 주소**: http://localhost:3000

### 2. Backend 설정

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**접속 주소**: http://localhost:8080

### 3. 데이터베이스 설정

`database/` 폴더의 SQL 스크립트를 실행하여 데이터베이스를 설정합니다.

## 📱 주요 기능

### 관리자 기능
- **게시판 관리**: 게시판 생성/수정/삭제
- **게시물 관리**: 게시물 CRUD, 파일 업로드
- **공통코드 관리**: 시스템 코드 관리
- **사용자 관리**: 사용자 계정 관리
- **설문 관리**: 설문 생성/관리

### 사용자 기능
- **게시물 조회**: 공지사항, 카드뉴스 등
- **설문 참여**: 다양한 설문 참여
- **댓글 기능**: 게시물에 댓글 작성

## 🚀 배포

### Frontend (Vercel)
```bash
# Vercel 배포
vercel --prod
```

### Backend (Render)
```bash
# Render에서 자동 배포
# Root Directory: backend
# Build Command: mvn clean package -DskipTests
# Start Command: java -jar target/*.jar
```

## 🔧 환경 변수 설정

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Backend (application.properties)
```properties
# 데이터베이스 설정
spring.datasource.url=jdbc:postgresql://localhost:5432/opensurvey
spring.datasource.username=your_username
spring.datasource.password=your_password

# 파일 업로드 설정
file.upload-dir=/uploads
file.max-size=10MB
```

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issue를 등록해주세요.

---

© 2024 OpenSurvey. 전자정부 프레임워크 기반 설문조사 시스템

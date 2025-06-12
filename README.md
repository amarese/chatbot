# Simple Chatbot Project

## 프로젝트 개요

이 프로젝트는 WebSocket 기반의 간단한 챗봇 시스템입니다. 프론트엔드, 백엔드, API, 데이터베이스(MongoDB)로 구성되어 있으며, 개발 환경은 Docker Compose와 Tilt로 손쉽게 실행할 수 있습니다.

---

## 전체 구조

```
chatbot/
├── frontend/         # React 기반 채팅 UI (WebSocket 사용)
│   ├── public/       # 정적 파일 (index.html 등)
│   ├── src/          # 프론트엔드 소스 코드
│   │   ├── components/   # Chat, Message 컴포넌트
│   │   ├── App.tsx       # 메인 App 컴포넌트
│   │   ├── index.tsx     # React 진입점
│   │   └── types.ts      # 타입 정의
│   ├── package.json      # 프론트엔드 의존성
│   ├── tsconfig.json     # TypeScript 설정
│   └── Dockerfile        # 프론트엔드 컨테이너 빌드
│
├── backend/          # Node.js + TypeScript 백엔드 (WebSocket 서버)
│   ├── src/
│   │   ├── db.ts         # MongoDB 연결 및 모델
│   │   ├── websocket.ts  # WebSocket 서버 구현
│   │   └── server.ts     # Express 서버 및 WebSocket 통합
│   ├── package.json      # 백엔드 의존성
│   └── Dockerfile        # 백엔드 컨테이너 빌드
│
├── api/              # 단어 단위로 스트리밍하는 echo API 서버
│   ├── src/
│   │   └── server.ts     # 스트리밍 에코 API 구현
│   ├── package.json      # API 서버 의존성
│   └── Dockerfile        # API 서버 컨테이너 빌드
│
├── docker-compose.yml    # 전체 서비스 오케스트레이션
├── Tiltfile              # Tilt 개발 환경 설정
└── README.md             # 프로젝트 설명
```

---

## 각 모듈 설명

### 1. frontend (React)
- WebSocket을 통해 실시간 채팅
- 사용자 메시지는 오른쪽, 챗봇 메시지는 왼쪽에 표시
- 최초 접속 시 uid 발급 및 localStorage 저장
- 이전 대화 내역은 REST API로 불러옴

### 2. backend (Node.js + TypeScript)
- WebSocket 서버로 채팅 메시지 중계
- MongoDB에 대화 내역 저장
- API 서버에 메시지 전달 및 스트리밍 응답을 WebSocket으로 전달
- 웹소켓이 끊겨도 대화 내역은 안전하게 저장

### 3. api (Node.js + TypeScript)
- /echo 엔드포인트에서 메시지를 단어 단위로 0.1초마다 스트리밍
- 실제 챗봇 대신 mocking 용도로 사용

### 4. mongodb
- 대화 내역 저장용 데이터베이스
- 개발용으로는 메모리 서버(mongodb-memory-server)도 사용 가능

---

## 개발 및 실행 방법

### 1. 의존성 설치
각 서비스 디렉토리에서 다음 명령어 실행:
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하여 MongoDB 및 API 주소를 지정합니다. 예시:
```
MONGODB_URI=mongodb://mongodb:27017/chatbot
API_URL=http://api:3001
```

### 3. Tilt로 전체 서비스 실행
루트 디렉토리에서:
```bash
tilt up
```
Tilt 대시보드에서 각 서비스의 상태를 확인할 수 있습니다.

### 4. 또는 Docker Compose로 실행
```bash
docker-compose up --build
```

---

## 기타 참고사항
- 프론트엔드 개발 시 코드 변경 사항이 컨테이너에 실시간 반영됩니다.
- MongoDB는 기본적으로 도커 컨테이너로 실행되며, 외부 DB로 쉽게 교체할 수 있습니다.
- 각 서비스는 독립적으로 개발 및 테스트가 가능합니다.

---

## 문의
추가 문의나 개선 요청은 이슈로 등록해 주세요. 
# ✅ API 설계

### 📌 서버 구성 요약

| 서버             | 주요 역할                        |
|----------------|------------------------------|
| Gateway Server | 인증/인가 처리 및 API 라우팅           |
| Auth Server    | 회원가입, 로그인, 역할 관리, JWT 발급     |
| Event Server   | 이벤트, 보상 등록 및 요청 처리, 지급 이력 관리 |

---

## API 설계

---
### 🔐 Auth Server

| 기능       | 메서드     | 경로                     | 설명              | 사용 가능 Role                     |
| -------- | ------- | ---------------------- | --------------- | ------------------------------ |
| 회원가입     | `POST`  | `/auth/register`       | 신규 유저 가입        | 누구나 (비로그인 상태 포함)               |
| 로그인      | `POST`  | `/auth/login`          | JWT 발급          | 누구나 (비로그인 상태 포함)               |
| 내 정보 조회  | `GET`   | `/auth/me`             | JWT 기반 유저 정보 조회 | USER, OPERATOR, AUDITOR, ADMIN |
| 유저 역할 수정 | `PATCH` | `/auth/users/:id/role` | 유저의 Role 변경     | ADMIN만 가능                      |

### 🎯 Event Server

#### 📁 이벤트 관련

| 기능        | 메서드     | 경로            | 설명                 | 사용 가능 Role                     |
| --------- | ------- | ------------- | ------------------ | ------------------------------ |
| 이벤트 등록    | `POST`  | `/events`     | 새로운 이벤트 등록         | OPERATOR, ADMIN                |
| 이벤트 목록 조회 | `GET`   | `/events`     | 전체 이벤트 목록 + 필터링 지원 | USER, OPERATOR, AUDITOR, ADMIN |
| 이벤트 상세 조회 | `GET`   | `/events/:id` | 특정 이벤트 상세 조회       | USER, OPERATOR, AUDITOR, ADMIN |
| 이벤트 수정    | `PATCH` | `/events/:id` | 조건, 기간, 상태 수정      | OPERATOR, ADMIN                |

---

#### 🎁 보상 관련
| 기능       | 메서드    | 경로                         | 설명                | 사용 가능 Role                     |
| -------- | ------ | -------------------------- | ----------------- | ------------------------------ |
| 보상 등록    | `POST` | `/events/:eventId/rewards` | 특정 이벤트에 보상 등록     | OPERATOR, ADMIN                |
| 보상 목록 조회 | `GET`  | `/events/:eventId/rewards` | 이벤트에 연결된 보상 목록 조회 | USER, OPERATOR, AUDITOR, ADMIN |


---

#### 🙋 보상 요청 관련

| 기능            | 메서드    | 경로                                          | 설명                      | 사용 가능 Role      |
| ------------- | ------ | ------------------------------------------- | ----------------------- | --------------- |
| 보상 요청         | `POST` | `/events/:eventId/rewards/request`          | 유저가 이벤트 보상 요청           | USER만 가능        |
| 내 보상 요청 이력 조회 | `GET`  | `/rewards/me?eventId=&status=`              | 본인 보상 요청 이력 필터링 조회      | USER만 가능        |
| 전체 요청 목록 조회   | `GET`  | `/rewards?userId=&eventId=&status=`         | 전체 유저의 보상 요청 이력 필터링 조회  | OPERATOR, ADMIN |
| 감사용 지급 이력 조회  | `GET`  | `/rewards/history?userId=&eventId=&status=` | 감사자 전용 보상 이력 조회 (읽기 전용) | AUDITOR, ADMIN  |



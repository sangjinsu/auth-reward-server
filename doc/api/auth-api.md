## 🔐 Auth 서버 API 상세 설명

---

### 1. 🔐 회원가입

#### 1) API 정보

* **메서드**: `POST`
* **경로**: `/auth/register`
* **설명**: 새로운 유저를 회원가입시킵니다.
* **접근 권한**: 누구나 (비로그인 포함)

#### 2) 바디 파라미터

| 필드         | 타입     | 설명                     |
| ---------- | ------ | ---------------------- |
| `email`    | string | 이메일 (ID로 사용)           |
| `password` | string | 비밀번호                   |
| `role`     | string | 초기 역할 (선택, 기본: `USER`) |

#### 3) 예시 요청

```http
POST /auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securepass123",
  "role": "USER"
}
```

---

### 2. 🔐 로그인

#### 1) API 정보

* **메서드**: `POST`
* **경로**: `/auth/login`
* **설명**: 로그인 후 JWT 토큰을 발급받습니다.
* **접근 권한**: 누구나 (비로그인 포함)

#### 2) 바디 파라미터

| 필드         | 타입     | 설명           |
| ---------- | ------ | ------------ |
| `email`    | string | 가입 시 입력한 이메일 |
| `password` | string | 비밀번호         |

#### 3) 예시 요청

```http
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securepass123"
}
```

---

### 3. 🙋 내 정보 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/auth/me`
* **설명**: JWT 토큰 기반으로 로그인된 유저의 정보를 조회합니다.
* **접근 권한**: USER, OPERATOR, AUDITOR, ADMIN

#### 2) 헤더

* `Authorization: Bearer <JWT_TOKEN>`

#### 3) 예시 요청

```http
GET /auth/me
Authorization: Bearer eyJhbGciOi...
```

---

### 4. 🛡 유저 역할 변경

#### 1) API 정보

* **메서드**: `PATCH`
* **경로**: `/auth/users/:id/role`
* **설명**: 특정 유저의 역할(Role)을 변경합니다.
* **접근 권한**: ADMIN

#### 2) 경로 파라미터

| 파라미터 | 타입     | 설명    |
| ---- | ------ | ----- |
| `id` | string | 유저 ID |

#### 3) 바디 파라미터

| 필드     | 타입     | 설명                                         |
| ------ | ------ | ------------------------------------------ |
| `role` | string | 변경할 역할 (예: `OPERATOR`, `AUDITOR`, `ADMIN`) |

#### 4) 예시 요청

```http
PATCH /auth/users/abc123/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "OPERATOR"
}
```

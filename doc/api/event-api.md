## 🎯 Event 서버 API 상세 설명

---

### 1. 📁 이벤트 등록

#### 1) API 정보

* **메서드**: `POST`
* **경로**: `/events`
* **설명**: 새로운 이벤트를 등록합니다. 조건, 기간, 상태 포함
* **접근 권한**: `OPERATOR`, `ADMIN`

#### 2) 바디 파라미터 (JSON)

| 필드          | 타입     | 설명                      |
| ----------- | ------ | ----------------------- |
| `title`     | string | 이벤트 이름                  |
| `condition` | object | 이벤트 조건 정의               |
| `startDate` | string | 이벤트 시작일 (ISO-8601)      |
| `endDate`   | string | 이벤트 종료일 (ISO-8601)      |
| `status`    | string | `Active` 또는 `NonActive` |

#### 3) 예시 요청

```http
POST /events
Content-Type: application/json

{
  "title": "7일 연속 출석 이벤트",
  "condition": { "type": "attendance", "days": 7 },
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "status": "Active"
}
```

---

### 2. 📁 이벤트 목록 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/events`
* **설명**: 조건에 맞는 이벤트 목록을 조회합니다.
* **접근 권한**: `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`

#### 2) 쿼리 파라미터

| 파라미터        | 타입     | 설명                      |
| ----------- | ------ | ----------------------- |
| `userId`    | string | 해당 유저가 참여 가능한 이벤트 필터    |
| `eventId`   | string | 특정 이벤트 ID 필터링           |
| `status`    | string | `Active` 또는 `NonActive` |
| `startDate` | string | 시작일 이후 필터 (ISO-8601)    |
| `endDate`   | string | 종료일 이전 필터 (ISO-8601)    |

#### 3) 예시 요청

```http
GET /events?status=Active&startDate=2024-06-01&endDate=2024-06-30&userId=abc123
```

---

### 3. 📁 이벤트 상세 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/events/:id`
* **설명**: 특정 이벤트의 상세 정보를 조회합니다.
* **접근 권한**: `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`

#### 2) 경로 파라미터

| 파라미터 | 타입     | 설명     |
| ---- | ------ | ------ |
| `id` | string | 이벤트 ID |

#### 3) 예시 요청

```http
GET /events/evt123456
```

---

### 4. 📁 이벤트 수정

#### 1) API 정보

* **메서드**: `PATCH`
* **경로**: `/events/:id`
* **설명**: 이벤트 기간, 상태, 조건 등을 수정합니다.
* **접근 권한**: `OPERATOR`, `ADMIN`

#### 2) 경로 파라미터

| 파라미터 | 타입     | 설명     |
| ---- | ------ | ------ |
| `id` | string | 이벤트 ID |

#### 3) 바디 파라미터 (변경할 항목만)

| 필드          | 타입     | 설명                            |
| ----------- | ------ | ----------------------------- |
| `condition` | object | 새로운 조건 (선택적)                  |
| `startDate` | string | 새로운 시작일 (선택적)                 |
| `endDate`   | string | 새로운 종료일 (선택적)                 |
| `status`    | string | `Active` 또는 `NonActive` (선택적) |

#### 4) 예시 요청

```http
PATCH /events/evt123456
Content-Type: application/json

{
  "endDate": "2024-07-15",
  "status": "NonActive"
}
```

좋습니다! 이어서 **Event 서버의 보상 및 보상 요청 관련 API**를 요청하신 형식대로 정리해드리겠습니다.

---

## 🎁 보상 관련 API

---

### 5. 🎁 보상 등록

#### 1) API 정보

* **메서드**: `POST`
* **경로**: `/events/:eventId/rewards`
* **설명**: 특정 이벤트에 보상을 등록합니다.
* **접근 권한**: `OPERATOR`, `ADMIN`

#### 2) 경로 파라미터

| 파라미터      | 타입     | 설명     |
| --------- | ------ | ------ |
| `eventId` | string | 이벤트 ID |

#### 3) 바디 파라미터 (JSON)

| 필드         | 타입     | 설명                                  |
| ---------- | ------ | ----------------------------------- |
| `type`     | string | 보상 유형 (`item`, `point`, `coupon` 등) |
| `quantity` | number | 보상 수량                               |
| `metadata` | object | 아이템명, 코드 등 보상 상세 (선택)               |

#### 4) 예시 요청

```http
POST /events/evt123/rewards
Content-Type: application/json

{
  "type": "item",
  "quantity": 1,
  "metadata": {
    "name": "고급 강화 주문서",
    "code": "item_001"
  }
}
```

---

### 6. 🎁 보상 목록 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/events/:eventId/rewards`
* **설명**: 이벤트에 등록된 보상 목록을 조회합니다.
* **접근 권한**: `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`

#### 2) 경로 파라미터

| 파라미터      | 타입     | 설명     |
| --------- | ------ | ------ |
| `eventId` | string | 이벤트 ID |

#### 3) 예시 요청

```http
GET /events/evt123/rewards
```

---

## 🙋 보상 요청 관련 API

---

### 7. 🙋 보상 요청

#### 1) API 정보

* **메서드**: `POST`
* **경로**: `/events/:eventId/rewards/request`
* **설명**: 유저가 이벤트에 대해 보상을 요청합니다. 조건 충족 여부 검증 후 결과 저장.
* **접근 권한**: `USER`

#### 2) 경로 파라미터

| 파라미터      | 타입     | 설명     |
| --------- | ------ | ------ |
| `eventId` | string | 이벤트 ID |

#### 3) 예시 요청

```http
POST /events/evt123/rewards/request
Authorization: Bearer <token>
```

※ 바디 없음 (인증된 유저 + 이벤트 ID만 필요)

---

### 8. 🙋 내 보상 요청 이력 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/rewards/me`
* **설명**: 로그인한 유저 본인의 요청 이력을 필터링 포함해 조회합니다.
* **접근 권한**: `USER`

#### 2) 쿼리 파라미터

| 파라미터      | 타입     | 설명                                           |
| --------- | ------ | -------------------------------------------- |
| `eventId` | string | 특정 이벤트 필터링                                   |
| `status`  | string | `PENDING`, `SUCCESS`, `FAILED`, `REJECTED` 등 |

#### 3) 예시 요청

```http
GET /rewards/me?eventId=evt123&status=SUCCESS
Authorization: Bearer <token>
```

---

### 9. 🙋 전체 요청 목록 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/rewards`
* **설명**: 모든 유저의 보상 요청 이력을 조회합니다 (필터링 포함).
* **접근 권한**: `OPERATOR`, `ADMIN`

#### 2) 쿼리 파라미터

| 파라미터      | 타입     | 설명            |
| --------- | ------ | ------------- |
| `userId`  | string | 특정 유저의 요청만 조회 |
| `eventId` | string | 특정 이벤트 요청만 조회 |
| `status`  | string | 요청 상태별 조회     |

#### 3) 예시 요청

```http
GET /rewards?userId=abc123&eventId=evt123&status=FAILED
```

---

### 10. 🔍 감사자 전용 지급 이력 조회

#### 1) API 정보

* **메서드**: `GET`
* **경로**: `/rewards/history`
* **설명**: 감사자 전용 보상 지급 내역 열람 (읽기 전용)
* **접근 권한**: `AUDITOR`, `ADMIN`

#### 2) 쿼리 파라미터: `/rewards/history?userId=&eventId=&status=`

#### 3) 예시 요청

```http
GET /rewards/history?eventId=evt123&status=SUCCESS
```

---

# MongoDB 스키마

## 🧑‍💼 User

```text
User {
  _id: ObjectId
  email: string
  password: string
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}
```

---

## 📣 Event
```text
Event {
  _id: ObjectId
  type : number            // 고유 숫자 ID (예: 1, 2, 3)
  title: string
  condition: {
    type: string       // 예: 'attendance'
    params: object     // 예: { days: 7 }
  }
  startDate: Date
  endDate: Date
  status: 'Active' | 'NonActive'
  createdBy: ObjectId   // User._id (운영자)
  createdAt: Date
  updatedAt: Date
}
```
---
## 🏷 RewardType

```text
RewardType {
  _id: ObjectId
  type: number              // 고유 숫자 ID (예: 1, 2, 3)
  name: string              // 예: '포인트'
  description?: string
  metadataSchema?: object
  createdAt: Date
  updatedAt: Date
}
```

✅ 인덱스

```ts
RewardTypeSchema.index({ type: 1 }, { unique: true })
```

---

## 🎁 Reward

```text
Reward {
  _id: ObjectId
  eventId: ObjectId         // Event._id
  rewardType: number        // RewardType.type
  quantity: number
  metadata: {
    name?: string
    code?: string
  }
  createdAt: Date
  updatedAt: Date
}
```

---

## 🧾 RewardRequest

```text
RewardRequest {
  _id: ObjectId
  userId: ObjectId               // 요청자 (User)
  eventId: ObjectId              // 요청 대상 이벤트
  rewardIds: ObjectId[]          // 실제 지급된 Reward 목록
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED'
  failureReason?: string
  requestedAt: Date
  evaluatedAt?: Date
}
```
✅ 중복 요청 방지 인덱스

```ts
RewardRequestSchema.index({ userId: 1, eventId: 1 }, { unique: true })
```


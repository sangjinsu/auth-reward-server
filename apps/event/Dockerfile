# Stage 1: 빌드
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:event

# Stage 2: 실행 전용
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
COPY .env .env
CMD ["node", "dist/apps/event/main.js"]
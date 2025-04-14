# Stage 1: Сборка приложения
FROM node:18-alpine AS builder
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь исходный код и собираем приложение
COPY . .
RUN npm run build

# Stage 2: Продакшен-образ
FROM node:18-alpine
WORKDIR /app

# Копируем файлы package.json для установки production-зависимостей
COPY package*.json ./

# Копируем собранное приложение из первого этапа
COPY --from=builder /app/dist ./dist

# Устанавливаем только production зависимости
RUN npm install --only=production

# Если требуется использовать переменные окружения, они будут переданы через docker run
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main.js"]

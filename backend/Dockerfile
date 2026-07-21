FROM mcr.microsoft.com/playwright:v1.61.1-jammy

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install --omit=dev

COPY backend backend
COPY frontend frontend

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]

// Конфигурация переменных окружения
// Скопируйте этот файл в .env.local и настройте под ваши нужды

module.exports = {
  // Next.js Application
  NEXT_PUBLIC_APP_NAME: "Компьютерный класс",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",

  // WebSocket Server
  NEXT_PUBLIC_WS_URL: "http://localhost:3003",
  WS_SERVER_PORT: 3003,

  // Telegram Bot
  TELEGRAM_BOT_TOKEN: "8306314985:AAEe9DmmVGqpXSk_uhiPA1YA8u2ysYu9usY",
  TELEGRAM_BOT_PORT: 3002,
  TELEGRAM_WEBHOOK_URL: "https://sokral-design.ru/webhook",
  TELEGRAM_FRONTEND_URL: "https://sokral-design.ru",

  // Database (для будущего расширения)
  DATABASE_URL: "sqlite:./database.db",

  // Admin Configuration
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "admin123",

  // Security
  JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production",
  SESSION_SECRET: "your-super-secret-session-key-change-this-in-production",

  // Development
  NODE_ENV: "development",
  DEBUG: "true"
};

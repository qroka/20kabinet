#!/bin/bash

# Скрипт для деплоя на сервер
# Использование: ./deploy.sh

echo "🚀 Начинаем деплой системы компьютерного класса..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корневой директории проекта."
    exit 1
fi

# Останавливаем PM2 процессы
echo "⏹️ Останавливаем старые процессы..."
pm2 stop ecosystem.config.js 2>/dev/null || true
pm2 delete ecosystem.config.js 2>/dev/null || true

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --production
cd server && npm install --production && cd ..
cd telegram-bot && npm install --production && cd ..

# Собираем приложение
echo "🔨 Собираем приложение..."
npm run build

# Запускаем процессы через PM2
echo "▶️ Запускаем процессы..."
pm2 start ecosystem.config.js

# Сохраняем конфигурацию PM2
pm2 save
pm2 startup

echo "✅ Деплой завершен!"
echo "📊 Статус процессов:"
pm2 status

echo "🌐 Приложение доступно по адресу: https://sokral-design.ru"
echo "🔧 Управление: pm2 status, pm2 restart, pm2 logs"

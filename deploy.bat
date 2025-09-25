@echo off
echo 🚀 Начинаем деплой системы компьютерного класса...

REM Проверяем, что мы в правильной директории
if not exist "package.json" (
    echo ❌ Ошибка: package.json не найден. Запустите скрипт из корневой директории проекта.
    pause
    exit /b 1
)

REM Останавливаем PM2 процессы
echo ⏹️ Останавливаем старые процессы...
pm2 stop ecosystem.config.js 2>nul
pm2 delete ecosystem.config.js 2>nul

REM Устанавливаем зависимости
echo 📦 Устанавливаем зависимости...
call npm install --production
cd server
call npm install --production
cd ..
cd telegram-bot
call npm install --production
cd ..

REM Собираем приложение
echo 🔨 Собираем приложение...
call npm run build

REM Запускаем процессы через PM2
echo ▶️ Запускаем процессы...
pm2 start ecosystem.config.js

REM Сохраняем конфигурацию PM2
pm2 save

echo ✅ Деплой завершен!
echo 📊 Статус процессов:
pm2 status

echo 🌐 Приложение доступно по адресу: https://sokral-design.ru
echo 🔧 Управление: pm2 status, pm2 restart, pm2 logs
pause

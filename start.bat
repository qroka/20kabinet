@echo off
echo 🚀 Запуск системы компьютерного класса...
echo.

echo 📦 Проверка зависимостей...
call npm install

echo.
echo 🔧 Установка зависимостей для сервера...
cd server
call npm install
cd ..

echo.
echo 🤖 Установка зависимостей для Telegram бота...
cd telegram-bot
call npm install
cd ..

echo.
echo ✅ Все зависимости установлены!
echo.
echo 🎯 Запуск всех сервисов...
echo.
echo Откройте 3 терминала и выполните:
echo Терминал 1: npm run dev
echo Терминал 2: npm run server  
echo Терминал 3: npm run telegram
echo.
echo 🌐 Приложение будет доступно по адресу: http://localhost:3000
echo.
pause

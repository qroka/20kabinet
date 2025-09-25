@echo off
echo 🚀 Запуск системы компьютерного класса для разработки...
echo.

echo 📦 Установка зависимостей...
call npm install
cd server
call npm install
cd ..
cd telegram-bot
call npm install
cd ..

echo.
echo 🔧 Запуск в режиме разработки...
echo.
echo Откройте 3 терминала и выполните:
echo.
echo Терминал 1: npm run dev
echo Терминал 2: npm run server
echo Терминал 3: npm run telegram
echo.
echo 🌐 Приложение: http://localhost:3000
echo.
pause

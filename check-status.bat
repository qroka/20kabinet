@echo off
echo 🔍 Проверка статуса сервисов...
echo.

echo 📱 Next.js приложение (порт 3000):
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Next.js запущен - http://localhost:3000
) else (
    echo ❌ Next.js не отвечает
)

echo.
echo 🔌 WebSocket сервер (порт 3003):
curl -s http://localhost:3003/api/computers >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ WebSocket сервер запущен - http://localhost:3003
) else (
    echo ❌ WebSocket сервер не отвечает
)

echo.
echo 🤖 Telegram бот (порт 3002):
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Telegram бот запущен - http://localhost:3002
) else (
    echo ❌ Telegram бот не отвечает
)

echo.
echo 🌐 Откройте в браузере: http://localhost:3000
pause

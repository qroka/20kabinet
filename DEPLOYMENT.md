# 🚀 Инструкция по деплою на сервер

## 📋 Подготовка

### 1. Установите PM2 на сервере
```bash
npm install -g pm2
```

### 2. Настройте переменные окружения
Создайте файл `.env.local` на сервере (скопируйте из `env.production.example`):
```bash
cp env.production.example .env.local
```

### 3. Настройте GitHub Secrets (для автоматического деплоя)
В настройках репозитория добавьте:
- `SERVER_HOST` - IP адрес сервера
- `SERVER_USER` - пользователь сервера
- `SERVER_SSH_KEY` - приватный SSH ключ

## 🎯 Способы деплоя

### Вариант 1: Автоматический деплой через GitHub Actions

1. **Загрузите код на GitHub**
2. **Настройте GitHub Secrets** (см. выше)
3. **Запушьте в main/master ветку** - деплой запустится автоматически

### Вариант 2: Ручной деплой через SSH

```bash
# Подключитесь к серверу
ssh user@your-server.com

# Клонируйте репозиторий
git clone https://github.com/your-username/20kabinet.git
cd 20kabinet

# Запустите деплой
chmod +x deploy.sh
./deploy.sh
```

### Вариант 3: Деплой через Windows (если сервер на Windows)

1. **Скопируйте проект на сервер**
2. **Запустите `deploy.bat`**
3. **Или выполните команды вручную:**

```cmd
npm install --production
cd server && npm install --production && cd ..
cd telegram-bot && npm install --production && cd ..
npm run build
pm2 start ecosystem.config.js
```

## 🔧 Управление на сервере

### Основные команды PM2:
```bash
# Статус процессов
pm2 status

# Перезапуск всех процессов
pm2 restart ecosystem.config.js

# Остановка всех процессов
pm2 stop ecosystem.config.js

# Просмотр логов
pm2 logs

# Просмотр логов конкретного процесса
pm2 logs computer-lab-frontend
pm2 logs computer-lab-websocket
pm2 logs computer-lab-telegram

# Удаление всех процессов
pm2 delete ecosystem.config.js
```

### Обновление кода:
```bash
# Обновите код
git pull origin main

# Перезапустите процессы
pm2 restart ecosystem.config.js
```

## 🌐 Настройка домена и SSL

### 1. Настройте Nginx (рекомендуется)
```nginx
server {
    listen 80;
    server_name sokral-design.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/telegram/ {
        proxy_pass http://localhost:3002/;
    }

    location /api/server/ {
        proxy_pass http://localhost:3003/api/;
    }
}
```

### 2. Настройте SSL сертификат
```bash
# Установите certbot
sudo apt install certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d sokral-design.ru
```

## 🔍 Проверка работы

После деплоя проверьте:

1. **Основное приложение**: https://sokral-design.ru
2. **WebSocket API**: https://sokral-design.ru:3003/api/computers
3. **Telegram бот**: найдите `@kb20surpk_bot` в Telegram

## 🐛 Устранение проблем

### Если приложение не запускается:
```bash
pm2 logs
```

### Если порты заняты:
```bash
# Найдите процесс
sudo netstat -tulpn | grep :3000

# Убейте процесс
sudo kill -9 PID
```

### Если не работает Telegram бот:
1. Проверьте токен бота
2. Убедитесь, что бот запущен: `pm2 logs computer-lab-telegram`
3. Проверьте переменные окружения

## 📊 Мониторинг

PM2 предоставляет веб-интерфейс для мониторинга:
```bash
pm2 web
```

Откройте http://localhost:9615 для просмотра статистики.

## ✅ Готово!

Ваше приложение теперь работает на продакшн сервере!

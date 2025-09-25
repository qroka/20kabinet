# 🖥️ Система отслеживания компьютерного класса

Современная система для отслеживания использования компьютеров в учебном классе с поддержкой Telegram авторизации и реального времени.

## ✨ Возможности

- 🖥️ **Визуальная схема кабинета** - интерактивная карта расположения компьютеров
- 👥 **Управление пользователями** - регистрация и авторизация студентов
- 📊 **Статистика в реальном времени** - отслеживание использования и популярных часов
- 🤖 **Telegram авторизация** - удобный вход через Telegram бота
- ⚡ **WebSocket соединение** - мгновенные обновления статуса
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔐 **Админ панель** - управление системой и просмотр логов

## 🏗️ Архитектура проекта

```
computer-lab-system/
├── app/                    # Next.js приложение (фронтенд)
│   ├── auth/              # Страница авторизации
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Основной layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ActiveSession.tsx  # Активная сессия пользователя
│   ├── AdminLogin.tsx     # Админ авторизация
│   ├── ComputerCard.tsx   # Карточка компьютера
│   ├── ComputerSelection.tsx # Выбор компьютера
│   ├── DatabaseManagement.tsx # Управление БД
│   ├── LabLayout.tsx      # Схема кабинета
│   ├── LoginChoice.tsx    # Выбор способа входа
│   ├── LogsPanel.tsx      # Панель логов
│   ├── StatisticsDashboard.tsx # Дашборд статистики
│   ├── TelegramAuth.tsx   # Telegram авторизация
│   ├── TelegramLogin.tsx  # Telegram вход
│   ├── UserManagement.tsx # Управление пользователями
│   ├── UserRegistration.tsx # Регистрация пользователей
│   └── WebSocketProvider.tsx # WebSocket провайдер
├── server/                # WebSocket сервер
│   ├── package.json       # Зависимости сервера
│   └── server.js          # Основной файл сервера
├── telegram-bot/          # Telegram бот
│   ├── package.json       # Зависимости бота
│   └── bot.js             # Основной файл бота
├── store/                 # Zustand store
│   └── useStore.ts        # Глобальное состояние
├── types/                 # TypeScript типы
│   └── index.ts           # Определения типов
├── utils/                 # Утилиты
│   ├── database.ts        # Работа с локальной БД
│   └── dateUtils.ts       # Работа с датами
└── package.json           # Основные зависимости
```

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd computer-lab-system

# Установите зависимости для всех частей проекта
npm run install:all
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Next.js Application
NEXT_PUBLIC_APP_NAME="Компьютерный класс"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# WebSocket Server
NEXT_PUBLIC_WS_URL="http://localhost:3003"
WS_SERVER_PORT=3003

# Telegram Bot
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_BOT_PORT=3002
TELEGRAM_WEBHOOK_URL="https://your-domain.com/webhook"
TELEGRAM_FRONTEND_URL="https://your-domain.com"

# Admin Configuration
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# Security
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-super-secret-session-key"

# Development
NODE_ENV="development"
DEBUG="true"
```

### 3. Запуск всех сервисов

```bash
# Запуск всех сервисов одновременно
npm run dev:all
```

Или запустите каждый сервис отдельно:

```bash
# Терминал 1: Next.js приложение
npm run dev

# Терминал 2: WebSocket сервер
npm run server

# Терминал 3: Telegram бот
npm run telegram
```

## 🔧 Настройка Telegram бота

### 1. Создание бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Скопируйте токен бота

### 2. Настройка бота

Замените `TELEGRAM_BOT_TOKEN` в `.env.local` на ваш токен.

### 3. Получение ссылки для авторизации

1. Найдите вашего бота в Telegram
2. Отправьте команду `/start`
3. Нажмите "Авторизоваться"
4. Скопируйте ссылку и перейдите по ней

## 📱 Использование системы

### Для пользователей

1. **Авторизация через Telegram**:
   - Откройте бота в Telegram
   - Нажмите "Авторизоваться"
   - Перейдите по ссылке

2. **Прямая регистрация**:
   - Нажмите "Войти напрямую"
   - Заполните форму регистрации
   - Выберите свободный компьютер

3. **Работа с компьютером**:
   - Выберите свободный компьютер
   - Начните сессию
   - Завершите работу при необходимости

### Для администраторов

1. **Вход в админ панель**:
   - Нажмите "Доступ администратора"
   - Введите логин: `admin`, пароль: `admin123`

2. **Управление системой**:
   - Просмотр схемы кабинета
   - Управление пользователями
   - Просмотр статистики
   - Управление базой данных

## 🛠️ Разработка

### Структура компонентов

- **Layout компоненты**: `LabLayout`, `LoginChoice`
- **User компоненты**: `UserRegistration`, `UserManagement`, `ActiveSession`
- **Computer компоненты**: `ComputerCard`, `ComputerSelection`
- **Admin компоненты**: `AdminLogin`, `DatabaseManagement`, `StatisticsDashboard`
- **Utility компоненты**: `WebSocketProvider`, `LogsPanel`, `TelegramAuth`

### Добавление новых компьютеров

Отредактируйте файл `utils/database.ts`, функция `initializeDatabase()`:

```typescript
{ 
  id: 'pc-new', 
  name: 'ПК-NEW', 
  type: 'ПК', 
  status: 'free', 
  position: { row: 4, col: 0 } 
}
```

### Настройка стилей

Основные цвета определены в `tailwind.config.js`:

- `primary-*` - основные цвета интерфейса
- `accent-*` - акцентные цвета
- `computer-*` - цвета статусов компьютеров

## 🔧 API Endpoints

### WebSocket Server (порт 3003)

- `GET /api/computers` - список всех компьютеров
- `GET /api/users` - список пользователей
- `GET /api/logs` - логи системы
- `GET /api/statistics` - статистика использования

### Telegram Bot (порт 3002)

- `GET /api/validate-auth/:token/:chatId` - проверка токена авторизации
- `POST /api/notify-user/:chatId` - отправка уведомления пользователю

## 🐛 Устранение неполадок

### Проблемы с WebSocket

1. Проверьте, что сервер запущен на порту 3003
2. Убедитесь, что в `.env.local` указан правильный `NEXT_PUBLIC_WS_URL`
3. Проверьте консоль браузера на ошибки подключения

### Проблемы с Telegram ботом

1. Проверьте токен бота в `.env.local`
2. Убедитесь, что бот запущен на порту 3002
3. Проверьте логи бота в консоли

### Проблемы с базой данных

1. Очистите localStorage браузера
2. Перезапустите приложение
3. Проверьте консоль на ошибки

## 📦 Сборка для продакшена

```bash
# Сборка Next.js приложения
npm run build

# Запуск в продакшене
npm start
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте раздел "Устранение неполадок"
2. Создайте Issue в репозитории
3. Обратитесь к разработчикам

---

**Система разработана для эффективного управления компьютерным классом** 🎓

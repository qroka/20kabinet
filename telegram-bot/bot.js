const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Конфигурация Telegram бота
const BOT_TOKEN = '8306314985:AAEe9DmmVGqpXSk_uhiPA1YA8u2ysYu9usY';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://sokral-design.ru/webhook';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://sokral-design.ru'; // URL вашего фронтенда

// Хранилище для временных токенов авторизации
const authTokens = new Map();

// Отключение webhook (используем polling)
async function deleteWebhook() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    console.log('Webhook отключен:', response.data);
  } catch (error) {
    console.error('Ошибка отключения webhook:', error);
  }
}

// Генерация случайного токена
function generateAuthToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Отправка сообщения пользователю
async function sendMessage(chatId, text, replyMarkup = null) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
}

// Обработка команд бота
async function handleCommand(chatId, message) {
  const command = message.text;

  switch (command) {
    case '/start':
      await sendMessage(chatId, `
🤖 <b>Добро пожаловать в систему компьютерного класса!</b>

Для авторизации нажмите кнопку ниже:
      `, {
        inline_keyboard: [[
          {
            text: '🔐 Авторизоваться',
            callback_data: 'auth_request'
          }
        ]]
      });
      break;

    case '/help':
      await sendMessage(chatId, `
📋 <b>Доступные команды:</b>

/start - Начать работу с ботом
/auth - Запросить авторизацию
/help - Показать эту справку

<b>Как использовать:</b>
1. Нажмите /auth или кнопку "Авторизоваться"
2. Получите ссылку для входа
3. Перейдите по ссылке и войдите в систему
      `);
      break;

    case '/auth':
      await handleAuthRequest(chatId);
      break;

    default:
      await sendMessage(chatId, `
❓ Неизвестная команда. Используйте /help для получения справки.
      `);
  }
}

// Обработка запроса авторизации
async function handleAuthRequest(chatId) {
  const authToken = generateAuthToken();
  const authUrl = `${FRONTEND_URL}/auth?token=${authToken}&chatId=${chatId}`;
  
  // Сохраняем токен на 10 минут
  authTokens.set(authToken, {
    chatId: chatId,
    timestamp: Date.now(),
    used: false
  });

  await sendMessage(chatId, `
✅ <b>Авторизация подтверждена!</b>

🔗 <b>Ссылка для входа:</b>
<a href="${authUrl}">Войти в систему компьютерного класса</a>

⏰ Ссылка действительна в течение 10 минут.

<b>Инструкция:</b>
1. Нажмите на ссылку выше
2. Если вы не зарегистрированы, заполните форму регистрации
3. Если уже зарегистрированы, выберите свободный компьютер

⚠️ Не передавайте эту ссылку другим пользователям!
  `, {
    inline_keyboard: [[
      {
        text: '🔄 Получить новую ссылку',
        callback_data: 'auth_request'
      }
    ]]
  });
}

// Обработка callback запросов (нажатие кнопок)
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case 'auth_request':
      await handleAuthRequest(chatId);
      break;
  }

  // Отвечаем на callback query
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      callback_query_id: callbackQuery.id
    });
  } catch (error) {
    console.error('Ошибка ответа на callback:', error);
  }
}

// Проверка токена авторизации
function validateAuthToken(token, chatId) {
  const authData = authTokens.get(token);
  
  if (!authData) {
    return false;
  }

  // Проверяем время жизни токена (10 минут)
  if (Date.now() - authData.timestamp > 10 * 60 * 1000) {
    authTokens.delete(token);
    return false;
  }

  // Проверяем, что токен не использован и chatId совпадает
  if (authData.used || authData.chatId !== chatId) {
    return false;
  }

  return true;
}

// Отметка токена как использованного
function markTokenAsUsed(token) {
  const authData = authTokens.get(token);
  if (authData) {
    authData.used = true;
  }
}

// Очистка старых токенов
function cleanupOldTokens() {
  const now = Date.now();
  for (const [token, data] of authTokens.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) {
      authTokens.delete(token);
    }
  }
}

// Webhook для получения обновлений от Telegram
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      const chatId = update.message.chat.id;
      const message = update.message;

      if (message.text && message.text.startsWith('/')) {
        await handleCommand(chatId, message);
      }
    }

    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Ошибка обработки webhook:', error);
    res.status(500).send('Error');
  }
});

// API для проверки токена авторизации
app.get('/api/validate-auth/:token/:chatId', (req, res) => {
  const { token, chatId } = req.params;
  const isValid = validateAuthToken(token, chatId);
  
  if (isValid) {
    markTokenAsUsed(token);
    res.json({ valid: true, chatId: chatId });
  } else {
    res.status(400).json({ valid: false, error: 'Invalid or expired token' });
  }
});

// API для отправки уведомлений пользователю
app.post('/api/notify-user/:chatId', async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    await sendMessage(chatId, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Polling для получения обновлений от Telegram
let lastUpdateId = 0;

async function getUpdates() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`, {
      offset: lastUpdateId + 1,
      timeout: 30
    });
    
    if (response.data.ok && response.data.result.length > 0) {
      for (const update of response.data.result) {
        lastUpdateId = update.update_id;
        
        if (update.message) {
          const chatId = update.message.chat.id;
          const message = update.message;
          
          if (message.text && message.text.startsWith('/')) {
            await handleCommand(chatId, message);
          }
        }
        
        if (update.callback_query) {
          await handleCallbackQuery(update.callback_query);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка получения обновлений:', error);
  }
}

// Запуск сервера
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🤖 Telegram бот запущен на порту ${PORT}`);
  
  // Отключаем webhook и включаем polling
  deleteWebhook();
  
  // Начинаем polling
  setInterval(getUpdates, 1000);
  
  // Очищаем старые токены каждые 5 минут
  setInterval(cleanupOldTokens, 5 * 60 * 1000);
  
  console.log('📡 Polling включен - бот готов к работе!');
});

// Экспорт функций для использования в других модулях
module.exports = {
  validateAuthToken,
  markTokenAsUsed,
  sendMessage
};

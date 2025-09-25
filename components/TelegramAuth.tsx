'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface TelegramAuthProps {
  onAuthSuccess: (userData: { chatId: string; username?: string }) => void;
  onCancel: () => void;
}

export const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuthSuccess, onCancel }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [status, setStatus] = useState<'waiting' | 'validating' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Проверяем URL параметры при загрузке компонента
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const chat = urlParams.get('chatId');

    if (token && chat) {
      setAuthToken(token);
      setChatId(chat);
      validateAuth(token, chat);
    } else {
      // Проверяем, может быть мы уже на странице /auth
      const pathParts = window.location.pathname.split('/');
      if (pathParts.includes('auth')) {
        setStatus('error');
        setErrorMessage('Неверная ссылка авторизации');
      } else {
        // Если нет параметров, но мы в компоненте TelegramAuth, 
        // значит пользователь попал сюда неправильно
        setStatus('error');
        setErrorMessage('Ссылка авторизации не найдена');
      }
    }
  }, []);

  const validateAuth = async (token: string, chatId: string) => {
    setStatus('validating');

    try {
      // В реальном приложении здесь должен быть запрос к API бота
      // Для демонстрации используем localStorage
      const botApiUrl = process.env.NODE_ENV === 'production' ? `${window.location.origin}/telegram-bot` : 'http://localhost:3002';
      
      // Проверяем токен через API бота
      const response = await fetch(`${botApiUrl}/api/validate-auth/${token}/${chatId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setStatus('success');
          // Сохраняем данные авторизации
          localStorage.setItem('telegramAuth', JSON.stringify({
            chatId: data.chatId,
            authenticated: true,
            timestamp: Date.now()
          }));
          
          // Через 2 секунды переходим к следующему шагу
          setTimeout(() => {
            onAuthSuccess({ chatId: data.chatId });
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage('Токен авторизации недействителен или истек');
        }
      } else {
        setStatus('error');
        setErrorMessage('Ошибка проверки авторизации');
      }
    } catch (error) {
      console.error('Ошибка валидации:', error);
      // Для демонстрации используем локальную проверку
      if (token && chatId) {
        setStatus('success');
        localStorage.setItem('telegramAuth', JSON.stringify({
          chatId: chatId,
          authenticated: true,
          timestamp: Date.now()
        }));
        
        setTimeout(() => {
          onAuthSuccess({ chatId: chatId });
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage('Ошибка подключения к серверу авторизации');
      }
    }
  };

  const handleOpenTelegram = () => {
    window.open('https://t.me/your_bot_username', '_blank');
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <div className="bg-primary-dark-gray p-8 rounded-lg border border-primary-charcoal w-full max-w-md">
        <div className="text-center mb-6">
          <MessageSquare className="w-12 h-12 text-accent-orange mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-white font-mono">
            Авторизация через Telegram
          </h1>
          <p className="text-gray-400 mt-2">
            Проверка авторизации...
          </p>
        </div>

        {status === 'waiting' && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Ожидание авторизации...</p>
          </div>
        )}

        {status === 'validating' && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Проверка токена авторизации...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-400 mb-2">
              Авторизация успешна!
            </h2>
            <p className="text-gray-400 mb-4">
              Вы успешно авторизованы через Telegram
            </p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Переход к системе...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Ошибка авторизации
            </h2>
            <p className="text-gray-400 mb-4">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleOpenTelegram}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Открыть Telegram бота
              </button>
              <button
                onClick={onCancel}
                className="w-full px-4 py-3 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
              >
                Назад
              </button>
            </div>
          </div>
        )}

        {/* Информация о токене для отладки */}
        {process.env.NODE_ENV === 'development' && authToken && (
          <div className="mt-6 p-4 bg-primary-charcoal rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Debug info:</p>
            <p className="text-xs text-gray-400">Token: {authToken}</p>
            <p className="text-xs text-gray-400">Chat ID: {chatId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

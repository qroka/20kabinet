'use client';

import React from 'react';
import { MessageSquare, ExternalLink, ArrowLeft, Copy } from 'lucide-react';

interface TelegramLoginProps {
  onAuthSuccess: (userData: { chatId: string; username?: string }) => void;
  onBack: () => void;
}

export const TelegramLogin: React.FC<TelegramLoginProps> = ({ onAuthSuccess, onBack }) => {
  const handleOpenTelegram = () => {
    // Правильная ссылка на бота без @
    const telegramUrl = 'https://t.me/kb20surpk_bot';
    
    // Пытаемся открыть в Telegram
    try {
      window.open(telegramUrl, '_blank');
    } catch (error) {
      console.error('Ошибка открытия Telegram:', error);
      // Fallback - копируем ссылку в буфер обмена
      navigator.clipboard.writeText(telegramUrl).then(() => {
        alert('Ссылка скопирована в буфер обмена. Откройте Telegram и вставьте ссылку.');
      });
    }
  };

  const handleCopyLink = () => {
    const telegramUrl = 'https://t.me/kb20surpk_bot';
    navigator.clipboard.writeText(telegramUrl).then(() => {
      alert('Ссылка на бота скопирована в буфер обмена!');
    }).catch(() => {
      alert('Не удалось скопировать ссылку. Ссылка: https://t.me/kb20surpk_bot');
    });
  };

  const handleDemoAuth = () => {
    // Для демонстрации создаем фиктивные данные
    const demoData = {
      chatId: `demo_${Date.now()}`,
      username: 'demo_user'
    };
    
    localStorage.setItem('telegramAuth', JSON.stringify({
      ...demoData,
      authenticated: true,
      timestamp: Date.now()
    }));
    
    onAuthSuccess(demoData);
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <div className="bg-primary-dark-gray p-8 rounded-lg border border-primary-charcoal w-full max-w-md">
        <div className="text-center mb-6">
          <MessageSquare className="w-16 h-16 text-accent-orange mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-white font-mono">
            Вход через Telegram
          </h1>
          <p className="text-gray-400 mt-2">
            Авторизуйтесь через Telegram бота для доступа к системе
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-primary-charcoal p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-text-white mb-2">
              📱 Инструкция:
            </h3>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Нажмите "Открыть Telegram бота" или скопируйте ссылку</li>
              <li>В Telegram найдите бота @kb20surpk_bot</li>
              <li>В боте нажмите /start или кнопку "Авторизоваться"</li>
              <li>Получите ссылку для входа</li>
              <li>Перейдите по ссылке в этом окне</li>
            </ol>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 <strong>Совет:</strong> Ссылка будет действительна в течение 10 минут
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
            <p className="text-sm text-green-300">
              🤖 <strong>Бот:</strong> @kb20surpk_bot
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleOpenTelegram}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            Открыть Telegram бота
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Скопировать ссылку на бота
          </button>

          {/* Демо кнопка для разработки */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleDemoAuth}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Демо авторизация (для разработки)
            </button>
          )}

          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к выбору входа
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-primary-charcoal">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Нет аккаунта Telegram?</p>
            <a 
              href="https://telegram.org/apps" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-accent-orange hover:text-accent-orange-hover transition-colors"
            >
              Скачать Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

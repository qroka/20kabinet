'use client';

import React from 'react';
import { MessageSquare, User, ArrowLeft } from 'lucide-react';

interface LoginChoiceProps {
  onTelegramLogin: () => void;
  onDirectLogin: () => void;
  onBack: () => void;
}

export const LoginChoice: React.FC<LoginChoiceProps> = ({ 
  onTelegramLogin, 
  onDirectLogin, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <div className="bg-primary-dark-gray p-8 rounded-lg border border-primary-charcoal w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-white font-mono mb-2">
            Добро пожаловать!
          </h1>
          <p className="text-gray-400">
            Выберите способ входа в систему компьютерного класса
          </p>
        </div>

        <div className="space-y-4">
          {/* Telegram Login */}
          <button
            onClick={onTelegramLogin}
            className="w-full p-6 bg-primary-charcoal border border-primary-charcoal rounded-lg hover:border-accent-orange transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-text-white mb-1">
                  Вход через Telegram
                </h3>
                <p className="text-sm text-gray-400">
                  Рекомендуемый способ. Быстрая авторизация через бота
                </p>
              </div>
            </div>
          </button>

          {/* Direct Login */}
          <button
            onClick={onDirectLogin}
            className="w-full p-6 bg-primary-charcoal border border-primary-charcoal rounded-lg hover:border-accent-orange transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center group-hover:bg-accent-orange-hover transition-colors">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-text-white mb-1">
                  Прямая регистрация
                </h3>
                <p className="text-sm text-gray-400">
                  Заполните форму регистрации напрямую
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-charcoal">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Быстро</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Безопасно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Удобно</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};





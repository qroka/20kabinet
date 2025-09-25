'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Простая проверка пароля (в реальном приложении это должно быть более безопасно)
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <div className="bg-primary-dark-gray p-8 rounded-lg border border-primary-charcoal w-full max-w-md">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 text-accent-orange mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-white font-mono">
            Вход в админ панель
          </h1>
          <p className="text-gray-400 mt-2">
            Введите пароль для доступа к административным функциям
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-white mb-2">
              Пароль администратора
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`
                  w-full px-4 py-3 pr-12 bg-primary-charcoal border rounded-lg text-text-white placeholder-gray-400
                  focus:border-accent-orange focus:outline-none transition-colors
                  ${error ? 'border-red-400' : 'border-primary-charcoal'}
                `}
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-3 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
            >
              Назад
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors font-medium"
            >
              Войти
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-primary-charcoal/50 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            <strong>Демо пароль:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};





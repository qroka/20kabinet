'use client';

import React, { useState, useEffect } from 'react';
import { User, CompetenceLevel } from '@/types';
import { UserPlus, Monitor, Smartphone, Eye, Palette } from 'lucide-react';

interface UserRegistrationProps {
  onRegister: (user: User) => void;
  onCancel: () => void;
  onAdminAccess?: () => void;
}

const competenceOptions: { value: CompetenceLevel; label: string; icon: React.ElementType; description: string }[] = [
  { 
    value: 'Motion Design', 
    label: 'Motion Design', 
    icon: Palette, 
    description: 'Анимация и видеодизайн' 
  },
  { 
    value: 'ЦД', 
    label: 'Цифровой дизайн', 
    icon: Monitor, 
    description: 'UI/UX и веб-дизайн' 
  },
  { 
    value: 'VR/AR', 
    label: 'VR/AR разработка', 
    icon: Eye, 
    description: 'Виртуальная и дополненная реальность' 
  },
  { 
    value: 'Мобильная разработка', 
    label: 'Мобильная разработка', 
    icon: Smartphone, 
    description: 'iOS и Android приложения' 
  },
];

export const UserRegistration: React.FC<UserRegistrationProps> = ({ onRegister, onCancel, onAdminAccess }) => {
  const [telegramData, setTelegramData] = useState<{chatId: string; username?: string} | null>(null);

  useEffect(() => {
    // Проверяем, есть ли данные Telegram авторизации
    const pendingAuth = localStorage.getItem('pendingTelegramAuth');
    if (pendingAuth) {
      try {
        const data = JSON.parse(pendingAuth);
        setTelegramData(data);
        localStorage.removeItem('pendingTelegramAuth');
      } catch (error) {
        console.error('Ошибка парсинга данных Telegram:', error);
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    competence: '' as CompetenceLevel | '',
    group: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }

    if (!formData.competence) {
      newErrors.competence = 'Выберите направление';
    }

    if (!formData.group.trim()) {
      newErrors.group = 'Введите группу';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const user: User = {
      id: telegramData?.chatId || Date.now().toString(), // Используем chatId из Telegram если есть
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      competenceLevel: formData.competence as CompetenceLevel,
      group: formData.group.trim(),
    };

    // Сохраняем пользователя в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    onRegister(user);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
      <div className="bg-primary-dark-gray p-8 rounded-lg border border-primary-charcoal w-full max-w-md">
        <div className="text-center mb-6">
          <UserPlus className="w-12 h-12 text-accent-orange mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-white font-mono">
            Регистрация в компьютерном классе
          </h1>
          <p className="text-gray-400 mt-2">
            Заполните форму для начала работы
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium text-text-white mb-2">
              Имя *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`
                w-full px-4 py-3 bg-primary-charcoal border rounded-lg text-text-white placeholder-gray-400
                focus:border-accent-orange focus:outline-none transition-colors
                ${errors.firstName ? 'border-red-400' : 'border-primary-charcoal'}
              `}
              placeholder="Введите ваше имя"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Фамилия */}
          <div>
            <label className="block text-sm font-medium text-text-white mb-2">
              Фамилия *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`
                w-full px-4 py-3 bg-primary-charcoal border rounded-lg text-text-white placeholder-gray-400
                focus:border-accent-orange focus:outline-none transition-colors
                ${errors.lastName ? 'border-red-400' : 'border-primary-charcoal'}
              `}
              placeholder="Введите вашу фамилию"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Направление */}
          <div>
            <label className="block text-sm font-medium text-text-white mb-2">
              Направление обучения *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {competenceOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('competence', option.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-left
                      ${formData.competence === option.value
                        ? 'border-accent-orange bg-accent-orange/10'
                        : 'border-primary-charcoal hover:border-accent-orange/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 text-accent-orange mb-2" />
                    <div className="text-sm font-medium text-text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.competence && (
              <p className="text-red-400 text-sm mt-1">{errors.competence}</p>
            )}
          </div>

          {/* Группа */}
          <div>
            <label className="block text-sm font-medium text-text-white mb-2">
              Группа *
            </label>
            <input
              type="text"
              value={formData.group}
              onChange={(e) => handleInputChange('group', e.target.value)}
              className={`
                w-full px-4 py-3 bg-primary-charcoal border rounded-lg text-text-white placeholder-gray-400
                focus:border-accent-orange focus:outline-none transition-colors
                ${errors.group ? 'border-red-400' : 'border-primary-charcoal'}
              `}
              placeholder="Например: ИТ-21, ДИЗ-22"
            />
            {errors.group && (
              <p className="text-red-400 text-sm mt-1">{errors.group}</p>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors font-medium"
            >
              Продолжить
            </button>
          </div>
        </form>

        {/* Admin Access Button */}
        {onAdminAccess && (
          <div className="mt-6 pt-6 border-t border-primary-charcoal">
            <button
              onClick={onAdminAccess}
              className="w-full px-4 py-2 text-sm text-gray-400 hover:text-accent-orange transition-colors"
            >
              Вход в админ панель
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

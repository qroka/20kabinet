'use client';

import React, { useState, useEffect } from 'react';
import { User, Computer, UserSession } from '@/types';
import { 
  LogOut, 
  Clock, 
  Monitor, 
  User as UserIcon,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { getTimeDiff, formatDuration } from '@/utils/dateUtils';

interface ActiveSessionProps {
  currentUser: User;
  currentComputer: Computer;
  session: UserSession;
  onLogout: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  currentUser,
  currentComputer,
  session,
  onLogout
}) => {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const updateDuration = () => {
      setSessionDuration(getTimeDiff(session.startTime));
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000); // Обновляем каждую секунду

    return () => clearInterval(interval);
  }, [session.startTime]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Сохраняем информацию о сессии
    const sessionData = {
      ...session,
      endTime: new Date(),
      isActive: false
    };
    
    localStorage.setItem('lastSession', JSON.stringify(sessionData));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentSession');
    
    onLogout();
  };

  const getCompetenceColor = (level: string) => {
    switch (level) {
      case 'Motion Design':
        return 'text-purple-400';
      case 'ЦД':
        return 'text-blue-400';
      case 'VR/AR':
        return 'text-green-400';
      case 'Мобильная разработка':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-primary-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-white font-mono mb-2">
                Активная сессия
              </h1>
              <p className="text-gray-400">
                Добро пожаловать в компьютерный класс!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-status-green rounded-full animate-pulse" />
              <span className="text-status-green text-sm font-medium">Активна</span>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Info */}
          <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal">
            <h2 className="text-lg font-semibold text-text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-accent-orange" />
              Информация о пользователе
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Имя:</span>
                <span className="text-text-white ml-2 font-medium">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Группа:</span>
                <span className="text-text-white ml-2 font-medium">{currentUser.group}</span>
              </div>
              <div>
                <span className="text-gray-400">Направление:</span>
                <span className={`ml-2 font-medium ${getCompetenceColor(currentUser.competenceLevel)}`}>
                  {currentUser.competenceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Computer Info */}
          <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal">
            <h2 className="text-lg font-semibold text-text-white mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-accent-orange" />
              Информация о компьютере
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Компьютер:</span>
                <span className="text-text-white ml-2 font-medium">{currentComputer.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Тип:</span>
                <span className="text-text-white ml-2 font-medium">{currentComputer.type}</span>
              </div>
              <div>
                <span className="text-gray-400">Статус:</span>
                <span className="text-status-green ml-2 font-medium">Занят</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Duration */}
        <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal mb-6">
          <h2 className="text-lg font-semibold text-text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-orange" />
            Время сессии
          </h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-orange font-mono mb-2">
              {formatDuration(sessionDuration)}
            </div>
            <p className="text-gray-400">
              Сессия началась {new Date(session.startTime).toLocaleTimeString('ru-RU')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal">
          <h2 className="text-lg font-semibold text-text-white mb-4">
            Действия
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Завершить сессию
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-text-white">
                  Подтверждение выхода
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Вы уверены, что хотите завершить сессию? 
                Время работы: <span className="text-accent-orange font-medium">
                  {formatDuration(sessionDuration)}
                </span>
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};





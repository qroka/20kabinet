'use client';

import React from 'react';
import { Computer, User } from '@/types';
import { Monitor, Laptop, Cpu, ArrowLeft, CheckCircle } from 'lucide-react';
import { getFreeComputers } from '@/utils/database';

interface ComputerSelectionProps {
  computers: Computer[];
  currentUser: User;
  onSelectComputer: (computerId: string) => void;
  onBack: () => void;
}

const getComputerIcon = (type: string) => {
  switch (type) {
    case 'МОНОБЛОК':
      return <Monitor className="w-6 h-6" />;
    case 'Ноутбук':
      return <Laptop className="w-6 h-6" />;
    default:
      return <Cpu className="w-6 h-6" />;
  }
};

export const ComputerSelection: React.FC<ComputerSelectionProps> = ({
  computers,
  currentUser,
  onSelectComputer,
  onBack
}) => {
  // Get fresh data from database
  const freeComputers = getFreeComputers();

  return (
    <div className="min-h-screen bg-primary-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-accent-orange hover:text-accent-orange-hover transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад к регистрации
          </button>
          
          <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal">
            <h1 className="text-xl font-bold text-text-white font-mono mb-2">
              Выберите свободный компьютер
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Пользователь: <span className="text-text-white">{currentUser.name}</span></span>
              <span>Группа: <span className="text-text-white">{currentUser.group}</span></span>
              <span>Направление: <span className="text-accent-orange">{currentUser.competenceLevel}</span></span>
            </div>
          </div>
        </div>

        {/* Computers Grid */}
        <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal">
          <h2 className="text-lg font-semibold text-text-white mb-4">
            Свободные компьютеры ({freeComputers.length})
          </h2>
          
          {freeComputers.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Все компьютеры заняты</p>
              <p className="text-gray-500 text-sm mt-2">
                Попробуйте позже или обратитесь к преподавателю
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {freeComputers.map((computer) => (
                <button
                  key={computer.id}
                  onClick={() => onSelectComputer(computer.id)}
                  className="group p-4 bg-primary-charcoal border border-primary-charcoal rounded-lg hover:border-accent-orange transition-all duration-200 hover:shadow-lg hover:shadow-accent-orange/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-accent-orange">
                      {getComputerIcon(computer.type)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-mono font-bold text-text-white">
                        {computer.name}
                      </h3>
                      <p className="text-xs text-gray-400">{computer.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-status-green rounded-full animate-pulse" />
                      <span className="text-xs text-status-green font-medium">
                        Свободен
                      </span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-accent-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal">
          <h3 className="text-sm font-semibold text-text-white mb-3">Статусы компьютеров</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-green animate-pulse" />
              <span className="text-gray-300">Свободен</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-red" />
              <span className="text-gray-300">Занят</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-orange animate-glow" />
              <span className="text-gray-300">Техобслуживание</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

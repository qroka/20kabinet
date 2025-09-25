'use client';

import React from 'react';
import { Statistics } from '@/types';
import { 
  Monitor, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface StatisticsDashboardProps {
  statistics: Statistics;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ statistics }) => {
  const utilizationPercentage = Math.round((statistics.occupiedComputers / statistics.totalComputers) * 100);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'text-text-white',
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: string;
    subtitle?: string;
  }) => (
    <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal hover:border-accent-orange transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="bg-primary-black p-6 rounded-lg border border-primary-charcoal">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-white font-mono">
          Статистика использования
        </h2>
        <p className="text-sm text-gray-400">
          Общая информация о работе компьютерного класса
        </p>
      </div>

      {/* Main statistics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Всего ПК"
          value={statistics.totalComputers}
          icon={Monitor}
          color="text-blue-400"
        />
        <StatCard
          title="Занято"
          value={statistics.occupiedComputers}
          icon={UserCheck}
          color="text-red-400"
          subtitle={`${utilizationPercentage}% загрузки`}
        />
        <StatCard
          title="Свободно"
          value={statistics.freeComputers}
          icon={Activity}
          color="text-green-400"
        />
        <StatCard
          title="Обслуживание"
          value={statistics.maintenanceComputers}
          icon={AlertTriangle}
          color="text-accent-orange"
        />
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Активных пользователей"
          value={statistics.totalUsers}
          icon={Users}
          color="text-purple-400"
          subtitle={`${statistics.activeSessions} активных сессий`}
        />
        <StatCard
          title="Среднее время сессии"
          value={`${statistics.averageSessionTime || 0} мин`}
          icon={Clock}
          color="text-yellow-400"
          subtitle={statistics.averageSessionTime === 0 ? "Нет данных" : "На основе завершенных сессий"}
        />
      </div>

      {/* Popular time slots */}
      {statistics.popularTimeSlots && statistics.popularTimeSlots.length > 0 ? (
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal">
          <h3 className="text-lg font-semibold text-text-white mb-4 font-mono">
            Популярные часы использования
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {statistics.popularTimeSlots.slice(0, 8).map((slot, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-charcoal rounded p-2 mb-1">
                  <p className="text-xs text-gray-400">{slot.hour}:00</p>
                  <p className="text-sm font-semibold text-text-white">{slot.count}</p>
                </div>
                <div 
                  className="w-full bg-primary-charcoal rounded-full h-2"
                >
                  <div 
                    className="bg-accent-orange h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(slot.count / Math.max(...statistics.popularTimeSlots.map(s => s.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal">
          <h3 className="text-lg font-semibold text-text-white mb-4 font-mono">
            Популярные часы использования
          </h3>
          <div className="text-center text-gray-500 py-8">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Данные по популярным часам появятся после начала использования системы</p>
          </div>
        </div>
      )}
    </div>
  );
};

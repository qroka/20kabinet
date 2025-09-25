'use client';

import React, { useEffect, useRef } from 'react';
import { LogEntry, LogSeverity, LogType } from '@/types';
import { useStore } from '@/store/useStore';
import { 
  User, 
  LogOut, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Wrench,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { safeDate } from '@/utils/dateUtils';

interface LogsPanelProps {
  logs: LogEntry[];
}

const getLogIcon = (type: LogType) => {
  switch (type) {
    case 'user_login':
      return <User className="w-4 h-4 text-green-400" />;
    case 'user_logout':
      return <LogOut className="w-4 h-4 text-blue-400" />;
    case 'session_timeout':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    case 'maintenance_start':
    case 'maintenance_end':
      return <Wrench className="w-4 h-4 text-accent-orange" />;
    default:
      return <Info className="w-4 h-4 text-gray-400" />;
  }
};

const getSeverityColor = (severity: LogSeverity) => {
  switch (severity) {
    case 'success':
      return 'border-l-green-400 bg-green-400/5';
    case 'warning':
      return 'border-l-yellow-400 bg-yellow-400/5';
    case 'error':
      return 'border-l-red-400 bg-red-400/5';
    default:
      return 'border-l-blue-400 bg-blue-400/5';
  }
};

const getLogTypeText = (type: LogType) => {
  switch (type) {
    case 'user_login':
      return 'Вход пользователя';
    case 'user_logout':
      return 'Выход пользователя';
    case 'status_change':
      return 'Смена статуса';
    case 'session_timeout':
      return 'Превышение времени';
    case 'maintenance_start':
      return 'Начало обслуживания';
    case 'maintenance_end':
      return 'Завершение обслуживания';
    default:
      return 'Событие';
  }
};

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => {
  const { clearLogs } = useStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  return (
    <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text-white font-mono">
          Логи системы
        </h3>
        <button
          onClick={clearLogs}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          title="Очистить логи"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-96 scrollbar-thin scrollbar-thumb-accent-orange scrollbar-track-primary-charcoal">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Нет записей в логах</p>
          </div>
        ) : (
          [...logs].reverse().map((log) => (
            <div
              key={log.id}
              className={`
                p-3 rounded-lg border-l-4 transition-all duration-200
                hover:bg-primary-charcoal/30
                ${getSeverityColor(log.severity)}
              `}
            >
              <div className="flex items-start gap-3">
                {getLogIcon(log.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-white">
                      {getLogTypeText(log.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {safeDate(log.timestamp) ? format(safeDate(log.timestamp)!, 'HH:mm:ss', { locale: ru }) : '--:--:--'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 break-words">
                    {log.message}
                  </p>
                  {log.computerId && (
                    <p className="text-xs text-gray-500 mt-1">
                      ПК: {log.computerId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Log statistics */}
      <div className="mt-4 pt-4 border-t border-primary-charcoal">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-text-white font-semibold">{logs.length}</p>
            <p className="text-gray-400">Всего записей</p>
          </div>
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              {logs.filter(log => log.severity === 'success').length}
            </p>
            <p className="text-gray-400">Успешных</p>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Database, Trash2, Download, Upload, RotateCcw, RefreshCw } from 'lucide-react';
import { clearDatabase, getDatabase, saveDatabase, refreshStatistics, resetStatistics } from '@/utils/database';

interface DatabaseManagementProps {
  onRefresh: () => void;
}

export const DatabaseManagement: React.FC<DatabaseManagementProps> = ({ onRefresh }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearDatabase = () => {
    clearDatabase();
    onRefresh();
    setShowConfirm(false);
  };

  const handleRefreshStatistics = () => {
    refreshStatistics();
    onRefresh();
  };

  const handleResetStatistics = () => {
    resetStatistics();
    onRefresh();
  };

  const handleExportData = () => {
    const data = getDatabase();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `computer-lab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        saveDatabase(data);
        onRefresh();
        alert('Данные успешно импортированы!');
      } catch (error) {
        alert('Ошибка при импорте данных. Проверьте формат файла.');
      }
    };
    reader.readAsText(file);
  };

  const getDatabaseStats = () => {
    const db = getDatabase();
    return {
      computers: db.computers.length,
      users: db.users.length,
      sessions: db.sessions.length,
      logs: db.logs.length,
      activeSessions: db.sessions.filter((s: any) => s.isActive).length,
    };
  };

  const stats = getDatabaseStats();

  return (
    <div className="bg-primary-black p-6 rounded-lg border border-primary-charcoal">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-accent-orange" />
        <h2 className="text-xl font-bold text-text-white font-mono">
          Управление базой данных
        </h2>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.computers}</p>
          <p className="text-sm text-gray-400">Компьютеры</p>
        </div>
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal text-center">
          <p className="text-2xl font-bold text-green-400">{stats.users}</p>
          <p className="text-sm text-gray-400">Пользователи</p>
        </div>
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.sessions}</p>
          <p className="text-sm text-gray-400">Сессии</p>
        </div>
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.logs}</p>
          <p className="text-sm text-gray-400">Логи</p>
        </div>
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal text-center">
          <p className="text-2xl font-bold text-accent-orange">{stats.activeSessions}</p>
          <p className="text-sm text-gray-400">Активные</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Export */}
        <button
          onClick={handleExportData}
          className="flex items-center gap-3 p-4 bg-primary-dark-gray border border-primary-charcoal rounded-lg hover:border-accent-orange transition-colors"
        >
          <Download className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <p className="font-medium text-text-white">Экспорт данных</p>
            <p className="text-sm text-gray-400">Скачать резервную копию</p>
          </div>
        </button>

        {/* Import */}
        <label className="flex items-center gap-3 p-4 bg-primary-dark-gray border border-primary-charcoal rounded-lg hover:border-accent-orange transition-colors cursor-pointer">
          <Upload className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <p className="font-medium text-text-white">Импорт данных</p>
            <p className="text-sm text-gray-400">Загрузить из файла</p>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </label>

        {/* Refresh Statistics */}
        <button
          onClick={handleRefreshStatistics}
          className="flex items-center gap-3 p-4 bg-primary-dark-gray border border-primary-charcoal rounded-lg hover:border-green-400 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <p className="font-medium text-text-white">Обновить статистику</p>
            <p className="text-sm text-gray-400">Пересчитать данные</p>
          </div>
        </button>

        {/* Reset Statistics */}
        <button
          onClick={handleResetStatistics}
          className="flex items-center gap-3 p-4 bg-primary-dark-gray border border-primary-charcoal rounded-lg hover:border-yellow-400 transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-yellow-400" />
          <div className="text-left">
            <p className="font-medium text-text-white">Сбросить статистику</p>
            <p className="text-sm text-gray-400">Обнулить все данные</p>
          </div>
        </button>

        {/* Clear */}
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-3 p-4 bg-primary-dark-gray border border-primary-charcoal rounded-lg hover:border-red-400 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
          <div className="text-left">
            <p className="font-medium text-text-white">Очистить базу</p>
            <p className="text-sm text-gray-400">Удалить все данные</p>
          </div>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-dark-gray p-6 rounded-lg border border-primary-charcoal max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-text-white">
                Подтверждение очистки
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Вы уверены, что хотите очистить всю базу данных? 
              Это действие нельзя отменить!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleClearDatabase}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

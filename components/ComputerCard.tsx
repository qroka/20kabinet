'use client';

import React from 'react';
import { Computer } from '@/types';
import { Monitor, Laptop, Cpu, User, Clock, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { formatDuration, getTimeDiff } from '@/utils/dateUtils';

interface ComputerCardProps {
  computer: Computer;
  isSelected?: boolean;
  onClick?: () => void;
  showUserInfo?: boolean;
}

const getComputerIcon = (type: string) => {
  switch (type) {
    case 'МОНОБЛОК':
      return <Monitor className="w-5 h-5" />;
    case 'Ноутбук':
      return <Laptop className="w-5 h-5" />;
    default:
      return <Cpu className="w-5 h-5" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'free':
      return <CheckCircle className="w-4 h-4 text-computer-free" />;
    case 'occupied':
      return <User className="w-4 h-4 text-computer-occupied" />;
    case 'maintenance':
      return <Wrench className="w-4 h-4 text-computer-maintenance" />;
    default:
      return <XCircle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'free':
      return 'Свободен';
    case 'occupied':
      return 'Занят';
    case 'maintenance':
      return 'Обслуживание';
    default:
      return 'Неизвестно';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'free':
      return 'border-computer-free bg-computer-free/10';
    case 'occupied':
      return 'border-computer-occupied bg-computer-occupied/10';
    case 'maintenance':
      return 'border-computer-maintenance bg-computer-maintenance/10';
    default:
      return 'border-gray-400 bg-gray-400/10';
  }
};

export const ComputerCard: React.FC<ComputerCardProps> = ({
  computer,
  isSelected = false,
  onClick,
  showUserInfo = true
}) => {
  const sessionDuration = computer.sessionStartTime 
    ? getTimeDiff(computer.sessionStartTime)
    : 0;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${getStatusColor(computer.status)}
        ${isSelected ? 'ring-2 ring-accent-orange ring-opacity-50' : ''}
        hover:shadow-lg hover:scale-105
        ${computer.status === 'free' ? 'hover:shadow-glow-green' : ''}
        ${computer.status === 'occupied' ? 'hover:shadow-glow-orange' : ''}
        ${computer.status === 'maintenance' ? 'hover:shadow-glow-blue' : ''}
      `}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className="absolute top-2 right-2">
        {getStatusIcon(computer.status)}
      </div>

      {/* Computer info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-accent-orange">
          {getComputerIcon(computer.type)}
        </div>
        <div>
          <h3 className="font-bold text-text-white font-mono text-lg">
            {computer.name}
          </h3>
          <p className="text-sm text-gray-400">
            {computer.type}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon(computer.status)}
        <span className="text-sm font-medium text-text-white">
          {getStatusText(computer.status)}
        </span>
      </div>

      {/* User info */}
      {showUserInfo && computer.currentUser && (
        <div className="mt-3 p-2 bg-primary-dark-gray rounded border border-primary-charcoal">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3 h-3 text-accent-orange" />
            <span className="text-xs font-medium text-text-white">
              {computer.currentUser.name}
            </span>
          </div>
          {computer.currentUser.group && (
            <p className="text-xs text-gray-400">
              {computer.currentUser.group}
            </p>
          )}
          {computer.currentUser.competenceLevel && (
            <p className="text-xs text-gray-400">
              {computer.currentUser.competenceLevel}
            </p>
          )}
        </div>
      )}

      {/* Session duration */}
      {computer.status === 'occupied' && computer.sessionStartTime && (
        <div className="mt-2 flex items-center gap-2">
          <Clock className="w-3 h-3 text-accent-orange" />
          <span className="text-xs text-gray-400">
            {formatDuration(sessionDuration)}
          </span>
        </div>
      )}

      {/* Maintenance info */}
      {computer.status === 'maintenance' && computer.maintenance && (
        <div className="mt-2 p-2 bg-computer-maintenance/20 rounded border border-computer-maintenance/50">
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-3 h-3 text-computer-maintenance" />
            <span className="text-xs font-medium text-computer-maintenance">
              Обслуживание
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {computer.maintenance.reason}
          </p>
          {computer.maintenance.startTime && (
            <p className="text-xs text-gray-400">
              С: {new Date(computer.maintenance.startTime).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Position indicator */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        {computer.position.row + 1}:{computer.position.col + 1}
      </div>
    </div>
  );
};
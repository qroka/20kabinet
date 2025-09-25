export interface User {
  id: string;
  name: string;
  competenceLevel: CompetenceLevel;
  group?: string;
  department?: string;
  avatar?: string;
}

export interface Computer {
  id: string;
  name: string;
  type: ComputerType;
  status: ComputerStatus;
  currentUser?: User;
  sessionStartTime?: Date | string;
  position: {
    row: number;
    col: number;
  };
  maintenance?: {
    reason: string;
    startTime: Date | string;
    estimatedEndTime?: Date | string;
  };
}

export interface Session {
  id: string;
  computerId: string;
  userId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date | string;
  type: LogType;
  computerId?: string;
  userId?: string;
  message: string;
  severity: LogSeverity;
}

export interface UserSession {
  id: string;
  userId: string;
  computerId: string;
  startTime: Date | string;
  endTime?: Date | string;
  isActive: boolean;
}

export type CompetenceLevel = 'Motion Design' | 'ЦД' | 'VR/AR' | 'Мобильная разработка';
export type ComputerType = 'ПК' | 'МОНОБЛОК' | 'Ноутбук';
export type ComputerStatus = 'free' | 'occupied' | 'maintenance';
export type LogType = 'user_login' | 'user_logout' | 'status_change' | 'session_timeout' | 'maintenance_start' | 'maintenance_end';
export type LogSeverity = 'info' | 'warning' | 'error' | 'success';

export interface Statistics {
  totalComputers: number;
  occupiedComputers: number;
  freeComputers: number;
  maintenanceComputers: number;
  totalUsers: number;
  activeSessions: number;
  averageSessionTime: number;
  popularTimeSlots: Array<{
    hour: number;
    count: number;
  }>;
}

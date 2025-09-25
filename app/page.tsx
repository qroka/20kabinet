'use client';

import React, { useState, useEffect } from 'react';
import { Computer, User, LogEntry, Statistics, UserSession } from '@/types';
import { useStore } from '@/store/useStore';
import { LabLayout } from '@/components/LabLayout';
import { LogsPanel } from '@/components/LogsPanel';
import { StatisticsDashboard } from '@/components/StatisticsDashboard';
import { UserManagement } from '@/components/UserManagement';
import { UserRegistration } from '@/components/UserRegistration';
import { ComputerSelection } from '@/components/ComputerSelection';
import { ActiveSession } from '@/components/ActiveSession';
import { AdminLogin } from '@/components/AdminLogin';
import { DatabaseManagement } from '@/components/DatabaseManagement';
import { TelegramAuth } from '@/components/TelegramAuth';
import { TelegramLogin } from '@/components/TelegramLogin';
import { LoginChoice } from '@/components/LoginChoice';
import { getAllComputers, addSessionToDB, updateSessionInDB, resetStatistics } from '@/utils/database';
import { 
  Layout, 
  Users, 
  BarChart3, 
  Activity,
  Wifi,
  WifiOff,
  Database
} from 'lucide-react';

// Mock data for demonstration
const mockComputers: Computer[] = [
  // Row 1
  { id: 'pc-1', name: 'ПК-01', type: 'ПК', status: 'free', position: { row: 0, col: 0 } },
  { id: 'pc-2', name: 'ПК-02', type: 'ПК', status: 'free', position: { row: 0, col: 1 } },
  { id: 'pc-3', name: 'ПК-03', type: 'ПК', status: 'free', position: { row: 0, col: 2 } },
  { id: 'pc-4', name: 'ПК-04', type: 'ПК', status: 'free', position: { row: 0, col: 3 } },
  
  // Row 2
  { id: 'pc-5', name: 'ПК-05', type: 'ПК', status: 'free', position: { row: 1, col: 0 } },
  { id: 'pc-6', name: 'ПК-06', type: 'ПК', status: 'free', position: { row: 1, col: 1 } },
  { id: 'pc-7', name: 'ПК-07', type: 'ПК', status: 'free', position: { row: 1, col: 2 } },
  { id: 'pc-8', name: 'ПК-08', type: 'ПК', status: 'maintenance', position: { row: 1, col: 3 }, maintenance: { reason: 'Обновление ПО', startTime: new Date(Date.now() - 60 * 60 * 1000) } },
  
  // Row 3
  { id: 'pc-9', name: 'ПК-09', type: 'ПК', status: 'free', position: { row: 2, col: 0 } },
  { id: 'mono-1', name: 'МОНО-01', type: 'МОНОБЛОК', status: 'free', position: { row: 2, col: 1 } },
  { id: 'pc-10', name: 'ПК-10', type: 'ПК', status: 'free', position: { row: 2, col: 2 } },
  { id: 'pc-11', name: 'ПК-11', type: 'ПК', status: 'free', position: { row: 2, col: 3 } },
  
  // Row 4
  { id: 'pc-12', name: 'ПК-12', type: 'ПК', status: 'free', position: { row: 3, col: 0 } },
  { id: 'pc-13', name: 'ПК-13', type: 'ПК', status: 'free', position: { row: 3, col: 2 } },
  { id: 'laptop-1', name: 'НОУТ-01', type: 'Ноутбук', status: 'free', position: { row: 3, col: 3 } },
  
  // Separate column
  { id: 'pc-14', name: 'ПК-14', type: 'ПК', status: 'free', position: { row: 0, col: 4 } },
  { id: 'laptop-2', name: 'НОУТ-02', type: 'Ноутбук', status: 'free', position: { row: 1, col: 4 } },
];

const mockUsers: User[] = [
  { id: 'u1', name: 'Иван Петров', competenceLevel: 'Motion Design', group: 'ДИЗ-21' },
  { id: 'u2', name: 'Мария Сидорова', competenceLevel: 'ЦД', group: 'ДИЗ-22' },
  { id: 'u3', name: 'Алексей Козлов', competenceLevel: 'VR/AR', group: 'ИТ-21' },
  { id: 'u4', name: 'Елена Волкова', competenceLevel: 'Мобильная разработка', group: 'ИТ-23' },
];

const mockStatistics: Statistics = {
  totalComputers: 16,
  occupiedComputers: 0,
  freeComputers: 15,
  maintenanceComputers: 1,
  totalUsers: 4,
  activeSessions: 0,
  averageSessionTime: 45,
  popularTimeSlots: [
    { hour: 9, count: 12 },
    { hour: 10, count: 15 },
    { hour: 11, count: 18 },
    { hour: 12, count: 8 },
    { hour: 13, count: 6 },
    { hour: 14, count: 14 },
    { hour: 15, count: 16 },
    { hour: 16, count: 10 },
  ]
};

type TabType = 'layout' | 'users' | 'statistics' | 'database';
type AppState = 'login-choice' | 'telegram-login' | 'telegram-auth' | 'registration' | 'computer-selection' | 'active-session' | 'admin-login' | 'admin';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('layout');
  const [appState, setAppState] = useState<AppState>('login-choice');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  
  const { 
    computers, 
    users, 
    logs, 
    statistics, 
    isConnected,
    initializeFromDB,
    setIsConnected,
    updateComputer,
    addUser,
    addLog
  } = useStore();

  // Initialize database and check for existing session
  useEffect(() => {
    // Initialize from database
    initializeFromDB();
    
    // Simulate connection status
    setIsConnected(true);
    
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    const savedSession = localStorage.getItem('currentSession');
    
    if (savedUser && savedSession) {
      try {
        const user = JSON.parse(savedUser);
        const session = JSON.parse(savedSession);
        
        if (session.isActive) {
          setCurrentUser(user);
          setCurrentSession(session);
          setAppState('active-session');
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentSession');
      }
    }
  }, [initializeFromDB, setIsConnected]);

  // Handlers
  const handleUserRegister = (user: User) => {
    setCurrentUser(user);
    addUser(user);
    setAppState('computer-selection');
  };

  const handleComputerSelect = (computerId: string) => {
    if (!currentUser) return;

    // Get fresh data from database
    const allComputers = getAllComputers();
    const computer = allComputers.find(c => c.id === computerId);
    if (!computer || computer.status !== 'free') return;

    // Create session
    const session: UserSession = {
      id: Date.now().toString(),
      userId: currentUser.id,
      computerId: computerId,
      startTime: new Date(),
      isActive: true
    };

    // Update computer
    updateComputer(computerId, {
      status: 'occupied',
      currentUser: currentUser,
      sessionStartTime: new Date()
    });

    // Save session to database and localStorage
    addSessionToDB(session);
    localStorage.setItem('currentSession', JSON.stringify(session));
    setCurrentSession(session);
    setAppState('active-session');

    // Add log
    addLog({
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'user_login',
      computerId: computerId,
      userId: currentUser.id,
      message: `${currentUser.name} начал работу на ${computer.name}`,
      severity: 'success'
    });
  };

  const handleLogout = () => {
    if (!currentUser || !currentSession) return;

    const allComputers = getAllComputers();
    const computer = allComputers.find(c => c.id === currentSession.computerId);
    
    // Update computer
    updateComputer(currentSession.computerId, {
      status: 'free',
      currentUser: undefined,
      sessionStartTime: undefined
    });

    // Update session in database
    updateSessionInDB(currentSession.id, {
      endTime: new Date(),
      isActive: false
    });

    // Add log
    addLog({
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'user_logout',
      computerId: currentSession.computerId,
      userId: currentUser.id,
      message: `${currentUser.name} завершил работу на ${computer?.name || 'компьютере'}`,
      severity: 'info'
    });

    // Clear session
    setCurrentUser(null);
    setCurrentSession(null);
    setAppState('registration');
  };

  const handleAdminAccess = () => {
    setAppState('admin-login');
  };

  const handleAdminLogin = () => {
    setAppState('admin');
  };

  // Telegram авторизация
  const handleTelegramAuthSuccess = (userData: { chatId: string; username?: string }) => {
    // Проверяем, зарегистрирован ли пользователь
    const existingUser = users.find(user => user.id === userData.chatId);
    
    if (existingUser) {
      // Пользователь уже зарегистрирован, переходим к выбору компьютера
      setCurrentUser(existingUser);
      setAppState('computer-selection');
    } else {
      // Пользователь не зарегистрирован, переходим к регистрации
      // Сохраняем данные Telegram для последующего использования
      localStorage.setItem('pendingTelegramAuth', JSON.stringify(userData));
      setAppState('registration');
    }
  };

  const handleTelegramLogin = () => {
    setAppState('telegram-login');
  };

  const handleDirectLogin = () => {
    setAppState('registration');
  };

  const handleBackToLoginChoice = () => {
    setAppState('login-choice');
  };

  // Auto-save session duration updates
  useEffect(() => {
    if (appState === 'active-session' && currentSession) {
      const interval = setInterval(() => {
        // Update session duration in localStorage
        const updatedSession = {
          ...currentSession,
          lastUpdate: new Date()
        };
        localStorage.setItem('currentSession', JSON.stringify(updatedSession));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [appState, currentSession]);

  const tabs = [
    { id: 'layout' as TabType, label: 'Схема кабинета', icon: Layout },
    { id: 'users' as TabType, label: 'Пользователи', icon: Users },
    { id: 'statistics' as TabType, label: 'Статистика', icon: BarChart3 },
    { id: 'database' as TabType, label: 'База данных', icon: Database },
  ];

  // Render different states
  if (appState === 'login-choice') {
    return (
      <LoginChoice 
        onTelegramLogin={handleTelegramLogin}
        onDirectLogin={handleDirectLogin}
        onBack={() => setAppState('login-choice')}
      />
    );
  }

  if (appState === 'telegram-login') {
    return (
      <TelegramLogin 
        onAuthSuccess={handleTelegramAuthSuccess}
        onBack={handleBackToLoginChoice}
      />
    );
  }

  if (appState === 'telegram-auth') {
    return (
      <TelegramAuth 
        onAuthSuccess={handleTelegramAuthSuccess}
        onCancel={handleBackToLoginChoice}
      />
    );
  }

  if (appState === 'registration') {
    return (
      <UserRegistration 
        onRegister={handleUserRegister}
        onCancel={handleBackToLoginChoice}
        onAdminAccess={handleAdminAccess}
      />
    );
  }

  if (appState === 'admin-login') {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onBack={() => setAppState('login-choice')}
      />
    );
  }

  if (appState === 'computer-selection' && currentUser) {
    return (
      <ComputerSelection 
        computers={computers}
        currentUser={currentUser}
        onSelectComputer={handleComputerSelect}
        onBack={() => setAppState('registration')}
      />
    );
  }

  if (appState === 'active-session' && currentUser && currentSession) {
    const currentComputer = computers.find(c => c.id === currentSession.computerId);
    if (!currentComputer) return null;

    return (
      <ActiveSession 
        currentUser={currentUser}
        currentComputer={currentComputer}
        session={currentSession}
        onLogout={handleLogout}
      />
    );
  }

  // Admin interface
  return (
    <div className="min-h-screen bg-primary-black">
      {/* Header */}
      <header className="bg-primary-dark-gray border-b border-primary-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-accent-orange" />
              <h1 className="text-xl font-bold text-text-white font-mono">
                Компьютерный класс - Админ панель
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAppState('registration')}
                className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors"
              >
                Режим пользователя
              </button>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className="text-sm text-gray-400">
                  {isConnected ? 'Подключено' : 'Отключено'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-primary-dark-gray border-b border-primary-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-accent-orange text-accent-orange'
                      : 'border-transparent text-gray-400 hover:text-text-white hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'layout' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <LabLayout computers={computers} />
            </div>
            <div className="lg:col-span-1">
              <LogsPanel logs={logs} />
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <UserManagement users={users} />
        )}
        
        {activeTab === 'statistics' && statistics && (
          <StatisticsDashboard statistics={statistics} />
        )}
        
        {activeTab === 'database' && (
          <DatabaseManagement onRefresh={() => initializeFromDB()} />
        )}
      </main>
    </div>
  );
}

/**
 * Простая система базы данных на localStorage
 */

export interface DatabaseData {
  computers: any[];
  users: any[];
  sessions: any[];
  logs: any[];
  statistics: any;
}

const DB_KEY = 'computer_lab_db';

// Инициализация базы данных
export const initializeDatabase = (): DatabaseData => {
  const defaultData: DatabaseData = {
    computers: [
      // Row 1
      { id: 'pc-1', name: 'ПК-01', type: 'ПК', status: 'free', position: { row: 0, col: 0 } },
      { id: 'pc-2', name: 'ПК-02', type: 'ПК', status: 'free', position: { row: 0, col: 1 } },
      { id: 'pc-3', name: 'ПК-03', type: 'ПК', status: 'free', position: { row: 0, col: 2 } },
      { id: 'pc-4', name: 'ПК-04', type: 'ПК', status: 'free', position: { row: 0, col: 3 } },
      
      // Row 2
      { id: 'pc-5', name: 'ПК-05', type: 'ПК', status: 'free', position: { row: 1, col: 0 } },
      { id: 'pc-6', name: 'ПК-06', type: 'ПК', status: 'free', position: { row: 1, col: 1 } },
      { id: 'pc-7', name: 'ПК-07', type: 'ПК', status: 'free', position: { row: 1, col: 2 } },
      { id: 'pc-8', name: 'ПК-08', type: 'ПК', status: 'maintenance', position: { row: 1, col: 3 }, maintenance: { reason: 'Обновление ПО', startTime: new Date() } },
      
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
    ],
    users: [],
    sessions: [],
    logs: [],
    statistics: {
      totalComputers: 16,
      occupiedComputers: 0,
      freeComputers: 15,
      maintenanceComputers: 1,
      totalUsers: 0,
      activeSessions: 0,
      averageSessionTime: 0,
      popularTimeSlots: []
    }
  };

  const existingData = localStorage.getItem(DB_KEY);
  if (!existingData) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    const parsed = JSON.parse(existingData);
    // Обновляем статистику
    updateStatistics(parsed);
    return parsed;
  } catch (error) {
    console.error('Error parsing database:', error);
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
};

// Получение данных
export const getDatabase = (): DatabaseData => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    return initializeDatabase();
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing database:', error);
    return initializeDatabase();
  }
};

// Сохранение данных
export const saveDatabase = (data: DatabaseData): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Обновление компьютера
export const updateComputerInDB = (computerId: string, updates: any): void => {
  const db = getDatabase();
  const computerIndex = db.computers.findIndex(c => c.id === computerId);
  
  if (computerIndex !== -1) {
    db.computers[computerIndex] = { ...db.computers[computerIndex], ...updates };
    updateStatistics(db);
    saveDatabase(db);
  }
};

// Добавление пользователя
export const addUserToDB = (user: any): void => {
  const db = getDatabase();
  db.users.push(user);
  updateStatistics(db);
  saveDatabase(db);
};

// Добавление сессии
export const addSessionToDB = (session: any): void => {
  const db = getDatabase();
  db.sessions.push(session);
  updateStatistics(db);
  saveDatabase(db);
};

// Обновление сессии
export const updateSessionInDB = (sessionId: string, updates: any): void => {
  const db = getDatabase();
  const sessionIndex = db.sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex !== -1) {
    db.sessions[sessionIndex] = { ...db.sessions[sessionIndex], ...updates };
    updateStatistics(db);
    saveDatabase(db);
  }
};

// Добавление лога
export const addLogToDB = (log: any): void => {
  const db = getDatabase();
  db.logs.unshift(log);
  // Храним только последние 1000 логов
  if (db.logs.length > 1000) {
    db.logs = db.logs.slice(0, 1000);
  }
  saveDatabase(db);
};

// Обновление статистики
export const updateStatistics = (db: DatabaseData): void => {
  const occupiedComputers = db.computers.filter(c => c.status === 'occupied').length;
  const freeComputers = db.computers.filter(c => c.status === 'free').length;
  const maintenanceComputers = db.computers.filter(c => c.status === 'maintenance').length;
  const activeSessions = db.sessions.filter(s => s.isActive).length;

  // Рассчитываем среднее время сессии
  const completedSessions = db.sessions.filter(s => s.endTime && !s.isActive);
  let averageSessionTime = 0;
  if (completedSessions.length > 0) {
    const totalTime = completedSessions.reduce((sum, session) => {
      const start = new Date(session.startTime).getTime();
      const end = new Date(session.endTime).getTime();
      return sum + (end - start);
    }, 0);
    averageSessionTime = Math.round(totalTime / completedSessions.length / 1000 / 60); // в минутах
  }

  // Рассчитываем популярные часы
  const hourlyUsage: { [key: number]: number } = {};
  db.sessions.forEach(session => {
    const startTime = new Date(session.startTime);
    const hour = startTime.getHours();
    hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
  });

  const popularTimeSlots = Object.entries(hourlyUsage)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Топ 8 часов

  db.statistics = {
    ...db.statistics,
    totalComputers: db.computers.length,
    occupiedComputers,
    freeComputers,
    maintenanceComputers,
    totalUsers: db.users.length,
    activeSessions,
    averageSessionTime,
    popularTimeSlots,
  };
};

// Получение активной сессии пользователя
export const getActiveSession = (userId: string): any => {
  const db = getDatabase();
  return db.sessions.find(s => s.userId === userId && s.isActive);
};

// Получение свободных компьютеров
export const getFreeComputers = (): any[] => {
  const db = getDatabase();
  return db.computers.filter(c => c.status === 'free');
};

// Получение всех компьютеров
export const getAllComputers = (): any[] => {
  const db = getDatabase();
  return db.computers;
};

// Получение всех пользователей
export const getAllUsers = (): any[] => {
  const db = getDatabase();
  return db.users;
};

// Получение всех логов
export const getAllLogs = (): any[] => {
  const db = getDatabase();
  return db.logs;
};

// Получение статистики
export const getStatistics = (): any => {
  const db = getDatabase();
  return db.statistics;
};

// Принудительное обновление статистики
export const refreshStatistics = (): void => {
  const db = getDatabase();
  updateStatistics(db);
  saveDatabase(db);
};

// Принудительный сброс статистики
export const resetStatistics = (): void => {
  const db = getDatabase();
  db.statistics = {
    totalComputers: db.computers.length,
    occupiedComputers: 0,
    freeComputers: db.computers.filter(c => c.status === 'free').length,
    maintenanceComputers: db.computers.filter(c => c.status === 'maintenance').length,
    totalUsers: 0,
    activeSessions: 0,
    averageSessionTime: 0,
    popularTimeSlots: []
  };
  saveDatabase(db);
};

// Очистка базы данных (для тестирования)
export const clearDatabase = (): void => {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentSession');
  localStorage.removeItem('lastSession');
};

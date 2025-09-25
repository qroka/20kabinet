import { create } from 'zustand';
import { Computer, User, LogEntry, Statistics } from '@/types';
import { 
  initializeDatabase, 
  getDatabase, 
  saveDatabase, 
  updateComputerInDB, 
  addUserToDB, 
  addLogToDB,
  getAllComputers,
  getAllUsers,
  getAllLogs,
  getStatistics
} from '@/utils/database';

interface AppState {
  // Computers
  computers: Computer[];
  setComputers: (computers: Computer[]) => void;
  updateComputer: (id: string, updates: Partial<Computer>) => void;
  
  // Users
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  
  // Logs
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  
  // Statistics
  statistics: Statistics | null;
  setStatistics: (stats: Statistics) => void;
  
  // UI State
  selectedComputer: string | null;
  setSelectedComputer: (id: string | null) => void;
  
  // Socket connection
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Database
  initializeFromDB: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  computers: [],
  users: [],
  logs: [],
  statistics: null,
  selectedComputer: null,
  isConnected: false,
  
  // Initialize from database
  initializeFromDB: () => {
    const db = getDatabase();
    set({
      computers: db.computers,
      users: db.users,
      logs: db.logs,
      statistics: db.statistics
    });
  },
  
  // Computer actions
  setComputers: (computers) => set({ computers }),
  
  updateComputer: (id, updates) => {
    // Update in database
    updateComputerInDB(id, updates);
    
    // Update in store
    set((state) => ({
      computers: state.computers.map(computer =>
        computer.id === id ? { ...computer, ...updates } : computer
      )
    }));
  },
  
  // User actions
  setUsers: (users) => set({ users }),
  
  addUser: (user) => {
    // Add to database
    addUserToDB(user);
    
    // Add to store
    set((state) => ({
      users: [...state.users, user]
    }));
  },
  
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user =>
      user.id === id ? { ...user, ...updates } : user
    )
  })),
  
  // Log actions
  addLog: (log) => {
    // Add to database
    addLogToDB(log);
    
    // Add to store
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 100) // Keep last 100 logs
    }));
  },
  
  clearLogs: () => set({ logs: [] }),
  
  // Statistics
  setStatistics: (statistics) => set({ statistics }),
  
  // UI actions
  setSelectedComputer: (selectedComputer) => set({ selectedComputer }),
  
  // Socket actions
  setIsConnected: (isConnected) => set({ isConnected }),
}));

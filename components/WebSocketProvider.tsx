'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStore } from '@/store/useStore';
import { Computer, User, LogEntry } from '@/types';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const { 
    setComputers, 
    setUsers, 
    updateComputer, 
    addLog,
    setIsConnected: setStoreConnected 
  } = useStore();

  useEffect(() => {
    // Подключение к WebSocket серверу
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3003', {
      transports: ['websocket'],
      timeout: 5000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setStoreConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setStoreConnected(false);
    });

    newSocket.on('initial_data', (data: { computers: Computer[], users: User[], logs: LogEntry[] }) => {
      console.log('Received initial data:', data);
      setComputers(data.computers);
      setUsers(data.users);
      data.logs.forEach(log => addLog(log));
    });

    newSocket.on('computer_updated', (computer: Computer) => {
      console.log('Computer updated:', computer);
      updateComputer(computer.id, computer);
    });

    newSocket.on('log_added', (log: LogEntry) => {
      console.log('Log added:', log);
      addLog(log);
    });

    newSocket.on('user_added', (user: User) => {
      console.log('User added:', user);
      // Обновить пользователей в store
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [setComputers, setUsers, updateComputer, addLog, setStoreConnected]);

  const contextValue: WebSocketContextType = {
    socket,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

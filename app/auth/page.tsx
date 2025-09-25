'use client';

import { TelegramAuth } from '@/components/TelegramAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAuthSuccess = (userData: { chatId: string; username?: string }) => {
    // Сохраняем данные авторизации
    localStorage.setItem('telegramAuth', JSON.stringify({
      ...userData,
      authenticated: true,
      timestamp: Date.now()
    }));

    // Перенаправляем на главную страницу
    router.push('/');
  };

  const handleCancel = () => {
    // Перенаправляем на главную страницу
    router.push('/');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <TelegramAuth 
      onAuthSuccess={handleAuthSuccess}
      onCancel={handleCancel}
    />
  );
}





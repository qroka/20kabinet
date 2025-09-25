import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { WebSocketProvider } from '@/components/WebSocketProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Компьютерный класс - Система отслеживания',
  description: 'Веб-приложение для отслеживания использования компьютерного класса в реальном времени',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${robotoMono.variable} font-inter bg-primary-black text-text-white antialiased`}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </body>
    </html>
  );
}

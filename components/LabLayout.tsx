'use client';

import React from 'react';
import { Computer } from '@/types';
import { ComputerCard } from './ComputerCard';
import { useStore } from '@/store/useStore';

interface LabLayoutProps {
  computers: Computer[];
}

export const LabLayout: React.FC<LabLayoutProps> = ({ computers }) => {
  const { selectedComputer, setSelectedComputer } = useStore();

  // Create a grid layout based on computer positions
  const maxRow = Math.max(...computers.map(c => c.position.row), 0);
  const maxCol = Math.max(...computers.map(c => c.position.col), 0);

  const grid = Array(maxRow + 1).fill(null).map(() => Array(maxCol + 1).fill(null));

  // Place computers in grid
  computers.forEach(computer => {
    grid[computer.position.row][computer.position.col] = computer;
  });

  return (
    <div className="bg-primary-black p-6 rounded-lg border border-primary-charcoal">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-white font-mono">
          Схема компьютерного класса
        </h2>
        <p className="text-sm text-gray-400">
          Интерактивная схема расположения ПК
        </p>
      </div>

      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${maxCol + 1}, 1fr)`,
          gridTemplateRows: `repeat(${maxRow + 1}, 1fr)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((computer, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`}>
              {computer ? (
                <ComputerCard
                  computer={computer}
                  isSelected={selectedComputer === computer.id}
                  onClick={() => setSelectedComputer(
                    selectedComputer === computer.id ? null : computer.id
                  )}
                />
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-primary-charcoal rounded-lg opacity-30" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-green animate-pulse" />
          <span className="text-text-white">Свободен</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-red" />
          <span className="text-text-white">Занят</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-orange animate-glow" />
          <span className="text-text-white">Техобслуживание</span>
        </div>
      </div>
    </div>
  );
};

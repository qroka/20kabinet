'use client';

import React, { useState } from 'react';
import { User, CompetenceLevel } from '@/types';
import { useStore } from '@/store/useStore';
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  Users, 
  Search,
  Filter
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
}

const competenceLevels: CompetenceLevel[] = ['Motion Design', 'ЦД', 'VR/AR', 'Мобильная разработка'];

export const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const { addUser, updateUser } = useStore();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompetence, setFilterCompetence] = useState<CompetenceLevel | 'all'>('all');
  const [filterGroup, setFilterGroup] = useState<string>('');

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    competenceLevel: 'Начинающий',
    group: '',
    department: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompetence = filterCompetence === 'all' || user.competenceLevel === filterCompetence;
    const matchesGroup = !filterGroup || user.group?.toLowerCase().includes(filterGroup.toLowerCase());
    
    return matchesSearch && matchesCompetence && matchesGroup;
  });

  const handleAddUser = () => {
    if (newUser.name) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        competenceLevel: newUser.competenceLevel || 'Motion Design',
        group: newUser.group,
        department: newUser.department
      };
      addUser(user);
      setNewUser({ name: '', competenceLevel: 'Motion Design', group: '', department: '' });
      setIsAddingUser(false);
    }
  };

  const getCompetenceColor = (level: CompetenceLevel) => {
    switch (level) {
      case 'Motion Design':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ЦД':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'VR/AR':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Мобильная разработка':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-primary-black p-6 rounded-lg border border-primary-charcoal">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-white font-mono">
          Управление пользователями
        </h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Добавить пользователя
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-dark-gray border border-primary-charcoal rounded-lg text-text-white placeholder-gray-400 focus:border-accent-orange focus:outline-none"
          />
        </div>
        
        <select
          value={filterCompetence}
          onChange={(e) => setFilterCompetence(e.target.value as CompetenceLevel | 'all')}
          className="px-4 py-2 bg-primary-dark-gray border border-primary-charcoal rounded-lg text-text-white focus:border-accent-orange focus:outline-none"
        >
          <option value="all">Все уровни</option>
          {competenceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Фильтр по группе..."
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="px-4 py-2 bg-primary-dark-gray border border-primary-charcoal rounded-lg text-text-white placeholder-gray-400 focus:border-accent-orange focus:outline-none"
        />
      </div>

      {/* Add user form */}
      {isAddingUser && (
        <div className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal mb-6">
          <h3 className="text-lg font-semibold text-text-white mb-4">Добавить пользователя</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Имя пользователя"
              value={newUser.name || ''}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="px-4 py-2 bg-primary-charcoal border border-primary-charcoal rounded-lg text-text-white placeholder-gray-400 focus:border-accent-orange focus:outline-none"
            />
            
            <select
              value={newUser.competenceLevel || 'Motion Design'}
              onChange={(e) => setNewUser({ ...newUser, competenceLevel: e.target.value as CompetenceLevel })}
              className="px-4 py-2 bg-primary-charcoal border border-primary-charcoal rounded-lg text-text-white focus:border-accent-orange focus:outline-none"
            >
              {competenceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Группа/курс"
              value={newUser.group || ''}
              onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
              className="px-4 py-2 bg-primary-charcoal border border-primary-charcoal rounded-lg text-text-white placeholder-gray-400 focus:border-accent-orange focus:outline-none"
            />
            
            <input
              type="text"
              placeholder="Отдел"
              value={newUser.department || ''}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              className="px-4 py-2 bg-primary-charcoal border border-primary-charcoal rounded-lg text-text-white placeholder-gray-400 focus:border-accent-orange focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors"
            >
              Добавить
            </button>
            <button
              onClick={() => setIsAddingUser(false)}
              className="px-4 py-2 bg-primary-charcoal text-text-white rounded-lg hover:bg-primary-charcoal/80 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Пользователи не найдены</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className="bg-primary-dark-gray p-4 rounded-lg border border-primary-charcoal hover:border-accent-orange transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-white">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {user.group && <span>Группа: {user.group}</span>}
                      {user.department && <span>Отдел: {user.department}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold border
                    ${getCompetenceColor(user.competenceLevel)}
                  `}>
                    {user.competenceLevel}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-6 border-t border-primary-charcoal">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {users.filter(u => u.competenceLevel === 'Motion Design').length}
            </p>
            <p className="text-sm text-gray-400">Motion Design</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {users.filter(u => u.competenceLevel === 'ЦД').length}
            </p>
            <p className="text-sm text-gray-400">Цифровой дизайн</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {users.filter(u => u.competenceLevel === 'VR/AR').length}
            </p>
            <p className="text-sm text-gray-400">VR/AR</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">
              {users.filter(u => u.competenceLevel === 'Мобильная разработка').length}
            </p>
            <p className="text-sm text-gray-400">Мобильная разработка</p>
          </div>
        </div>
      </div>
    </div>
  );
};

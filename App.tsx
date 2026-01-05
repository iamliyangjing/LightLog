
import React, { useState, useEffect, useMemo } from 'react';
import { EntryType, LogEntry } from './types';
import { COLORS, ICONS } from './constants';
import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import AddEntryModal from './components/AddEntryModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'stats' | 'settings'>('home');
  
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('lightlog_entries');
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((e: any) => ({ 
        ...e, 
        timestamp: new Date(e.timestamp) 
      }));
    } catch (err) {
      console.error("Failed to parse entries", err);
      return [];
    }
  });

  const [dailyTarget, setDailyTarget] = useState<number>(() => {
    const saved = localStorage.getItem('lightlog_target');
    return saved ? parseInt(saved, 10) : 2000;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<EntryType>(EntryType.DIET);

  useEffect(() => {
    localStorage.setItem('lightlog_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('lightlog_target', dailyTarget.toString());
  }, [dailyTarget]);

  const addEntry = (name: string, calories: number, type: EntryType, duration?: number) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim() || (type === EntryType.DIET ? '未命名饮食' : '未命名运动'),
      calories: Math.abs(calories),
      type,
      timestamp: new Date(),
      duration: type === EntryType.WORKOUT ? duration : undefined
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const todayEntries = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return entries.filter(e => e.timestamp >= startOfDay);
  }, [entries]);

  const todayIntake = todayEntries
    .filter(e => e.type === EntryType.DIET)
    .reduce((sum, e) => sum + e.calories, 0);

  const todayBurned = todayEntries
    .filter(e => e.type === EntryType.WORKOUT)
    .reduce((sum, e) => sum + e.calories, 0);

  const remaining = dailyTarget - todayIntake + todayBurned;

  const handleOpenAdd = (type: EntryType) => {
    setModalType(type);
    setIsModalOpen(true);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F2F2F7] overflow-hidden select-none">
      {/* Safe Area Top Spacing */}
      <div className="h-[env(safe-area-inset-top)] bg-[#F2F2F7]"></div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-[100px]">
        <div className="max-w-xl mx-auto min-h-full">
          {activeTab === 'home' && (
            <HomeView 
              intake={todayIntake} 
              burned={todayBurned} 
              target={dailyTarget} 
              remaining={remaining}
              onAdd={handleOpenAdd}
              recentEntries={todayEntries}
            />
          )}
          {activeTab === 'history' && (
            <HistoryView entries={entries} onDelete={deleteEntry} />
          )}
          {activeTab === 'stats' && (
            <StatsView entries={entries} target={dailyTarget} />
          )}
          {activeTab === 'settings' && (
            <SettingsView target={dailyTarget} setTarget={setDailyTarget} />
          )}
        </div>
      </main>

      <nav className="ios-blur border-t border-gray-200/50 fixed bottom-0 left-0 right-0 h-[88px] flex justify-around items-start pt-3 px-6 z-40">
        <TabButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<ICONS.Home className="w-[26px] h-[26px]" />} 
          label="首页" 
        />
        <TabButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<ICONS.History className="w-[26px] h-[26px]" />} 
          label="明细" 
        />
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<ICONS.Activity className="w-[26px] h-[26px]" />} 
          label="趋势" 
        />
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<ICONS.User className="w-[26px] h-[26px]" />} 
          label="我的" 
        />
      </nav>

      {isModalOpen && (
        <AddEntryModal 
          type={modalType} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addEntry} 
        />
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-[#007AFF] scale-105' : 'text-[#8E8E93] scale-100'}`}
  >
    <div className={`${active ? 'drop-shadow-[0_0_8px_rgba(0,122,255,0.3)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold leading-none ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

export default App;

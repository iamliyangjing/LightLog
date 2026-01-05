
import React from 'react';
import { EntryType, LogEntry } from '../types';
import { COLORS, ICONS } from '../constants';

interface HomeViewProps {
  intake: number;
  burned: number;
  target: number;
  remaining: number;
  onAdd: (type: EntryType) => void;
  recentEntries: LogEntry[];
}

const HomeView: React.FC<HomeViewProps> = ({ intake, burned, target, remaining, onAdd, recentEntries }) => {
  // Ring calculation: Radius 80, Circumference 2 * PI * 80 approx 502
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((intake - burned) / target, 0), 1);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="p-5 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 px-1">
        <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-widest mb-1">健康摘要</p>
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold tracking-tight text-black">轻记 LightLog</h1>
          <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden border border-gray-100">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Dashboard Ring Card */}
      <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center mb-8 relative overflow-hidden">
        {/* Large Circular Progress */}
        <div className="relative w-56 h-56 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              fill="transparent"
              stroke="#F2F2F7"
              strokeWidth="18"
            />
            {/* Intake Progress */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              fill="transparent"
              stroke={remaining >= 0 ? COLORS.intake : '#FF3B30'}
              strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black tracking-tighter text-black">
              {Math.abs(remaining)}
            </span>
            <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mt-1">
              {remaining >= 0 ? '剩余千卡' : '已超千卡'}
            </span>
          </div>
        </div>

        {/* Triple Stat Row */}
        <div className="grid grid-cols-3 w-full pt-4 border-t border-gray-50">
          <div className="text-center">
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">已摄入</p>
            <p className="text-xl font-bold text-black">{intake}</p>
          </div>
          <div className="text-center border-x border-gray-50 px-2">
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">已消耗</p>
            <p className="text-xl font-bold" style={{ color: COLORS.burned }}>{burned}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">目标</p>
            <p className="text-xl font-bold text-gray-400">{target}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => onAdd(EntryType.DIET)}
          className="bg-white rounded-2xl p-5 flex flex-col items-start gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E5F9EB] flex items-center justify-center text-[#34C759] group-active:bg-[#34C759] group-active:text-white transition-colors">
            <ICONS.Plus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[15px] font-bold">记饮食</p>
            <p className="text-[11px] text-[#8E8E93] font-medium mt-0.5">记录摄入热量</p>
          </div>
        </button>
        <button 
          onClick={() => onAdd(EntryType.WORKOUT)}
          className="bg-white rounded-2xl p-5 flex flex-col items-start gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4E5] flex items-center justify-center text-[#FF9500] group-active:bg-[#FF9500] group-active:text-white transition-colors">
            <ICONS.Plus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[15px] font-bold">记运动</p>
            <p className="text-[11px] text-[#8E8E93] font-medium mt-0.5">记录消耗热量</p>
          </div>
        </button>
      </div>

      {/* Today's List */}
      <section className="px-1">
        <div className="flex justify-between items-end mb-5">
          <h3 className="text-xl font-bold tracking-tight">今日记录</h3>
          <span className="text-[#8E8E93] text-[13px] font-medium">{recentEntries.length} 条数据</span>
        </div>
        <div className="space-y-3">
          {recentEntries.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-gray-200 p-10 rounded-3xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ICONS.Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-[#8E8E93] text-sm font-medium">开始记录你的一天</p>
            </div>
          ) : (
            recentEntries.map(entry => (
              <div key={entry.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${entry.type === EntryType.DIET ? 'bg-[#E5F9EB] text-[#34C759]' : 'bg-[#FFF4E5] text-[#FF9500]'}`}>
                    {entry.type === EntryType.DIET ? '🍱' : '🏃'}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-black">{entry.name}</p>
                    <p className="text-[11px] text-[#8E8E93] font-semibold">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {entry.duration && ` • ${entry.duration} min`}
                    </p>
                  </div>
                </div>
                <div className={`text-[15px] font-black ${entry.type === EntryType.DIET ? 'text-black' : 'text-[#FF9500]'}`}>
                  {entry.type === EntryType.DIET ? `+${entry.calories}` : `-${entry.calories}`} <span className="text-[10px] font-bold opacity-40">KCAL</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;


import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EntryType, LogEntry } from '../types';
import { COLORS } from '../constants';

interface StatsViewProps {
  entries: LogEntry[];
  target: number;
}

const StatsView: React.FC<StatsViewProps> = ({ entries, target }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(date => {
      const dateStr = date.toDateString();
      const dayEntries = entries.filter(e => e.timestamp.toDateString() === dateStr);
      const intake = dayEntries.filter(e => e.type === EntryType.DIET).reduce((s, e) => s + e.calories, 0);
      const burned = dayEntries.filter(e => e.type === EntryType.WORKOUT).reduce((s, e) => s + e.calories, 0);
      return {
        name: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
        intake,
        burned,
        net: intake - burned
      };
    });
  }, [entries]);

  const avgIntake = Math.round(chartData.reduce((s, d) => s + d.intake, 0) / 7);

  return (
    <div className="p-6 pt-12 animate-in zoom-in-95 duration-300">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">健康趋势</h1>
        <p className="text-[#8E8E93] text-sm mt-1">最近 7 天的热量变化</p>
      </header>

      {/* Chart Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#F2F2F7' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="intake" fill={COLORS.intake} radius={[4, 4, 0, 0]} name="摄入" />
              <Bar dataKey="burned" fill={COLORS.burned} radius={[4, 4, 0, 0]} name="消耗" />
              <ReferenceLine y={target} stroke="#8E8E93" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#34C759]" />
            <span className="text-[11px] font-medium text-[#8E8E93]">摄入热量</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF9500]" />
            <span className="text-[11px] font-medium text-[#8E8E93]">运动消耗</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-[#8E8E93] font-bold uppercase mb-1">平均每日摄入</p>
          <p className="text-2xl font-bold">{avgIntake} <span className="text-xs font-normal">kcal</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-[#8E8E93] font-bold uppercase mb-1">对比目标</p>
          <p className={`text-2xl font-bold ${avgIntake > target ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
            {avgIntake > target ? `+${avgIntake - target}` : `-${target - avgIntake}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsView;

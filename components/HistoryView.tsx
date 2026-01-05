
import React from 'react';
import { EntryType, LogEntry } from '../types';

interface HistoryViewProps {
  entries: LogEntry[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ entries, onDelete }) => {
  // Group entries by date
  const groups = entries.reduce((acc: any, entry) => {
    const date = entry.timestamp.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 pt-12 animate-in slide-in-from-right duration-300">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">明细记录</h1>
      </header>

      {Object.keys(groups).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-40">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">还没有任何记录</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([date, items]: [string, any]) => (
            <section key={date}>
              <h3 className="text-sm font-bold text-[#8E8E93] mb-3 sticky top-0 py-1 bg-[#F2F2F7] z-10">{date}</h3>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
                {items.map((entry: LogEntry) => (
                  <div key={entry.id} className="p-4 flex justify-between items-center active:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-8 rounded-full ${entry.type === EntryType.DIET ? 'bg-[#34C759]' : 'bg-[#FF9500]'}`} />
                      <div>
                        <p className="font-semibold text-sm">{entry.name}</p>
                        <p className="text-[11px] text-[#8E8E93]">
                          {entry.type === EntryType.DIET ? '饮食' : '运动'} • {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {entry.duration && ` • ${entry.duration} min`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-sm font-bold ${entry.type === EntryType.DIET ? 'text-black' : 'text-[#FF9500]'}`}>
                        {entry.type === EntryType.DIET ? `+${entry.calories}` : `-${entry.calories}`} kcal
                      </div>
                      <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-2 text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;

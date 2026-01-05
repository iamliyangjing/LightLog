
import React, { useState, useEffect, useRef } from 'react';
import { EntryType } from '../types';

interface AddEntryModalProps {
  type: EntryType;
  onClose: () => void;
  onAdd: (name: string, calories: number, type: EntryType, duration?: number) => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ type, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay to ensure modal animation is active before focus
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name && calories) {
      const durVal = duration ? parseInt(duration, 10) : undefined;
      onAdd(name, parseInt(calories, 10), type, durVal);
      onClose();
    }
  };

  const dietShortcuts = [
    { label: '米饭', cal: 116 },
    { label: '煎蛋', cal: 140 },
    { label: '牛排', cal: 250 },
    { label: '苹果', cal: 52 },
    { label: '拿铁', cal: 120 },
    { label: '沙拉', cal: 180 }
  ];

  const workoutShortcuts = [
    { label: '跑步', cal: 450, dur: 30 },
    { label: '游泳', cal: 600, dur: 45 },
    { label: '单车', cal: 500, dur: 40 },
    { label: '瑜伽', cal: 150, dur: 60 },
    { label: '走路', cal: 120, dur: 30 },
    { label: '深蹲', cal: 300, dur: 20 }
  ];

  const shortcuts = type === EntryType.DIET ? dietShortcuts : workoutShortcuts;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-300">
      {/* Backdrop closer */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#F2F2F7] rounded-t-[40px] p-6 pb-12 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-500 ease-out border-t border-white/50">
        {/* Grabber handle */}
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 opacity-50" />

        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="text-[#007AFF] text-[17px] font-medium active:opacity-50">取消</button>
          <h2 className="text-[17px] font-bold tracking-tight">{type === EntryType.DIET ? '记录饮食' : '记录运动'}</h2>
          <button 
            onClick={() => handleSubmit()} 
            disabled={!name || !calories}
            className={`text-[17px] font-bold transition-opacity ${(!name || !calories) ? 'text-gray-300' : 'text-[#007AFF] active:opacity-50'}`}
          >
            完成
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50 border border-gray-100">
            <div className="p-4 flex items-center gap-4">
              <span className="text-[15px] font-semibold w-12 text-black">{type === EntryType.DIET ? '内容' : '运动'}</span>
              <input 
                ref={inputRef}
                type="text" 
                placeholder={type === EntryType.DIET ? "今天吃了什么？" : "刚才做了什么运动？"}
                className="flex-1 outline-none text-[16px] font-medium placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="p-4 flex items-center gap-4">
              <span className="text-[15px] font-semibold w-12 text-black">热量</span>
              <input 
                type="number" 
                inputMode="numeric"
                placeholder="0"
                className="flex-1 outline-none text-[16px] font-bold text-[#007AFF] placeholder:text-gray-300"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <span className="text-[13px] text-[#8E8E93] font-bold tracking-tighter uppercase">kcal</span>
            </div>
            
            {type === EntryType.WORKOUT && (
              <div className="p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-[15px] font-semibold w-12 text-black">时长</span>
                <input 
                  type="number" 
                  inputMode="numeric"
                  placeholder="0"
                  className="flex-1 outline-none text-[16px] font-bold text-[#FF9500] placeholder:text-gray-300"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <span className="text-[13px] text-[#8E8E93] font-bold tracking-tighter uppercase">min</span>
              </div>
            )}
          </div>

          <div className="px-2">
            <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3 px-1">快速选择</p>
            <div className="grid grid-cols-3 gap-2">
              {shortcuts.map(item => (
                <button 
                  key={item.label}
                  type="button" 
                  onClick={() => {
                    setName(item.label);
                    setCalories(item.cal.toString());
                    if ('dur' in item) {
                      setDuration(item.dur!.toString());
                    }
                  }}
                  className={`py-3 rounded-xl shadow-sm border border-gray-50 transition-all active:scale-95 text-[14px] font-bold ${name === item.label ? 'bg-[#007AFF] text-white border-[#007AFF]' : 'bg-white text-black hover:bg-gray-50'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[12px] text-[#8E8E93] text-center font-medium opacity-60 mt-4 leading-snug">
            {type === EntryType.DIET 
              ? "准确记录卡路里是开启减脂之路的第一步。" 
              : "记录运动时长可以帮助您更好地评估训练强度。"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;

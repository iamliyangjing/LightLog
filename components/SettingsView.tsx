
import React from 'react';

interface SettingsViewProps {
  target: number;
  setTarget: (val: number) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ target, setTarget }) => {
  return (
    <div className="p-6 pt-12 animate-in slide-in-from-left duration-300">
      <header className="mb-10 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 shadow-sm flex items-center justify-center overflow-hidden border-4 border-white">
          <img src="https://picsum.photos/seed/lightlog/200/200" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold">健康达人</h1>
        <p className="text-[#8E8E93] text-sm">追求更好的自己</p>
      </header>

      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider ml-4 mb-2">个人目标</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <span className="font-medium">每日摄入目标</span>
              <div className="flex items-center gap-3">
                 <input 
                    type="number" 
                    value={target} 
                    onChange={(e) => setTarget(parseInt(e.target.value) || 2000)}
                    className="w-20 text-right font-bold text-[#007AFF] outline-none"
                 />
                 <span className="text-sm text-[#8E8E93]">kcal</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider ml-4 mb-2">更多</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <SettingsItem label="健康提醒" />
             <SettingsItem label="数据导出" />
             <SettingsItem label="隐私协议" />
             <SettingsItem label="关于轻记" />
          </div>
        </section>

        <button className="w-full bg-white text-[#FF3B30] font-semibold py-4 rounded-2xl shadow-sm active:bg-red-50 transition-colors">
          重置所有数据
        </button>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ label: string }> = ({ label }) => (
  <button className="w-full p-4 flex justify-between items-center active:bg-gray-50 text-left">
    <span className="font-medium">{label}</span>
    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default SettingsView;


import React, { useRef, useState, useEffect } from 'react';
import { LogEntry, EntryType } from '../types';

interface SettingsViewProps {
  target: number;
  setTarget: (val: number) => void;
  avatar: string;
  setAvatar: (val: string) => void;
  onReset: () => void;
  entries: LogEntry[];
}

const SettingsView: React.FC<SettingsViewProps> = ({ target, setTarget, avatar, setAvatar, onReset, entries }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem('lightlog_reminders') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('lightlog_reminders', remindersEnabled.toString());
  }, [remindersEnabled]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('图片太大啦，请选择 2MB 以内的图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    if (entries.length === 0) {
      alert('目前还没有任何记录可以导出。');
      return;
    }

    // Prepare CSV header
    const headers = ['日期', '类型', '名称', '卡路里(kcal)', '时长(min)'];
    
    // Convert entries to CSV rows
    const csvContent = entries.map(e => {
      const date = e.timestamp.toLocaleString('zh-CN');
      const type = e.type === EntryType.DIET ? '饮食' : '运动';
      return [
        `"${date}"`,
        `"${type}"`,
        `"${e.name}"`,
        e.calories,
        e.duration || 0
      ].join(',');
    });

    // Add BOM for Excel Chinese support
    const blobContent = '\uFEFF' + [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([blobContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `LightLog_数据备份_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleReminders = async () => {
    if (!remindersEnabled) {
      if (!("Notification" in window)) {
        alert("很抱歉，您的浏览器不支持桌面通知。");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setRemindersEnabled(true);
        new Notification("轻记 LightLog", {
          body: "健康提醒已开启！我们将陪伴你坚持每一天。",
          icon: "https://img.icons8.com/ios-filled/100/007AFF/apple-health.png"
        });
      } else {
        alert("请在浏览器设置中允许通知权限，以开启提醒功能。");
      }
    } else {
      setRemindersEnabled(false);
    }
  };

  if (showAbout) {
    return (
      <div className="p-6 pt-12 animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar max-h-screen">
        <button 
          onClick={() => setShowAbout(false)}
          className="flex items-center text-[#007AFF] font-medium mb-8 active:opacity-50"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回设置
        </button>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-[22%] mx-auto mb-4 shadow-xl border border-gray-100 flex items-center justify-center p-3">
            <img src="https://img.icons8.com/ios-filled/512/007AFF/apple-health.png" alt="App Icon" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold">轻记 LightLog</h1>
          <p className="text-[#8E8E93] text-sm mt-1 font-medium tracking-widest uppercase">Version 1.1.0</p>
        </div>

        <article className="prose prose-sm bg-white p-6 rounded-[28px] shadow-sm text-gray-800 leading-relaxed space-y-4">
          <p className="font-bold text-[#007AFF] text-center border-b border-gray-50 pb-4 mb-4">
            轻记，不仅是一款记录热量的工具，更是你追求极简健康生活的一场艺术修行。
          </p>
          <p>在这个信息冗余的时代，“轻记”主张回归记录的本质。我们深知，每一次克制的饮食、每一场挥汗如雨的奔跑，都是通往更好自己的笃定脚步。</p>
          <p>我们打造了一个如呼吸般自然、如羽毛般轻盈的数字空间，让“管理身材”不再是一项沉重的负担，而是一场悦己的视觉享受。</p>
          
          <h4 className="font-bold text-black pt-2 text-base">设计哲学</h4>
          <p>灵感源自苹果原生的健康美学。中心那枚随动而变的环形进度条，实时平衡着“摄入”与“消耗”的微妙关系。色彩在指尖流转，目标触手可及，让复杂的数字瞬间化为直观的动力。</p>
          
          <h4 className="font-bold text-black pt-2 text-base">隐私与安全</h4>
          <p>没有社交干扰，没有算法焦虑。所有数据均静静沉淀在你的设备本地，如同一本私密的电子日记，只属于你，也只服务于你。</p>
          
          <p className="text-center text-[#8E8E93] text-xs pt-8 border-t border-gray-50">
            在轻记，我们记录热量，更记录你对生活的热爱。<br/>
            轻装上阵，记入未来。
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 animate-in slide-in-from-left duration-300">
      <header className="mb-10 text-center">
        <div className="relative inline-block">
          <button 
            onClick={handleAvatarClick}
            className="w-24 h-24 bg-white rounded-full mx-auto mb-4 shadow-md flex items-center justify-center overflow-hidden border-4 border-white active:scale-95 transition-transform"
          >
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>
          </button>
          <div className="absolute bottom-4 right-0 bg-[#007AFF] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
             </svg>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
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
                    className="w-20 text-right font-bold text-[#007AFF] outline-none bg-transparent"
                 />
                 <span className="text-sm text-[#8E8E93]">kcal</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider ml-4 mb-2">更多设置</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <div className="p-4 flex justify-between items-center bg-white">
                <span className="font-medium">健康提醒</span>
                <button 
                  onClick={handleToggleReminders}
                  className={`relative w-11 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none ${remindersEnabled ? 'bg-[#34C759]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-sm transform ${remindersEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
             </div>
             <SettingsItem label="数据导出" onClick={handleExportData} icon={
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
             } />
             <SettingsItem label="隐私协议" />
             <SettingsItem label="关于轻记" onClick={() => setShowAbout(true)} />
          </div>
        </section>

        <button 
          onClick={onReset}
          className="w-full bg-white text-[#FF3B30] font-semibold py-4 rounded-2xl shadow-sm active:bg-red-50 transition-colors"
        >
          重置所有数据
        </button>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ label: string; onClick?: () => void; icon?: React.ReactNode }> = ({ label, onClick, icon }) => (
  <button 
    onClick={onClick}
    className="w-full p-4 flex justify-between items-center active:bg-gray-50 text-left transition-colors"
  >
    <span className="font-medium">{label}</span>
    <div className="flex items-center">
      {icon ? icon : (
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  </button>
);

export default SettingsView;

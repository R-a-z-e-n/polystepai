
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  nativeLanguage: string;
  setNativeLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  nativeLanguage, 
  setNativeLanguage, 
  targetLanguage, 
  setTargetLanguage 
}) => {
  const menuItems = [
    { view: AppView.DASHBOARD, icon: 'fa-chart-line', label: 'Dashboard', group: 'Learn' },
    { view: AppView.GRAMMAR, icon: 'fa-book-open', label: 'Grammar Hub', group: 'Learn' },
    { view: AppView.VOCABULARY, icon: 'fa-layer-group', label: 'Vocab Vault', group: 'Learn' },
    { view: AppView.WORKOUTS, icon: 'fa-dumbbell', label: 'Workouts', group: 'Practice' },
    { view: AppView.CONVERSATION, icon: 'fa-comments', label: 'AI Partner', group: 'Practice' },
    { view: AppView.CULTURE, icon: 'fa-globe', label: 'Cultural Layer', group: 'Practice' },
    { view: AppView.COMMUNITY, icon: 'fa-people-group', label: 'Community', group: 'Social' },
    { view: AppView.OFFLINE, icon: 'fa-cloud-arrow-down', label: 'Offline Mode', group: 'Social' },
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Italian', 'Chinese', 'Portuguese'];

  return (
    <aside className="w-20 md:w-72 bg-indigo-950 text-white flex flex-col transition-all duration-300 shadow-2xl z-50 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
          <i className="fa-solid fa-stairs"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">PolyStep<span className="text-indigo-400">AI</span></span>
      </div>

      <div className="px-4 mt-2 hidden md:block">
        <div className="bg-indigo-900/40 p-4 rounded-2xl border border-indigo-800/50">
          <div className="mb-4">
            <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2 mb-1.5">
              <i className="fa-solid fa-user text-[8px]"></i> I Speak
            </label>
            <div className="relative">
              <select 
                value={nativeLanguage} 
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full bg-indigo-950 border border-indigo-800 rounded-xl p-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-indigo-900 transition-colors"
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
          <div className="mt-2">
            <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2 mb-1.5">
              <i className="fa-solid fa-graduation-cap text-[8px]"></i> I'm Learning
            </label>
            <div className="relative">
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-indigo-950 border border-indigo-800 rounded-xl p-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-indigo-900 transition-colors text-indigo-200"
              >
                {languages.filter(l => l !== nativeLanguage).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar px-2">
        {['Learn', 'Practice', 'Social'].map(group => (
          <div key={group} className="mb-4">
            <div className="px-4 mb-2 hidden md:block">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{group}</span>
            </div>
            {menuItems.filter(item => item.group === group).map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 transition-all relative group rounded-xl mb-1 ${
                  activeView === item.view 
                    ? 'bg-indigo-800 text-white shadow-lg' 
                    : 'text-indigo-300 hover:bg-indigo-900 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeView === item.view ? 'bg-indigo-500 text-white' : 'bg-indigo-900/50 text-indigo-400 group-hover:bg-indigo-800'}`}>
                  <i className={`fa-solid ${item.icon} text-base`}></i>
                </div>
                <span className="hidden md:block font-semibold text-sm tracking-wide">{item.label}</span>
                {item.view === AppView.OFFLINE && (
                  <div className="ml-auto hidden md:block">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-900">
        <div className="bg-indigo-900/40 p-3 rounded-2xl mb-4 hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">PolyTokens</span>
            <span className="text-xs font-bold text-amber-400">1,240 🪙</span>
          </div>
          <div className="w-full bg-indigo-950 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[60%]"></div>
          </div>
        </div>
        <button className="w-full hidden md:flex items-center gap-3 text-indigo-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-indigo-900/30">
          <i className="fa-solid fa-gear"></i>
          <span className="text-sm font-semibold">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

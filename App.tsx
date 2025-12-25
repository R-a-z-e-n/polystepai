
import React, { useState } from 'react';
import { AppView, VocabularyWord } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GrammarHub from './components/GrammarHub';
import VocabularyVault from './components/VocabularyVault';
import Workouts from './components/Workouts';
import AIConversation from './components/AIConversation';
import CulturalLayer from './components/CulturalLayer';
import Community from './components/Community';
import OfflineMode from './components/OfflineMode';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([
    { id: '1', word: 'Aprovechar', translation: 'To take advantage of', mastery: 65, lastReviewed: '2023-10-25', example: 'Debes aprovechar esta oportunidad.' },
    { id: '2', word: 'Ojalá', translation: 'Hopefully / I wish', mastery: 80, lastReviewed: '2023-10-26', example: 'Ojalá llueva pronto.' },
    { id: '3', word: 'Desarrollar', translation: 'To develop', mastery: 40, lastReviewed: '2023-10-24', example: 'Queremos desarrollar una nueva app.' },
  ]);

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard vocabulary={vocabulary} language={targetLanguage} nativeLanguage={nativeLanguage} />;
      case AppView.GRAMMAR:
        return <GrammarHub language={targetLanguage} nativeLanguage={nativeLanguage} />;
      case AppView.VOCABULARY:
        return <VocabularyVault vocabulary={vocabulary} setVocabulary={setVocabulary} />;
      case AppView.WORKOUTS:
        return <Workouts language={targetLanguage} nativeLanguage={nativeLanguage} />;
      case AppView.CONVERSATION:
        return <AIConversation language={targetLanguage} nativeLanguage={nativeLanguage} />;
      case AppView.CULTURE:
        return <CulturalLayer language={targetLanguage} />;
      case AppView.COMMUNITY:
        return <Community language={targetLanguage} />;
      case AppView.OFFLINE:
        return <OfflineMode enabled={offlineEnabled} setEnabled={setOfflineEnabled} language={targetLanguage} />;
      default:
        return <Dashboard vocabulary={vocabulary} language={targetLanguage} nativeLanguage={nativeLanguage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        nativeLanguage={nativeLanguage}
        setNativeLanguage={setNativeLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
      />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                {activeView.charAt(0) + activeView.slice(1).toLowerCase().replace('_', ' ')}
              </h1>
              {offlineEnabled && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fa-solid fa-cloud-arrow-down"></i> OFFLINE READY
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium">Mastering {targetLanguage} from {nativeLanguage} • Intermediate</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="font-bold text-indigo-600 flex items-center gap-2">
                  <i className="fa-solid fa-fire animate-pulse"></i> 12 Day Streak
                </span>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[80%]"></div>
                   </div>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">80% to Daily Goal</span>
                </div>
             </div>
             <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">Alex Rivera</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Level 18 Adept</p>
               </div>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm" />
             </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto pb-12">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;

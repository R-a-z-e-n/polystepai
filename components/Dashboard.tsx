
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { VocabularyWord } from '../types';

interface DashboardProps {
  vocabulary: VocabularyWord[];
  language: string;
  nativeLanguage: string;
}

const Dashboard: React.FC<DashboardProps> = ({ vocabulary, language, nativeLanguage }) => {
  const chartData = [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 15 },
    { day: 'Sat', minutes: 50 },
    { day: 'Sun', minutes: 40 },
  ];

  const masteryData = [
    { range: '0-20%', count: 5, color: '#f43f5e' },
    { range: '21-40%', count: 12, color: '#fb923c' },
    { range: '41-60%', count: 25, color: '#fbbf24' },
    { range: '61-80%', count: 18, color: '#818cf8' },
    { range: '81-100%', count: 10, color: '#10b981' },
  ];

  const stats = [
    { label: 'Fluency Level', value: 'B1 High', icon: 'fa-brain', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Vault Size', value: vocabulary.length * 10, icon: 'fa-list-check', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Mastery', value: '72%', icon: 'fa-bullseye', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Tokens', value: '1,240', icon: 'fa-coins', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const adaptiveTips = [
    { text: "You're mixing up 'Ser' vs 'Estar'. Revisit the Grammar Hub module.", icon: 'fa-circle-exclamation', color: 'text-rose-500' },
    { text: "Your speaking fluency is B2, but your writing is B1. Try more essay workouts.", icon: 'fa-pen-nib', color: 'text-indigo-500' },
    { text: "Spaced Repetition: 5 verbs from last week are ready for review.", icon: 'fa-clock', color: 'text-amber-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} text-xl shadow-inner`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Learning Momentum</h3>
                <p className="text-sm text-gray-400 font-medium">Daily study minutes this week</p>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-2xl">
                 <span className="text-xs font-bold text-indigo-600">Avg: 38m / day</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-sparkles text-indigo-500"></i> Adaptive Feedback
               </h3>
               <div className="space-y-4">
                  {adaptiveTips.map((tip, i) => (
                    <div key={i} className="flex gap-4 group p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-default">
                       <div className={`mt-1 text-sm ${tip.color}`}><i className={`fa-solid ${tip.icon}`}></i></div>
                       <p className="text-xs font-medium text-slate-600 leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                 Full Analysis Report
               </button>
            </div>

            <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 relative overflow-hidden group">
               <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full transition-transform group-hover:scale-125 duration-700"></div>
               <h3 className="text-lg font-bold text-amber-900 mb-6 flex items-center gap-2 relative z-10">
                 <i className="fa-solid fa-coins text-amber-500"></i> PolyRewards
               </h3>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-amber-800">Next Milestone</span>
                     <span className="text-xs font-bold text-amber-500">250 / 500 XP</span>
                  </div>
                  <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden shadow-inner">
                     <div className="bg-amber-400 h-full w-[50%]"></div>
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium italic mt-2">
                    "Reach 500 XP to unlock the exclusive 'Castilian Accent' voice pack for Carlos!"
                  </p>
                  <button className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-200 mt-4 hover:bg-amber-600 transition-all">
                    Open Rewards Vault
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Mastery Distribution</h3>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masteryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {masteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-600">Mastered Words</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">142</span>
               </div>
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-xs font-bold text-slate-600">Critical Review</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600">12</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
                <i className="fa-solid fa-stairs"></i>
             </div>
             <h3 className="text-xl font-bold mb-4 relative z-10">Intermediate Peak</h3>
             <p className="text-xs opacity-80 leading-relaxed mb-6 relative z-10">
               Learners from {nativeLanguage} often plateau here. PolyStepAI has detected you're ready for **Indirect Object Pronouns**.
             </p>
             <button className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-950/20 hover:bg-indigo-400 transition-colors">
                Start Next Unit
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

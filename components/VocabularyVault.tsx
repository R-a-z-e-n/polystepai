
import React from 'react';
import { VocabularyWord } from '../types';

interface VocabularyVaultProps {
  vocabulary: VocabularyWord[];
  setVocabulary: React.Dispatch<React.SetStateAction<VocabularyWord[]>>;
}

const VocabularyVault: React.FC<VocabularyVaultProps> = ({ vocabulary, setVocabulary }) => {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'bg-green-500';
    if (mastery >= 50) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
           <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
           <input 
              type="text" 
              placeholder="Filter my vault..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
           />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2">
           <i className="fa-solid fa-plus"></i> Add New Word
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Word</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Translation</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mastery</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Review</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vocabulary.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                   <div className="font-bold text-slate-800">{v.word}</div>
                   <div className="text-xs text-gray-400 mt-1 line-clamp-1">{v.example}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{v.translation}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${getMasteryColor(v.mastery)}`} style={{width: `${v.mastery}%`}}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{v.mastery}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{v.lastReviewed}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100">
                         <i className="fa-solid fa-play text-xs"></i>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100">
                         <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 text-3xl">
               <i className="fa-solid fa-brain"></i>
            </div>
            <div>
               <h4 className="font-bold text-indigo-900">Spaced Repetition Active</h4>
               <p className="text-sm text-indigo-700">12 words are ready for your daily review. Average mastery increased by 4% this week.</p>
            </div>
         </div>
         <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-600 text-3xl">
               <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
               <h4 className="font-bold text-rose-900">Leaking Vocabulary</h4>
               <p className="text-sm text-rose-700">You haven't reviewed 5 high-priority words in over a month. Don't lose your progress!</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VocabularyVault;

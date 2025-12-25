
import React, { useState } from 'react';
import { generateGrammarExplanation } from '../services/geminiService';
import { GrammarNote } from '../types';

interface GrammarHubProps {
  language: string;
  nativeLanguage: string;
}

const GrammarHub: React.FC<GrammarHubProps> = ({ language, nativeLanguage }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<GrammarNote | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateGrammarExplanation(topic, language);
      setExplanation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const commonTopics = ['Subjunctive Mood', 'Past Participles', 'Direct Object Pronouns', 'Conditional Tense', 'Irregular Verbs'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Search Topic</h3>
          <div className="relative">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Subjunctive"
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="absolute right-2 top-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            </button>
          </div>
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Popular Topics</p>
            <div className="flex flex-wrap gap-2">
              {commonTopics.map(t => (
                <button 
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full hover:bg-indigo-100 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
           <div className="flex items-center gap-3 text-indigo-800 mb-3">
              <i className="fa-solid fa-lightbulb"></i>
              <span className="font-bold">Pro Tip</span>
           </div>
           <p className="text-sm text-indigo-700 leading-relaxed">
             Understanding {language} rules from {nativeLanguage} helps you spot "False Friends" and logic patterns.
           </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        {explanation ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-bold text-indigo-900">{explanation.topic}</h2>
            </div>
            <div className="p-8">
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {explanation.explanation}
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <i className="fa-solid fa-vial-circle-check text-indigo-500"></i>
                  Usage Examples
                </h4>
                {explanation.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl border-l-4 border-indigo-500 italic text-gray-700">
                    {ex}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                 <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                    Add to Review Deck
                 </button>
                 <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    Find Exercises
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 h-full min-h-[400px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <i className="fa-solid fa-book-open-reader text-6xl mb-4"></i>
            <p className="text-lg font-medium">Get {language} grammar insights in your {nativeLanguage}.</p>
            <p className="text-sm mt-2">Deep explanations including logic, rules, and context.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarHub;

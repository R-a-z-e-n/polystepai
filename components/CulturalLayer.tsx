
import React from 'react';

interface CulturalLayerProps {
  language: string;
}

const CulturalLayer: React.FC<CulturalLayerProps> = ({ language }) => {
  const culturalFacts = [
    {
      title: 'Common Slang',
      content: 'In many Spanish-speaking countries, "¡Qué guay!" or "¡Qué padre!" are used for "How cool!", but use varies by region.',
      type: 'idiom'
    },
    {
      title: 'Etiquette Tip',
      content: 'In French business settings, using "vous" is non-negotiable until specifically invited to use "tu".',
      type: 'culture'
    },
    {
      title: 'False Cognates',
      content: '"Actual" in Spanish means "current", not "real" (which is "real"). Be careful with this trap!',
      type: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalFacts.map((fact, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                    fact.type === 'idiom' ? 'bg-amber-100 text-amber-600' : 
                    fact.type === 'culture' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                     <i className={`fa-solid ${
                       fact.type === 'idiom' ? 'fa-quote-left' : 
                       fact.type === 'culture' ? 'fa-users' : 'fa-triangle-exclamation'
                     }`}></i>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{fact.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{fact.content}</p>
                </div>
                <button className="mt-6 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                   Learn More <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
             </div>
          ))}
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
             <h3 className="text-xl font-bold text-gray-800">Weekly Cultural Spotlight: Regional Dialects</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
             <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Understanding the difference between Peninsular Spanish and Latin American variants is crucial for intermediate learners. From the "ceceo" in Spain to the "voseo" in Argentina, these nuances make you sound more like a native speaker.
                </p>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="font-bold text-indigo-600">Spain:</div>
                      <div className="text-gray-600">"Vosotros" for plural you.</div>
                   </div>
                   <div className="flex gap-4">
                      <div className="font-bold text-indigo-600">Mexico:</div>
                      <div className="text-gray-600">"Ustedes" is the standard plural.</div>
                   </div>
                </div>
                <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors">
                   Deep Dive into Dialects
                </button>
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 overflow-hidden">
                <img src="https://picsum.photos/600/400?grayscale" alt="Cultural" className="rounded-xl w-full h-auto grayscale opacity-80" />
             </div>
          </div>
       </div>
    </div>
  );
};

export default CulturalLayer;

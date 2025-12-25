
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { getGeminiClient, decodeBase64, encodeBase64, decodeAudioData, translateText } from '../services/geminiService';

interface AIConversationProps {
  language: string;
  nativeLanguage: string;
}

const AIConversation: React.FC<AIConversationProps> = ({ language, nativeLanguage }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  // Translation and speech states
  const [translationTarget, setTranslationTarget] = useState(nativeLanguage);
  const [showTranslation, setShowTranslation] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  
  // User speech states
  const [liveUserText, setLiveUserText] = useState("");
  const [isTranslatingUser, setIsTranslatingUser] = useState(false);
  
  // AI speech states
  const [liveAiText, setLiveAiText] = useState("");
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  
  const [history, setHistory] = useState<{original: string, translation: string, speaker: 'user' | 'ai'}[]>([]);

  // Sync translation target with app's native language state
  useEffect(() => {
    setTranslationTarget(nativeLanguage);
  }, [nativeLanguage]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const speechSpeedRef = useRef(1.0);

  useEffect(() => {
    speechSpeedRef.current = speechSpeed;
  }, [speechSpeed]);
  
  const tempUserTextRef = useRef("");
  const tempAiTextRef = useRef("");

  const translationLanguages = ["English", "French", "German", "Spanish", "Chinese", "Japanese", "Portuguese", "Italian"];

  const handleTranslation = async (text: string, speaker: 'user' | 'ai') => {
    if (!text.trim()) return;
    
    if (speaker === 'user') setIsTranslatingUser(true);
    else setIsTranslatingAi(true);
    
    try {
      // We always translate to the user's nativeLanguage (e.g. English)
      const translation = await translateText(text, language, translationTarget);
      setHistory(prev => [{ original: text, translation, speaker }, ...prev].slice(0, 15));
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      if (speaker === 'user') setIsTranslatingUser(false);
      else setIsTranslatingAi(false);
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    setLiveUserText("");
    setLiveAiText("");
    tempUserTextRef.current = "";
    tempAiTextRef.current = "";
    
    try {
      const ai = getGeminiClient();
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);

            if (audioContextRef.current && streamRef.current) {
              const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
              const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encodeBase64(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current.destination);
            }
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              const currentSpeed = speechSpeedRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.playbackRate.value = currentSpeed;
              source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += (audioBuffer.duration / currentSpeed);
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              tempUserTextRef.current += text;
              setLiveUserText(tempUserTextRef.current);
              if (tempAiTextRef.current) {
                 tempAiTextRef.current = "";
                 setLiveAiText("");
              }
            }
            
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              tempAiTextRef.current += text;
              setLiveAiText(tempAiTextRef.current);
              if (tempUserTextRef.current) {
                 tempUserTextRef.current = "";
                 setLiveUserText("");
              }
            }

            if (message.serverContent?.turnComplete) {
              if (tempUserTextRef.current.trim()) {
                handleTranslation(tempUserTextRef.current, 'user');
                tempUserTextRef.current = "";
                setLiveUserText("");
              }
              if (tempAiTextRef.current.trim()) {
                handleTranslation(tempAiTextRef.current, 'ai');
                tempAiTextRef.current = "";
                setLiveAiText("");
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
             console.error('Live error:', e);
             setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `You are Carlos, a native ${language} speaker. Talk to a student whose native language is ${nativeLanguage}. Use B1-B2 level. Correct major errors. Be engaging.`
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setLiveUserText("");
    setLiveAiText("");
    tempUserTextRef.current = "";
    tempAiTextRef.current = "";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[600px] w-full max-w-5xl mx-auto pb-12">
      {/* Top Control Bar */}
      <div className="w-full bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-none mb-1">Carlos</h2>
            <p className="text-xs text-indigo-500 font-medium tracking-wide uppercase">Native {language} Partner</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex flex-col items-start px-3 py-1 border-r border-gray-100">
            <div className="flex justify-between w-full mb-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">AI Speed</span>
              <span className="text-[9px] font-bold text-indigo-600">{speechSpeed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="0.5" max="1.5" step="0.1" value={speechSpeed} 
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="flex flex-col items-start px-3 py-1 border-r border-gray-100">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Translation Link</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{language}</span>
              <i className="fa-solid fa-arrow-right text-[10px] text-gray-300"></i>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{nativeLanguage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  showTranslation 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                }`}
             >
                <i className={`fa-solid ${showTranslation ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                {showTranslation ? 'Translations Visible' : 'Translations Hidden'}
             </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col min-h-[500px] relative overflow-hidden">
            {isActive && (
              <div className="absolute top-6 right-8 flex items-center gap-2 z-10">
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Live Recording</span>
              </div>
            )}

            <div className="flex-1 space-y-8 flex flex-col justify-end pb-8">
              {/* Turn History with English/Native translation specifically below user input */}
              {history.slice(0, 3).reverse().map((turn, i) => (
                <div key={i} className={`flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 ${turn.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] ${turn.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                      {turn.speaker === 'user' ? `You (${language})` : `Carlos (${language})`}
                    </span>
                    <div className={`inline-block p-4 rounded-3xl shadow-sm border ${turn.speaker === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-100'}`}>
                      <p className="text-base font-semibold">{turn.original}</p>
                      
                      {showTranslation && (
                        <div className={`mt-2 pt-2 border-t text-sm font-medium ${turn.speaker === 'user' ? 'border-indigo-500/30 text-indigo-100' : 'border-gray-100 text-emerald-600'}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                             <i className="fa-solid fa-language opacity-70"></i>
                             <span className="text-[10px] uppercase font-bold tracking-wider">{nativeLanguage} (Translated)</span>
                          </div>
                          <p>{turn.translation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Current Live Speaking View */}
              {(liveUserText || liveAiText) && (
                <div className={`flex flex-col animate-pulse ${liveUserText ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[85%] ${liveUserText ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">
                      {liveUserText ? 'You are speaking...' : 'Carlos is responding...'}
                    </span>
                    <div className={`inline-block p-4 rounded-3xl border-2 border-dashed ${liveUserText ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                      <p className="text-lg font-bold">{liveUserText || liveAiText}</p>
                      {showTranslation && liveUserText && (
                        <p className="text-xs text-indigo-400 mt-1 italic italic">Translation appears after turn...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isActive && !liveUserText && !liveAiText && history.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 animate-bounce shadow-inner">
                    <i className="fa-solid fa-microphone text-2xl"></i>
                  </div>
                  <p className="text-indigo-600 font-bold tracking-tight">Listening for your {language}...</p>
                  <p className="text-xs text-gray-400 max-w-[200px]">Carlos is ready to chat. Go ahead and say something!</p>
                </div>
              )}
            </div>

            {!isActive && history.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 mb-6 shadow-sm">
                  <i className="fa-solid fa-microphone-slash text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Immersion Practice</h3>
                <p className="text-gray-400 max-w-xs mx-auto text-sm">Practice speaking {language} naturally. Carlos will help you transition from {nativeLanguage} logic to native fluency.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!isActive ? (
              <button 
                onClick={startSession} disabled={isConnecting}
                className="flex-1 bg-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isConnecting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-headset"></i>}
                {isConnecting ? 'Connecting AI...' : 'Begin Voice Session'}
              </button>
            ) : (
              <button 
                onClick={stopSession}
                className="flex-1 bg-rose-600 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-rose-100 hover:bg-rose-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-phone-slash"></i>
                End Conversation
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-4">
           <div className="bg-indigo-950 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src="https://picsum.photos/80/80?1" alt="Carlos" className="w-16 h-16 rounded-2xl border-2 border-indigo-400/30 object-cover" />
                  {isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-indigo-950"></div>}
                </div>
                <div>
                   <h3 className="font-bold text-lg">Carlos Mendoza</h3>
                   <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                     <i className="fa-solid fa-location-dot"></i> Mexico City, MX
                   </span>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    <span>Role</span>
                    <span className="text-white">Cultural Guide</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    <span>Target</span>
                    <span className="text-white">Intermediate ({language})</span>
                 </div>
                 <div className="pt-4 border-t border-indigo-900">
                   <p className="text-[11px] text-indigo-100 opacity-80 leading-relaxed italic">
                     "I'll help you speak more naturally. I'll explain idioms if you get stuck, and you can always toggle translations back to {nativeLanguage} if my pace is too fast!"
                   </p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Focus Mode</h3>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                 <p className="text-xs font-semibold text-indigo-900 mb-2">Translation Toggle</p>
                 <p className="text-[10px] text-indigo-700 leading-relaxed mb-4">
                   Displaying your speech in {nativeLanguage} helps you confirm if your intended meaning was captured correctly in {language}.
                 </p>
                 <button 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${showTranslation ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                 >
                   {showTranslation ? 'Disable Translation' : 'Enable Translation'}
                 </button>
              </div>
           </div>

           <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-3 text-emerald-800">
                 <i className="fa-solid fa-bolt-lightning"></i>
                 <span className="text-xs font-bold uppercase tracking-widest">Active Lesson</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 font-medium">
                Carlos is listening for your use of connectors like "sin embargo" or "por lo tanto" to improve your B2 flow!
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversation;

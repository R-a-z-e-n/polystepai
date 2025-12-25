
import { GoogleGenAI, Type } from "@google/genai";

// Always use the GoogleGenAI constructor with a direct reference to process.env.API_KEY
export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const translateText = async (text: string, sourceLang: string, targetLang: string = "English") => {
  if (!text.trim()) return "";
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following ${sourceLang} text to ${targetLang}. Return only the translated string: "${text}"`,
  });
  return response.text || "";
};

export const generateGrammarExplanation = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the grammar topic "${topic}" in "${language}" for an intermediate learner. Include rules, 3 interactive examples with translations, and common pitfalls. Format as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["topic", "explanation", "examples"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateWorkout = async (language: string, level: string = "B1") => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate an intermediate language workout in ${language} at level ${level}. Include a paragraph for translation, a composition prompt, and a fill-in-the-blank sentence. Format as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translationTask: { type: Type.STRING },
          compositionPrompt: { type: Type.STRING },
          clozeTask: { type: Type.STRING }
        },
        required: ["translationTask", "compositionPrompt", "clozeTask"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Live Audio Helper Functions
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

export interface SpeakOptions {
  forceSpeak?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

interface AccessibilityContextType {
  isEasyMode: boolean;
  setIsEasyMode: (val: boolean) => void;
  textSize: 'small' | 'normal' | 'large';
  setTextSize: (size: 'small' | 'normal' | 'large') => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  speakText: (text: string, options?: SpeakOptions) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('English');
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isEasyMode) {
      root.classList.add('easy-mode');
    } else {
      root.classList.remove('easy-mode');
    }

    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [isEasyMode, isHighContrast]);

  const speakText = (text: string, options?: SpeakOptions) => {
    const shouldSpeak = options?.forceSpeak || isVoiceEnabled;
    if (!shouldSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel(); // Stop any active speech before starting new one
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (language === 'Tamil') utterance.lang = 'ta-IN';
      else if (language === 'Hindi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';
      
      utterance.rate = options?.rate ?? 0.90; // slightly slower for emergency clarity
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      if (options?.onStart) utterance.onstart = options.onStart;
      if (options?.onEnd) utterance.onend = options.onEnd;
      if (options?.onError) utterance.onerror = options.onError;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      if (options?.onError) options.onError(err);
    }
  };

  return (
    <AccessibilityContext.Provider value={{
      isEasyMode, setIsEasyMode,
      textSize, setTextSize,
      isHighContrast, setIsHighContrast,
      isVoiceEnabled, setIsVoiceEnabled,
      language, setLanguage,
      reduceMotion, setReduceMotion,
      speakText
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};

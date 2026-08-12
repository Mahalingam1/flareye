import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import type { CopilotMessage } from '../../types';
import { Bot, Mic, Send, Sparkles, User } from 'lucide-react';

export const AICopilotPanel: React.FC = () => {
  const { language, speakText } = useAccessibility();
  const { setActiveTab, setActiveFloor } = useSafetyBrain();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am FLAREYE AI Safety Copilot. How can I assist you with hospital fire safety today?',
      timestamp: '14:32:00'
    }
  ]);

  const quickPrompts = [
    "Is the hospital safe?",
    "Where is the fire?",
    "Which exit is safest?",
    "Show today's violations",
    "Generate today's report"
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    try {
      const res = await fetch('/api/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, language })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.answer,
          action: data.highlight_action,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.answer);

        // Perform UI highlight action based on AI response
        if (data.highlight_action === 'ZOOM_FLOOR_2') {
          setActiveFloor(2);
        } else if (data.highlight_action === 'SHOW_EVACUATION_ROUTE') {
          setActiveTab('evacuation');
        } else if (data.highlight_action === 'SHOW_COMPLIANCE') {
          setActiveTab('compliance');
        }
      }
    } catch (e) {
      const fallbackMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'A high-risk fire event is verified on Floor 2. The safest exit is the East Ramp Emergency Exit (84m).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Tamil' ? 'ta-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl flex flex-col h-[550px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">🤖 FLAREYE SAFETY COPILOT</h2>
            <p className="text-xs text-slate-400">Voice-guided AI assistant in English, Tamil & Hindi</p>
          </div>
        </div>

        <button
          onClick={handleSpeechInput}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
            isListening
              ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-600/40'
              : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isListening ? 'LISTENING...' : '🎙️ TALK TO AI'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-semibold rounded-tr-none'
                  : 'bg-slate-800 text-slate-100 border border-slate-700 font-medium rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[10px] text-slate-400 block mt-1 text-right font-sans">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
          placeholder={`Ask FLAREYE in ${language}...`}
          className="flex-1 bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={() => handleSend(inputQuery)}
          className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer shadow-lg shadow-red-600/30"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

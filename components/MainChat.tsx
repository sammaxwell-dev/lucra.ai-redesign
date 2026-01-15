import React, { useState, useRef, useEffect } from 'react';
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import {
  Send,
  Mic,
  Paperclip,
  Bot,
  TrendingUp,
  FileText,
  Calculator
} from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface MainChatProps {
  onNewChat: () => void;
}

const MainChat: React.FC<MainChatProps> = ({ onNewChat }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await sendMessageToGemini(textToSend);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInitialState = messages.length === 0;

  return (
    <main className="flex-1 h-[95vh] my-auto mx-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">


      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">

        {/* Background Gradients for Aesthetics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-50/40 rounded-full blur-[80px] pointer-events-none" />

        {isInitialState ? (
          /* Empty State / Hero Section (Design from Screenshot 2) */
          <div className="h-full flex flex-col items-center justify-center px-4 mt-4">

            {/* Voice Powered Orb */}
            <div className="mb-8 relative w-48 h-48 cursor-pointer transition-transform duration-700 hover:scale-105">
              <VoicePoweredOrb enableVoiceControl={false} hue={0} />
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-2 text-center tracking-tight">
              Good Morning, Shamil Musaev
            </h1>
            <h2 className="text-2xl font-light text-slate-400 mb-10 text-center">
              How can I help with your <span className="text-blue-600 font-medium">taxes</span> today?
            </h2>

            {/* Central Input Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2 relative group focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] focus-within:border-blue-100 transition-all duration-300 z-10">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Skatteverket forms, deductions, or declaration dates..."
                className="w-full h-28 p-4 text-slate-700 bg-transparent resize-none focus:outline-none text-lg placeholder:text-slate-300 placeholder:font-light"
              />

              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                    <Paperclip size={20} />
                  </button>
                </div>

                <button
                  onClick={() => handleSend()}
                  className={`p-3 rounded-xl transition-all duration-300 ${input.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-100' : 'bg-slate-100 text-slate-400 scale-95'}`}
                >
                  {input.trim() ? <Send size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>

            {/* Suggestion Chips (Hints) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8 px-4 md:px-0">
              <button
                onClick={() => handleSend("What is the difference between Enskild Firma and Aktiebolag?")}
                className="bg-white border border-slate-200 group hover:border-blue-200 hover:bg-[#e4ecf5]/50 p-5 rounded-2xl text-left transition-all duration-300 shadow-sm hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <FileText size={18} />
                  <span className="font-semibold text-sm text-slate-800">Company Forms</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Differences between sole trader (Enskild) and limited company (AB).
                </p>
              </button>

              <button
                onClick={() => handleSend("How do I calculate Rot and Rut deductions?")}
                className="bg-white border border-slate-200 group hover:border-blue-200 hover:bg-[#e4ecf5]/50 p-5 rounded-2xl text-left transition-all duration-300 shadow-sm hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Calculator size={18} />
                  <span className="font-semibold text-sm text-slate-800">Deductions</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Calculate tax relief for home repairs (Rot) and household services (Rut).
                </p>
              </button>

              <button
                onClick={() => handleSend("When are the key dates for Inkomstdeklaration 2024?")}
                className="bg-white border border-slate-200 group hover:border-blue-200 hover:bg-[#e4ecf5]/50 p-5 rounded-2xl text-left transition-all duration-300 shadow-sm hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <TrendingUp size={18} />
                  <span className="font-semibold text-sm text-slate-800">Key Dates</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Important deadlines for VAT, employer contributions, and declarations.
                </p>
              </button>
            </div>

          </div>
        ) : (
          /* Active Chat View */
          <div className="flex flex-col min-h-full pb-32">
            <div className="flex-1 p-8 space-y-8 max-w-4xl mx-auto w-full">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                      {msg.role === 'user' ? (
                        <span className="text-white text-xs font-bold">SM</span>
                      ) : (
                        <Bot size={16} className="text-blue-600" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`p-5 rounded-2xl shadow-sm leading-relaxed text-[15px] ${msg.role === 'user'
                      ? 'bg-slate-800 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                      }`}>
                      {msg.content}
                    </div>

                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start max-w-4xl mx-auto w-full px-12">
                  <div className="flex gap-1 bg-white border border-slate-100 px-4 py-3 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar for Active Chat */}
            <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center">
              <div className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-100 p-2 flex items-end gap-2">
                <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Swedish taxes..."
                  className="flex-1 max-h-32 py-3 px-2 text-slate-700 bg-transparent resize-none focus:outline-none"
                  rows={1}
                />
                <button
                  onClick={() => handleSend()}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-md shadow-slate-200"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainChat;
import React, { useState, useRef, useEffect } from 'react';
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import {
  Send,
  Mic,
  Paperclip,
  Bot,
  TrendingUp,
  FileText,
  Calculator,
  UserPlus,
  X
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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [accountantEmail, setAccountantEmail] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
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
    <main className="flex-1 h-screen md:h-[95vh] my-0 md:my-auto mx-0 md:mx-4 bg-white rounded-none md:rounded-[2rem] shadow-sm border-0 md:border border-slate-100 overflow-hidden relative flex flex-col">
      {/* Floating Add Accountant Button */}
      <button
        onClick={() => setIsInviteModalOpen(true)}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2.5 md:p-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-xl md:rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 hover:scale-105 transition-all duration-300 group"
        title="Add Accountant"
      >
        <UserPlus size={20} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Add Accountant
        </span>
      </button>

      {/* Invite Accountant Modal */}
      {isInviteModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"
            onClick={() => setIsInviteModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <UserPlus className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Add an accountant</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Do you want to add an accountant to the chat? They will be able to see the conversation and help with your taxes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={accountantEmail}
                    onChange={(e) => setAccountantEmail(e.target.value)}
                    placeholder="accountant@email.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl text-slate-500 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Logic to send invite would go here
                      console.log('Sending invite to:', accountantEmail);
                      setIsInviteModalOpen(false);
                      setAccountantEmail('');
                      setShowInviteSuccess(true);
                      setTimeout(() => setShowInviteSuccess(false), 3000);
                    }}
                    disabled={!accountantEmail.trim() || !accountantEmail.includes('@')}
                    className="flex-1 py-4 px-6 bg-blue-600 text-white font-medium rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showInviteSuccess && (
        <div className="absolute top-24 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium">Invite sent successfully!</p>
        </div>
      )}


      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">

        {/* Background Gradients for Aesthetics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-50/40 rounded-full blur-[80px] pointer-events-none" />

        {isInitialState ? (
          /* Empty State / Hero Section (Design from Screenshot 2) */
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-6 mt-0 pt-12 md:pt-0">

            {/* Voice Powered Orb */}
            <div className="mb-4 md:mb-6 relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 cursor-pointer transition-transform duration-700 hover:scale-105">
              <VoicePoweredOrb enableVoiceControl={false} hue={0} />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2 text-center tracking-tight px-2">
              Good Morning, Shamil Musaev
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-light text-slate-400 mb-4 md:mb-6 text-center px-2">
              How can I help with your <span className="text-[#3D506D] font-medium">financials</span> today?
            </h2>

            {/* Central Input Card */}
            <div className="w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2 relative group focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] focus-within:border-blue-100 transition-all duration-300 z-10">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about financial data, reports, or business analysis..."
                className="w-full h-20 md:h-28 p-3 md:p-4 text-slate-700 bg-transparent resize-none focus:outline-none text-base md:text-lg placeholder:text-slate-300 placeholder:font-light"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full max-w-[92vw] md:max-w-4xl lg:max-w-5xl mt-4 md:mt-6 px-0">
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
                  <span className="font-semibold text-sm text-slate-800">Business Data</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Analyze client data, Profit & Loss, and balance sheet insights.
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
          <div className="flex flex-col min-h-full pb-24 md:pb-32">
            <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-[95vw] md:max-w-4xl lg:max-w-5xl mx-auto w-full pt-14 md:pt-8">
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
            <div className="absolute bottom-0 md:bottom-6 left-0 right-0 px-2 sm:px-4 md:px-8 pb-2 md:pb-0 flex justify-center">
              <div className="w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white rounded-xl md:rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-100 p-1.5 md:p-2 flex items-end gap-1 md:gap-2">
                <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your financial data..."
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
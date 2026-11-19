'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/types';
import { X, Send, Sparkles, MapPin, GraduationCap, ShieldCheck } from 'lucide-react';

interface ChatDrawerProps {
  profile: Profile | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ profile, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'them',
      text: `Hey! Looks like we both liked each other on Coy 😊`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!profile) return null;

  const handleSend = (textToSend?: string) => {
    const content = textToSend || inputText.trim();
    if (!content) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text: content,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Simulate friendly reply after a brief moment
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}_reply`,
          sender: 'them',
          text: `I saw you like ${profile.interests[0] || 'the same vibes'} too! Tell me more about it!`,
          timestamp: 'Just now',
        },
      ]);
    }, 1200);
  };

  const icebreakers = [
    `Hey ${profile.name.split(' ')[0]}! What's the story behind ${profile.interests[0]}?`,
    `Excited to see you here! Best coffee spot in ${profile.city.split(',')[0]}?`,
    `Hey! How's your week going? ✨`,
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover border border-rose-500/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  {profile.name}
                  <span className="text-xs font-normal text-slate-400">
                    {profile.age}
                  </span>
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" />
                    {profile.city}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Banner */}
          <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 flex items-center gap-2 text-[11px] text-rose-300">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Mutual match verified. Private end-to-end sandbox.</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'me' ? 'text-rose-200 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-400 rounded-bl-none flex items-center gap-1.5">
                  <span className="animate-pulse">{profile.name.split(' ')[0]} is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Icebreaker Suggestions */}
          <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Suggested Icebreakers:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {icebreakers.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(starter)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
                >
                  &ldquo;{starter}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${profile.name.split(' ')[0]}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-all active:scale-95 shadow-md shadow-rose-600/30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

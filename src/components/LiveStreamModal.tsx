import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveStream } from '../types';
import {
  X,
  Users,
  Heart,
  Send,
  Sparkles,
  Gift,
  DollarSign,
  Radio,
  Share2,
  Volume2,
  VolumeX,
  MessageSquare
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface LiveStreamModalProps {
  live: LiveStream | null;
  onClose: () => void;
}

interface LiveChatMessage {
  id: string;
  author: string;
  avatar: string;
  text: string;
  isTip?: boolean;
  tipAmount?: number;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ live, onClose }) => {
  const { currentUser, requestActionOrPromptGuest } = useApp();
  const [messages, setMessages] = useState<LiveChatMessage[]>([
    { id: '1', author: 'Mário da Costa', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80', text: 'Top demais! Viva a cultura de São Tomé! 🇸🇹🔥' },
    { id: '2', author: 'Dina do Príncipe', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80', text: 'Estamos a assistir diretamente de Santo António!', isTip: true, tipAmount: 25 },
    { id: '3', author: 'Carlos Mendes', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', text: 'Toca aquela com o ritmo de Bulawê!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(live?.viewerCount || 184);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [tipSuccessNotice, setTipSuccessNotice] = useState<string | null>(null);

  // Periodic simulated live viewer fluctuations & chat messages
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, [live]);

  if (!live) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestActionOrPromptGuest('comentar no chat da Live')) return;
    if (!inputMessage.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      author: currentUser?.name || 'Espectador',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      text: inputMessage
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleSendTip = (amountDobras: number) => {
    if (!requestActionOrPromptGuest('enviar donativo')) return;

    const tipMsg: LiveChatMessage = {
      id: `tip-${Date.now()}`,
      author: currentUser?.name || 'Apoiante',
      avatar: currentUser?.avatar || '',
      text: `Enviou um donativo de ${amountDobras} Dobras para o Talent! 🌟`,
      isTip: true,
      tipAmount: amountDobras
    };

    setMessages(prev => [...prev, tipMsg]);
    setTipSuccessNotice(`Enviou ${amountDobras} Dobras (STN) com sucesso!`);
    setTimeout(() => setTipSuccessNotice(null), 3000);
    spawnHeart();
  };

  const spawnHeart = () => {
    const id = Date.now();
    const x = Math.floor(Math.random() * 60) + 20;
    setFloatingHearts(prev => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== id));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] flex flex-col md:flex-row bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Stage Area (Left / Main) */}
        <div className="relative flex-1 bg-stone-900 flex flex-col justify-between overflow-hidden">
          {/* Simulated live camera backdrop */}
          <img
            src={live.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/70" />

          {/* Floating Hearts Animation Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingHearts.map(h => (
              <div
                key={h.id}
                className="absolute bottom-16 animate-bounce text-amber-400"
                style={{ left: `${h.x}%`, animationDuration: '1.2s' }}
              >
                <Heart className="w-8 h-8 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
            ))}
          </div>

          {/* Live Header Overlay */}
          <div className="relative z-10 p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src={live.talentAvatar}
                alt=""
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white shadow-black drop-shadow">{live.talentName}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    AO VIVO
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-medium drop-shadow">{live.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-stone-700 text-xs text-stone-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold">{viewerCount}</span>
              </span>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Live Stage Bottom Controls */}
          <div className="relative z-10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={spawnHeart}
                className="p-2 sm:p-3 rounded-full bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5"
                title="Curtir ao vivo"
              >
                <TalentIcon size={18} filled />
                <span className="text-[11px] sm:text-xs font-black">Apoiar</span>
              </button>

              <button
                onClick={() => handleSendTip(10)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:bg-stone-800 text-[11px] sm:text-xs font-semibold flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                +10 STN
              </button>

              <button
                onClick={() => handleSendTip(50)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/60 text-amber-200 hover:bg-amber-500/30 text-[11px] sm:text-xs font-semibold flex items-center gap-1"
              >
                <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                +50 STN
              </button>
            </div>

            {tipSuccessNotice && (
              <span className="text-[10px] sm:text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full animate-in fade-in">
                {tipSuccessNotice}
              </span>
            )}
          </div>
        </div>

        {/* Live Chat Drawer (Right) */}
        <div className="w-full md:w-80 h-48 sm:h-64 md:h-full bg-stone-950 border-t md:border-t-0 md:border-l border-stone-800 flex flex-col justify-between">
          <div className="p-3.5 border-b border-stone-800 flex items-center justify-between text-xs font-semibold text-stone-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <MessageSquare className="w-4 h-4" />
              Chat em Tempo Real
            </span>
            <span className="text-stone-500 font-normal text-[11px]">São Tomé & Diáspora</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl ${
                  m.isTip
                    ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                    : 'bg-stone-900/70 border border-stone-800/60 text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.avatar && (
                    <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  )}
                  <span className="font-bold text-amber-400 text-[11px]">{m.author}</span>
                  {m.isTip && (
                    <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded">
                      +{m.tipAmount} STN
                    </span>
                  )}
                </div>
                <p className="text-stone-300 leading-snug">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-800 bg-stone-900/50 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Escreva uma mensagem..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

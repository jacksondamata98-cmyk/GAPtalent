import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  Plus,
  Flame,
  User as UserIcon
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onSelectTab }) => {
  const {
    currentUser,
    setBecomeTalentModalOpen,
    setTalentStudioOpen
  } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Big Tech Mobile App Bar (Instagram / TikTok Style) */}
      <nav className="w-full bg-stone-950/95 backdrop-blur-2xl border-t border-stone-800/80 px-2 py-1.5 flex items-center justify-around select-none">
        {/* 1. Feed / Início */}
        <button
          type="button"
          onClick={() => onSelectTab('feed')}
          className="flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none min-h-[48px]"
          aria-label="Início"
        >
          <div className="relative">
            <Home
              className={`w-6 h-6 transition-all duration-150 ${
                currentTab === 'feed'
                  ? 'text-amber-400 stroke-[2.4] scale-105'
                  : 'text-stone-400 group-hover:text-stone-200'
              }`}
            />
            {currentTab === 'feed' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors ${
              currentTab === 'feed' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Início
          </span>
        </button>

        {/* 2. Explorar / Rankings */}
        <button
          type="button"
          onClick={() => onSelectTab('ranking')}
          className="flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none min-h-[48px]"
          aria-label="Explorar e Ranking"
        >
          <div className="relative">
            <Compass
              className={`w-6 h-6 transition-all duration-150 ${
                currentTab === 'ranking'
                  ? 'text-amber-400 stroke-[2.4] scale-105'
                  : 'text-stone-400 group-hover:text-stone-200'
              }`}
            />
            {currentTab === 'ranking' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors ${
              currentTab === 'ranking' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Explorar
          </span>
        </button>

        {/* 3. Botão Central: Publicar / Seja Talent (TikTok / Instagram Icon Style) */}
        <button
          type="button"
          onClick={() => {
            if (currentUser?.role === 'talent') {
              setTalentStudioOpen(true);
            } else {
              setBecomeTalentModalOpen(true);
            }
          }}
          className="flex-1 flex flex-col items-center justify-center py-0.5 group focus:outline-none min-h-[48px]"
          aria-label={currentUser?.role === 'talent' ? 'Publicar no Estúdio' : 'Seja Talent'}
        >
          <div className="w-11 h-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/30 group-active:scale-95 transition-transform">
            {currentUser?.role === 'talent' ? (
              <Plus className="w-5 h-5 stroke-[3]" />
            ) : (
              <TalentIcon size={18} filled />
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-300 mt-1 tracking-tight">
            {currentUser?.role === 'talent' ? 'Publicar' : 'Talent'}
          </span>
        </button>

        {/* 4. Desafios */}
        <button
          type="button"
          onClick={() => onSelectTab('desafios')}
          className="flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none min-h-[48px]"
          aria-label="Desafios"
        >
          <div className="relative">
            <Flame
              className={`w-6 h-6 transition-all duration-150 ${
                currentTab === 'desafios'
                  ? 'text-amber-400 stroke-[2.4] scale-105'
                  : 'text-stone-400 group-hover:text-stone-200'
              }`}
            />
            {currentTab === 'desafios' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors ${
              currentTab === 'desafios' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            Desafios
          </span>
        </button>

        {/* 5. Perfil / Painel do Usuário */}
        <button
          type="button"
          onClick={() => onSelectTab('perfil')}
          className="flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none min-h-[48px]"
          aria-label="Perfil"
        >
          <div className="relative">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className={`w-6 h-6 rounded-full object-cover transition-all ${
                  currentTab === 'perfil'
                    ? 'ring-2 ring-amber-400 scale-105'
                    : 'opacity-80 group-hover:opacity-100'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon
                className={`w-6 h-6 transition-all duration-150 ${
                  currentTab === 'perfil'
                    ? 'text-amber-400 stroke-[2.4] scale-105'
                    : 'text-stone-400 group-hover:text-stone-200'
                }`}
              />
            )}
            {currentTab === 'perfil' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors ${
              currentTab === 'perfil' ? 'text-amber-400 font-bold' : 'text-stone-400'
            }`}
          >
            {currentUser ? 'Perfil' : 'Entrar'}
          </span>
        </button>
      </nav>

      {/* Mobile Safe Area Bottom Bar Indicator */}
      <div className="w-full bg-stone-950 pb-1 flex justify-center items-center">
        <div className="w-24 h-1 bg-stone-700/60 rounded-full" />
      </div>
    </div>
  );
};

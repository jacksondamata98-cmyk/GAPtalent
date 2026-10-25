import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, X } from 'lucide-react';
import { TalentIcon } from './TalentIcon';

export const GuestPromptBanner: React.FC = () => {
  const { currentUser, setAuthModalOpen, setAuthModalInitialTab } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Only show to Guests (not logged in) and when not dismissed
  if (currentUser || dismissed) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-30 bg-stone-900/95 border border-amber-400/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
            <TalentIcon size={18} filled />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              Participe no Talent Hub
            </p>
            <p className="text-[10px] text-stone-300 truncate">
              Entre para curtir e apoiar criadores STP!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              setAuthModalInitialTab('login');
              setAuthModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            Entrar
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-stone-400 hover:text-white"
            aria-label="Dispensar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Award, Sparkles, Flame, ChevronRight, Crown, Radio } from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface RankingSidebarProps {
  onOpenChallenges: () => void;
}

export const RankingSidebar: React.FC<RankingSidebarProps> = ({ onOpenChallenges }) => {
  const { users, currentUser, setBecomeTalentModalOpen, setViewingTalentProfile, setActiveLive, lives } = useApp();

  // Active talents sorted by points descending (excluding blocked ones from active ranking as per rules)
  const activeTalents = users
    .filter(u => u.role === 'talent' && u.subscriptionStatus === 'active')
    .sort((a, b) => b.points - a.points);

  const top10 = activeTalents.slice(0, 10);

  const getTierBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-sm shadow-amber-500/30">
          <Crown className="w-3 h-3 fill-current" />
          Talent Gold 🥇
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-stone-200 to-stone-400 text-stone-950 shadow-sm">
          Talent Silver 🥈
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 shadow-sm">
          Talent Bronze 🥉
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">
        #{index + 1}
      </span>
    );
  };

  return (
    <aside className="w-full space-y-4">
      {/* Top 10 Leaderboard Card */}
      <div className="bg-stone-900/90 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Top 10 TALENT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tempo Real" />
              </h3>
              <p className="text-[10px] text-stone-400">Rank em Tempo Real por Curtidas</p>
            </div>
          </div>

          <span className="text-[10px] bg-stone-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
            {activeTalents.length} Activos
          </span>
        </div>

        {/* List of Talents */}
        <div className="space-y-2.5">
          {top10.map((talent, idx) => {
            const isLive = lives.some(l => l.talentId === talent.id && l.isActive);

            return (
              <div
                key={talent.id}
                onClick={() => setViewingTalentProfile(talent)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  idx === 0
                    ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-amber-400/40 hover:border-amber-400'
                    : idx === 1
                    ? 'bg-stone-800/40 border-stone-700/60 hover:border-stone-500'
                    : idx === 2
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600'
                    : 'bg-stone-950/50 border-stone-800/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={talent.avatar}
                      alt=""
                      className={`w-10 h-10 rounded-full object-cover border-2 ${
                        idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-stone-300' : idx === 2 ? 'border-amber-700' : 'border-stone-700'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {isLive && (
                      <span className="absolute -bottom-1 -right-1 bg-red-600 text-[8px] font-black px-1 rounded-full text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                      <span className="text-xs font-semibold text-stone-200 truncate max-w-[110px] sm:max-w-none">{talent.name}</span>
                      {getTierBadge(idx)}
                    </div>
                    <p className="text-[10px] text-amber-400 truncate">{talent.talentCategory}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                    <TalentIcon size={14} filled />
                    <span>{talent.points.toLocaleString()}</span>
                  </div>
                  <span className="text-[9px] text-stone-500">pontos</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Talent Raro Callout Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-stone-950 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-bold text-yellow-300">Prémio Talent Raro ⭐</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-snug">
            Avaliado e premiado a todo <strong>dia 15 de cada mês</strong>. Apenas 3 criadores selecionados pelo impacto cultural e criatividade!
          </p>
        </div>

        {/* Desafios Callout for talents below Top 10 */}
        <div className="mt-3 p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-stone-200">Abaixo do Top 10?</h4>
            <p className="text-[10px] text-stone-400">Participe nos 5 desafios semanais e suba no ranking!</p>
          </div>
          <button
            onClick={onOpenChallenges}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <span>Ver Desafios</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Become Talent CTA if not a talent */}
      {currentUser?.role !== 'talent' && (
        <div className="bg-gradient-to-br from-amber-500/20 via-yellow-600/15 to-stone-950 border border-amber-400/40 rounded-3xl p-5 shadow-xl text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Quer estar no Ranking Nacional?</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Torne-se um <strong>TALENT</strong> por apenas <strong>50 Dobras/mês</strong>. Publique vídeos até 2 min, faça lives e concorra a prémios!
            </p>
          </div>
          <button
            onClick={() => setBecomeTalentModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            SEJA TALENT AGORA
          </button>
        </div>
      )}
    </aside>
  );
};

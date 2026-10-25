import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, Trophy, Clock, CheckCircle2, ArrowRight, Sparkles, Users, Award } from 'lucide-react';

interface ChallengesSectionProps {
  onClose?: () => void;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({ onClose }) => {
  const { challenges, currentUser, participateChallenge, requestActionOrPromptGuest } = useApp();

  const handleParticipate = (challengeId: string) => {
    if (!requestActionOrPromptGuest('participar nos desafios')) return;
    participateChallenge(challengeId);
  };

  return (
    <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Desafios Semanais</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                5 Novos Desafios
              </span>
            </h3>
            <p className="text-xs text-stone-400 leading-snug">
              Aceleração para criadores e talentos conquistarem pontos de ranking!
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-xl bg-stone-800 shrink-0"
          >
            Fechar
          </button>
        )}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {challenges.map((challenge, index) => {
          const isCompleted = currentUser ? challenge.completedBy.includes(currentUser.id) : false;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-stone-950/70 border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-mono">
                    Desafio #{index + 1}
                  </span>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    +{challenge.pointsReward} Pontos
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                <p className="text-xs text-stone-300 leading-relaxed">{challenge.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-800/60 mt-3 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    {challenge.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    {challenge.participantsCount} participantes
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleParticipate(challenge.id)}
                  disabled={isCompleted}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Desafio Concluído! (+{challenge.pointsReward} pts)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Aceitar Desafio e Enviar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  X,
  Trophy,
  Award,
  Crown,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Heart,
  MessageSquare,
  Radio,
  Check
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface TalentProfileModalProps {
  talent: User | null;
  onClose: () => void;
  onOpenLive?: (liveId: string) => void;
}

export const TalentProfileModal: React.FC<TalentProfileModalProps> = ({
  talent,
  onClose,
  onOpenLive
}) => {
  const { currentUser, posts, lives, updateCurrentUserProfile, requestActionOrPromptGuest, setActiveLive } = useApp();

  if (!talent) return null;

  const talentPosts = posts.filter(p => p.authorId === talent.id);
  const isFollowing = currentUser ? currentUser.followingIds.includes(talent.id) : false;
  const isLive = lives.find(l => l.talentId === talent.id && l.isActive);

  const toggleFollow = () => {
    if (!requestActionOrPromptGuest('seguir talentos')) return;
    if (!currentUser) return;

    const newFollowing = isFollowing
      ? currentUser.followingIds.filter(id => id !== talent.id)
      : [...currentUser.followingIds, talent.id];

    updateCurrentUserProfile({ followingIds: newFollowing });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Banner with cover photo */}
        <div className="h-32 bg-gradient-to-r from-amber-600/40 via-yellow-600/30 to-stone-900 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pb-4 relative">
          <div className="flex flex-wrap items-end justify-between -mt-14 mb-3 gap-2">
            <div className="relative">
              <img
                src={talent.avatar}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-stone-900 shadow-xl"
                referrerPolicy="no-referrer"
              />
              {talent.talentTier === 'gold' && (
                <span className="absolute bottom-0 right-0 bg-amber-400 text-stone-950 p-1 rounded-full shadow" title="Talent Gold 🥇">
                  <Crown className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isLive && (
                <button
                  onClick={() => {
                    setActiveLive(isLive);
                    if (onOpenLive) onOpenLive(isLive.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-600/30 animate-pulse"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Em Directo 🔴</span>
                </button>
              )}

              <button
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-stone-800 text-stone-300 border border-stone-700'
                    : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                }`}
              >
                {isFollowing ? 'A Seguir' : 'Seguir Talent'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{talent.name} {talent.surname}</h3>
              {talent.talentTier === 'gold' && (
                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                  1º Talent Gold 🥇
                </span>
              )}
              {talent.talentTier === 'silver' && (
                <span className="text-[10px] bg-stone-300 text-stone-950 font-black px-2 py-0.5 rounded-full">
                  2º Talent Silver 🥈
                </span>
              )}
              {talent.talentTier === 'bronze' && (
                <span className="text-[10px] bg-amber-800 text-amber-100 font-black px-2 py-0.5 rounded-full">
                  3º Talent Bronze 🥉
                </span>
              )}
            </div>
            <p className="text-xs text-amber-400 font-medium">@{talent.username} • {talent.talentCategory}</p>
            {talent.district && (
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-500" />
                {talent.district}
              </p>
            )}
          </div>

          {talent.bio && (
            <p className="text-xs text-stone-300 mt-3 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
              {talent.bio}
            </p>
          )}

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-base font-black text-amber-400 font-mono block">
                {talent.points.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400">Pontos / Curtidas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-base font-black text-white font-mono block">
                {talentPosts.length}
              </span>
              <span className="text-[10px] text-stone-400">Publicações</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-base font-black text-white font-mono block">
                {talent.subscriptionStatus === 'active' ? 'Ativo' : 'Pendente'}
              </span>
              <span className="text-[10px] text-stone-400">Estatuto Oficial</span>
            </div>
          </div>
        </div>

        {/* Talent Posts Section */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 border-t border-stone-800 space-y-3">
          <h4 className="text-xs font-bold text-stone-200">Publicações de {talent.name}</h4>
          {talentPosts.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-4">
              Nenhuma publicação registada até ao momento.
            </p>
          ) : (
            talentPosts.map(post => (
              <div
                key={post.id}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-2"
              >
                <p className="text-stone-300 leading-relaxed">{post.content}</p>
                {post.mediaUrl && post.mediaType === 'image' && (
                  <img src={post.mediaUrl} alt="" className="w-full h-40 object-cover rounded-xl" />
                )}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                    <TalentIcon size={14} filled />
                    {post.likes} pontos
                  </span>
                  <span>{post.commentCount} comentários</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

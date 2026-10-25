import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Post, Comment, User } from '../types';
import { CATEGORIES } from '../data/initialData';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle,
  MoreHorizontal,
  Flame,
  Radio,
  Clock,
  Megaphone,
  UserPlus,
  UserCheck,
  Gift
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface FeedProps {
  onOpenLive: (liveId: string) => void;
  onOpenChallenges: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLive, onOpenChallenges }) => {
  const {
    posts,
    comments,
    currentUser,
    users,
    lives,
    likePost,
    reactToPost,
    addComment,
    setViewingTalentProfile,
    requestActionOrPromptGuest,
    setActiveLive,
    savedPostIds,
    toggleSavePost,
    toggleFollow,
    tipTalent,
    setBecomeTalentModalOpen
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'raro'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCaptions, setExpandedCaptions] = useState<{ [postId: string]: boolean }>({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [tipSuccessPostId, setTipSuccessPostId] = useState<string | null>(null);

  // Double tap heart animation state: { [postId: string]: boolean }
  const [heartBurst, setHeartBurst] = useState<{ [postId: string]: boolean }>({});
  const lastTapRef = useRef<{ [postId: string]: number }>({});

  // Video play & audio mute states
  const [videoPlaying, setVideoPlaying] = useState<{ [postId: string]: boolean }>({ 'post-2': false });
  const [videoMuted, setVideoMuted] = useState<{ [postId: string]: boolean }>({ 'post-2': true });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'raro') {
      return post.postType === 'raro' || post.isRareContender;
    }
    if (feedFilter === 'following') {
      if (!currentUser) return false;
      return (currentUser.followingIds || []).includes(post.authorId);
    }
    if (selectedCategory !== 'all') {
      return post.category === selectedCategory;
    }
    return true;
  });

  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[postId] || 0;

    if (now - lastTap < 300) {
      // Double tap detected!
      likePost(postId);
      setHeartBurst(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setHeartBurst(prev => ({ ...prev, [postId]: false }));
      }, 900);
    }
    lastTapRef.current[postId] = now;
  };

  const handleShare = (postId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(postId);
      setTimeout(() => setCopiedToast(null), 2500);
    }
  };

  const handleQuickTip = (talentId: string, postId: string) => {
    if (!currentUser) {
      requestActionOrPromptGuest('apoiar com aplausos e dobras');
      return;
    }
    tipTalent(talentId, 25);
    setTipSuccessPostId(postId);
    setTimeout(() => setTipSuccessPostId(null), 3000);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const res = addComment(postId, text);
    if (res.success) {
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const activeLives = lives.filter(l => l.isActive);
  const featuredTalents = users.filter(u => u.role === 'talent').slice(0, 8);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 1. STORIES / TALENT HIGHLIGHTS TRAY (Instagram / TikTok Style) */}
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-3 backdrop-blur-md">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1 pt-0.5">
          {/* Item 1: O Meu Perfil / Adicionar Story */}
          <div
            onClick={() => {
              if (currentUser?.role === 'talent') {
                // Talent can publish
                onOpenLive('live-1');
              } else {
                setBecomeTalentModalOpen(true);
              }
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-stone-700 to-stone-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-full h-full rounded-full object-cover border border-stone-950"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center border-2 border-stone-950 shadow">
                +
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-300 truncate max-w-[62px]">
              {currentUser ? 'Meu Story' : 'Seja Talent'}
            </span>
          </div>

          {/* Active Lives in Stories */}
          {activeLives.map(live => (
            <div
              key={live.id}
              onClick={() => {
                setActiveLive(live);
                onOpenLive(live.id);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-red-500 via-rose-500 to-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={live.talentAvatar}
                  alt={live.talentName}
                  className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 bg-red-600 text-white font-black text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider border-2 border-stone-950 animate-pulse">
                  AO VIVO
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-white truncate max-w-[62px]">
                {live.talentName.split(' ')[0]}
              </span>
            </div>
          ))}

          {/* Featured STP Talents Highlights */}
          {featuredTalents.map(talent => (
            <div
              key={talent.id}
              onClick={() => setViewingTalentProfile(talent)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-500 to-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-0.5 max-w-[62px]">
                <span className="text-[10px] sm:text-[11px] font-medium text-stone-200 truncate">
                  {talent.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-amber-400">★</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TIKTOK-STYLE SEGMENTED TABS (Para Você | A Seguir | Talent Raro) */}
      <div className="flex items-center justify-between border-b border-stone-800/80 px-2 pt-1 pb-2">
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <button
            onClick={() => {
              setFeedFilter('all');
              setSelectedCategory('all');
            }}
            className={`font-bold transition-all relative py-1 focus:outline-none ${
              feedFilter === 'all' && selectedCategory === 'all'
                ? 'text-white text-base scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Para Você</span>
            {feedFilter === 'all' && selectedCategory === 'all' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setFeedFilter('following');
              setSelectedCategory('all');
            }}
            className={`font-bold transition-all relative py-1 focus:outline-none ${
              feedFilter === 'following'
                ? 'text-white text-base scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>A Seguir</span>
            {feedFilter === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setFeedFilter('raro');
              setSelectedCategory('all');
            }}
            className={`font-bold transition-all relative py-1 flex items-center gap-1 focus:outline-none ${
              feedFilter === 'raro'
                ? 'text-amber-400 text-base scale-105'
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Talent Raro</span>
            {feedFilter === 'raro' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Category Filter Indicator */}
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-[11px] text-amber-400 hover:underline font-semibold"
          >
            Limpar filtro ({selectedCategory})
          </button>
        )}
      </div>

      {/* 3. HORIZONTAL CATEGORY DISCOVERY PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-stone-100 text-stone-950 font-bold'
              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
          }`}
        >
          Tudo 🇸🇹
        </button>

        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. POST FEED STREAM (INSTAGRAM / TIKTOK CARD ARCHITECTURE) */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-stone-900/40 border border-stone-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-800 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-200">Nenhuma publicação por aqui ainda</h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Experimente selecionar a aba "Para Você" ou explorar novas categorias de talentos santomenses!
            </p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
            const isSaved = savedPostIds?.includes(post.id);
            const isFollowingAuthor = currentUser?.followingIds?.includes(post.authorId);
            const postComments = comments.filter(c => c.postId === post.id && c.status === 'approved');
            const isCommentsOpen = openCommentsPostId === post.id;
            const isCaptionExpanded = expandedCaptions[post.id];
            const isRare = post.postType === 'raro' || post.isRareContender;
            const author = users.find(u => u.id === post.authorId);

            return (
              <article
                key={post.id}
                className="bg-stone-900/90 border border-stone-800/90 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden backdrop-blur-md transition-all"
              >
                {/* Official Announcement Banner */}
                {post.isOfficial && (
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-transparent border-b border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                      Comunicado Oficial da Direção • Talent Hub STP
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                      Destaque
                    </span>
                  </div>
                )}

                {/* Rare Contender Banner */}
                {isRare && !post.isOfficial && (
                  <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400/20 to-transparent border-b border-amber-400/30 flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Candidato a Talent Raro (Votação até dia 15!)
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      Voto Aberto
                    </span>
                  </div>
                )}

                {/* POST HEADER: Author Avatar, Name, Verification, Follow CTA, Three-dots */}
                <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar with Gradient Story Ring */}
                    <div
                      onClick={() => {
                        if (author) setViewingTalentProfile(author);
                      }}
                      className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 cursor-pointer shrink-0 hover:scale-105 transition-transform"
                    >
                      <img
                        src={post.authorAvatar}
                        alt=""
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-stone-950"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Author Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          onClick={() => {
                            if (author) setViewingTalentProfile(author);
                          }}
                          className="font-bold text-sm sm:text-base text-white hover:text-amber-400 cursor-pointer transition-colors truncate"
                        >
                          {post.authorName}
                        </span>

                        {/* Verified Talent Badge */}
                        {post.authorRole === 'talent' && (
                          <span title="Talent Oficial Verificado" className="text-amber-400 inline-flex items-center">
                            <CheckCircle className="w-4 h-4 fill-amber-400 text-stone-950" />
                          </span>
                        )}

                        {post.authorTier === 'gold' && (
                          <span className="text-xs" title="1º Lugar Ouro">🥇</span>
                        )}
                        {post.authorTier === 'silver' && (
                          <span className="text-xs" title="2º Lugar Prata">🥈</span>
                        )}
                        {post.authorTier === 'bronze' && (
                          <span className="text-xs" title="3º Lugar Bronze">🥉</span>
                        )}
                      </div>

                      {/* Clean Unboxed Metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <span className="text-amber-400/90 font-medium truncate max-w-[120px]">
                          @{post.authorUsername}
                        </span>
                        <span>·</span>
                        <span className="truncate">{post.category}</span>
                        <span>·</span>
                        <span className="shrink-0 text-stone-500">
                          {new Date(post.createdAt).toLocaleDateString('pt-PT', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Right: Instagram Follow CTA & Options Menu */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Follow button if not current user */}
                    {currentUser?.id !== post.authorId && post.authorRole === 'talent' && (
                      <button
                        onClick={() => toggleFollow(post.authorId)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                          isFollowingAuthor
                            ? 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700'
                            : 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-sm'
                        }`}
                      >
                        {isFollowingAuthor ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span className="hidden sm:inline">A Seguir</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Seguir</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleShare(post.id)}
                      className="p-1.5 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                      title="Partilhar"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* POST MEDIA: Video or Image with Double-Tap to Like */}
                {post.mediaUrl && (
                  <div
                    onDoubleClick={() => handleDoubleTap(post.id)}
                    className="relative w-full bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none group"
                  >
                    {/* Double-tap beating heart burst overlay */}
                    {heartBurst[post.id] && (
                      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-in zoom-in-50 duration-200">
                        <div className="w-24 h-24 rounded-full bg-amber-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-2xl scale-125 transition-transform">
                          <TalentIcon size={54} filled />
                        </div>
                      </div>
                    )}

                    {post.mediaType === 'image' && (
                      <img
                        src={post.mediaUrl}
                        alt="Conteúdo do Talent"
                        className="w-full h-auto max-h-[560px] object-cover sm:object-contain mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {post.mediaType === 'video' && (
                      <div className="relative w-full aspect-[4/5] sm:aspect-video bg-black flex items-center justify-center">
                        <video
                          src={post.mediaUrl}
                          playsInline
                          loop
                          muted={videoMuted[post.id] ?? true}
                          controls
                          className="w-full h-full object-cover"
                          poster="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
                        />

                        {/* Sound & Mute Indicator */}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setVideoMuted(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                          }}
                          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors z-20"
                          title={videoMuted[post.id] ? 'Ativar som' : 'Silenciar som'}
                        >
                          {videoMuted[post.id] ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-amber-400" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Sound Ticker / Badge (TikTok Audio Tag) */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium max-w-[80%]">
                      <span className="text-amber-400 font-bold">♫</span>
                      <span className="truncate">Som Original • {post.authorName} ({post.category})</span>
                    </div>
                  </div>
                )}

                {/* POST ACTION ROW: Like, Comment, Share, Tip/Gift, Save (Instagram / TikTok Style) */}
                <div className="p-3 sm:px-4 sm:pt-3 sm:pb-2">
                  <div className="flex items-center justify-between">
                    {/* Left Actions: Like, Comment, Share */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Like / Aplaudir with custom TalentIcon */}
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center gap-1.5 text-stone-200 hover:text-amber-400 transition-colors group focus:outline-none"
                        title={isLiked ? 'Desfazer curtida' : 'Apoiar e curtir talent'}
                      >
                        <div className={`p-1 rounded-full transition-transform active:scale-125 ${isLiked ? 'text-amber-400 scale-110' : 'group-hover:text-amber-400'}`}>
                          <TalentIcon size={24} filled={isLiked} />
                        </div>
                        <span className="font-bold text-xs sm:text-sm font-mono tracking-tight">
                          {post.likes.toLocaleString()}
                        </span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                        className="flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors group focus:outline-none"
                        title="Ver e adicionar comentários"
                      >
                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-xs sm:text-sm font-mono tracking-tight">
                          {postComments.length}
                        </span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShare(post.id)}
                        className="p-1 text-stone-200 hover:text-white transition-colors focus:outline-none"
                        title="Partilhar link"
                      >
                        <Send className="w-5 h-5 -rotate-12 hover:scale-110 transition-transform" />
                      </button>

                      {/* Emoji quick reactions */}
                      <div className="hidden sm:flex items-center gap-1 bg-stone-950/80 px-2 py-0.5 rounded-full border border-stone-800">
                        {['🔥', '👏', '❤️', '🇸🇹'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => reactToPost(post.id, emoji)}
                            className="text-xs hover:scale-125 transition-transform px-1 py-0.5"
                            title={`Reagir com ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Actions: Bookmark Save */}
                    <div className="flex items-center gap-2">
                      {/* Instagram Bookmark Save Button */}
                      <button
                        onClick={() => toggleSavePost(post.id)}
                        className={`p-1.5 rounded-full transition-colors focus:outline-none ${
                          isSaved ? 'text-amber-400' : 'text-stone-300 hover:text-white'
                        }`}
                        title={isSaved ? 'Remover dos guardados' : 'Guardar publicação'}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Feedback toasts */}
                  {copiedToast === post.id && (
                    <p className="text-[11px] text-emerald-400 pt-1 text-right animate-in fade-in">
                      Link da publicação copiado!
                    </p>
                  )}

                  {/* Likes Summary (Instagram Style) */}
                  <div className="pt-2 text-xs text-stone-300">
                    <span>Apoiado por </span>
                    <strong className="text-white font-semibold">
                      {post.likedBy.length > 0 ? `@${post.authorUsername}` : 'Comunidade STP'}
                    </strong>
                    <span> e </span>
                    <strong className="text-white font-semibold">
                      outras {post.likes.toLocaleString()} pessoas
                    </strong>
                  </div>

                  {/* Post Caption (Instagram / TikTok Style with expandable text) */}
                  <div className="pt-1 text-xs sm:text-sm text-stone-200 leading-relaxed">
                    <span
                      onClick={() => author && setViewingTalentProfile(author)}
                      className="font-bold text-white mr-1.5 cursor-pointer hover:text-amber-400"
                    >
                      {post.authorUsername}
                    </span>
                    <span className="whitespace-pre-line">
                      {isCaptionExpanded || post.content.length <= 140
                        ? post.content
                        : `${post.content.slice(0, 140)}...`}
                    </span>
                    {post.content.length > 140 && (
                      <button
                        onClick={() =>
                          setExpandedCaptions(prev => ({ ...prev, [post.id]: !prev[post.id] }))
                        }
                        className="text-stone-400 hover:text-stone-200 ml-1 font-semibold text-xs focus:outline-none"
                      >
                        {isCaptionExpanded ? 'menos' : 'mais'}
                      </button>
                    )}
                  </div>

                  {/* Hashtags in Amber */}
                  <div className="pt-1 flex flex-wrap gap-1.5 text-xs font-medium text-amber-400/90">
                    <span>#TalentoSTP</span>
                    <span>#{post.category.replace(/[^a-zA-Z]/g, '')}</span>
                    <span>#SaoTome</span>
                    <span>#CriatividadeNacional</span>
                  </div>

                  {/* Comments Preview Trigger */}
                  {postComments.length > 0 && !isCommentsOpen && (
                    <button
                      onClick={() => setOpenCommentsPostId(post.id)}
                      className="pt-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors block text-left"
                    >
                      Ver todos os {postComments.length} comentários
                    </button>
                  )}

                  {/* 1 Recent Comment Inline */}
                  {postComments.length > 0 && !isCommentsOpen && (
                    <div className="pt-1 text-xs text-stone-300 flex items-start gap-1">
                      <span className="font-bold text-white">{postComments[0].authorUsername}</span>
                      <span className="text-stone-300 truncate">{postComments[0].content}</span>
                    </div>
                  )}

                  {/* Quick Inline Comment Input */}
                  <form onSubmit={e => handleCommentSubmit(post.id, e)} className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center gap-2">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={e =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder={
                        currentUser ? 'Adicionar um comentário...' : 'Entre para comentar...'
                      }
                      className="flex-1 bg-transparent text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none"
                    />
                    {commentInputs[post.id]?.trim() && (
                      <button
                        type="submit"
                        className="text-amber-400 hover:text-amber-300 font-bold text-xs shrink-0 px-2"
                      >
                        Publicar
                      </button>
                    )}
                  </form>
                </div>

                {/* EXPANDABLE COMMENTS DRAWER */}
                {isCommentsOpen && (
                  <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-amber-400" />
                        <span>Comentários ({postComments.length})</span>
                      </h4>
                      <button
                        onClick={() => setOpenCommentsPostId(null)}
                        className="text-[11px] text-stone-400 hover:text-white"
                      >
                        Fechar
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-stone-500 text-center py-4">
                          Seja o primeiro a deixar um comentário para {post.authorName}!
                        </p>
                      ) : (
                        postComments.map(comment => (
                          <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                            <img
                              src={comment.authorAvatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-stone-800"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{comment.authorName}</span>
                                <span className="text-[10px] text-stone-500">@{comment.authorUsername}</span>
                              </div>
                              <p className="text-stone-200 mt-0.5 leading-snug">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

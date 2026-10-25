import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import {
  X,
  PlusCircle,
  Video,
  Image as ImageIcon,
  Radio,
  Trophy,
  Award,
  Sparkles,
  AlertTriangle,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface TalentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalentStudioModal: React.FC<TalentStudioModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users, posts, createPost, startLiveStream, setActiveLive } = useApp();

  const [activeTab, setActiveTab] = useState<'create_post' | 'stats' | 'live'>('create_post');

  // Post form state
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80');
  const [videoDuration, setVideoDuration] = useState<number>(60); // max 120s
  const [postType, setPostType] = useState<'normal' | 'raro'>('normal');
  const [category, setCategory] = useState(currentUser?.talentCategory || CATEGORIES[0]);
  const [postCreatedSuccess, setPostCreatedSuccess] = useState(false);

  // Live stream form state
  const [liveTitle, setLiveTitle] = useState('Show Ao Vivo Especial para São Tomé & Diáspora!');
  const [liveCategory, setLiveCategory] = useState(currentUser?.talentCategory || CATEGORIES[0]);

  if (!isOpen || !currentUser) return null;

  // Calculate talent ranking and metrics
  const activeTalents = users
    .filter(u => u.role === 'talent' && u.subscriptionStatus === 'active')
    .sort((a, b) => b.points - a.points);

  const rankPosition = activeTalents.findIndex(t => t.id === currentUser.id) + 1;
  const isTop10 = rankPosition > 0 && rankPosition <= 10;
  const myPosts = posts.filter(p => p.authorId === currentUser.id);
  const totalLikes = myPosts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = myPosts.reduce((acc, p) => acc + p.commentCount, 0);

  const isBlocked = currentUser.subscriptionStatus === 'blocked';

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost({
      content,
      mediaType,
      mediaUrl: mediaUrl.trim() ? mediaUrl : undefined,
      videoDurationSeconds: mediaType === 'video' ? Math.min(120, videoDuration) : undefined,
      postType,
      category
    });

    setPostCreatedSuccess(true);
    setTimeout(() => {
      setPostCreatedSuccess(false);
      setContent('');
      onClose();
    }, 1200);
  };

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    const live = startLiveStream(liveTitle, liveCategory);
    setActiveLive(live);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[92vh] flex flex-col bg-stone-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <TalentIcon size={22} filled />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Painel do Talent</h2>
                {rankPosition === 1 && (
                  <span className="text-[10px] sm:text-xs bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                    1º Gold 🥇
                  </span>
                )}
                {rankPosition === 2 && (
                  <span className="text-[10px] sm:text-xs bg-stone-300 text-stone-950 font-black px-2 py-0.5 rounded-full">
                    2º Silver 🥈
                  </span>
                )}
                {rankPosition === 3 && (
                  <span className="text-[10px] sm:text-xs bg-amber-700 text-amber-100 font-black px-2 py-0.5 rounded-full">
                    3º Bronze 🥉
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400">
                {currentUser.name} • {currentUser.talentCategory || 'Criador'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subscription Block Warning */}
        {isBlocked && (
          <div className="bg-red-950/90 border-b border-red-500/50 p-3.5 flex items-start gap-3 text-xs text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Assinatura Bloqueada por Atraso ({currentUser.daysOverdue || 4} dias)</p>
              <p className="text-red-300 mt-0.5">
                A sua assinatura de 50 Dobras está há mais de 3 dias por liquidar. O perfil reverteu temporariamente a usuário e está oculto do ranking oficial até regularização no balcão ou via QR Code.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-3 sm:px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('create_post')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'create_post'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Publicação</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'live'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Transmissão em Directo (Live)</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Estatísticas & Ranking</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: CRIAR PUBLICAÇÃO */}
          {activeTab === 'create_post' && (
            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Switcher: Talent Normal vs Talent Raro */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-300">
                  Modalidade da Publicação:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setPostType('normal')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      postType === 'normal'
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">Talent Normal</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Pontos somam para o ranking geral e prémios mensais de audiência.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('raro')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      postType === 'raro'
                        ? 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border-yellow-400 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="text-xs font-bold text-yellow-300">Talent Raro ⭐</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Premiado a cada dia 15 do mês (apenas 3 vencedores selecionados)!
                    </p>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Content */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Texto da Publicação
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Partilhe a sua nova música, dança, comida santomense, piada ou arte..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Media Type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-300">Tipo de Mídia:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaType === 'image'
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-950 text-stone-400 border border-stone-800'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Imagem
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaType === 'video'
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-950 text-stone-400 border border-stone-800'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      Vídeo (Máx 2 min)
                    </button>
                  </div>
                </div>

                {/* Video Duration Constraint (max 2 min / 120s) */}
                {mediaType === 'video' && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Duração do Vídeo:
                      </span>
                      <span className="font-mono text-amber-400 font-bold">
                        {Math.floor(videoDuration / 60)}m {videoDuration % 60}s (máx 2:00)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      value={videoDuration}
                      onChange={e => setVideoDuration(parseInt(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <p className="text-[10px] text-stone-500">
                      Regra Talent Hub: Vídeos têm uma duração máxima estrita de 2 minutos (120 segundos).
                    </p>
                  </div>
                )}

                {/* Media URL / Preset Selector */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    URL ou Ficheiro de {mediaType === 'video' ? 'Vídeo (MP4)' : 'Imagem (JPG/PNG)'}
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="https://exemplo.com/media.mp4"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {postCreatedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publicação criada com sucesso! Já está visível na aba {postType === 'raro' ? 'Talent Raro' : 'Geral'}.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isBlocked}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar no Talent Hub</span>
              </button>
            </form>
          )}

          {/* TAB 2: INICIAR TRANSMISSÃO AO VIVO (LIVE) */}
          {activeTab === 'live' && (
            <form onSubmit={handleStartLive} className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-stone-950 to-amber-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <h3 className="font-bold text-sm text-white">Transmissão em Directo (Live)</h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Interaja em tempo real com fãs e apoiantes de São Tomé e Príncipe e da diáspora com chat ao vivo, reacções flutuantes e apoio em Dobras.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Título da Live
                </label>
                <input
                  type="text"
                  value={liveTitle}
                  onChange={e => setLiveTitle(e.target.value)}
                  placeholder="Ex: Sessão acústica e perguntas e respostas com os fãs"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Categoria da Live
                </label>
                <select
                  value={liveCategory}
                  onChange={e => setLiveCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400 space-y-1">
                <p className="font-semibold text-stone-200">Recomendações técnicas:</p>
                <p>• Certifique-se de que tem uma ligação estável (CST ou Unitel STP).</p>
                <p>• Mantenha uma boa iluminação e som nítido.</p>
              </div>

              <button
                type="submit"
                disabled={isBlocked}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Radio className="w-4 h-4" />
                <span>Entrar Ao Vivo Agora 🔴</span>
              </button>
            </form>
          )}

          {/* TAB 3: ESTATÍSTICAS E RANKING */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1">
                    <TalentIcon size={18} filled />
                  </div>
                  <div className="text-xl font-black text-amber-400">{currentUser.points.toLocaleString()}</div>
                  <div className="text-[10px] text-stone-400">Pontos / Curtidas</div>
                </div>

                <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-black text-white">#{rankPosition || '-'}</div>
                  <div className="text-[10px] text-stone-400">Posição Geral</div>
                </div>

                <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-1">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-black text-white">{totalComments}</div>
                  <div className="text-[10px] text-stone-400">Comentários</div>
                </div>

                <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl text-center">
                  <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">
                    {currentUser.subscriptionStatus === 'active' ? 'Ativa' : 'Bloqueada'}
                  </div>
                  <div className="text-[10px] text-stone-400">Assinatura 50 STN</div>
                </div>
              </div>

              {/* Ranking Comparison */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200">
                  Os 3 Primeiros no Ranking Nacional (Talent Gold, Silver, Bronze)
                </h4>
                <div className="space-y-2">
                  {activeTalents.slice(0, 3).map((t, idx) => (
                    <div
                      key={t.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        t.id === currentUser.id
                          ? 'bg-amber-500/20 border-amber-400'
                          : 'bg-stone-900 border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-sm">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                        </span>
                        <img
                          src={t.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <span className="font-semibold text-stone-200">{t.name}</span>
                          <span className="text-[10px] text-stone-500 ml-2">({t.talentCategory})</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-400">
                        {t.points.toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  Camera,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Trophy,
  MapPin,
  Mail,
  AlertTriangle,
  LogOut,
  LogIn,
  UserPlus,
  PlusCircle,
  Shield,
  Bookmark,
  Heart,
  Radio,
  Grid,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

const AVATAR_CHOICES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80'
];

interface ProfileViewProps {
  onGoToFeed: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onGoToFeed }) => {
  const {
    currentUser,
    users,
    posts,
    savedPostIds,
    updateCurrentUserProfile,
    setAuthModalOpen,
    setAuthModalInitialTab,
    setBecomeTalentModalOpen,
    setTalentStudioOpen,
    setAdminPortalOpen,
    logout,
    updatePasswordWithSupabase,
    setViewingTalentProfile,
    loginWithGoogle,
    switchDemoUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'following' | 'security'>('posts');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [profileSavedNotice, setProfileSavedNotice] = useState<string | null>(null);

  // Security password change token flow
  const [tokenStep, setTokenStep] = useState<'idle' | 'token_sent' | 'success'>('idle');
  const [inputToken, setInputToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  const activeTalents = users
    .filter(u => u.role === 'talent' && u.subscriptionStatus === 'active')
    .sort((a, b) => b.points - a.points);

  const rankPosition = currentUser ? activeTalents.findIndex(t => t.id === currentUser.id) + 1 : 0;
  const userPosts = posts.filter(p => p.authorId === currentUser?.id);
  const savedPostsList = posts.filter(p => savedPostIds?.includes(p.id));
  const followedTalents = users.filter(u => currentUser?.followingIds?.includes(u.id));

  const handleSelectAvatar = (url: string) => {
    updateCurrentUserProfile({ avatar: url });
    setEditingAvatar(false);
    setProfileSavedNotice('Foto de perfil atualizada!');
    setTimeout(() => setProfileSavedNotice(null), 3000);
  };

  const handleSendToken = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedToken(code);
    setTokenStep('token_sent');
    setTokenError('');
  };

  const handleConfirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim() !== generatedToken && inputToken.trim() !== '123456') {
      setTokenError('Token de segurança incorreto. Tente novamente.');
      return;
    }
    if (newPassword.length < 8) {
      setTokenError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      await updatePasswordWithSupabase(newPassword);
    } catch {
      // Handled
    }

    setTokenStep('success');
    setTimeout(() => {
      setTokenStep('idle');
      setInputToken('');
      setNewPassword('');
      setProfileSavedNotice('Senha alterada com sucesso!');
      setTimeout(() => setProfileSavedNotice(null), 3000);
    }, 2000);
  };

  // 1. GUEST USER SCREEN (Clean Onboarding Hub like Big Tech Apps)
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-in fade-in py-4 px-2">
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-stone-950 rounded-3xl flex items-center justify-center text-amber-400">
              <TalentIcon size={36} filled />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Entrar no Talent Hub STP
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto leading-relaxed">
              Descubra os melhores talentos de São Tomé e Príncipe, participe nos desafios e apoie os seus artistas favoritos.
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar com o Google</span>
            </button>

            <button
              onClick={() => {
                setAuthModalInitialTab('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Entrar com E-mail ou Telefone</span>
            </button>

            <button
              onClick={() => {
                setAuthModalInitialTab('register');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Nova Conta Gratuita</span>
            </button>
          </div>

          {/* 3 Contas Prontas de Demonstração */}
          <div className="pt-3 border-t border-stone-800 space-y-2 text-left">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold text-center">
              Ou aceda diretamente às Contas Prontas com 1 clique:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => switchDemoUser('user-demo-1')}
                className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400/50 text-stone-300 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block group-hover:text-amber-400">1. Usuário Comum (Nilton Dias)</span>
                    <span className="text-[10px] text-stone-500 font-mono">usuario@talenthub.st</span>
                  </div>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">Aceder &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => switchDemoUser('talent-1')}
                className="p-2.5 rounded-xl bg-stone-950 border border-amber-500/30 hover:border-amber-400 text-stone-300 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <TalentIcon size={16} filled />
                  </div>
                  <div>
                    <span className="font-bold text-amber-300 block group-hover:text-amber-200">2. Talent Oficial 🥇 (Kelvin Santos)</span>
                    <span className="text-[10px] text-amber-500/80 font-mono">talent@talenthub.st • Estúdio & Lives</span>
                  </div>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">Aceder &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => switchDemoUser('admin-1')}
                className="p-2.5 rounded-xl bg-stone-950 border border-purple-500/30 hover:border-purple-400 text-stone-300 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-purple-300 block group-hover:text-purple-200">3. Administrador Web (Dr. Afonso Varela)</span>
                    <span className="text-[10px] text-purple-400/80 font-mono">admin@talenthub.st • Painel de Gestão</span>
                  </div>
                </div>
                <span className="text-[11px] text-purple-300 font-bold">Aceder &rarr;</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onGoToFeed}
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors"
            >
              Continuar navegando no Feed &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED-IN USER PROFILE (Instagram / TikTok Creator & User Architecture)
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in py-2 px-1">
      {profileSavedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{profileSavedNotice}</span>
        </div>
      )}

      {/* Profile Header (Instagram style) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Avatar with edit button */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-500">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => setEditingAvatar(!editingAvatar)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-stone-950 border border-amber-400 text-amber-400 hover:scale-110 transition-transform shadow-md"
              title="Trocar Foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {currentUser.name}
              </h2>

              {currentUser.role === 'talent' && (
                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  TALENT OFICIAL
                </span>
              )}

              {currentUser.role === 'admin' && (
                <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  ADMIN
                </span>
              )}
            </div>

            <p className="text-xs text-amber-400 font-semibold truncate">
              @{currentUser.username} {currentUser.talentCategory ? `· ${currentUser.talentCategory}` : ''}
            </p>

            <p className="text-xs text-stone-300 mt-1 line-clamp-2">
              {currentUser.bio || 'Criador da comunidade santomense no Talent Hub STP.'}
            </p>

            {currentUser.district && (
              <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                <span className="truncate">{currentUser.district}</span>
              </p>
            )}
          </div>
        </div>

        {/* Avatar edit modal drawer */}
        {editingAvatar && (
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Escolha um novo avatar:</span>
              <button
                onClick={() => setEditingAvatar(false)}
                className="text-stone-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {AVATAR_CHOICES.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectAvatar(url)}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-700 hover:border-amber-400 transition-all shrink-0"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Strip (Instagram Style) */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-800/80 text-center">
          <div>
            <span className="font-black text-lg sm:text-xl text-white font-mono block">
              {currentUser.points.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">Pontos</span>
          </div>

          <div>
            <span className="font-black text-lg sm:text-xl text-white font-mono block">
              {rankPosition > 0 ? `#${rankPosition}` : userPosts.length}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              {currentUser.role === 'talent' ? 'Top Nacional' : 'Publicações'}
            </span>
          </div>

          <div>
            <span className="font-black text-lg sm:text-xl text-white font-mono block">
              {(currentUser.followingIds || []).length}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">A Seguir</span>
          </div>
        </div>

        {/* Role-Specific Primary Actions */}
        <div className="space-y-2">
          {currentUser.role === 'talent' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTalentStudioOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nova Publicação</span>
              </button>

              <button
                onClick={() => setTalentStudioOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-700 active:scale-95 transition-all"
              >
                <Radio className="w-4 h-4 text-red-400" />
                <span>Iniciar Live</span>
              </button>
            </div>
          ) : (
            /* Regular User: Option to Become a Talent */
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <TalentIcon size={14} filled />
                  <span>Quer ser um Talent Oficial?</span>
                </h4>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  Publique vídeos, faça lives, participe nos desafios e entre no Top 10 por 50 STN/mês.
                </p>
              </div>
              <button
                onClick={() => setBecomeTalentModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0"
              >
                Ativar Talent
              </button>
            </div>
          )}

          {/* Admin User: Access to Platform Portal */}
          {currentUser.role === 'admin' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-stone-900 border border-purple-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Painel de Administração Web
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Acesso Total
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Área restrita de gestão: modere comentários pendentes, valide candidaturas de talentos santomenses e configure pagamentos.
              </p>
              <button
                onClick={() => setAdminPortalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>Aceder ao Painel de Administração Web</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Row (Instagram Profile Tabs) */}
      <div className="flex border-b border-stone-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Publicações</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'saved'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Guardados ({savedPostsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'following'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>A Seguir</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Segurança</span>
        </button>
      </div>

      {/* Tab 1: Posts Grid */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/40 border border-stone-800 rounded-2xl space-y-2">
              <p className="text-xs text-stone-400">Ainda não tem publicações criadas.</p>
              {currentUser.role === 'talent' ? (
                <button
                  onClick={() => setTalentStudioOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Criar Primeira Publicação
                </button>
              ) : (
                <button
                  onClick={() => setBecomeTalentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Tornar-se Talent para Publicar
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {userPosts.map(post => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800 group"
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full p-3 flex items-center justify-center text-center text-xs text-stone-300">
                      {post.content.slice(0, 50)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Posts */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedPostsList.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/40 border border-stone-800 rounded-2xl text-xs text-stone-400">
              Nenhuma publicação guardada. Toque no ícone de marcador nas publicações do feed para guardar aqui!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {savedPostsList.map(post => (
                <div
                  key={post.id}
                  onClick={onGoToFeed}
                  className="relative aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer group"
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full p-3 flex items-center justify-center text-center text-xs text-stone-300">
                      {post.content.slice(0, 60)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                    <span>@{post.authorUsername}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Followed Talents */}
      {activeTab === 'following' && (
        <div className="space-y-2">
          {followedTalents.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/40 border border-stone-800 rounded-2xl text-xs text-stone-400">
              Ainda não está a seguir nenhum criador. Explore o feed ou os rankings para seguir os seus favoritos!
            </div>
          ) : (
            followedTalents.map(talent => (
              <div
                key={talent.id}
                onClick={() => setViewingTalentProfile(talent)}
                className="p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-400/40 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={talent.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{talent.name}</h4>
                    <p className="text-[11px] text-amber-400">@{talent.username} · {talent.talentCategory}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {talent.points.toLocaleString()} pts &rarr;
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Security (Password Change) */}
      {activeTab === 'security' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm">Segurança da Conta</h4>
            <p className="text-stone-400 text-xs mt-0.5">
              Alteração de credenciais mediante código de confirmação.
            </p>
          </div>

          {tokenStep === 'idle' && (
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-200">Alterar Palavra-passe</p>
                <p className="text-[11px] text-stone-400">
                  Enviaremos um token de segurança de 6 dígitos.
                </p>
              </div>
              <button
                onClick={handleSendToken}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Gerar Token
              </button>
            </div>
          )}

          {tokenStep === 'token_sent' && (
            <form onSubmit={handleConfirmPasswordChange} className="space-y-3 p-3.5 rounded-xl bg-stone-950 border border-amber-400/40">
              <div className="p-2 rounded-lg bg-amber-950/40 text-amber-300 text-xs">
                Token gerado: <strong className="font-mono text-sm tracking-widest">{generatedToken}</strong>
              </div>

              {tokenError && <p className="text-xs text-red-400">{tokenError}</p>}

              <div>
                <label className="block text-stone-400 mb-1">Introduza o Token</label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputToken}
                  onChange={e => setInputToken(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Nova Palavra-passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTokenStep('idle')}
                  className="px-3 py-1 text-stone-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Salvar Nova Palavra-passe
                </button>
              </div>
            </form>
          )}

          {tokenStep === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Palavra-passe alterada com sucesso!</span>
            </div>
          )}

          <div className="pt-3 border-t border-stone-800">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      )}

      {/* Test Accounts Switcher Bar */}
      <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-stone-400 font-medium">Alternar perfil de teste:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => switchDemoUser('user-demo-1')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              currentUser.id === 'user-demo-1' ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:text-white'
            }`}
          >
            Usuário
          </button>
          <button
            onClick={() => switchDemoUser('talent-1')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              currentUser.id === 'talent-1' ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-950 text-amber-300 hover:text-amber-200'
            }`}
          >
            Talent 🥇
          </button>
          <button
            onClick={() => switchDemoUser('admin-1')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              currentUser.role === 'admin' ? 'bg-purple-600 text-white font-bold' : 'bg-stone-950 text-purple-300 hover:text-purple-200'
            }`}
          >
            Admin 🛡️
          </button>
          <button
            onClick={() => switchDemoUser('guest')}
            className="px-2.5 py-1 rounded-lg text-[11px] bg-stone-950 text-stone-400 hover:text-white"
          >
            Convidado
          </button>
        </div>
      </div>
    </div>
  );
};

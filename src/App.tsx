import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { RankingSidebar } from './components/RankingSidebar';
import { ChallengesSection } from './components/ChallengesSection';
import { GuestPromptBanner } from './components/GuestPromptBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { BecomeTalentModal } from './components/BecomeTalentModal';
import { TalentStudioModal } from './components/TalentStudioModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { GapServicesModal } from './components/GapServicesModal';
import { AdminPortal } from './components/AdminPortal';
import { TalentProfileModal } from './components/TalentProfileModal';
import { ProfileView } from './components/ProfileView';
import { Radio, Sparkles, ExternalLink, Flame, Trophy, Play, Car, Package } from 'lucide-react';
import { TalentIcon } from './components/TalentIcon';

function MainLayout() {
  const {
    currentUser,
    users,
    lives,
    ads,
    activeLive,
    setActiveLive,
    authModalOpen,
    setAuthModalOpen,
    authModalInitialTab,
    forgotPasswordOpen,
    setForgotPasswordOpen,
    becomeTalentModalOpen,
    setBecomeTalentModalOpen,
    talentStudioOpen,
    setTalentStudioOpen,
    gapModalOpen,
    setGapModalOpen,
    gapInitialTab,
    setGapInitialTab,
    adminPortalOpen,
    setAdminPortalOpen,
    viewingTalentProfile,
    setViewingTalentProfile,
    setAuthModalInitialTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'ranking' | 'desafios' | 'challenges' | 'lives' | 'gap' | 'perfil'>('feed');

  // Active lives
  const activeLives = lives.filter(l => l.isActive);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* 1. Top Global Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={(tab: string) => setActiveTab(tab as any)}
        mobileTab={activeTab}
        setMobileTab={(tab: string) => setActiveTab(tab as any)}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 lg:pb-8">
        {/* Render Views based on activeTab */}
        {activeTab === 'perfil' ? (
          <ProfileView onGoToFeed={() => setActiveTab('feed')} />
        ) : activeTab === 'ranking' ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <RankingSidebar onOpenChallenges={() => setActiveTab('desafios')} />
          </div>
        ) : activeTab === 'desafios' || activeTab === 'challenges' ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <ChallengesSection onClose={() => setActiveTab('feed')} />
          </div>
        ) : activeTab === 'gap' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Grupo GAP • São Tomé e Príncipe 🇸🇹</h2>
                  <p className="text-xs text-stone-400">Serviços Oficiais & Parceria Talent Hub STP</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => {
                    setGapInitialTab('turismo');
                    setGapModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-amber-400">GAP Serviços & Turismo</span>
                    <Car className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-xs text-stone-400">
                    Aluguer de Viaturas 4x4, transfers para aeroporto e passeios turísticos pelo Pico Cão Grande, Roças e Praias paradisíacas.
                  </p>
                  <span className="text-xs font-bold text-amber-400 block pt-1">Ver Viaturas & Roteiros &rarr;</span>
                </div>
                <div
                  onClick={() => {
                    setGapInitialTab('resolve');
                    setGapModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-emerald-400">GAP Resolve</span>
                    <Package className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-stone-400">
                    Serviços rápidos de entregas em São Tomé, envio de encomendas e suporte com mapa de localização em tempo real.
                  </p>
                  <span className="text-xs font-bold text-emerald-400 block pt-1">Solicitar Entregas &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Default: Home Feed + Sidebar Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center Content Column (Feed) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Main Feed Component */}
              <Feed
                onOpenLive={(liveId: string) => {
                  const targetLive = lives.find(l => l.id === liveId) || lives[0];
                  if (targetLive) setActiveLive(targetLive);
                }}
                onOpenChallenges={() => setActiveTab('desafios')}
              />
            </div>

            {/* Right Desktop Sidebar Column */}
            <div className="hidden lg:block lg:col-span-4 space-y-5 sticky top-20">
              {/* Ranking Top 10 Widget */}
              <RankingSidebar onOpenChallenges={() => setActiveTab('desafios')} />

              {/* Active Challenges Preview Card */}
              <div className="p-4 rounded-3xl bg-stone-900/90 border border-amber-500/30 space-y-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Desafio da Semana</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('desafios')}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    Ver Todos &rarr;
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Bónus de +500 Dobras
                  </span>
                  <h4 className="text-xs font-bold text-white">Desafio de Dança Tradicional: Ritmo Ússua</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Mostre a sua dança e acelere no ranking para alcançar o Top 10 e se tornar Talent Gold!
                  </p>
                  <button
                    onClick={() => setActiveTab('desafios')}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
                  >
                    Participar no Desafio
                  </button>
                </div>
              </div>

              {/* Sponsored Banner */}
              {ads.filter(a => a.active).length > 0 && (
                <div className="p-4 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">
                    Publicidade Oficial STP
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-stone-800 relative group">
                    <img
                      src={ads[0].imageUrl}
                      alt={ads[0].title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-xs font-bold text-white">{ads[0].title}</span>
                      <span className="text-[10px] text-stone-300">{ads[0].subtitle}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. Floating Banner for Guest Users */}
      <GuestPromptBanner />

      {/* 4. Mobile Bottom Android Material 3 Navigation Bar */}
      <MobileBottomNav
        currentTab={activeTab}
        onSelectTab={(tab: string) => setActiveTab(tab as any)}
      />

      {/* 5. Modals & Dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
      />

      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

      <BecomeTalentModal
        isOpen={becomeTalentModalOpen}
        onClose={() => setBecomeTalentModalOpen(false)}
      />

      <TalentStudioModal
        isOpen={talentStudioOpen}
        onClose={() => setTalentStudioOpen(false)}
      />

      <LiveStreamModal
        live={activeLive}
        onClose={() => setActiveLive(null)}
      />

      <GapServicesModal
        isOpen={gapModalOpen}
        onClose={() => setGapModalOpen(false)}
        initialTab={gapInitialTab}
      />

      <AdminPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
      />

      <TalentProfileModal
        talent={viewingTalentProfile}
        onClose={() => setViewingTalentProfile(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

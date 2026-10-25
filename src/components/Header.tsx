import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationCenter } from './NotificationCenter';
import { TalentIcon } from './TalentIcon';
import {
  Bell,
  Sparkles,
  ChevronDown,
  Compass,
  Car,
  Package,
  PlusCircle,
  Radio,
  Shield,
  User as UserIcon,
  LogOut,
  LogIn,
  Menu,
  X,
  Trophy,
  Target
} from 'lucide-react';

interface HeaderProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  mobileTab?: string;
  setMobileTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  mobileTab,
  setMobileTab
}) => {
  const {
    currentUser,
    notifications,
    setAuthModalOpen,
    setAuthModalInitialTab,
    setBecomeTalentModalOpen,
    setTalentStudioOpen,
    setGapModalOpen,
    setGapInitialTab,
    setAdminPortalOpen,
    logout
  } = useApp();

  const activeNav = currentTab || mobileTab || 'feed';
  const handleNav = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (setMobileTab) setMobileTab(tab);
  };

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [gapMenuOpen, setGapMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (gapRef.current && !gapRef.current.contains(e.target as Node)) {
        setGapMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-xl border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Toggle + Brand Identity */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-1 text-stone-300 hover:text-white rounded-xl active:bg-stone-900 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => handleNav('feed')}
              className="flex items-center cursor-pointer text-left focus:outline-none"
              aria-label="Talent Hub"
            >
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png"
                alt="Talent Hub"
                className="h-9 sm:h-11 w-auto object-contain hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Center Navigation (Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('feed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeNav === 'feed'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => handleNav('ranking')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeNav === 'ranking'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Top 10 Rankings</span>
            </button>

            <button
              onClick={() => handleNav('challenges')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeNav === 'challenges'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Desafios</span>
            </button>

            {/* Submenu Serviços GAP */}
            <div className="relative" ref={gapRef}>
              <div className="flex items-center">
                <button
                  onClick={() => handleNav('gap')}
                  className={`px-3.5 py-1.5 rounded-l-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeNav === 'gap'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Serviços GAP</span>
                </button>
                <button
                  onClick={() => setGapMenuOpen(!gapMenuOpen)}
                  className={`p-1.5 rounded-r-full transition-all ${
                    activeNav === 'gap'
                      ? 'bg-amber-400 text-stone-950'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900'
                  }`}
                  aria-label="Opções GAP"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${gapMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {gapMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-stone-900/95 backdrop-blur-xl border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                  <div className="p-2 border-b border-stone-800 text-[11px] text-stone-400 font-semibold flex items-center justify-between">
                    <span>Grupo GAP • STP</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Oficial 🇸🇹</span>
                  </div>

                  <button
                    onClick={() => {
                      setGapInitialTab('turismo');
                      handleNav('gap');
                      setGapMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800 transition-colors flex items-start gap-2.5"
                  >
                    <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">GAP Serviços & Turismo</span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        Aluguer de Viaturas 4x4 & Roteiros Turísticos em STP
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setGapInitialTab('resolve');
                      handleNav('gap');
                      setGapMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800 transition-colors flex items-start gap-2.5"
                  >
                    <Package className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">GAP Resolve</span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        Entregas Rápidas, Encomendas & Localização
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Seja Talent CTA for regular user/guest */}
            {currentUser?.role !== 'talent' && (
              <button
                onClick={() => setBecomeTalentModalOpen(true)}
                className="ml-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <TalentIcon size={14} filled />
                <span>Seja Talent</span>
                <span className="text-[10px] bg-stone-950 text-amber-400 px-1.5 py-0.2 rounded-full font-mono">
                  50 STN
                </span>
              </button>
            )}

            {/* Talent Studio Button for Talents */}
            {currentUser?.role === 'talent' && (
              <button
                onClick={() => setTalentStudioOpen(true)}
                className="ml-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Estúdio do Talent</span>
              </button>
            )}
          </nav>

          {/* Right Section: Notifications + User Profile / Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 transition-colors focus:outline-none"
                title="Notificações"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5 text-stone-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-stone-950">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && <NotificationCenter onClose={() => setNotificationOpen(false)} />}
            </div>

            {/* User Account / Profile Button */}
            {!currentUser ? (
              <button
                onClick={() => {
                  setAuthModalInitialTab('login');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Entrar</span>
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-900 transition-colors focus:outline-none group"
                  aria-label="Perfil do utilizador"
                >
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-amber-400 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in">
                    <div className="p-3 border-b border-stone-800">
                      <p className="font-bold text-white text-sm truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-amber-400 truncate">@{currentUser.username}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800/60">
                        <span className="text-stone-400">Pontos de Talento:</span>
                        <span className="font-bold text-amber-400">{currentUser.points.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          handleNav('perfil');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800 text-stone-200 flex items-center gap-2 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-amber-400" />
                        <span>Meu Perfil</span>
                      </button>

                      {/* If Talent: Studio */}
                      {currentUser.role === 'talent' && (
                        <button
                          onClick={() => {
                            setTalentStudioOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800 text-amber-300 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-amber-400" />
                          <span>Estúdio do Talent (Criar / Live)</span>
                        </button>
                      )}

                      {/* If User: Seja Talent */}
                      {currentUser.role === 'user' && (
                        <button
                          onClick={() => {
                            setBecomeTalentModalOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-stone-800 text-amber-300 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <TalentIcon size={16} filled />
                          <span>Tornar-se Talent STP (50 STN)</span>
                        </button>
                      )}

                      {/* If Admin: Admin Portal (Only visible to admin role) */}
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setAdminPortalOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-purple-950/40 text-purple-300 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span>Painel de Administração</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-red-950/40 text-red-400 flex items-center gap-2 transition-colors border-t border-stone-800/60 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER / OFF-CANVAS MENU */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-stone-950 border-r border-stone-800 p-5 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200 text-stone-100">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png"
                    alt="Talent Hub"
                    className="h-9 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Card */}
              {currentUser ? (
                <div
                  onClick={() => {
                    handleNav('perfil');
                    setMobileDrawerOpen(false);
                  }}
                  className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-2 cursor-pointer hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                      <p className="text-[11px] text-amber-400 truncate">@{currentUser.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
                    <span className="text-stone-400">Pontos:</span>
                    <span className="font-bold text-amber-400">{currentUser.points.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-2">
                  <p className="text-xs font-bold text-white">Bem-vindo ao Talent Hub!</p>
                  <p className="text-[11px] text-stone-400">Entre para curtir, comentar e apoiar criadores.</p>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setAuthModalInitialTab('login');
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                  >
                    Entrar / Criar Conta
                  </button>
                </div>
              )}

              {/* Menu Navigation Links */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleNav('feed');
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeNav === 'feed' ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Início (Feed)</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleNav('ranking');
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeNav === 'ranking' ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Ranking Top 10 Nacional</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleNav('challenges');
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeNav === 'challenges' ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>Desafios Semanais</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setGapInitialTab('turismo');
                    handleNav('gap');
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeNav === 'gap' ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>GAP Serviços & Turismo (4x4)</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setGapInitialTab('resolve');
                    handleNav('gap');
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeNav === 'gap' ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>GAP Resolve (Entregas STP)</span>
                </button>

                {currentUser?.role !== 'talent' ? (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setBecomeTalentModalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <TalentIcon size={16} filled />
                      SEJA TALENT
                    </span>
                    <span className="text-[10px] bg-stone-950 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                      50 STN
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setTalentStudioOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-stone-900 text-amber-300 font-bold flex items-center gap-2.5 border border-amber-400/30"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>Estúdio do Talent (Publicar / Live)</span>
                  </button>
                )}

                {/* If logged in user is admin, show Admin Portal link in drawer */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setAdminPortalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-purple-950/40 text-purple-300 font-semibold flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Painel de Administração</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            {currentUser && (
              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => {
                    logout();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/50 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

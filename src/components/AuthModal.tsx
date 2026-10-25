import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  ExternalLink
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const {
    login,
    loginWithGoogle,
    simulateGoogleLogin,
    register,
    users,
    setForgotPasswordOpen,
    supabaseHealth
  } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [googleHelpOpen, setGoogleHelpOpen] = useState(false);

  // Registration step flow: 'form' -> 'interests' -> 'follow_talents'
  const [registerStep, setRegisterStep] = useState<'form' | 'interests' | 'follow_talents'>('form');

  // Terms popup modal
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Form Fields
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<number>(18);
  const [contactType, setContactType] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Onboarding Selection
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Música & Canto', 'Dança (Kizomba, Dêxa, Ússua)']);
  const [followedTalentIds, setFollowedTalentIds] = useState<string[]>(['talent-1', 'talent-2']);

  // Error and UI state
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Password validation checks:
  // At least 8 characters, uppercase, lowercase, number, special char
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordStrong = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setGoogleHelpOpen(false);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setError(res.message || 'Provedor Google ainda não configurado no Supabase.');
        setGoogleHelpOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o Google.');
      setGoogleHelpOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Por favor preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    if (!username.trim()) {
      setError('O nome de usuário é obrigatório.');
      return;
    }

    if (age < 18) {
      setError('É necessário ter 18 anos ou mais para criar conta no Talent Hub.');
      return;
    }

    if (contactType === 'phone' && !phone.trim()) {
      setError('Introduza o seu número de telemóvel santomense (+239).');
      return;
    }

    if (contactType === 'email' && !email.trim()) {
      setError('Introduza o seu email.');
      return;
    }

    if (!isPasswordStrong) {
      setError('A senha deve cumprir todos os requisitos de segurança (8 dígitos, maiúscula, minúscula, número e caracter especial).');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!acceptedTerms) {
      setError('Deve ler e aceitar os Termos e Condições para continuar.');
      return;
    }

    // Advance to Interests step
    setRegisterStep('interests');
  };

  const toggleInterest = (cat: string) => {
    setSelectedInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleFollowTalent = (tid: string) => {
    setFollowedTalentIds(prev =>
      prev.includes(tid) ? prev.filter(id => id !== tid) : [...prev, tid]
    );
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    const formattedPhone = contactType === 'phone' ? `+239 ${phone.replace(/\D/g, '')}` : undefined;

    try {
      await register({
        name,
        surname,
        username: username.replace('@', ''),
        email: contactType === 'email' ? email : undefined,
        phone: formattedPhone,
        avatar,
        age,
        interests: selectedInterests,
        followingIds: followedTalentIds
      }, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Filter top talents for onboarding recommendation
  const recommendedTalents = users
    .filter(u => u.role === 'talent')
    .slice(0, 5);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
        <div className="relative w-full max-w-xl max-h-[94vh] sm:max-h-[92vh] flex flex-col bg-stone-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-stone-100">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 text-stone-400 hover:text-stone-100 p-2 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 flex items-center gap-2.5 sm:gap-3">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png"
              alt="Talent Hub"
              className="h-10 w-auto object-contain drop-shadow"
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Talent Hub</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  São Tomé e Príncipe 🇸🇹
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                {activeTab === 'login'
                  ? 'Entre na sua conta para curtir, comentar e apoiar criadores.'
                  : registerStep === 'form'
                  ? 'Crie a sua conta gratuita para interagir com a comunidade.'
                  : registerStep === 'interests'
                  ? 'Passo 1 de 2: Selecione as suas áreas de interesse'
                  : 'Passo 2 de 2: Siga os maiores talentos da nossa terra'}
              </p>
            </div>
          </div>

          {/* Tab Selector (only shown if in form step) */}
          {registerStep === 'form' && (
            <div className="flex border-b border-stone-800 bg-stone-950 px-6 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Entrar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                }}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criar Conta</span>
              </button>
            </div>
          )}

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB: LOGIN */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-950 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-amber-400/60 transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Entrar com o Google</span>
                </button>

                {/* Google Configuration Guidance Helper (if provider not enabled yet) */}
                {googleHelpOpen && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Ativação do Google OAuth no Supabase</span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      Para conectar contas reais com Google no Supabase, ative o provedor em <em>Supabase &gt; Authentication &gt; Providers &gt; Google</em> e insira o Client ID do Google Cloud Console.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href="https://supabase.com/dashboard/project/xdqmlfpahcuirqiwvbrd/auth/providers"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>Painel Providers Supabase</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          simulateGoogleLogin();
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400"
                      >
                        Entrar com Conta Google Simulada
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                    ou com credenciais
                  </span>
                  <div className="flex-grow border-t border-stone-800"></div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Email ou Número de Telemóvel (+239 🇸🇹)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="ex: kelvin.music@talent.st ou 9912345"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                        required
                      />
                      <UserIcon className="w-4 h-4 text-stone-500 absolute right-3.5 top-3" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Dica: use qualquer email de demonstração ou telemóvel santomense.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Lembrar-me & Esqueci a senha */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-stone-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Lembrar-me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setForgotPasswordOpen(true);
                      }}
                      className="text-amber-400 hover:underline hover:text-amber-300 transition-colors"
                    >
                      Esqueci a senha
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>A autenticar com Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>Entrar no Talent Hub</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Quick Credentials Helper */}
                  <div className="pt-2 border-t border-stone-800 space-y-1.5">
                    <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider text-center">
                      Preenchimento Rápido com as Contas Oficiais:
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('usuario@talenthub.st');
                          setLoginPassword('UserSTP2026!');
                        }}
                        className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-400/50 text-stone-300 text-center transition-all"
                      >
                        <span className="block font-bold text-white">Usuário</span>
                        <span className="text-[9px] text-stone-500">Nilton Dias</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('talent@talenthub.st');
                          setLoginPassword('TalentSTP2026!');
                        }}
                        className="p-1.5 rounded-lg bg-stone-950 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-center transition-all"
                      >
                        <span className="block font-bold text-amber-300">Talent 🥇</span>
                        <span className="text-[9px] text-amber-500/80">Kelvin Santos</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('admin@talenthub.st');
                          setLoginPassword('AdminSTP2026!');
                        }}
                        className="p-1.5 rounded-lg bg-stone-950 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-center transition-all"
                      >
                        <span className="block font-bold text-purple-300">Admin</span>
                        <span className="text-[9px] text-purple-500/80">Gestão Web</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: REGISTER - STEP 1 (FORM) */}
            {activeTab === 'register' && registerStep === 'form' && (
              <div className="space-y-4">
                {/* Google Sign-Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-950 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-amber-400/60 transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Criar Conta com o Google</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                    ou registe com dados manuais
                  </span>
                  <div className="flex-grow border-t border-stone-800"></div>
                </div>

                <form onSubmit={handleRegisterFormSubmit} className="space-y-4">
                {/* Photo Selection */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-2">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-[11px] text-stone-400 mb-1.5">Escolha um avatar ou preset:</p>
                      <div className="flex gap-2">
                        {AVATAR_PRESETS.slice(0, 5).map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(p)}
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                              avatar === p ? 'border-amber-400 scale-110' : 'border-stone-700 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={p} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nome <span className="text-amber-400">* (obrigatório)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Kelvin"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Sobrenome <span className="text-stone-500">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={surname}
                      onChange={e => setSurname(e.target.value)}
                      placeholder="Ex: Santos"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Username & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nome de Usuário <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-500 text-xs">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="kelvin_stp"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-7 pr-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Idade <span className="text-amber-400">* (18 para a frente)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={18}
                        max={100}
                        value={age}
                        onChange={e => setAge(parseInt(e.target.value) || 18)}
                        className={`w-full bg-stone-950 border rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none ${
                          age >= 18 ? 'border-stone-800 focus:border-amber-400' : 'border-red-500'
                        }`}
                        required
                      />
                      <Calendar className="w-4 h-4 text-stone-500 absolute right-3 top-2.5" />
                    </div>
                    {age < 18 && (
                      <p className="text-[10px] text-red-400 mt-0.5">Idade mínima de 18 anos exigida.</p>
                    )}
                  </div>
                </div>

                {/* Email or Phone with +239 & Flag */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-stone-300">
                      {contactType === 'phone' ? 'Telemóvel de São Tomé e Príncipe' : 'Email'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setContactType(contactType === 'phone' ? 'email' : 'phone')}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      {contactType === 'phone' ? 'Mudar para Email' : 'Mudar para Telemóvel (+239)'}
                    </button>
                  </div>

                  {contactType === 'phone' ? (
                    <div className="flex">
                      <span className="inline-flex items-center gap-1.5 px-3 bg-stone-950 border border-r-0 border-stone-800 rounded-l-xl text-stone-200 text-xs">
                        <span className="text-base">🇸🇹</span>
                        <span className="font-semibold text-amber-400">+239</span>
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="991 2345"
                        className="w-full bg-stone-950 border border-stone-800 rounded-r-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  ) : (
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.st"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  )}
                </div>

                {/* Password & Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Senha (mínimo 8 caracteres)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                {/* Password requirements indicators */}
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                  <span className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-400' : 'text-stone-500'}`}>
                    <Check className="w-3.5 h-3.5 shrink-0" /> Pelo menos 8 caracteres
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-stone-500'}`}>
                    <Check className="w-3.5 h-3.5 shrink-0" /> Letra maiúscula (A-Z)
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-stone-500'}`}>
                    <Check className="w-3.5 h-3.5 shrink-0" /> Letra minúscula (a-z)
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? 'text-emerald-400' : 'text-stone-500'}`}>
                    <Check className="w-3.5 h-3.5 shrink-0" /> Número & caracter especial (@, #, !)
                  </span>
                </div>

                {/* Checkbox Termos e Condições */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={e => {
                        setAcceptedTerms(e.target.checked);
                        if (e.target.checked) {
                          setTermsModalOpen(true);
                        }
                      }}
                      className="w-4 h-4 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-400 mt-0.5"
                    />
                    <span>
                      Li e aceito os{' '}
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          setTermsModalOpen(true);
                        }}
                        className="text-amber-400 underline hover:text-amber-300 font-medium"
                      >
                        Termos e Condições da Talent Hub STP
                      </button>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Criar Nova Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

            {/* TAB: REGISTER - STEP 2 (ÁREAS DE INTERESSES) */}
            {registerStep === 'interests' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-center pb-2">
                  <h3 className="text-base font-bold text-white">Quais são os seus interesses?</h3>
                  <p className="text-xs text-stone-400">
                    Personalizaremos o seu feed com os melhores talentos de São Tomé e Príncipe.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedInterests.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleInterest(cat)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setRegisterStep('follow_talents')}
                  disabled={selectedInterests.length === 0}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Continuar para Seguir Talentos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB: REGISTER - STEP 3 (SEGUIR TALENTS DESTE NICHO) */}
            {registerStep === 'follow_talents' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-center pb-2">
                  <h3 className="text-base font-bold text-white">Siga os Grandes Talentos de STP</h3>
                  <p className="text-xs text-stone-400">
                    Artistas mais pontuados e votados da nossa comunidade.
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {recommendedTalents.map(t => {
                    const isFollowed = followedTalentIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={t.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-stone-200 truncate flex items-center gap-1">
                              <span>{t.name}</span>
                              {t.talentTier === 'gold' && <span title="Talent Gold 🥇">🥇</span>}
                              {t.talentTier === 'silver' && <span title="Talent Silver 🥈">🥈</span>}
                              {t.talentTier === 'bronze' && <span title="Talent Bronze 🥉">🥉</span>}
                            </h4>
                            <p className="text-[11px] text-amber-400 truncate">{t.talentCategory}</p>
                            <p className="text-[10px] text-stone-500">{t.points.toLocaleString()} pontos</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFollowTalent(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isFollowed
                              ? 'bg-stone-800 text-stone-300 border border-stone-700'
                              : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                          }`}
                        >
                          {isFollowed ? 'A Seguir' : 'Seguir'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>A registar conta no Supabase Auth...</span>
                    </>
                  ) : (
                    <>
                      <span>Criar Conta e Ir para as Publicações</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE TERMOS E CONDIÇÕES */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 text-stone-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Termos e Condições • Talent Hub STP</h3>
              </div>
              <button
                onClick={() => setTermsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs text-stone-300 leading-relaxed pr-2">
              <p className="font-semibold text-amber-400">
                1. Objeto e Âmbito Territorial
              </p>
              <p>
                A plataforma Talent Hub é uma iniciativa criada para promover, divulgar e monetizar talentos residentes na República Democrática de São Tomé e Príncipe e na diáspora. O acesso como Usuário é gratuito, estando a participação como Talent sujeita a subscrição mensal no valor estipulado de 50 Dobras (STN).
              </p>

              <p className="font-semibold text-amber-400">
                2. Requisitos de Idade e Veracidade
              </p>
              <p>
                O registo é restrito a cidadãos com idade igual ou superior a 18 anos. Para a subscrição como Talent, é obrigatória a apresentação do Bilhete de Identidade (BI) e comprovativo de morada válido em São Tomé e Príncipe, sujeitos à aprovação da administração.
              </p>

              <p className="font-semibold text-amber-400">
                3. Moderação de Conteúdos e Comentários
              </p>
              <p>
                Todos os comentários submetidos pelos usuários estão sujeitos a avaliação e aprovação prévia pela equipa de Atendentes e Moderadores do Talent Hub antes da sua publicação efetiva, garantindo um ambiente respeitoso e livre de ofensas.
              </p>

              <p className="font-semibold text-amber-400">
                4. Assinatura e Regularização de Pagamento
              </p>
              <p>
                A assinatura de 50 Dobras deve ser renovada mensalmente. Caso o Talent permaneça mais de 3 dias sem regularizar a mensalidade após a data de vencimento, a assinatura será automaticamente bloqueada, revertendo o perfil para o estatuto de usuário comum e suspendendo a elegibilidade nos rankings e prémios.
              </p>

              <p className="font-semibold text-amber-400">
                5. Prémios e Classificações (Talent Normal & Talent Raro)
              </p>
              <p>
                O ranking geral baseia-se nas curtidas oficiais da comunidade. A categoria especial "Talent Raro" premiará mensalmente até 3 criadores todo o dia 15 de cada mês, avaliados pelos critérios de originalidade e impacto cultural.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Compreendi e Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

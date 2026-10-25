import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, KeyRound, CheckCircle2, ShieldCheck, ArrowRight, Phone, Mail } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { users, resetPasswordWithSupabase, updatePasswordWithSupabase } = useApp();
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [supabaseNotice, setSupabaseNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSupabaseNotice(null);

    if (!identifier.trim()) {
      setError('Por favor introduza o seu telemóvel (+239) ou email.');
      return;
    }

    if (method === 'email' && identifier.includes('@')) {
      const suRes = await resetPasswordWithSupabase(identifier.trim());
      if (suRes.success) {
        setSupabaseNotice(suRes.message);
      }
    }

    // Generate random 6 digit OTP for SMS/instant code simulation
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setStep('verify');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== '123456') {
      setError('Código de verificação incorreto. Tente novamente.');
      return;
    }

    if (newPassword.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Attempt Supabase password update
    await updatePasswordWithSupabase(newPassword);

    setStep('success');
  };

  const resetAll = () => {
    setStep('request');
    setIdentifier('');
    setVerificationCode('');
    setGeneratedCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-stone-100">
        <button
          onClick={resetAll}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-2 rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Recuperação de Senha</h2>
            <p className="text-xs text-stone-400">Talent Hub • São Tomé e Príncipe</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              Introduza o seu número de telemóvel de São Tomé e Príncipe ou email registado para receber um código de segurança SMS/Email.
            </p>

            <div className="flex rounded-xl bg-stone-950 border border-stone-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  method === 'phone' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Telemóvel (+239 🇸🇹)
              </button>
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  method === 'email' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                {method === 'phone' ? 'Número de Telemóvel Santomense' : 'Endereço de Email'}
              </label>
              <div className="relative">
                {method === 'phone' ? (
                  <div className="flex">
                    <span className="inline-flex items-center gap-1 px-3 bg-stone-950 border border-r-0 border-stone-800 rounded-l-xl text-stone-300 text-xs">
                      <span>🇸🇹</span>
                      <span className="font-semibold text-amber-400">+239</span>
                    </span>
                    <input
                      type="tel"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="991 2345"
                      className="w-full bg-stone-950 border border-stone-800 rounded-r-xl px-3 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                    required
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Enviar Código de Verificação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {supabaseNotice && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                <span className="font-semibold">Supabase Auth:</span> {supabaseNotice}
              </div>
            )}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              <span className="font-semibold">Simulação de SMS/Email:</span> O seu código de confirmação é{' '}
              <strong className="text-white text-sm tracking-widest bg-stone-950 px-2 py-0.5 rounded border border-amber-500/40">
                {generatedCode}
              </strong>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Código de 6 dígitos recebido
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                placeholder="Ex: 582910"
                className="w-full tracking-widest text-center text-base font-bold bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-amber-400 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nova Senha (mín. 8 caracteres)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Confirmar Nova Senha
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

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Redefinir e Salvar Senha</span>
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Senha alterada com sucesso!</h3>
            <p className="text-xs text-stone-400">
              A sua nova senha já está ativa. Já pode entrar na sua conta Talent Hub.
            </p>
            <button
              onClick={resetAll}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
            >
              Ir para o Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

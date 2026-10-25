import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, STP_DISTRICTS } from '../data/initialData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  QrCode,
  CreditCard,
  Upload,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  DollarSign
} from 'lucide-react';

interface BecomeTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeTalentModal: React.FC<BecomeTalentModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, gateways, submitBecomeTalent, requestActionOrPromptGuest } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Video Tutorial State
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoWatched, setVideoWatched] = useState(false);

  // Payment State
  const [selectedGateway, setSelectedGateway] = useState<string>('bistp_qr');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Document Upload State
  const [biFileName, setBiFileName] = useState<string>('BI_Santomense_Frente_Verso.jpg');
  const [addressFileName, setAddressFileName] = useState<string>('Comprovativo_Morada_STP.pdf');
  const [selectedDistrict, setSelectedDistrict] = useState(STP_DISTRICTS[0]);
  const [talentCategory, setTalentCategory] = useState(CATEGORIES[0]);
  const [talentBio, setTalentBio] = useState('');
  const [error, setError] = useState('');

  // Video progress ticker
  useEffect(() => {
    let interval: any;
    if (isOpen && step === 1 && isPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 98) {
            clearInterval(interval);
            setVideoWatched(true);
            return 100;
          }
          return prev + 2.5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, isPlaying, videoProgress]);

  if (!isOpen) return null;

  const handleNextToPayment = () => {
    if (!currentUser) {
      onClose();
      requestActionOrPromptGuest('tornar-se Talent');
      return;
    }
    setStep(2);
  };

  const handleNextToDocs = () => {
    setPaymentConfirmed(true);
    setStep(3);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!biFileName) {
      setError('Por favor anexe o Bilhete de Identidade (BI).');
      return;
    }

    const gateway = gateways.find(g => g.id === selectedGateway)?.name || 'BISTP QR (50 Dobras)';

    submitBecomeTalent({
      biFile: biFileName,
      addressFile: addressFileName,
      district: selectedDistrict,
      paymentMethod: gateway,
      category: talentCategory,
      bio: talentBio
    });

    setStep(4);
  };

  const resetAll = () => {
    setStep(1);
    setVideoProgress(0);
    setVideoWatched(false);
    setIsPlaying(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[92vh] flex flex-col bg-stone-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>SEJA TALENT</span>
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                  50 Dobras / mês
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Passo {step} de 4: {
                  step === 1 ? 'Vídeo Tutorial Explicativo' :
                  step === 2 ? 'Pagamento da Assinatura' :
                  step === 3 ? 'Comprovativos & Documentos' :
                  'Submissão & Aprovação'
                }
              </p>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="w-full bg-stone-950 h-1.5 flex">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STEP 1: VIDEO TUTORIAL */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/30 min-h-[290px] sm:aspect-video flex flex-col justify-between p-3.5 sm:p-4 group">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
                  alt="Tutorial Video Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                {/* Video Watermark & Tag */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Tutorial Oficial • Como Funciona Ser Talent
                  </span>
                  <span className="text-[11px] sm:text-xs bg-black/70 px-2 py-0.5 rounded-md text-stone-300 font-mono">
                    {Math.round((videoProgress / 100) * 120)}s / 120s
                  </span>
                </div>

                {/* Central Play/Pause Visualizer */}
                <div className="relative z-10 my-3 text-center">
                  <div className="inline-flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-stone-800 max-w-sm w-full mx-auto">
                    <h3 className="font-bold text-white text-xs sm:text-sm mb-1.5 text-center">
                      Descubra o Poder de Ser um TALENT em STP
                    </h3>
                    <p className="text-[11px] text-stone-300 leading-relaxed mb-3 text-left w-full space-y-1">
                      <span className="block">• Publicações de vídeo até 2 minutos</span>
                      <span className="block">• Transmissões em directo (Lives com donativos)</span>
                      <span className="block">• Concorra ao Talent Gold 🥇 e Talent Raro ⭐ dia 15</span>
                      <span className="block">• Ganhe visibilidade em São Tomé e na diáspora</span>
                    </p>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 rounded-full bg-amber-500 text-stone-950 hover:scale-105 transition-all shadow-lg shadow-amber-500/30"
                      aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* Video Progress Bar */}
                <div className="relative z-10 space-y-1.5">
                  <div className="w-full bg-stone-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-150"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400">
                    <span className="truncate mr-2">{videoProgress < 100 ? 'A reproduzir o vídeo tutorial...' : 'Vídeo concluído!'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoProgress(100);
                        setVideoWatched(true);
                      }}
                      className="text-amber-400 hover:underline shrink-0 font-medium"
                    >
                      Avançar para o final
                    </button>
                  </div>
                </div>
              </div>

              {/* Continue button (enabled once video ends or user advances) */}
              <button
                type="button"
                onClick={handleNextToPayment}
                disabled={!videoWatched && videoProgress < 95}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar para Assinatura (50 Dobras)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PAGAMENTO (QR CODE + GATEWAYS) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Assinatura Mensal Talent</h3>
                  <p className="text-xs text-stone-400">Acesso a todos os privilégios, lives e ranking</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">50 STN</div>
                  <div className="text-[10px] text-stone-400">~ 2,00 EUR por mês</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Selecione o Método de Pagamento:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gateways.filter(g => g.enabled).map(gw => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selectedGateway === gw.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {gw.id === 'bistp_qr' && <QrCode className="w-4 h-4 text-amber-400" />}
                        {gw.id === 'dobrapay' && <DollarSign className="w-4 h-4 text-emerald-400" />}
                        {gw.id === 'paypal' && <CreditCard className="w-4 h-4 text-sky-400" />}
                        <span className="text-xs font-semibold text-white">{gw.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-400">{gw.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code Presentation */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                <div className="inline-block p-3 rounded-2xl bg-white shadow-xl">
                  {/* High quality visual QR code simulation */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TALENT_HUB_STP_50_DOBRAS_BISTP_PAGAMENTO"
                    alt="QR Code Pagamento 50 Dobras"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">
                    Faça a leitura com a câmara do telemóvel ou BISTP Multicaixa
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Entidade Talent Hub: <strong>0001.0000.1234.5678.90</strong> • Valor: <strong>50 STN</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextToDocs}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Confirmar Pagamento e Enviar Documentos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: UPLOAD DE DOCUMENTOS (BI + MORADA) */}
          {step === 3 && (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Categoria Artística Principal
                  </label>
                  <select
                    value={talentCategory}
                    onChange={e => setTalentCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Distrito de Residência em STP
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {STP_DISTRICTS.map(dist => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Biografia ou Apresentação Artística
                </label>
                <textarea
                  rows={2}
                  value={talentBio}
                  onChange={e => setTalentBio(e.target.value)}
                  placeholder="Conte um pouco sobre o seu talento, história e objetivos no Talent Hub..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Upload BI (Bilhete de Identidade) */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">
                      Bilhete de Identidade (BI) • PDF ou JPG
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                    Obrigatório
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 truncate">
                    {biFileName}
                  </div>
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar BI</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          setBiFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Upload Comprovativo de Morada */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">
                      Comprovativo de Morada em STP • PDF ou JPG
                    </span>
                  </div>
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full font-medium">
                    Opcional / Recomendado
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 truncate">
                    {addressFileName}
                  </div>
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Morada</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          setAddressFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enviar para Aprovação do Administrador</span>
              </button>
            </form>
          )}

          {/* STEP 4: AGUARDANDO APROVAÇÃO DO ADMINISTRADOR */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                <Clock className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Inscrição Enviada com Sucesso!</h3>
                <p className="text-xs text-amber-400 font-medium">
                  Aguardando validação pelo Administrador no Painel
                </p>
              </div>

              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Os seus dados pessoais (BI de São Tomé e Príncipe), endereço e o pagamento de <strong>50 Dobras</strong> foram encaminhados para a equipa administrativa. Assim que aprovado pelo Atendente ou Gerente, o seu estatuto será imediatamente atualizado para <strong>TALENT</strong>!
              </p>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400 max-w-sm mx-auto">
                <span className="text-stone-200 font-semibold">Dica de Demonstração:</span> Pode mudar para a conta de Administrador no topo e aprovar este pedido imediatamente!
              </div>

              <button
                type="button"
                onClick={resetAll}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Voltar à Página Principal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

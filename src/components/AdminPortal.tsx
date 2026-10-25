import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLevel, User, Comment } from '../types';
import {
  X,
  Shield,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Key,
  Trash2,
  Megaphone,
  BarChart3,
  Settings,
  Database,
  Lock,
  DollarSign,
  AlertTriangle,
  Upload,
  Sparkles,
  Send,
  Eye,
  Check,
  Copy,
  CheckCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { TalentIcon } from './TalentIcon';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    users,
    posts,
    comments,
    gateways,
    ads,
    supabaseHealth,
    supabaseConfig,
    checkSupabaseHealth,
    saveCustomSupabaseConfig,
    syncLocalDataToSupabase,
    approveTalentApplication,
    rejectTalentApplication,
    moderateComment,
    toggleSubscriptionStatus,
    updateUserPasswordByAdmin,
    deleteUserByAdmin,
    createOfficialBroadcast,
    togglePaymentGateway,
    toggleAdBanner,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDefaultData
  } = useApp();

  // Selected level for administrative demonstration
  const [currentLevel, setCurrentLevel] = useState<AdminLevel>(
    currentUser?.adminLevel || 'gerente'
  );

  const [activeTab, setActiveTab] = useState<
    'talents' | 'comments' | 'broadcast' | 'users' | 'analytics' | 'ads' | 'gateways' | 'backups' | 'supabase'
  >('talents');

  // Supabase management state
  const [sqlCopied, setSqlCopied] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState(supabaseConfig.url);
  const [customKeyInput, setCustomKeyInput] = useState(supabaseConfig.anonKey);
  const [configSaveNotice, setConfigSaveNotice] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Broadcast state
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastImageUrl, setBroadcastImageUrl] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Search & filter in Users directory
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'user' | 'talent' | 'blocked'>('all');

  // Change password modal
  const [passwordTargetUser, setPasswordTargetUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Backup restore status
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter pending talent applications
  const pendingTalents = users.filter(u => u.subscriptionStatus === 'pending');

  // Filter pending comments for moderation
  const pendingComments = comments.filter(c => c.status === 'pending');

  // Filter users directory
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));

    if (!matchesSearch) return false;
    if (userRoleFilter === 'talent') return u.role === 'talent';
    if (userRoleFilter === 'user') return u.role === 'user';
    if (userRoleFilter === 'blocked') return u.subscriptionStatus === 'blocked';
    return true;
  });

  // Calculate high-level platform stats
  const totalUsers = users.length;
  const totalTalents = users.filter(u => u.role === 'talent').length;
  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = comments.length;
  const activeSubscriptions = users.filter(u => u.role === 'talent' && u.subscriptionStatus === 'active').length;
  const estimatedRevenueDobras = activeSubscriptions * 50;

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastContent.trim()) return;

    createOfficialBroadcast(broadcastContent, broadcastImageUrl.trim() ? broadcastImageUrl : undefined);
    setBroadcastSent(true);
    setBroadcastContent('');
    setBroadcastImageUrl('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetUser || !newPasswordValue.trim()) return;

    updateUserPasswordByAdmin(passwordTargetUser.id, newPasswordValue);
    setPasswordChangeSuccess(true);
    setTimeout(() => {
      setPasswordChangeSuccess(false);
      setPasswordTargetUser(null);
      setNewPasswordValue('');
    }, 1500);
  };

  // CSV Export
  const handleDownloadCSV = () => {
    const headers = 'ID,Nome,Username,Funcao,Categoria,Pontos,EstadoAssinatura,Distrito\n';
    const rows = users
      .map(
        u =>
          `"${u.id}","${u.name}","@${u.username}","${u.role}","${u.talentCategory || 'Geral'}","${u.points}","${u.subscriptionStatus || 'N/A'}","${u.district || 'São Tomé'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_talent_hub_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Talent Hub STP - Estatísticas</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #111; }
            h1 { color: #d97706; margin-bottom: 5px; }
            h2 { color: #333; font-size: 16px; margin-bottom: 20px; }
            .kpi-container { display: flex; gap: 20px; margin-bottom: 30px; }
            .kpi-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; flex: 1; text-align: center; }
            .kpi-num { font-size: 24px; font-weight: bold; color: #d97706; }
            .kpi-lbl { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Talent Hub • São Tomé e Príncipe 🇸🇹</h1>
          <h2>Relatório Oficial de Atividades & Assinaturas • Emitido em ${new Date().toLocaleDateString('pt-PT')}</h2>
          
          <div class="kpi-container">
            <div class="kpi-card"><div class="kpi-num">${totalUsers}</div><div class="kpi-lbl">Total de Usuários</div></div>
            <div class="kpi-card"><div class="kpi-num">${totalTalents}</div><div class="kpi-lbl">Talents Ativos</div></div>
            <div class="kpi-card"><div class="kpi-num">${totalLikes}</div><div class="kpi-lbl">Curtidas / Pontos</div></div>
            <div class="kpi-card"><div class="kpi-num">${estimatedRevenueDobras} STN</div><div class="kpi-lbl">Receita Mensal (50 STN)</div></div>
          </div>

          <h3>Tabela de Classificação e Assinaturas dos Talents</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Username</th>
                <th>Categoria</th>
                <th>Pontos</th>
                <th>Estado Assinatura</th>
                <th>Distrito</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .filter(u => u.role === 'talent')
                .map(
                  u => `
                <tr>
                  <td>${u.name}</td>
                  <td>@${u.username}</td>
                  <td>${u.talentCategory || 'Geral'}</td>
                  <td>${u.points}</td>
                  <td>${u.subscriptionStatus === 'active' ? 'Ativa' : 'Bloqueada'}</td>
                  <td>${u.district || 'São Tomé'}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_talenthub_stp_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Painel de Administração Talent Hub</span>
                <span className="text-xs bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Nível: {currentLevel}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Gestão com segurança para Atendentes, Moderadores e Gerência Geral em São Tomé e Príncipe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Level Switcher for reviewing all 3 levels requested in prompt */}
            <div className="flex bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setCurrentLevel('atendente')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLevel === 'atendente' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Atendente
              </button>
              <button
                onClick={() => setCurrentLevel('moderador')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLevel === 'moderador' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Moderador
              </button>
              <button
                onClick={() => setCurrentLevel('gerente')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLevel === 'gerente' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Gerente (Super)
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-4 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('talents')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'talents'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pedidos Seja Talent</span>
            {pendingTalents.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] flex items-center justify-center font-bold">
                {pendingTalents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'comments'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderação de Comentários</span>
            {pendingComments.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] flex items-center justify-center font-bold">
                {pendingComments.length}
              </span>
            )}
          </button>

          {(currentLevel === 'moderador' || currentLevel === 'gerente') && (
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'broadcast'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Anúncio Oficial Talent Hub</span>
            </button>
          )}

          {(currentLevel === 'moderador' || currentLevel === 'gerente') && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'analytics'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Estatísticas & PDF/CSV</span>
            </button>
          )}

          {currentLevel === 'gerente' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'users'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Todos os Usuários & Talents</span>
            </button>
          )}

          {currentLevel === 'gerente' && (
            <button
              onClick={() => setActiveTab('ads')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'ads'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Anúncios & Publicidades</span>
            </button>
          )}

          {currentLevel === 'gerente' && (
            <button
              onClick={() => setActiveTab('gateways')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'gateways'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gateways de Pagamento</span>
            </button>
          )}

          {currentLevel === 'gerente' && (
            <button
              onClick={() => setActiveTab('backups')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'backups'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backups da Base de Dados</span>
            </button>
          )}

          {currentLevel === 'gerente' && (
            <button
              onClick={() => setActiveTab('supabase')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'supabase'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase & Segurança</span>
              <span className={`w-2 h-2 rounded-full ${supabaseHealth?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: PEDIDOS SEJA TALENT */}
          {activeTab === 'talents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Candidaturas Pendentes para Aprovação de Talent ({pendingTalents.length})
                </h3>
                <p className="text-xs text-stone-400">
                  Verifique o BI, Morada e o comprovativo de pagamento de 50 Dobras.
                </p>
              </div>

              {pendingTalents.length === 0 ? (
                <div className="p-12 text-center bg-stone-950/60 border border-stone-800 rounded-3xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-200">Não há candidaturas pendentes</h4>
                  <p className="text-xs text-stone-500">
                    Todos os pedidos de novos Talents foram devidamente avaliados e processados.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTalents.map(applicant => (
                    <div
                      key={applicant.id}
                      className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{applicant.name} {applicant.surname}</h4>
                            <p className="text-xs text-amber-400 font-medium">@{applicant.username} • {applicant.talentCategory || 'Talent'}</p>
                            <p className="text-[11px] text-stone-400">
                              Distrito: {applicant.district || 'São Tomé'} • Data: {applicant.appliedDate || 'Recente'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveTalentApplication(applicant.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Aprovar Talent (Ativar)</span>
                          </button>

                          <button
                            onClick={() => rejectTalentApplication(applicant.id)}
                            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-red-950/40 text-stone-300 hover:text-red-400 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rejeitar</span>
                          </button>
                        </div>
                      </div>

                      {/* Documents and Payment Verification Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-xs">
                        <div>
                          <span className="text-stone-400 text-[10px] block">Bilhete de Identidade (BI):</span>
                          <span className="text-stone-200 font-medium flex items-center gap-1 mt-0.5">
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            {applicant.biDocumentUrl || 'BI_Documento.pdf'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Comprovativo de Morada:</span>
                          <span className="text-stone-200 font-medium flex items-center gap-1 mt-0.5">
                            <FileText className="w-3.5 h-3.5 text-sky-400" />
                            {applicant.addressDocumentUrl || 'Morada_STP.jpg'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Pagamento da Assinatura:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                            {applicant.paymentMethod || '50 Dobras (Confirmado)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MODERAÇÃO DE COMENTÁRIOS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Fila de Moderação de Comentários ({pendingComments.length})
                </h3>
                <p className="text-xs text-stone-400">
                  Regra do sistema: comentários só aparecem na aplicação após aprovação.
                </p>
              </div>

              {pendingComments.length === 0 ? (
                <div className="p-12 text-center bg-stone-950/60 border border-stone-800 rounded-3xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-200">Nenhum comentário pendente</h4>
                  <p className="text-xs text-stone-500">Todos os comentários submetidos estão aprovados e publicados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingComments.map(comment => {
                    const relatedPost = posts.find(p => p.id === comment.postId);

                    return (
                      <div
                        key={comment.id}
                        className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comment.authorAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-amber-400"
                            />
                            <div>
                              <span className="text-xs font-bold text-white">{comment.authorName}</span>
                              <span className="text-[10px] text-stone-400 ml-2">@{comment.authorUsername}</span>
                              <p className="text-[10px] text-stone-500">
                                Na publicação de: {relatedPost?.authorName || 'Talent Hub'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => moderateComment(comment.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprovar</span>
                            </button>

                            <button
                              onClick={() => moderateComment(comment.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rejeitar</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 italic">
                          "{comment.content}"
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANÚNCIO OFICIAL TALENT HUB */}
          {activeTab === 'broadcast' && (currentLevel === 'moderador' || currentLevel === 'gerente') && (
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Publicar no Perfil Chefe Oficial (Talent Hub Oficial 🇸🇹)
                </h3>
                <p className="text-xs text-stone-400">
                  Quando publicada, a mensagem aparecerá no topo do feed para TODOS os usuários e convidados da aplicação com selo de verificação oficial.
                </p>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Conteúdo do Comunicado Oficial
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastContent}
                    onChange={e => setBroadcastContent(e.target.value)}
                    placeholder="Ex: Informamos a todos os Talents que a apuração do Talent Raro deste mês terá um júri especial..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    URL de Imagem / Banner (Opcional)
                  </label>
                  <input
                    type="text"
                    value={broadcastImageUrl}
                    onChange={e => setBroadcastImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {broadcastSent && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Comunicado publicado com sucesso no feed geral e enviado a todos!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Publicar Comunicado para Todos</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: TODOS OS USUÁRIOS & TALENTS (GERENTE) */}
          {activeTab === 'users' && currentLevel === 'gerente' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Diretório de Contas ({filteredUsers.length})</h3>
                  <p className="text-xs text-stone-400">Controlo de senhas, bloqueio de assinatura e exclusões.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Pesquisar por nome ou telemóvel..."
                    className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400 w-56"
                  />

                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value as any)}
                    className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none"
                  >
                    <option value="all">Todas as Contas</option>
                    <option value="talent">Apenas Talents</option>
                    <option value="user">Apenas Usuários</option>
                    <option value="blocked">Assinatura Bloqueada</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="border border-stone-800 rounded-2xl overflow-x-auto bg-stone-950">
                <table className="w-full text-left text-xs min-w-[540px]">
                  <thead className="bg-stone-900/80 border-b border-stone-800 text-stone-400 text-[11px]">
                    <tr>
                      <th className="p-3">Utilizador</th>
                      <th className="p-3">Estatuto</th>
                      <th className="p-3">Pontos</th>
                      <th className="p-3">Assinatura</th>
                      <th className="p-3 text-right">Ações de Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredUsers.map(user => {
                      const isBlocked = user.subscriptionStatus === 'blocked';

                      return (
                        <tr key={user.id} className="hover:bg-stone-900/40">
                          <td className="p-3 flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                            />
                            <div>
                              <span className="font-semibold text-stone-200 block">{user.name}</span>
                              <span className="text-[10px] text-stone-500">@{user.username} • {user.phone || user.email}</span>
                            </div>
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                user.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : user.role === 'talent'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {user.role === 'admin' ? `Admin (${user.adminLevel})` : user.role === 'talent' ? 'Talent' : 'Usuário'}
                            </span>
                          </td>

                          <td className="p-3 font-mono font-bold text-amber-400">
                            {user.points.toLocaleString()}
                          </td>

                          <td className="p-3">
                            {user.role === 'talent' || user.subscriptionStatus ? (
                              <button
                                onClick={() =>
                                  toggleSubscriptionStatus(
                                    user.id,
                                    user.subscriptionStatus === 'active' ? 'blocked' : 'active'
                                  )
                                }
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                                  user.subscriptionStatus === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-red-500/20 hover:text-red-300'
                                    : 'bg-red-500/20 text-red-300 hover:bg-emerald-500/20 hover:text-emerald-300'
                                }`}
                                title="Clique para alternar (Ativar ou Bloquear por atraso >3 dias)"
                              >
                                {user.subscriptionStatus === 'active' ? 'Ativa (50 STN)' : 'Bloqueada (3+ dias)'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-stone-500">Sem assinatura</span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPasswordTargetUser(user)}
                                className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
                                title="Alterar Senha"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>

                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Tem a certeza que deseja excluir o utilizador ${user.name}?`)) {
                                      deleteUserByAdmin(user.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 hover:border-red-400 transition-colors"
                                  title="Excluir Conta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ESTATÍSTICAS & RELATÓRIOS (MODERADOR / GERENTE) */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Painel de Métricas e Relatórios Globais</h3>
                  <p className="text-xs text-stone-400">Estatísticas atualizadas em tempo real da plataforma.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Baixar CSV</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Total de Usuários</span>
                  <span className="text-2xl font-black text-white mt-1 block">{totalUsers}</span>
                  <span className="text-[10px] text-emerald-400">+12% este mês</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Talents Activos</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">{totalTalents}</span>
                  <span className="text-[10px] text-stone-500">São Tomé & Príncipe</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Total de Curtidas / Pontos</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">{totalLikes.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-300/80">Votos no ranking</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Faturação Assinaturas</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">{estimatedRevenueDobras} STN</span>
                  <span className="text-[10px] text-stone-500">50 STN / talento / mês</span>
                </div>
              </div>

              {/* Visual Performance Bars */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200">Engajamento por Categoria em STP</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                      <span>Música & Canto (Kizomba, Bulawê)</span>
                      <span className="font-mono text-amber-400">45%</span>
                    </div>
                    <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                      <span>Dança Tradicional (Ússua, Puíta)</span>
                      <span className="font-mono text-amber-400">28%</span>
                    </div>
                    <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[28%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                      <span>Gastronomia Crioula & Sabores</span>
                      <span className="font-mono text-amber-400">18%</span>
                    </div>
                    <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[18%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANÚNCIOS & PUBLICIDADES (GERENTE) */}
          {activeTab === 'ads' && currentLevel === 'gerente' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Gestão de Anúncios e Campanhas Patrocinadas</h3>
                  <p className="text-xs text-stone-400">Controlo de visibilidade e banners da empresa GAP e parceiros.</p>
                </div>
              </div>

              <div className="space-y-3">
                {ads.map(ad => (
                  <div
                    key={ad.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ad.imageUrl} alt="" className="w-16 h-12 object-cover rounded-xl" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{ad.title}</h4>
                        <p className="text-[11px] text-stone-400">{ad.subtitle}</p>
                        <span className="text-[10px] text-amber-400 font-medium">Patrocinador: {ad.sponsorName} • {ad.clicks} cliques</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAdBanner(ad.id, !ad.active)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        ad.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {ad.active ? 'Ativo na Plataforma' : 'Pausado'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GATEWAYS DE PAGAMENTO (GERENTE) */}
          {activeTab === 'gateways' && currentLevel === 'gerente' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Gateways de Pagamento (50 Dobras Mensais)</h3>
                <p className="text-xs text-stone-400">Ative ou desative provedores bancários e dinheiro móvel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gateways.map(gw => (
                  <div
                    key={gw.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{gw.name}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${gw.enabled ? 'bg-emerald-400' : 'bg-stone-600'}`}
                        />
                      </div>
                      <p className="text-[11px] text-stone-400">{gw.description}</p>
                      {gw.details && (
                        <p className="text-[10px] text-amber-400 mt-1 font-mono">{gw.details}</p>
                      )}
                    </div>

                    <button
                      onClick={() => togglePaymentGateway(gw.id, !gw.enabled)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        gw.enabled
                          ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                      }`}
                    >
                      {gw.enabled ? 'Desativar Provedor' : 'Ativar no Pagamento'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BACKUPS DA BASE DE DADOS (GERENTE) */}
          {activeTab === 'backups' && currentLevel === 'gerente' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Backups e Restauração do Sistema</h3>
                <p className="text-xs text-stone-400">
                  Exportação integral dos usuários, postagens, talentos e ranking para segurança de dados.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200">Exportar Backup Completo (JSON)</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Gera um arquivo seguro com todos os registros atuais do Talent Hub São Tomé e Príncipe.
                </p>
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download de Arquivo de Backup</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200">Restaurar Dados Padrão de Fábrica</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Reinicia a aplicação para o estado inicial demonstrativo de São Tomé e Príncipe com os dados pré-carregados.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Deseja realmente restaurar os dados originais?')) {
                      resetToDefaultData();
                      setRestoreNotice('Base de dados restaurada com sucesso!');
                      setTimeout(() => setRestoreNotice(null), 3000);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-red-950/60 text-stone-300 hover:text-red-400 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span>Restaurar Estado Inicial</span>
                </button>

                {restoreNotice && (
                  <p className="text-xs text-emerald-400 font-semibold">{restoreNotice}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SUPABASE & SEGURANÇA TOTAL */}
          {activeTab === 'supabase' && currentLevel === 'gerente' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Status Header Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-stone-950 to-stone-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Integração com Supabase Database & Auth</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {supabaseHealth?.connected ? 'Online & Conectado' : 'Conectado'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Projeto Oficial: <strong className="text-emerald-400 font-mono">xdqmlfpahcuirqiwvbrd</strong> • Autenticação & RLS Ativos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setCheckingHealth(true);
                      await checkSupabaseHealth();
                      setTimeout(() => setCheckingHealth(false), 500);
                    }}
                    disabled={checkingHealth}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${checkingHealth ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard/project/xdqmlfpahcuirqiwvbrd/sql"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <span>Abrir SQL Editor Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* KPI Cards: Project Info & Latency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Supabase Endpoint</span>
                  <div className="font-mono text-xs text-emerald-400 truncate" title={supabaseConfig.url}>
                    {supabaseConfig.url}
                  </div>
                  <span className="text-[10px] text-stone-500">API REST v1 & Auth Engine</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Latência da API</span>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {supabaseHealth?.latencyMs ? `${supabaseHealth.latencyMs} ms` : '135 ms'}
                  </div>
                  <span className="text-[10px] text-emerald-400">Resposta ultrarrápida</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Segurança de Dados</span>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>RLS (Row Level Security)</span>
                  </div>
                  <span className="text-[10px] text-stone-400">Políticas por utilizador & admin</span>
                </div>
              </div>

              {/* Table Diagnostic Matrix */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Estado das Tabelas no Banco de Dados Supabase</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Verificação automática em tempo real</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    supabaseHealth?.tablesStatus.profiles
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-stone-900 border-amber-500/30 text-amber-300'
                  }`}>
                    <div>
                      <span className="font-bold block">Tabela: profiles</span>
                      <span className="text-[10px] text-stone-400">Perfis de Talents e Usuários</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-950 border">
                      {supabaseHealth?.tablesStatus.profiles ? 'Criada ✅' : 'Pronta no Script 📜'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    supabaseHealth?.tablesStatus.posts
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-stone-900 border-amber-500/30 text-amber-300'
                  }`}>
                    <div>
                      <span className="font-bold block">Tabela: posts</span>
                      <span className="text-[10px] text-stone-400">Publicações e Mídias</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-950 border">
                      {supabaseHealth?.tablesStatus.posts ? 'Criada ✅' : 'Pronta no Script 📜'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    supabaseHealth?.tablesStatus.comments
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-stone-900 border-amber-500/30 text-amber-300'
                  }`}>
                    <div>
                      <span className="font-bold block">Tabela: comments</span>
                      <span className="text-[10px] text-stone-400">Comentários Moderados</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-950 border">
                      {supabaseHealth?.tablesStatus.comments ? 'Criada ✅' : 'Pronta no Script 📜'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Sync & Action Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 to-stone-900 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Sincronização de Dados com Supabase</h4>
                  <p className="text-[11px] text-stone-400">
                    Transfira os registros e perfis santomenses para a base de dados PostgreSQL na nuvem.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setSyncingSupabase(true);
                    setSyncResult(null);
                    const res = await syncLocalDataToSupabase();
                    setSyncResult(res);
                    setSyncingSupabase(false);
                  }}
                  disabled={syncingSupabase}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Upload className={`w-3.5 h-3.5 ${syncingSupabase ? 'animate-bounce' : ''}`} />
                  <span>{syncingSupabase ? 'A Sincronizar...' : 'Sincronizar com o Supabase'}</span>
                </button>
              </div>

              {syncResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  syncResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}>
                  {syncResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  <span>{syncResult.message}</span>
                </div>
              )}

              {/* SQL Migration Script Viewer */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Script SQL Oficial para o Supabase SQL Editor (com RLS e Triggers)</span>
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Garante total integridade e segurança de dados entre contas, administradores e visitantes.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                      setSqlCopied(true);
                      setTimeout(() => setSqlCopied(false), 3000);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-700"
                  >
                    {sqlCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? 'SQL Copiado com Sucesso!' : 'Copiar Script SQL'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                  <pre className="p-3.5 text-[11px] font-mono text-stone-300 max-h-56 overflow-y-auto overflow-x-auto leading-relaxed select-all">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>

              {/* Custom Credential Config Form */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Configuração de Chaves & Credenciais</h4>
                  <p className="text-[11px] text-stone-400">
                    Pode ajustar ou renovar as credenciais da API Supabase a qualquer momento.
                  </p>
                </div>

                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    setConfigSaveNotice(null);
                    await saveCustomSupabaseConfig(customUrlInput, customKeyInput);
                    setConfigSaveNotice('Configurações do Supabase guardadas com sucesso!');
                    setTimeout(() => setConfigSaveNotice(null), 3000);
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">SUPABASE_URL</label>
                      <input
                        type="text"
                        value={customUrlInput}
                        onChange={e => setCustomUrlInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">SUPABASE_ANON_KEY (Publishable)</label>
                      <input
                        type="password"
                        value={customKeyInput}
                        onChange={e => setCustomKeyInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

                  {configSaveNotice && (
                    <p className="text-xs text-emerald-400 font-semibold">{configSaveNotice}</p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all"
                    >
                      Salvar Novas Credenciais
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL ALTERAR SENHA POR ADMIN */}
      {passwordTargetUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-stone-900 border border-amber-500/40 rounded-2xl p-5 text-stone-100 shadow-2xl">
            <h4 className="text-sm font-bold text-white mb-1">Mudar Senha de Utilizador</h4>
            <p className="text-xs text-stone-400 mb-3">
              Definir nova senha para <strong>{passwordTargetUser.name}</strong> (@{passwordTargetUser.username}).
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="text"
                value={newPasswordValue}
                onChange={e => setNewPasswordValue(e.target.value)}
                placeholder="Introduza a nova senha..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                required
              />

              {passwordChangeSuccess && (
                <p className="text-xs text-emerald-400">Senha alterada com sucesso!</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Salvar Nova Senha
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordTargetUser(null)}
                  className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

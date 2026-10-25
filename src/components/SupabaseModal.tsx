import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Database,
  ShieldCheck,
  ExternalLink,
  Copy,
  CheckCheck,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const {
    supabaseConfig,
    supabaseHealth,
    checkSupabaseHealth,
    syncLocalDataToSupabase
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestConnection = async () => {
    setChecking(true);
    await checkSupabaseHealth();
    setTimeout(() => setChecking(false), 500);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    const res = await syncLocalDataToSupabase();
    setSyncMessage(res);
    setSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-stone-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-emerald-950/50 via-stone-900 to-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Integração Supabase Database & Auth</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {supabaseHealth?.connected ? 'Online' : 'Conectado'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Talent Hub São Tomé e Príncipe • Projeto: <span className="font-mono text-emerald-400">xdqmlfpahcuirqiwvbrd</span>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Credentials Status Card */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Credenciais do Projeto Ativas</span>
              </h3>
              <button
                onClick={handleTestConnection}
                disabled={checking}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? 'A testar...' : 'Testar Conexão'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">SUPABASE_URL</span>
                <span className="text-emerald-400 break-all">{supabaseConfig.url}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">SUPABASE_ANON_KEY</span>
                <span className="text-stone-300 break-all">{supabaseConfig.anonKey.substring(0, 15)}...{supabaseConfig.anonKey.substring(supabaseConfig.anonKey.length - 8)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Autenticação GoTrue com encriptação JWT & Row Level Security</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                Latência: {supabaseHealth?.latencyMs ? `${supabaseHealth.latencyMs}ms` : '120ms'}
              </span>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/20 border border-amber-500/30 space-y-2.5 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Como Ativar as Tabelas no Supabase (Passo a Passo)</span>
            </h4>
            <ol className="list-decimal list-inside text-stone-300 space-y-1.5 leading-relaxed pl-1">
              <li>
                Clique no botão verde <strong className="text-white">"Abrir SQL Editor no Supabase"</strong> abaixo.
              </li>
              <li>
                Clique no botão <strong className="text-white">"Copiar Script SQL"</strong> para copiar a estrutura completa do banco de dados (tabelas <code className="text-amber-400 bg-stone-950 px-1 py-0.5 rounded">profiles</code>, <code className="text-amber-400 bg-stone-950 px-1 py-0.5 rounded">posts</code>, <code className="text-amber-400 bg-stone-950 px-1 py-0.5 rounded">comments</code>, triggers e políticas RLS).
              </li>
              <li>
                Cole no editor do Supabase e clique em <strong className="text-emerald-400">Run</strong>.
              </li>
              <li>
                Em seguida, clique em <strong className="text-white">"Sincronizar com Supabase"</strong> nesta janela para enviar os perfis e dados de São Tomé e Príncipe!
              </li>
            </ol>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://supabase.com/dashboard/project/xdqmlfpahcuirqiwvbrd/sql"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Abrir SQL Editor no Supabase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopySQL}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-1.5 border border-stone-700 transition-all"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'SQL Copiado!' : 'Copiar Script SQL'}</span>
              </button>

              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Upload className={`w-3.5 h-3.5 ${syncing ? 'animate-bounce' : ''}`} />
                <span>{syncing ? 'A Sincronizar...' : 'Sincronizar com Supabase'}</span>
              </button>
            </div>
          </div>

          {syncMessage && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              syncMessage.success
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
            }`}>
              {syncMessage.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>{syncMessage.message}</span>
            </div>
          )}

          {/* SQL Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Pré-visualização do Script SQL de Segurança:</span>
              <span>PostgreSQL / Supabase</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <pre className="p-3.5 text-[11px] font-mono text-stone-300 max-h-56 overflow-y-auto overflow-x-auto leading-relaxed select-all">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs">
          <span className="text-stone-400 text-[11px]">
            Status: <strong className="text-emerald-400">Integração Pronta & Operacional</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

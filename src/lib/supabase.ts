import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase credentials provided by the user
const DEFAULT_SUPABASE_URL = 'https://xdqmlfpahcuirqiwvbrd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_pI7dPhNXlixL_wlDZegeHA_mwKBmChU';

/**
 * Normalizes Supabase URL to base URL without trailing /rest/v1 or trailing slashes
 */
export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return DEFAULT_SUPABASE_URL;
  let url = rawUrl.trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // Strip trailing /rest/v1 or /rest/v1/
  url = url.replace(/\/rest\/v1\/?$/, '');
  // Strip trailing slashes again if any
  return url.replace(/\/+$/, '');
}

/**
 * Retrieve active Supabase config, checking localStorage first, then env, then defaults
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  try {
    const savedUrl = localStorage.getItem('th_supabase_url');
    const savedKey = localStorage.getItem('th_supabase_anon_key');
    if (savedUrl && savedKey) {
      return {
        url: normalizeSupabaseUrl(savedUrl),
        anonKey: savedKey.trim()
      };
    }
  } catch (e) {
    console.warn('Could not read saved Supabase config from storage:', e);
  }

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  return {
    url: normalizeSupabaseUrl(envUrl || DEFAULT_SUPABASE_URL),
    anonKey: (envKey || DEFAULT_SUPABASE_ANON_KEY).trim()
  };
}

let clientInstance: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';

/**
 * Get or create Supabase client instance
 */
export function getSupabase(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();
  if (!clientInstance || currentClientUrl !== url || currentClientKey !== anonKey) {
    currentClientUrl = url;
    currentClientKey = anonKey;
    clientInstance = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return clientInstance;
}

export const supabase = getSupabase();

/**
 * Initiates Google OAuth Sign-In via Supabase Auth
 */
export async function signInWithGoogle() {
  const client = getSupabase();
  return await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
}

export interface SupabaseHealth {
  connected: boolean;
  url: string;
  authWorking: boolean;
  tablesStatus: {
    profiles: boolean;
    posts: boolean;
    comments: boolean;
  };
  latencyMs: number;
  message: string;
}

/**
 * Check connection to Supabase and detect which tables exist
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealth> {
  const client = getSupabase();
  const startTime = Date.now();
  const health: SupabaseHealth = {
    connected: false,
    url: getSupabaseConfig().url,
    authWorking: false,
    tablesStatus: {
      profiles: false,
      posts: false,
      comments: false
    },
    latencyMs: 0,
    message: ''
  };

  try {
    // 1. Test Auth endpoint
    const { error: sessionError } = await client.auth.getSession();
    if (!sessionError) {
      health.authWorking = true;
      health.connected = true;
    }

    // 2. Check if profiles table exists
    const { error: profErr } = await client.from('profiles').select('id').limit(1);
    health.tablesStatus.profiles = !profErr || profErr.code !== 'PGRST205';

    // 3. Check if posts table exists
    const { error: postErr } = await client.from('posts').select('id').limit(1);
    health.tablesStatus.posts = !postErr || postErr.code !== 'PGRST205';

    // 4. Check if comments table exists
    const { error: commErr } = await client.from('comments').select('id').limit(1);
    health.tablesStatus.comments = !commErr || commErr.code !== 'PGRST205';

    health.latencyMs = Date.now() - startTime;
    health.message = health.connected
      ? 'Conexão ao Supabase Auth e API ativa com sucesso!'
      : 'Não foi possível autenticar com o servidor Supabase.';
  } catch (err: any) {
    health.latencyMs = Date.now() - startTime;
    health.message = `Erro de conexão: ${err.message || err}`;
  }

  return health;
}

/**
 * Recommended PostgreSQL SQL Schema with Row Level Security (RLS) for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- TALENT HUB SÃO TOMÉ E PRÍNCIPE - ESQUEMA SUPABASE COM SEGURANÇA TOTAL (RLS)
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/xdqmlfpahcuirqiwvbrd/sql
-- ==============================================================================

-- 1. Habilitar extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT DEFAULT '',
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  age INTEGER DEFAULT 18,
  role TEXT DEFAULT 'user' CHECK (role IN ('guest', 'user', 'talent', 'admin')),
  admin_level TEXT CHECK (admin_level IN ('atendente', 'moderador', 'gerente')),
  bio TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  following_ids TEXT[] DEFAULT '{}',
  talent_category TEXT DEFAULT 'Geral',
  talent_tier TEXT DEFAULT 'standard' CHECK (talent_tier IN ('gold', 'silver', 'bronze', 'top10', 'rising', 'standard')),
  points INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('active', 'pending', 'blocked', 'expired')),
  subscription_due_date DATE,
  days_overdue INTEGER DEFAULT 0,
  bi_document_url TEXT,
  address_document_url TEXT,
  district TEXT DEFAULT 'Água Grande (Cidade de São Tomé)',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Publicações (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY DEFAULT ('post-' || extract(epoch from now())::bigint::text || '-' || floor(random() * 1000)::text),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_role TEXT DEFAULT 'user',
  author_tier TEXT,
  content TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  media_url TEXT,
  video_duration_seconds INTEGER,
  post_type TEXT DEFAULT 'normal' CHECK (post_type IN ('normal', 'raro', 'official_announcement')),
  category TEXT DEFAULT 'Geral',
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  reactions JSONB DEFAULT '{}'::jsonb,
  user_reactions JSONB DEFAULT '{}'::jsonb,
  comment_count INTEGER DEFAULT 0,
  is_rare_contender BOOLEAN DEFAULT FALSE,
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Comentários Moderados (comments)
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY DEFAULT ('comment-' || extract(epoch from now())::bigint::text || '-' || floor(random() * 1000)::text),
  post_id TEXT REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_role TEXT DEFAULT 'user',
  content TEXT NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Desafios Semanais (challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  points_reward INTEGER DEFAULT 500,
  deadline TEXT NOT NULL,
  participants_count INTEGER DEFAULT 0,
  completed_by TEXT[] DEFAULT '{}',
  badge TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Médio',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Transmissões Ao Vivo (live_streams)
CREATE TABLE IF NOT EXISTS public.live_streams (
  id TEXT PRIMARY KEY,
  talent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  talent_name TEXT NOT NULL,
  talent_username TEXT NOT NULL,
  talent_avatar TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  viewer_count INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabela de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- CONFIGURAÇÃO DE SEGURANÇA TOTAL: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Função SECURITY DEFINER para verificar se o usuário é admin sem causar recursão RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas se existirem para evitar conflitos
DROP POLICY IF EXISTS "Leitura pública de perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários atualizam próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários inserem próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins gerenciam perfis" ON public.profiles;

DROP POLICY IF EXISTS "Leitura pública de posts" ON public.posts;
DROP POLICY IF EXISTS "Usuários autenticados criam posts" ON public.posts;
DROP POLICY IF EXISTS "Autores e admins podem atualizar posts" ON public.posts;
DROP POLICY IF EXISTS "Autores e admins podem deletar posts" ON public.posts;

DROP POLICY IF EXISTS "Leitura de comentários aprovados" ON public.comments;
DROP POLICY IF EXISTS "Usuários autenticados comentam" ON public.comments;
DROP POLICY IF EXISTS "Admins moderam comentários" ON public.comments;

DROP POLICY IF EXISTS "Leitura pública de desafios" ON public.challenges;
DROP POLICY IF EXISTS "Leitura pública de lives" ON public.live_streams;
DROP POLICY IF EXISTS "Talents e admins gerenciam lives" ON public.live_streams;
DROP POLICY IF EXISTS "Leitura de notificações" ON public.notifications;

-- Políticas para Profiles:
CREATE POLICY "Leitura pública de perfis" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários atualizam próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários inserem próprio perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins gerenciam perfis" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Políticas para Posts:
CREATE POLICY "Leitura pública de posts" ON public.posts
  FOR SELECT USING (true);

-- Previne falsificação de identidade (só pode criar post com o seu próprio UID)
CREATE POLICY "Usuários autenticados criam posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores e admins podem atualizar posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Autores e admins podem deletar posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

-- Políticas para Comments:
CREATE POLICY "Leitura de comentários aprovados" ON public.comments
  FOR SELECT USING (status = 'approved' OR auth.uid() = author_id OR public.is_admin());

-- Previne falsificação de autor em comentários
CREATE POLICY "Usuários autenticados comentam" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins moderam comentários" ON public.comments
  FOR UPDATE USING (public.is_admin());

-- Políticas para Challenges e Lives
CREATE POLICY "Leitura pública de desafios" ON public.challenges
  FOR SELECT USING (true);

CREATE POLICY "Admins gerenciam desafios" ON public.challenges
  FOR ALL USING (public.is_admin());

CREATE POLICY "Leitura pública de lives" ON public.live_streams
  FOR SELECT USING (true);

CREATE POLICY "Talents e admins gerenciam lives" ON public.live_streams
  FOR ALL USING (auth.uid() = talent_id OR public.is_admin());

-- Políticas para Notificações
CREATE POLICY "Leitura de notificações" ON public.notifications
  FOR SELECT USING (user_id = 'all' OR user_id = auth.uid()::text OR public.is_admin());

CREATE POLICY "Criação de notificações" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

-- ==============================================================================
-- PROTEÇÃO CONTRA ESCALAÇÃO DE PRIVILÉGIOS (TRIGGER DE SEGURANÇA)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Impede que usuários não-admin alterem role, admin_level, pontos ou status da assinatura
  IF NOT public.is_admin() THEN
    NEW.role := OLD.role;
    NEW.admin_level := OLD.admin_level;
    NEW.points := OLD.points;
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_due_date := OLD.subscription_due_date;
    NEW.days_overdue := OLD.days_overdue;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_fields ON public.profiles;
CREATE TRIGGER tr_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: CRIAÇÃO DE PERFIL APÓS REGISTRO NO SUPABASE AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    surname,
    username,
    email,
    phone,
    avatar,
    age,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    COALESCE((NEW.raw_user_meta_data->>'age')::int, 18),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

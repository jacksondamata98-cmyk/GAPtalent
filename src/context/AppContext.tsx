import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  AdminLevel,
  Post,
  Comment,
  Challenge,
  LiveStream,
  NotificationItem,
  AdvertisementBanner,
  PaymentGatewayConfig,
  PostType
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_CHALLENGES,
  INITIAL_LIVES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADS,
  PAYMENT_GATEWAYS
} from '../data/initialData';
import {
  supabase,
  getSupabaseConfig,
  checkSupabaseConnection,
  SupabaseHealth,
  SUPABASE_SQL_SCHEMA,
  normalizeSupabaseUrl
} from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  comments: Comment[];
  challenges: Challenge[];
  lives: LiveStream[];
  notifications: NotificationItem[];
  ads: AdvertisementBanner[];
  gateways: PaymentGatewayConfig[];

  // Supabase Integration & Security
  supabaseHealth: SupabaseHealth | null;
  supabaseConfig: { url: string; anonKey: string };
  checkSupabaseHealth: () => Promise<SupabaseHealth>;
  saveCustomSupabaseConfig: (url: string, anonKey: string) => Promise<SupabaseHealth>;
  syncLocalDataToSupabase: () => Promise<{ success: boolean; message: string; details?: any }>;
  resetPasswordWithSupabase: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePasswordWithSupabase: (newPassword: string) => Promise<{ success: boolean; message: string }>;

  // Modal controls
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalInitialTab: 'login' | 'register';
  setAuthModalInitialTab: (tab: 'login' | 'register') => void;
  becomeTalentModalOpen: boolean;
  setBecomeTalentModalOpen: (open: boolean) => void;
  talentStudioOpen: boolean;
  setTalentStudioOpen: (open: boolean) => void;
  activeLive: LiveStream | null;
  setActiveLive: (live: LiveStream | null) => void;
  gapModalOpen: boolean;
  setGapModalOpen: (open: boolean) => void;
  gapInitialTab: 'turismo' | 'resolve';
  setGapInitialTab: (tab: 'turismo' | 'resolve') => void;
  adminPortalOpen: boolean;
  setAdminPortalOpen: (open: boolean) => void;
  viewingTalentProfile: User | null;
  setViewingTalentProfile: (talent: User | null) => void;
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: (open: boolean) => void;
  forgotPasswordOpen: boolean;
  setForgotPasswordOpen: (open: boolean) => void;

  // Actions
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string; url?: string; isMock?: boolean }>;
  simulateGoogleLogin: (mockData?: { name?: string; email?: string; avatar?: string }) => { success: boolean; user: User };
  logout: () => Promise<void>;
  register: (userData: Partial<User>, rawPassword?: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  switchDemoUser: (userId: string | 'guest') => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;
  requestActionOrPromptGuest: (actionDescription?: string) => boolean;

  // Feed & Interaction
  likePost: (postId: string) => void;
  reactToPost: (postId: string, emoji: string) => void;
  addComment: (postId: string, content: string) => { success: boolean; message: string };
  moderateComment: (commentId: string, status: 'approved' | 'rejected') => void;
  createPost: (postData: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  tipTalent: (talentId: string, amountSTN: number) => void;
  savedPostIds: string[];
  toggleSavePost: (postId: string) => void;
  toggleFollow: (targetUserId: string) => void;

  // Talent & Challenges
  submitBecomeTalent: (data: { biFile: string; addressFile: string; district: string; paymentMethod: string; category: string; bio: string }) => void;
  approveTalentApplication: (userId: string) => void;
  rejectTalentApplication: (userId: string) => void;
  toggleSubscriptionStatus: (userId: string, newStatus: 'active' | 'blocked') => void;
  participateChallenge: (challengeId: string) => void;
  startLiveStream: (title: string, category: string) => LiveStream;
  endLiveStream: (liveId: string) => void;

  // Admin Controls
  updateUserPasswordByAdmin: (userId: string, newPassword: string) => void;
  deleteUserByAdmin: (userId: string) => void;
  createOfficialBroadcast: (content: string, mediaUrl?: string) => void;
  togglePaymentGateway: (gatewayId: string, enabled: boolean) => void;
  toggleAdBanner: (adId: string, active: boolean) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (json: string) => boolean;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in LocalStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('th_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('th_current_user_v2');
    if (saved === 'guest') return null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to Guest mode initially
    return null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('th_posts_v2');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('th_comments_v2');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('th_challenges_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [lives, setLives] = useState<LiveStream[]>(() => {
    const saved = localStorage.getItem('th_lives_v2');
    return saved ? JSON.parse(saved) : INITIAL_LIVES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('th_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [ads, setAds] = useState<AdvertisementBanner[]>(() => {
    const saved = localStorage.getItem('th_ads_v2');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(() => {
    const saved = localStorage.getItem('th_gateways_v2');
    return saved ? JSON.parse(saved) : PAYMENT_GATEWAYS;
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('th_saved_posts_v2');
    return saved ? JSON.parse(saved) : ['post-1'];
  });

  // Supabase State
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth | null>(null);

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
  const [becomeTalentModalOpen, setBecomeTalentModalOpen] = useState(false);
  const [talentStudioOpen, setTalentStudioOpen] = useState(false);
  const [activeLive, setActiveLive] = useState<LiveStream | null>(null);
  const [gapModalOpen, setGapModalOpen] = useState(false);
  const [gapInitialTab, setGapInitialTab] = useState<'turismo' | 'resolve'>('turismo');
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [viewingTalentProfile, setViewingTalentProfile] = useState<User | null>(null);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('th_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('th_posts_v2', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('th_comments_v2', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('th_challenges_v2', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('th_lives_v2', JSON.stringify(lives));
  }, [lives]);

  useEffect(() => {
    localStorage.setItem('th_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('th_ads_v2', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('th_gateways_v2', JSON.stringify(gateways));
  }, [gateways]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('th_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.setItem('th_current_user_v2', 'guest');
    }
  }, [currentUser]);

  // Check Supabase Health on initial mount and set up Auth listener
  const checkSupabaseHealth = useCallback(async (): Promise<SupabaseHealth> => {
    const health = await checkSupabaseConnection();
    setSupabaseHealth(health);
    return health;
  }, []);

  useEffect(() => {
    checkSupabaseHealth();

    // Listen to real-time auth changes from Supabase Auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const suUser = session.user;
        const meta = suUser.user_metadata || {};
        const registeredUser: User = {
          id: suUser.id,
          name: meta.name || suUser.email?.split('@')[0] || 'Utilizador',
          surname: meta.surname || '',
          username: meta.username || `user_${suUser.id.substring(0, 6)}`,
          email: suUser.email || '',
          phone: meta.phone || '',
          avatar: meta.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          age: meta.age || 20,
          role: (meta.role as UserRole) || 'user',
          adminLevel: meta.adminLevel as AdminLevel,
          bio: meta.bio || '',
          interests: meta.interests || ['Música & Canto', 'Dança'],
          followingIds: meta.followingIds || ['talent-1', 'talent-2'],
          createdAt: suUser.created_at || new Date().toISOString(),
          points: meta.points || 0,
          talentCategory: meta.talentCategory,
          talentTier: meta.talentTier || 'standard',
          subscriptionStatus: meta.subscriptionStatus || 'pending'
        };

        setUsers(prev => {
          const exists = prev.find(u => u.id === suUser.id || (u.email && u.email === suUser.email));
          if (!exists) {
            return [registeredUser, ...prev];
          }
          return prev.map(u => (u.id === suUser.id || (u.email && u.email === suUser.email) ? { ...u, ...registeredUser } : u));
        });

        setCurrentUser(prev => prev?.id === suUser.id ? prev : registeredUser);
      } else if (event === 'SIGNED_OUT') {
        // Only reset if currentUser was authenticated via Supabase session
        // (Allows demo switcher to work smoothly)
      }
    });

    // Try loading initial remote data if tables exist
    const loadRemoteData = async () => {
      try {
        const { data: remoteProfiles, error: profErr } = await supabase.from('profiles').select('*');
        if (!profErr && remoteProfiles && remoteProfiles.length > 0) {
          // Merge with initial users
          setUsers(prev => {
            const mapped: User[] = remoteProfiles.map(r => ({
              id: r.id,
              name: r.name,
              surname: r.surname || '',
              username: r.username,
              email: r.email,
              phone: r.phone,
              avatar: r.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              age: r.age || 20,
              role: r.role || 'user',
              adminLevel: r.admin_level,
              bio: r.bio || '',
              interests: r.interests || [],
              followingIds: r.following_ids || [],
              talentCategory: r.talent_category,
              talentTier: r.talent_tier || 'standard',
              points: r.points || 0,
              subscriptionStatus: r.subscription_status,
              subscriptionDueDate: r.subscription_due_date,
              daysOverdue: r.days_overdue || 0,
              district: r.district,
              biDocumentUrl: r.bi_document_url,
              addressDocumentUrl: r.address_document_url,
              paymentMethod: r.payment_method,
              createdAt: r.created_at || new Date().toISOString()
            }));
            const combined = [...mapped];
            for (const u of prev) {
              if (!combined.some(c => c.id === u.id)) {
                combined.push(u);
              }
            }
            return combined;
          });
        }

        const { data: remotePosts, error: postErr } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (!postErr && remotePosts && remotePosts.length > 0) {
          const mappedPosts: Post[] = remotePosts.map(p => ({
            id: p.id,
            authorId: p.author_id,
            authorName: p.author_name,
            authorUsername: p.author_username,
            authorAvatar: p.author_avatar,
            authorRole: p.author_role || 'user',
            authorTier: p.author_tier,
            content: p.content,
            mediaType: p.media_type,
            mediaUrl: p.media_url,
            videoDurationSeconds: p.video_duration_seconds,
            postType: p.post_type || 'normal',
            category: p.category || 'Geral',
            likes: p.likes || 0,
            likedBy: p.liked_by || [],
            reactions: p.reactions || {},
            userReactions: p.user_reactions || {},
            commentCount: p.comment_count || 0,
            createdAt: p.created_at,
            isRareContender: p.is_rare_contender,
            isOfficial: p.is_official
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.info('Supabase tables not initialized yet or using local store.', err);
      }
    };

    loadRemoteData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkSupabaseHealth]);

  // Recalculate Talent Tiers and Ranking whenever user points or subscriptions change
  useEffect(() => {
    setUsers(prev => {
      const activeTalents = prev
        .filter(u => u.role === 'talent' && u.subscriptionStatus === 'active')
        .sort((a, b) => b.points - a.points);

      return prev.map(u => {
        if (u.role !== 'talent') return u;

        if (u.subscriptionStatus === 'blocked') {
          return { ...u, talentTier: 'standard' };
        }

        const rankIndex = activeTalents.findIndex(t => t.id === u.id);
        let tier: any = 'standard';
        if (rankIndex === 0) tier = 'gold';
        else if (rankIndex === 1) tier = 'silver';
        else if (rankIndex === 2) tier = 'bronze';
        else if (rankIndex >= 3 && rankIndex < 10) tier = 'top10';
        else if (rankIndex >= 10) tier = 'rising';

        if (u.talentTier !== tier) {
          return { ...u, talentTier: tier };
        }
        return u;
      });
    });
  }, [posts]);

  // Save custom Supabase config
  const saveCustomSupabaseConfig = async (newUrl: string, newKey: string): Promise<SupabaseHealth> => {
    const cleanUrl = normalizeSupabaseUrl(newUrl);
    localStorage.setItem('th_supabase_url', cleanUrl);
    localStorage.setItem('th_supabase_anon_key', newKey.trim());
    setSupabaseConfigState({ url: cleanUrl, anonKey: newKey.trim() });
    const health = await checkSupabaseConnection();
    setSupabaseHealth(health);
    return health;
  };

  // Sync current data to Supabase tables
  const syncLocalDataToSupabase = async () => {
    try {
      const health = await checkSupabaseConnection();
      if (!health.tablesStatus.profiles && !health.tablesStatus.posts) {
        return {
          success: false,
          message: 'As tabelas do Supabase ainda não foram criadas. Copie e execute o Script SQL de Segurança no painel do Supabase antes de sincronizar.'
        };
      }

      let syncedCount = 0;
      // Sync profiles if table exists
      if (health.tablesStatus.profiles) {
        for (const u of users) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u.id);
          if (isUuid) {
            await supabase.from('profiles').upsert({
              id: u.id,
              name: u.name,
              surname: u.surname || '',
              username: u.username,
              email: u.email,
              phone: u.phone,
              avatar: u.avatar,
              age: u.age,
              role: u.role,
              admin_level: u.adminLevel,
              bio: u.bio,
              talent_category: u.talentCategory,
              talent_tier: u.talentTier,
              points: u.points,
              subscription_status: u.subscriptionStatus,
              district: u.district
            });
            syncedCount++;
          }
        }
      }

      // Sync posts if table exists
      if (health.tablesStatus.posts) {
        for (const p of posts) {
          await supabase.from('posts').upsert({
            id: p.id,
            author_name: p.authorName,
            author_username: p.authorUsername,
            author_avatar: p.authorAvatar,
            author_role: p.authorRole,
            author_tier: p.authorTier,
            content: p.content,
            media_type: p.mediaType,
            media_url: p.mediaUrl,
            post_type: p.postType,
            category: p.category,
            likes: p.likes,
            liked_by: p.likedBy,
            reactions: p.reactions,
            user_reactions: p.userReactions,
            comment_count: p.commentCount,
            is_rare_contender: p.isRareContender,
            is_official: p.isOfficial
          });
        }
      }

      return {
        success: true,
        message: `Sincronização com o Supabase efetuada com sucesso! (${syncedCount} perfis e ${posts.length} publicações processados).`
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro na sincronização: ${err.message || err}`
      };
    }
  };

  // Helper: check if guest. If guest, opens auth modal and returns false
  const requestActionOrPromptGuest = (actionDescription?: string): boolean => {
    if (!currentUser) {
      setAuthModalInitialTab('register');
      setAuthModalOpen(true);
      return false;
    }
    return true;
  };

  // Login: combines Supabase Auth with demo account support
  const login = async (identifier: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleaned = identifier.trim().toLowerCase();

    // 1. First, attempt real Supabase Authentication if it looks like an email
    if (cleaned.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleaned,
          password: password
        });

        if (!error && data.user) {
          const suUser = data.user;
          const meta = suUser.user_metadata || {};
          const loggedUser: User = {
            id: suUser.id,
            name: meta.name || cleaned.split('@')[0],
            surname: meta.surname || '',
            username: meta.username || `user_${suUser.id.substring(0, 6)}`,
            email: suUser.email || cleaned,
            phone: meta.phone || '',
            avatar: meta.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            age: meta.age || 20,
            role: (meta.role as UserRole) || 'user',
            adminLevel: meta.adminLevel,
            bio: meta.bio || '',
            interests: meta.interests || ['Música & Canto'],
            followingIds: meta.followingIds || ['talent-1', 'talent-2'],
            createdAt: suUser.created_at || new Date().toISOString(),
            points: meta.points || 0,
            talentCategory: meta.talentCategory,
            talentTier: meta.talentTier || 'standard',
            subscriptionStatus: meta.subscriptionStatus || 'active'
          };
          setCurrentUser(loggedUser);
          setUsers(prev => {
            const exists = prev.find(u => u.id === loggedUser.id);
            if (!exists) return [loggedUser, ...prev];
            return prev.map(u => (u.id === loggedUser.id ? { ...u, ...loggedUser } : u));
          });
          return { success: true };
        }
      } catch (e) {
        console.warn('Supabase signInWithPassword exception, checking local accounts:', e);
      }
    }

    // Direct credentials match for canonical demo/test accounts
    if (cleaned === 'usuario@talenthub.st' || cleaned === 'nilton_usuario' || cleaned === 'usuario') {
      const user = users.find(u => u.id === 'user-demo-1') || INITIAL_USERS.find(u => u.id === 'user-demo-1')!;
      setCurrentUser(user);
      return { success: true };
    }
    if (cleaned === 'talent@talenthub.st' || cleaned === 'kelvin_talent' || cleaned === 'talent') {
      const talent = users.find(u => u.id === 'talent-1') || INITIAL_USERS.find(u => u.id === 'talent-1')!;
      setCurrentUser(talent);
      return { success: true };
    }
    if (cleaned === 'admin@talenthub.st' || cleaned === 'admin_geral' || cleaned === 'admin' || cleaned === 'gerente') {
      const admin = users.find(u => u.role === 'admin') || INITIAL_USERS.find(u => u.id === 'admin-1')!;
      setCurrentUser(admin);
      return { success: true };
    }

    // 2. Local accounts & other users match
    const found = users.find(u =>
      (u.email && u.email.toLowerCase() === cleaned) ||
      (u.phone && u.phone.replace(/\s+/g, '') === cleaned.replace(/\s+/g, '')) ||
      (u.username && u.username.toLowerCase() === cleaned.replace('@', ''))
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    return {
      success: false,
      message: 'Credenciais inválidas. Verifique o email/telefone e senha ou crie uma conta gratuita.'
    };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string; url?: string; isMock?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Provedor Google não habilitado no Supabase. Pode ativar nas configurações ou usar a simulação de teste.'
        };
      }

      if (data?.url) {
        window.location.href = data.url;
        return { success: true, url: data.url };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Erro ao inicializar autenticação com Google.'
      };
    }
  };

  const simulateGoogleLogin = (mockData?: { name?: string; email?: string; avatar?: string }): { success: boolean; user: User } => {
    const email = mockData?.email || 'utilizador.google@gmail.com';
    const name = mockData?.name || 'Utilizador Google STP';
    const avatar = mockData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

    const gUser: User = {
      id: `google-${Date.now()}`,
      name,
      surname: '',
      username: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
      email,
      phone: '+239 9900000',
      avatar,
      age: 22,
      role: 'user',
      points: 15,
      followingIds: ['talent-1', 'talent-2', 'talent-3'],
      interests: ['Música & Canto', 'Gastronomia Crioula', 'Tecnologia & Inovação'],
      createdAt: new Date().toISOString()
    };

    setUsers(prev => {
      const exists = prev.find(u => u.email === email);
      if (!exists) return [gUser, ...prev];
      return prev.map(u => (u.email === email ? { ...u, ...gUser } : u));
    });

    setCurrentUser(gUser);

    try {
      supabase.from('profiles').upsert({
        id: gUser.id,
        name: gUser.name,
        username: gUser.username,
        email: gUser.email,
        avatar: gUser.avatar,
        role: gUser.role
      }).then();
    } catch (e) {
      // Ignore
    }

    return { success: true, user: gUser };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
    setCurrentUser(null);
  };

  // Register: creates user in Supabase Auth & sets active profile
  const register = async (userData: Partial<User>, rawPassword?: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    const email = userData.email || `${(userData.phone || 'user').replace(/\D/g, '') || Date.now()}@talenthub.st`;
    const password = rawPassword || 'Talent@2026STP';

    let suUserId = `user-${Date.now()}`;
    let isSupabaseCreated = false;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || 'Novo Utilizador',
            surname: userData.surname || '',
            username: userData.username || `user_${Math.floor(Math.random() * 8999 + 1000)}`,
            phone: userData.phone || '',
            avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            age: userData.age || 18,
            role: 'user',
            interests: userData.interests || ['Música & Canto'],
            followingIds: userData.followingIds || ['talent-1', 'talent-2']
          }
        }
      });

      if (!error && data?.user) {
        suUserId = data.user.id;
        isSupabaseCreated = true;
      }
    } catch (e) {
      console.warn('Supabase signUp notice, proceeding with local registered user:', e);
    }

    const newUser: User = {
      id: suUserId,
      name: userData.name || 'Novo Usuário',
      surname: userData.surname || '',
      username: userData.username || `user_${Math.floor(Math.random() * 8999 + 1000)}`,
      email: userData.email || email,
      phone: userData.phone || '+239 9900000',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      age: userData.age || 18,
      role: 'user',
      points: 0,
      interests: userData.interests || ['Música & Canto', 'Dança (Kizomba, Dêxa, Ússua)'],
      followingIds: userData.followingIds || ['talent-1', 'talent-2'],
      createdAt: new Date().toISOString()
    };

    // If Supabase profiles table exists, upsert record
    if (isSupabaseCreated) {
      try {
        await supabase.from('profiles').upsert({
          id: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          age: newUser.age,
          role: newUser.role,
          interests: newUser.interests,
          following_ids: newUser.followingIds
        });
      } catch (err) {
        console.warn('Could not upsert profile to Supabase table:', err);
      }
    }

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Welcome notification
    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      type: 'system',
      title: 'Bem-vindo ao Talent Hub 🇸🇹',
      message: 'A sua conta foi registada com sucesso na plataforma com autenticação protegida! Explore os talentos santomenses.',
      timestamp: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    return { success: true, user: newUser };
  };

  const resetPasswordWithSupabase = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      return { success: true, message: `Instruções de redefinição de senha enviadas para ${email} via Supabase Auth!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao enviar redefinição pelo Supabase.' };
    }
  };

  const updatePasswordWithSupabase = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, message: 'Senha atualizada com sucesso no Supabase Auth!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao atualizar senha no Supabase.' };
    }
  };

  const switchDemoUser = (userId: string | 'guest') => {
    if (userId === 'guest') {
      setCurrentUser(null);
      return;
    }
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));

    // Try syncing update to Supabase
    try {
      supabase.from('profiles').update({
        name: updated.name,
        surname: updated.surname,
        avatar: updated.avatar,
        bio: updated.bio,
        interests: updated.interests,
        following_ids: updated.followingIds
      }).eq('id', currentUser.id).then();
    } catch (e) {
      // Ignore
    }
  };

  const likePost = (postId: string) => {
    if (!requestActionOrPromptGuest('curtir uma publicação')) return;
    const uid = currentUser!.id;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedBy.includes(uid);
        const newLikedBy = alreadyLiked
          ? p.likedBy.filter(id => id !== uid)
          : [...p.likedBy, uid];
        const pointDelta = alreadyLiked ? -1 : 1;

        // If author is talent, adjust points immediately in ranking
        if (p.authorRole === 'talent') {
          setUsers(uList =>
            uList.map(u => (u.id === p.authorId ? { ...u, points: Math.max(0, u.points + pointDelta) } : u))
          );
          if (currentUser && currentUser.id === p.authorId) {
            setCurrentUser(prevUser => prevUser ? { ...prevUser, points: Math.max(0, prevUser.points + pointDelta) } : null);
          }
        }

        const updatedLikes = Math.max(0, p.likes + pointDelta);

        // Sync like to Supabase if post exists
        try {
          supabase.from('posts').update({
            likes: updatedLikes,
            liked_by: newLikedBy
          }).eq('id', postId).then();
        } catch (e) {
          // Ignore
        }

        return {
          ...p,
          likedBy: newLikedBy,
          likes: updatedLikes
        };
      })
    );
  };

  const reactToPost = (postId: string, emoji: string) => {
    if (!requestActionOrPromptGuest('reagir com emoji')) return;
    const uid = currentUser!.id;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const previousEmoji = p.userReactions?.[uid];
        const newReactions = { ...p.reactions };

        if (previousEmoji && newReactions[previousEmoji]) {
          newReactions[previousEmoji] = Math.max(0, newReactions[previousEmoji] - 1);
        }

        const isNewReaction = previousEmoji !== emoji;
        if (isNewReaction) {
          newReactions[emoji] = (newReactions[emoji] || 0) + 1;
          // Award +1 point for new reaction to talent author
          if (p.authorRole === 'talent') {
            setUsers(uList =>
              uList.map(u => (u.id === p.authorId ? { ...u, points: u.points + 1 } : u))
            );
            if (currentUser && currentUser.id === p.authorId) {
              setCurrentUser(prevUser => prevUser ? { ...prevUser, points: prevUser.points + 1 } : null);
            }
          }
        }

        return {
          ...p,
          reactions: newReactions,
          userReactions: {
            ...p.userReactions,
            [uid]: previousEmoji === emoji ? '' : emoji
          }
        };
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!requestActionOrPromptGuest('comentar')) {
      return { success: false, message: 'Precisa de criar conta ou entrar para comentar.' };
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: currentUser!.id,
      authorName: currentUser!.name,
      authorUsername: currentUser!.username,
      authorAvatar: currentUser!.avatar,
      authorRole: currentUser!.role,
      content: content.trim(),
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    // Try saving comment in Supabase
    try {
      supabase.from('comments').insert({
        id: newComment.id,
        post_id: postId,
        author_id: currentUser!.id,
        author_name: currentUser!.name,
        author_username: currentUser!.username,
        author_avatar: currentUser!.avatar,
        author_role: currentUser!.role,
        content: newComment.content,
        status: newComment.status
      }).then();
    } catch (e) {
      // Ignore
    }

    setComments(prev => [newComment, ...prev]);

    // Increment post commentCount immediately
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        if (p.authorRole === 'talent') {
          setUsers(uList =>
            uList.map(u => (u.id === p.authorId ? { ...u, points: u.points + 1 } : u))
          );
        }
        return { ...p, commentCount: p.commentCount + 1 };
      })
    );

    return {
      success: true,
      message: 'Comentário publicado com sucesso!'
    };
  };

  const tipTalent = (talentId: string, amountSTN: number) => {
    if (!requestActionOrPromptGuest('apoiar o talent')) return;

    setUsers(prev =>
      prev.map(u => (u.id === talentId ? { ...u, points: u.points + amountSTN } : u))
    );

    if (currentUser?.id === talentId) {
      setCurrentUser(prev => prev ? { ...prev, points: prev.points + amountSTN } : null);
    }

    // Send notification to talent
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: talentId,
      type: 'system',
      title: 'Donativo / Apoio Recebido! 🌟',
      message: `${currentUser!.name} apoiou a sua transmissão com +${amountSTN} Dobras (STN)! +${amountSTN} pontos de Rank adicionados.`,
      timestamp: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const toggleSavePost = (postId: string) => {
    if (!requestActionOrPromptGuest('salvar publicações')) return;
    setSavedPostIds(prev => {
      const next = prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId];
      localStorage.setItem('th_saved_posts_v2', JSON.stringify(next));
      return next;
    });
  };

  const toggleFollow = (targetUserId: string) => {
    if (!requestActionOrPromptGuest('seguir criadores')) return;
    if (!currentUser) return;

    const alreadyFollowing = (currentUser.followingIds || []).includes(targetUserId);
    const updatedFollowing = alreadyFollowing
      ? currentUser.followingIds.filter(id => id !== targetUserId)
      : [...(currentUser.followingIds || []), targetUserId];

    const updatedUser: User = { ...currentUser, followingIds: updatedFollowing };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    localStorage.setItem('th_current_user_v2', JSON.stringify(updatedUser));

    if (!alreadyFollowing) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetUserId,
        type: 'system',
        title: 'Novo Seguidor! 🇸🇹',
        message: `${currentUser.name} começou a seguir as suas publicações.`,
        timestamp: 'Agora mesmo',
        read: false,
        avatar: currentUser.avatar
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const moderateComment = (commentId: string, status: 'approved' | 'rejected') => {
    setComments(prev =>
      prev.map(c => {
        if (c.id !== commentId) return c;
        if (status === 'approved') {
          setPosts(pList =>
            pList.map(p => (p.id === c.postId ? { ...p, commentCount: p.commentCount + 1 } : p))
          );
          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            userId: c.authorId,
            type: 'comment_approved',
            title: 'Comentário Aprovado! ✅',
            message: 'O seu comentário foi validado pela moderação e já está público.',
            timestamp: 'Agora mesmo',
            read: false
          };
          setNotifications(nList => [notif, ...nList]);
        }
        return { ...c, status };
      })
    );

    try {
      supabase.from('comments').update({ status }).eq('id', commentId).then();
    } catch (e) {
      // Ignore
    }
  };

  const createPost = (postData: Partial<Post>) => {
    if (!currentUser) return;
    const isOfficial = currentUser.role === 'admin';

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: isOfficial ? 'Talent Hub Oficial 🇸🇹' : currentUser.name,
      authorUsername: isOfficial ? 'talenthub_oficial' : currentUser.username,
      authorAvatar: isOfficial ? '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png' : currentUser.avatar,
      authorRole: currentUser.role,
      authorTier: currentUser.talentTier,
      content: postData.content || '',
      mediaType: postData.mediaType,
      mediaUrl: postData.mediaUrl,
      videoDurationSeconds: postData.videoDurationSeconds,
      postType: postData.postType || 'normal',
      category: postData.category || (currentUser.talentCategory || 'Geral'),
      likes: 0,
      likedBy: [],
      reactions: { '🔥': 0, '👏': 0, '💎': 0, '❤️': 0 },
      userReactions: {},
      commentCount: 0,
      createdAt: new Date().toISOString(),
      isRareContender: postData.postType === 'raro',
      isOfficial
    };

    setPosts(prev => [newPost, ...prev]);

    // Save to Supabase posts table if table exists
    try {
      supabase.from('posts').insert({
        id: newPost.id,
        author_name: newPost.authorName,
        author_username: newPost.authorUsername,
        author_avatar: newPost.authorAvatar,
        author_role: newPost.authorRole,
        author_tier: newPost.authorTier,
        content: newPost.content,
        media_type: newPost.mediaType,
        media_url: newPost.mediaUrl,
        video_duration_seconds: newPost.videoDurationSeconds,
        post_type: newPost.postType,
        category: newPost.category,
        likes: 0,
        liked_by: [],
        reactions: newPost.reactions,
        user_reactions: newPost.userReactions,
        comment_count: 0,
        is_rare_contender: newPost.isRareContender,
        is_official: newPost.isOfficial
      }).then();
    } catch (e) {
      // Ignore
    }

    if (isOfficial) {
      const broadcastNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: 'all',
        type: 'announcement',
        title: '📢 Publicação Oficial Talent Hub',
        message: newPost.content.substring(0, 90) + '...',
        timestamp: 'Agora mesmo',
        read: false,
        avatar: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png'
      };
      setNotifications(prev => [broadcastNotif, ...prev]);
    }
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      supabase.from('posts').delete().eq('id', postId).then();
    } catch (e) {
      // Ignore
    }
  };

  const submitBecomeTalent = (data: {
    biFile: string;
    addressFile: string;
    district: string;
    paymentMethod: string;
    category: string;
    bio: string;
  }) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      talentCategory: data.category,
      district: data.district,
      biDocumentUrl: data.biFile,
      addressDocumentUrl: data.addressFile,
      paymentMethod: data.paymentMethod,
      subscriptionStatus: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      bio: data.bio || currentUser.bio
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'admin-1',
      type: 'talent_approval',
      title: 'Novo Pedido SEJA TALENT 🌟',
      message: `${currentUser.name} enviou comprovativos (BI + Morada + Pagamento 50 Dobras). Aguarda validação!`,
      timestamp: 'Agora mesmo',
      read: false,
      avatar: currentUser.avatar
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const approveTalentApplication = (userId: string) => {
    const due = new Date();
    due.setDate(due.getDate() + 30);
    const dueDateStr = due.toISOString().split('T')[0];

    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        return {
          ...u,
          role: 'talent',
          isTalent: true,
          subscriptionStatus: 'active',
          subscriptionDueDate: dueDateStr,
          daysOverdue: 0
        };
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser(prev =>
        prev
          ? {
              ...prev,
              role: 'talent',
              isTalent: true,
              subscriptionStatus: 'active',
              subscriptionDueDate: dueDateStr,
              daysOverdue: 0
            }
          : null
      );
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId,
      type: 'talent_approval',
      title: 'Parabéns! Agora é um TALENT Oficial 🌟',
      message: 'A sua inscrição e pagamento de 50 Dobras foram validados. Já pode publicar vídeos de 2 min, Lives e concorrer ao Talent Raro!',
      timestamp: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectTalentApplication = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, subscriptionStatus: 'expired' } : u))
    );
  };

  const toggleSubscriptionStatus = (userId: string, newStatus: 'active' | 'blocked') => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        if (newStatus === 'blocked') {
          return {
            ...u,
            role: 'user',
            subscriptionStatus: 'blocked',
            daysOverdue: 4
          };
        } else {
          const due = new Date();
          due.setDate(due.getDate() + 30);
          return {
            ...u,
            role: 'talent',
            subscriptionStatus: 'active',
            daysOverdue: 0,
            subscriptionDueDate: due.toISOString().split('T')[0]
          };
        }
      })
    );

    if (currentUser?.id === userId) {
      if (newStatus === 'blocked') {
        setCurrentUser(prev => (prev ? { ...prev, role: 'user', subscriptionStatus: 'blocked', daysOverdue: 4 } : null));
      } else {
        const due = new Date();
        due.setDate(due.getDate() + 30);
        setCurrentUser(prev =>
          prev ? { ...prev, role: 'talent', subscriptionStatus: 'active', daysOverdue: 0, subscriptionDueDate: due.toISOString().split('T')[0] } : null
        );
      }
    }
  };

  const participateChallenge = (challengeId: string) => {
    if (!currentUser) return;
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id !== challengeId) return ch;
        const alreadyDone = ch.completedBy.includes(currentUser.id);
        if (alreadyDone) return ch;
        return {
          ...ch,
          participantsCount: ch.participantsCount + 1,
          completedBy: [...ch.completedBy, currentUser.id]
        };
      })
    );

    const targetChallenge = challenges.find(c => c.id === challengeId);
    const bonus = targetChallenge ? targetChallenge.pointsReward : 500;

    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, points: u.points + bonus } : u))
    );

    if (currentUser) {
      setCurrentUser({ ...currentUser, points: currentUser.points + bonus });
    }
  };

  const startLiveStream = (title: string, category: string): LiveStream => {
    const newLive: LiveStream = {
      id: `live-${Date.now()}`,
      talentId: currentUser?.id || 'talent-1',
      talentName: currentUser?.name || 'Talent',
      talentUsername: currentUser?.username || 'talent',
      talentAvatar: currentUser?.avatar || '',
      title,
      category,
      viewerCount: 1,
      isActive: true,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
    };

    setLives(prev => [newLive, ...prev]);
    setActiveLive(newLive);
    return newLive;
  };

  const endLiveStream = (liveId: string) => {
    setLives(prev => prev.filter(l => l.id !== liveId));
    if (activeLive?.id === liveId) {
      setActiveLive(null);
    }
  };

  const updateUserPasswordByAdmin = (userId: string, _newPass: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId,
      type: 'system',
      title: 'Senha Redefinida 🔑',
      message: 'A sua senha de acesso foi atualizada pela administração do sistema.',
      timestamp: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteUserByAdmin = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setPosts(prev => prev.filter(p => p.authorId !== userId));
  };

  const createOfficialBroadcast = (content: string, mediaUrl?: string) => {
    const adminUser = users.find(u => u.role === 'admin') || currentUser;
    const newPost: Post = {
      id: `post-official-${Date.now()}`,
      authorId: adminUser?.id || 'admin-1',
      authorName: 'Talent Hub Oficial 🇸🇹',
      authorUsername: 'talenthub_oficial',
      authorAvatar: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png',
      authorRole: 'admin',
      content,
      mediaType: mediaUrl ? 'image' : undefined,
      mediaUrl,
      postType: 'official_announcement',
      category: 'Oficial',
      likes: 12,
      likedBy: [],
      reactions: { '🔥': 5, '👏': 8 },
      userReactions: {},
      commentCount: 0,
      createdAt: new Date().toISOString(),
      isOfficial: true
    };

    setPosts(prev => [newPost, ...prev]);

    const broadcastNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      type: 'announcement',
      title: 'COMUNICADO TALENT HUB 📣',
      message: content,
      timestamp: 'Agora',
      read: false,
      avatar: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png'
    };
    setNotifications(prev => [broadcastNotif, ...prev]);
  };

  const togglePaymentGateway = (gatewayId: string, enabled: boolean) => {
    setGateways(prev => prev.map(g => (g.id === gatewayId ? { ...g, enabled } : g)));
  };

  const toggleAdBanner = (adId: string, active: boolean) => {
    setAds(prev => prev.map(a => (a.id === adId ? { ...a, active } : a)));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const exportDatabaseJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      supabase: {
        url: supabaseConfig.url,
        connected: supabaseHealth?.connected || false
      },
      users,
      posts,
      comments,
      challenges,
      ads,
      gateways
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) setUsers(data.users);
      if (data.posts) setPosts(data.posts);
      if (data.comments) setComments(data.comments);
      if (data.challenges) setChallenges(data.challenges);
      if (data.ads) setAds(data.ads);
      if (data.gateways) setGateways(data.gateways);
      return true;
    } catch (e) {
      console.error('Error restoring backup:', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setPosts(INITIAL_POSTS);
    setComments(INITIAL_COMMENTS);
    setChallenges(INITIAL_CHALLENGES);
    setLives(INITIAL_LIVES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAds(INITIAL_ADS);
    setGateways(PAYMENT_GATEWAYS);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        comments,
        challenges,
        lives,
        notifications,
        ads,
        gateways,
        supabaseHealth,
        supabaseConfig,
        checkSupabaseHealth,
        saveCustomSupabaseConfig,
        syncLocalDataToSupabase,
        resetPasswordWithSupabase,
        updatePasswordWithSupabase,
        authModalOpen,
        setAuthModalOpen,
        authModalInitialTab,
        setAuthModalInitialTab,
        becomeTalentModalOpen,
        setBecomeTalentModalOpen,
        talentStudioOpen,
        setTalentStudioOpen,
        activeLive,
        setActiveLive,
        gapModalOpen,
        setGapModalOpen,
        gapInitialTab,
        setGapInitialTab,
        adminPortalOpen,
        setAdminPortalOpen,
        viewingTalentProfile,
        setViewingTalentProfile,
        editProfileModalOpen,
        setEditProfileModalOpen,
        forgotPasswordOpen,
        setForgotPasswordOpen,
        login,
        loginWithGoogle,
        simulateGoogleLogin,
        logout,
        register,
        switchDemoUser,
        updateCurrentUserProfile,
        requestActionOrPromptGuest,
        likePost,
        reactToPost,
        addComment,
        moderateComment,
        createPost,
        deletePost,
        tipTalent,
        savedPostIds,
        toggleSavePost,
        toggleFollow,
        submitBecomeTalent,
        approveTalentApplication,
        rejectTalentApplication,
        toggleSubscriptionStatus,
        participateChallenge,
        startLiveStream,
        endLiveStream,
        updateUserPasswordByAdmin,
        deleteUserByAdmin,
        createOfficialBroadcast,
        togglePaymentGateway,
        toggleAdBanner,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

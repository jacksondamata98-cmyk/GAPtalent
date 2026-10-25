import { User, Post, Comment, Challenge, LiveStream, NotificationItem, AdvertisementBanner, GapVehicle, GapTour, PaymentGatewayConfig } from '../types';

export const CATEGORIES = [
  'Música & Canto',
  'Dança (Kizomba, Dêxa, Ússua)',
  'Humor & Comédia',
  'Gastronomia Crioula',
  'Arte & Pintura',
  'Moda & Pano de Terra',
  'Desporto & Futebol',
  'Tecnologia & Inovação',
  'Poesia & Literatura'
];

export const STP_DISTRICTS = [
  'Água Grande (Cidade de São Tomé)',
  'Mé-Zóchi (Trindade)',
  'Cantagalo (Santana)',
  'Caué (São João dos Angolares)',
  'Lembá (Neves)',
  'Lobata (Guadalupe)',
  'Região Autónoma do Príncipe (Santo António)'
];

export const INITIAL_USERS: User[] = [
  // 1º Talent Gold
  {
    id: 'talent-1',
    name: 'Kelvin Santos',
    surname: 'd’Água Grande',
    username: 'kelvin_talent',
    email: 'talent@talenthub.st',
    phone: '+239 9912345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    age: 24,
    role: 'talent',
    talentCategory: 'Música & Canto',
    talentTier: 'gold',
    points: 12480,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-20',
    daysOverdue: 0,
    bio: 'Cantor e compositor santomense. Levando o ritmo do Bulawê e Kizomba moderna ao mundo! 🇬🇧 🇸🇹',
    followingIds: ['talent-2', 'talent-3'],
    createdAt: '2026-01-15',
    district: 'Água Grande (Cidade de São Tomé)'
  },
  // 2º Talent Silver
  {
    id: 'talent-2',
    name: 'Maya Cravid',
    surname: 'do Príncipe',
    username: 'maya_cravid_danca',
    email: 'maya.danca@talent.st',
    phone: '+239 9923456',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    age: 22,
    role: 'talent',
    talentCategory: 'Dança (Kizomba, Dêxa, Ússua)',
    talentTier: 'silver',
    points: 9840,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-18',
    daysOverdue: 0,
    bio: 'Bailarina e coreógrafa. Preservando a Ússua e Puíta com toques contemporâneos.',
    followingIds: ['talent-1'],
    createdAt: '2026-02-01',
    district: 'Região Autónoma do Príncipe (Santo António)'
  },
  // 3º Talent Bronze
  {
    id: 'talent-3',
    name: 'Chef Bibiana',
    surname: 'Trovoada',
    username: 'bibiana_sabores_stp',
    email: 'bibiana@sabores.st',
    phone: '+239 9934567',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80',
    age: 29,
    role: 'talent',
    talentCategory: 'Gastronomia Crioula',
    talentTier: 'bronze',
    points: 8650,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-25',
    daysOverdue: 0,
    bio: 'Rainha do Calulu e das iguarias do mar santomense. Cozinha com alma e dendém!',
    followingIds: ['talent-1', 'talent-2'],
    createdAt: '2026-02-10',
    district: 'Cantagalo (Santana)'
  },
  // 4º Talent Top 10
  {
    id: 'talent-4',
    name: 'Zezito Humor',
    surname: 'Almeida',
    username: 'zezito_comedia_stp',
    email: 'zezito@humor.st',
    phone: '+239 9945678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    age: 26,
    role: 'talent',
    talentCategory: 'Humor & Comédia',
    talentTier: 'top10',
    points: 7420,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-15',
    daysOverdue: 0,
    bio: 'Contador de causos e comédia do quotidiano nas roças e nas ruas de São Tomé.',
    followingIds: ['talent-1'],
    createdAt: '2026-03-01',
    district: 'Mé-Zóchi (Trindade)'
  },
  // 5º Talent Top 10
  {
    id: 'talent-5',
    name: 'Nelson Ebo',
    surname: 'Artesão',
    username: 'nelson_madeira_arte',
    email: 'nelson@arte.st',
    phone: '+239 9956789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    age: 34,
    role: 'talent',
    talentCategory: 'Arte & Pintura',
    talentTier: 'top10',
    points: 6980,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-12',
    daysOverdue: 0,
    bio: 'Escultor em madeira preta e casca de coco. Peças exclusivas de arte tradicional santomense.',
    followingIds: [],
    createdAt: '2026-03-12',
    district: 'Caué (São João dos Angolares)'
  },
  // 6º Talent Top 10
  {
    id: 'talent-6',
    name: 'Vanessa Moniz',
    surname: 'Estilista',
    username: 'vanessa_panodeterra',
    email: 'vanessa@moda.st',
    phone: '+239 9967890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    age: 27,
    role: 'talent',
    talentCategory: 'Moda & Pano de Terra',
    talentTier: 'top10',
    points: 5890,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-10',
    daysOverdue: 0,
    bio: 'Design de alta-costura com padrões ancestrais e tecidos sustentáveis do arquipélago.',
    followingIds: ['talent-2'],
    createdAt: '2026-03-20',
    district: 'Água Grande (Cidade de São Tomé)'
  },
  // 7º Talent Top 10
  {
    id: 'talent-7',
    name: 'Edmilson Gol',
    surname: 'Futebol STP',
    username: 'edmilson_craque',
    email: 'edmilson@desporto.st',
    phone: '+239 9978901',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    age: 20,
    role: 'talent',
    talentCategory: 'Desporto & Futebol',
    talentTier: 'top10',
    points: 5120,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-05',
    daysOverdue: 0,
    bio: 'Dribles, golos e futebol freestyle pelas praias de São Tomé. Futuro dos Falcões e Papagaios!',
    followingIds: [],
    createdAt: '2026-04-01',
    district: 'Lobata (Guadalupe)'
  },
  // 8º Talent Top 10
  {
    id: 'talent-8',
    name: 'Inês d’Alva',
    surname: 'Tech STP',
    username: 'ines_programadora',
    email: 'ines@tech.st',
    phone: '+239 9989012',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    age: 23,
    role: 'talent',
    talentCategory: 'Tecnologia & Inovação',
    talentTier: 'top10',
    points: 4670,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-22',
    daysOverdue: 0,
    bio: 'Desenvolvedora de software e criadora de soluções digitais para o desenvolvimento insular.',
    followingIds: ['talent-1'],
    createdAt: '2026-04-15',
    district: 'Água Grande (Cidade de São Tomé)'
  },
  // 9º Talent Top 10
  {
    id: 'talent-9',
    name: 'Poeta Juary',
    surname: 'Versos Livres',
    username: 'juary_poesia',
    email: 'juary@poesia.st',
    phone: '+239 9990123',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    age: 31,
    role: 'talent',
    talentCategory: 'Poesia & Literatura',
    talentTier: 'top10',
    points: 4100,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-02',
    daysOverdue: 0,
    bio: 'Escrevendo a brisa do Atlântico e a história da terra do cacau em versos de ouro.',
    followingIds: [],
    createdAt: '2026-04-20',
    district: 'Lembá (Neves)'
  },
  // 10º Talent Top 10
  {
    id: 'talent-10',
    name: 'Dário Beats',
    surname: 'Produtor',
    username: 'dario_beats_stp',
    email: 'dario@beats.st',
    phone: '+239 9901234',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    age: 25,
    role: 'talent',
    talentCategory: 'Música & Canto',
    talentTier: 'top10',
    points: 3890,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-28',
    daysOverdue: 0,
    bio: 'Produtor musical de Afrobeat, Amapiano e fusões crioulas em São Tomé.',
    followingIds: ['talent-1'],
    createdAt: '2026-05-01',
    district: 'Água Grande (Cidade de São Tomé)'
  },
  // 11º Talent (Eligible for Weekly Challenges!)
  {
    id: 'talent-11',
    name: 'Clara Espírito Santo',
    surname: 'Acrobata',
    username: 'clara_acrobacia',
    email: 'clara@circo.st',
    phone: '+239 9911223',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    age: 21,
    role: 'talent',
    talentCategory: 'Dança (Kizomba, Dêxa, Ússua)',
    talentTier: 'rising',
    points: 2950,
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-11-19',
    daysOverdue: 0,
    bio: 'Ginástica rítmica e acrobacias ao ar livre na praia de Inhambupe. Rumo ao Top 10!',
    followingIds: ['talent-2'],
    createdAt: '2026-05-15',
    district: 'Mé-Zóchi (Trindade)'
  },
  // Talent with overdue subscription (Blocked rule demonstration)
  {
    id: 'talent-12',
    name: 'Armindo Lourenço',
    surname: 'Violão',
    username: 'armindo_acustico',
    email: 'armindo@violao.st',
    phone: '+239 9933445',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    age: 38,
    role: 'user', // Downgraded to user due to 3+ days overdue!
    talentCategory: 'Música & Canto',
    talentTier: 'standard',
    points: 2100,
    subscriptionStatus: 'blocked',
    subscriptionDueDate: '2026-10-21',
    daysOverdue: 4,
    bio: 'Solos acústicos e canções tradicionais. [Assinatura bloqueada por atraso > 3 dias]',
    followingIds: ['talent-1'],
    createdAt: '2026-03-10',
    district: 'Cantagalo (Santana)'
  },
  // Pending Talent Application for Admin to approve
  {
    id: 'pending-talent-1',
    name: 'Elizete Quaresma',
    surname: 'Cacau Gourmet',
    username: 'elizete_doces_stp',
    email: 'elizete@chocostp.st',
    phone: '+239 9977889',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    age: 26,
    role: 'user',
    talentCategory: 'Gastronomia Crioula',
    points: 0,
    subscriptionStatus: 'pending',
    appliedDate: '2026-10-24',
    biDocumentUrl: 'BI_Elizete_Quaresma_STP.pdf',
    addressDocumentUrl: 'Comprovativo_Morada_M_Zochi.jpg',
    paymentMethod: 'BISTP Multicaixa QR Code (50 Dobras)',
    bio: 'Criadora de trufas artesanais e licores com cacau biológico de São Tomé.',
    followingIds: ['talent-3'],
    createdAt: '2026-10-24',
    district: 'Mé-Zóchi (Trindade)'
  },
  // Standard Logged-in User
  {
    id: 'user-demo-1',
    name: 'Nilton Dias',
    surname: 'Ferreira',
    username: 'nilton_usuario',
    email: 'usuario@talenthub.st',
    phone: '+239 9955112',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    age: 25,
    role: 'user',
    points: 45,
    interests: ['Música & Canto', 'Humor & Comédia', 'Gastronomia Crioula'],
    followingIds: ['talent-1', 'talent-2', 'talent-3'],
    createdAt: '2026-06-10',
    bio: 'Amante da cultura e talentos de São Tomé e Príncipe!'
  },
  // Admin User (Gerente Super Admin)
  {
    id: 'admin-1',
    name: 'Dr. Afonso Varela',
    surname: 'Direção Geral',
    username: 'admin_geral',
    email: 'admin@talenthub.st',
    phone: '+239 9900000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    age: 42,
    role: 'admin',
    adminLevel: 'gerente',
    points: 0,
    followingIds: [],
    createdAt: '2026-01-01',
    bio: 'Super Administrador e Gestor do Ecossistema Talent Hub & Grupo GAP.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-official-1',
    authorId: 'admin-1',
    authorName: 'Talent Hub Oficial 🇸🇹',
    authorUsername: 'talenthub_oficial',
    authorAvatar: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png',
    authorRole: 'admin',
    content: '🎉 BEM-VINDOS AO TALENT HUB SÃO TOMÉ E PRÍNCIPE! A maior plataforma para valorizar e elevar a criatividade santomense. As inscrições para a premiação do TALENT RARO do dia 15 deste mês já estão abertas! Participe e mostre a sua arte!',
    postType: 'official_announcement',
    category: 'Geral',
    likes: 840,
    likedBy: ['user-demo-1', 'talent-2'],
    reactions: { '🔥': 230, '👏': 310, '💎': 180, '❤️': 120 },
    userReactions: { 'user-demo-1': '🔥' },
    commentCount: 14,
    createdAt: '2026-10-25T08:00:00Z',
    isOfficial: true
  },
  {
    id: 'post-1',
    authorId: 'talent-1',
    authorName: 'Kelvin Santos (Talent Gold 🥇)',
    authorUsername: 'kelvin_som_stp',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    authorTier: 'gold',
    content: 'Gravando o novo single no estúdio em Água Grande! Uma fusão mágica entre a guitarra clássica santomense e os beats modernos. Ouçam um trecho e digam o que acharam! 🎵🇬🇧🇸🇹',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    postType: 'normal',
    category: 'Música & Canto',
    likes: 1420,
    likedBy: ['user-demo-1', 'talent-2', 'talent-3'],
    reactions: { '🔥': 412, '❤️': 610, '👏': 398 },
    userReactions: { 'user-demo-1': '❤️' },
    commentCount: 28,
    createdAt: '2026-10-25T09:15:00Z'
  },
  {
    id: 'post-2',
    authorId: 'talent-2',
    authorName: 'Maya Cravid (Talent Silver 🥈)',
    authorUsername: 'maya_cravid_danca',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    authorTier: 'silver',
    content: 'Ensaio matinal nas areias douradas do Ilhéu das Rolas. A dança corre nas nossas veias desde o berço! Dedico esta performance a todos que acreditam na cultura da Ilha do Príncipe e São Tomé. 💃✨',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-traditional-costume-41617-large.mp4',
    videoDurationSeconds: 78,
    postType: 'raro',
    isRareContender: true,
    category: 'Dança (Kizomba, Dêxa, Ússua)',
    likes: 1250,
    likedBy: ['talent-1'],
    reactions: { '💎': 520, '🔥': 410, '👏': 320 },
    userReactions: {},
    commentCount: 19,
    createdAt: '2026-10-24T18:30:00Z'
  },
  {
    id: 'post-3',
    authorId: 'talent-3',
    authorName: 'Chef Bibiana (Talent Bronze 🥉)',
    authorUsername: 'bibiana_sabores_stp',
    authorAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    authorTier: 'bronze',
    content: 'O verdadeiro segredo do nosso Calulu de Peixe Seco: ervas frescas colhidas hoje de manhã na Roça Monte Café e o azeite de palma virgem feito no pilão tradicional. Quem aceita um prato? 🍲🌶️',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    postType: 'normal',
    category: 'Gastronomia Crioula',
    likes: 980,
    likedBy: ['user-demo-1'],
    reactions: { '❤️': 450, '👏': 310, '🔥': 220 },
    userReactions: {},
    commentCount: 32,
    createdAt: '2026-10-24T14:10:00Z'
  },
  {
    id: 'post-4',
    authorId: 'talent-4',
    authorName: 'Zezito Humor',
    authorUsername: 'zezito_comedia_stp',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    authorTier: 'top10',
    content: 'Quando você diz que vai só dar uma voltinha no mercado grande de São Tomé e volta 5 horas depois com 3 jacas, 2 galinhas e conversou com metade da ilha! 😂😂😂 Marca aquele teu amigo santomense que é assim!',
    postType: 'normal',
    category: 'Humor & Comédia',
    likes: 875,
    likedBy: [],
    reactions: { '🔥': 540, '👏': 335 },
    userReactions: {},
    commentCount: 41,
    createdAt: '2026-10-24T11:00:00Z'
  },
  {
    id: 'post-5',
    authorId: 'talent-6',
    authorName: 'Vanessa Moniz',
    authorUsername: 'vanessa_panodeterra',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    authorTier: 'top10',
    content: 'Nova coleção: "Raízes do Cacau". Vestido drapeado feito com técnicas tradicionais de tecelagem e tingimento natural. Candidata oficial a TALENT RARO deste mês! O vosso apoio faz toda a diferença. ✨🌿',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    postType: 'raro',
    isRareContender: true,
    category: 'Moda & Pano de Terra',
    likes: 740,
    likedBy: ['user-demo-1'],
    reactions: { '💎': 390, '❤️': 350 },
    userReactions: {},
    commentCount: 15,
    createdAt: '2026-10-23T16:45:00Z'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-demo-1',
    authorName: 'Mário da Costa',
    authorUsername: 'mario_costa',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    authorRole: 'user',
    content: 'Espetacular Kelvin! O som tá muito limpo e a batida bate forte no coração de São Tomé! 🇸🇹🔥',
    status: 'approved',
    createdAt: '2026-10-25T09:30:00Z'
  },
  {
    id: 'comment-2',
    postId: 'post-2',
    authorId: 'talent-1',
    authorName: 'Kelvin Santos',
    authorUsername: 'kelvin_som_stp',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorRole: 'talent',
    content: 'A Maya representa o Príncipe como ninguém. Orgulho nacional! 👏💎',
    status: 'approved',
    createdAt: '2026-10-24T19:00:00Z'
  },
  {
    id: 'comment-pending-1',
    postId: 'post-1',
    authorId: 'user-demo-1',
    authorName: 'Mário da Costa',
    authorUsername: 'mario_costa',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    authorRole: 'user',
    content: 'Ansioso pelo lançamento oficial na sexta-feira!',
    status: 'pending', // Awaiting Admin moderation!
    createdAt: '2026-10-25T10:10:00Z'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Desafio Ritmo de São Tomé 🎶',
    description: 'Grave um vídeo de até 60 segundos com o seu instrumento ou voz interpretando uma cantiga tradicional da sua comunidade.',
    category: 'Música & Canto',
    pointsReward: 500,
    deadline: 'Domingo às 23:59',
    participantsCount: 14,
    completedBy: [],
    badge: '🏆 Bónus +500 Pontos',
    difficulty: 'Médio'
  },
  {
    id: 'challenge-2',
    title: 'Desafio Criatividade com Cacau 🍫',
    description: 'Apresente uma criação (artesanato, receita culinária ou pintura) inspirada na semente de cacau ouro santomense.',
    category: 'Arte & Gastronomia',
    pointsReward: 600,
    deadline: 'Segunda às 20:00',
    participantsCount: 9,
    completedBy: [],
    badge: '✨ Cacau de Ouro',
    difficulty: 'Avançado'
  },
  {
    id: 'challenge-3',
    title: 'Dança Tradicional Remix 💃',
    description: 'Faça uma coreografia curta combinando passos de Ússua com batidas contemporâneas.',
    category: 'Dança',
    pointsReward: 450,
    deadline: 'Terça às 18:00',
    participantsCount: 22,
    completedBy: [],
    badge: '⚡ Destaque Semanal',
    difficulty: 'Fácil'
  },
  {
    id: 'challenge-4',
    title: 'Humor das Nossas Ruas 😂',
    description: 'Crie uma esquete cómica de 45 segundos sobre uma situação típica num táxi ou num mercado de São Tomé.',
    category: 'Humor',
    pointsReward: 400,
    deadline: 'Quarta às 22:00',
    participantsCount: 18,
    completedBy: [],
    badge: '🎭 Riso Forte',
    difficulty: 'Fácil'
  },
  {
    id: 'challenge-5',
    title: 'Voz da Juventude & Futuro 🌍',
    description: 'Compartilhe uma ideia inovadora em tecnologia ou sustentabilidade para São Tomé e Príncipe.',
    category: 'Inovação & Ideias',
    pointsReward: 700,
    deadline: 'Quinta às 23:59',
    participantsCount: 11,
    completedBy: [],
    badge: '💡 Grande Inovador',
    difficulty: 'Avançado'
  }
];

export const INITIAL_LIVES: LiveStream[] = [
  {
    id: 'live-1',
    talentId: 'talent-1',
    talentName: 'Kelvin Santos',
    talentUsername: 'kelvin_som_stp',
    talentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'AO VIVO: Acústico na Praia das Sete Ondas & Bate-papo!',
    category: 'Música & Canto',
    viewerCount: 284,
    isActive: true,
    startedAt: '10:15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'live-2',
    talentId: 'talent-2',
    talentName: 'Maya Cravid',
    talentUsername: 'maya_cravid_danca',
    talentAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    title: 'Aula ao Vivo de Kizomba & Postura para Iniciantes',
    category: 'Dança',
    viewerCount: 195,
    isActive: true,
    startedAt: '10:20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-demo-1',
    type: 'like',
    title: 'Nova interação',
    message: 'Kelvin Santos curtiu o seu comentário.',
    timestamp: 'Há 15 min',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'notif-2',
    userId: 'user-demo-1',
    type: 'ranking',
    title: 'Atualização do Ranking',
    message: 'Kelvin Santos conquistou o 1º Lugar (Talent Gold) com 12.480 pontos!',
    timestamp: 'Há 2 horas',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'user-demo-1',
    type: 'announcement',
    title: 'Talent Hub Oficial 🇸🇹',
    message: 'Prémio Talent Raro: votação especial dia 15 de cada mês com premiação de 3 grandes talentos.',
    timestamp: 'Há 5 horas',
    read: true,
    avatar: '/assets/aistudio/WhatsApp_Image_2026-10-01_at_20.13.05-removebg-preview_200ca2a6.png'
  }
];

export const INITIAL_ADS: AdvertisementBanner[] = [
  {
    id: 'ad-1',
    title: 'Descubra São Tomé com a GAP Serviços & Turismo',
    subtitle: 'Aluguer de 4x4 Suzuki Jimny e Toyota Hilux com as melhores tarifas em Dobras e Euros!',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#gap-servicos',
    sponsorName: 'GAP Turismo STP',
    active: true,
    clicks: 142
  },
  {
    id: 'ad-2',
    title: 'GAP Resolve: Entregas Rápidas em Toda a Ilha',
    subtitle: 'Documentos, encomendas e compras entregues à sua porta com rastreio no mapa.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#gap-resolve',
    sponsorName: 'GAP Resolve',
    active: true,
    clicks: 98
  }
];

export const GAP_VEHICLES: GapVehicle[] = [
  {
    id: 'car-1',
    name: 'Suzuki Jimny AllGrip 4x4',
    category: '4x4 Todo-Terreno',
    dailyPriceDobras: 1200,
    dailyPriceEuros: 48,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    passengers: 4,
    transmission: 'Manual',
    fuel: 'Gasolina',
    airConditioning: true,
    popularFor: 'Ideal para as estradas do sul (Porto Alegre, Praia Inhambupe e Roça São João)'
  },
  {
    id: 'car-2',
    name: 'Toyota Hilux Double Cab 4x4',
    category: 'Pickup',
    dailyPriceDobras: 1800,
    dailyPriceEuros: 72,
    imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    passengers: 5,
    transmission: 'Manual',
    fuel: 'Gasóleo',
    airConditioning: true,
    popularFor: 'Máxima robustez para expedições pelas roças montanhosas de Monte Café e Trindade'
  },
  {
    id: 'car-3',
    name: 'Renault Duster 4WD',
    category: 'SUV Urbano',
    dailyPriceDobras: 1400,
    dailyPriceEuros: 56,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    passengers: 5,
    transmission: 'Manual',
    fuel: 'Gasolina',
    airConditioning: true,
    popularFor: 'Conforto familiar para visitar a Lagoa Azul, Neves e Guadalupe'
  }
];

export const GAP_TOURS: GapTour[] = [
  {
    id: 'tour-1',
    title: 'Expedição ao Marco do Equador & Ilhéu das Rolas',
    region: 'São Tomé Sul',
    duration: 'Dia Inteiro (8h)',
    priceDobras: 2200,
    priceEuros: 89,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Passagem de barco para o Ilhéu', 'Marco geodésico do Equador', 'Almoço com peixe grelhado fresco', 'Praia Café & Bateria'],
    included: ['Transporte 4x4', 'Travessia de barco', 'Guia santomense credenciado', 'Almoço típico']
  },
  {
    id: 'tour-2',
    title: 'Rota do Café & Cascata de São Nicolau',
    region: 'São Tomé Centro',
    duration: 'Meio Dia (5h)',
    priceDobras: 1400,
    priceEuros: 56,
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    highlights: ['Visita histórica à Roça Monte Café', 'Degustação de café arábica vulcânico', 'Banho revigorante na Cascata São Nicolau', 'Jardim Botânico do Bom Sucesso'],
    included: ['Entradas nas roças', 'Degustação de café', 'Guia especializado', 'Água mineral']
  },
  {
    id: 'tour-3',
    title: 'Circuito Norte: Lagoa Azul & Savanas Vulcânicas',
    region: 'São Tomé Norte',
    duration: '6 horas',
    priceDobras: 1600,
    priceEuros: 64,
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Snorkel na água cristalina da Lagoa Azul', 'Farol da Lagoa Azul', 'Cidade histórica de Guadalupe', 'Baobás gigantes da costa norte'],
    included: ['Equipamento de snorkel', 'Transporte 4x4 com A/C', 'Frutas tropicais locais']
  }
];

export const PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'bistp_qr',
    name: 'QR Code BISTP (Dobras STN)',
    enabled: true,
    iconName: 'QrCode',
    description: 'Transferência instantânea em Dobras através do Banco Internacional de São Tomé e Príncipe.',
    details: 'Chave Multicaixa / NIB BISTP: 0001.0000.1234.5678.90'
  },
  {
    id: 'dobrapay',
    name: 'DobraPay / Dinheiro Móvel STP',
    enabled: true,
    iconName: 'Smartphone',
    description: 'Pagamento instantâneo via carteira móvel nacional de São Tomé e Príncipe (+239).',
    details: 'Número comercial: 991 0000 (Talent Hub Oficial)'
  },
  {
    id: 'paypal',
    name: 'PayPal & Cartão Internacional',
    enabled: true,
    iconName: 'CreditCard',
    description: 'Ideal para a diáspora santomense em Portugal, Angola, Reino Unido, França e resto do mundo.',
    details: 'Pagamento seguro com conversão direta de 50 STN (~2.00 €)'
  },
  {
    id: 'bgfi_bank',
    name: 'BGFIBank São Tomé',
    enabled: false,
    iconName: 'Building2',
    description: 'Depósito ou transferência direta via rede BGFIBank.',
    details: 'Disponível sob requisição no balcão'
  }
];

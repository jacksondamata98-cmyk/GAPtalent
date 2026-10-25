export type UserRole = 'guest' | 'user' | 'talent' | 'admin';

export type AdminLevel = 'atendente' | 'moderador' | 'gerente';

export type TalentRankTier = 'gold' | 'silver' | 'bronze' | 'top10' | 'rising' | 'standard';

export interface User {
  id: string;
  name: string;
  surname?: string;
  username: string;
  email?: string;
  phone?: string; // +239 ...
  avatar: string;
  age: number;
  role: UserRole;
  adminLevel?: AdminLevel;
  bio?: string;
  interests?: string[];
  followingIds: string[];
  createdAt: string;

  // Talent specific fields
  isTalent?: boolean;
  talentCategory?: string;
  talentTier?: TalentRankTier;
  points: number; // likes count
  subscriptionStatus?: 'active' | 'pending' | 'blocked' | 'expired';
  subscriptionDueDate?: string; // YYYY-MM-DD
  daysOverdue?: number;
  biDocumentUrl?: string;
  addressDocumentUrl?: string;
  district?: string;
  appliedDate?: string;
  paymentMethod?: string;
}

export type PostType = 'normal' | 'raro' | 'official_announcement';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorTier?: TalentRankTier;
  content: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  videoDurationSeconds?: number; // max 120s
  postType: PostType;
  category: string;
  likes: number;
  likedBy: string[]; // user IDs
  reactions: { [emoji: string]: number };
  userReactions: { [userId: string]: string };
  commentCount: number;
  createdAt: string;
  isRareContender?: boolean;
  isOfficial?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  pointsReward: number;
  deadline: string;
  participantsCount: number;
  completedBy: string[]; // talent IDs
  badge: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
}

export interface LiveStream {
  id: string;
  talentId: string;
  talentName: string;
  talentUsername: string;
  talentAvatar: string;
  title: string;
  category: string;
  viewerCount: number;
  isActive: boolean;
  startedAt: string;
  thumbnailUrl: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'comment_approved' | 'ranking' | 'announcement' | 'talent_approval' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkId?: string;
  avatar?: string;
}

export interface AdvertisementBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  sponsorName: string;
  active: boolean;
  clicks: number;
}

export interface GapVehicle {
  id: string;
  name: string;
  category: '4x4 Todo-Terreno' | 'SUV Urbano' | 'Pickup' | 'Económico';
  dailyPriceDobras: number;
  dailyPriceEuros: number;
  imageUrl: string;
  passengers: number;
  transmission: 'Manual' | 'Automático';
  fuel: 'Gasolina' | 'Gasóleo';
  airConditioning: boolean;
  popularFor: string;
}

export interface GapTour {
  id: string;
  title: string;
  region: 'São Tomé Sul' | 'São Tomé Norte' | 'São Tomé Centro' | 'Ilha do Príncipe';
  duration: string;
  priceDobras: number;
  priceEuros: number;
  imageUrl: string;
  highlights: string[];
  included: string[];
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  iconName: string;
  description: string;
  details?: string;
}

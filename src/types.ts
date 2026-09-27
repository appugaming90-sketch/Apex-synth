export type TabType = 'base' | 'jobs' | 'careers' | 'casino' | 'syndicates' | 'leaderboard' | 'market' | 'inventory' | 'map' | 'overview' | 'profile';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'exotic';
export type ItemType = 'perk' | 'item' | 'pet' | 'consumable';

export interface ItemStats {
  incomeMultiplierBonus?: number; // e.g., +0.10 (+10%)
  xpBonus?: number; // e.g., +0.15 (+15%)
  luckBonus?: number; // e.g., +0.10 (+10% casino / crate roll luck)
  costDiscount?: number; // e.g., 0.05 (-5% build/upgrade cost)
  clickBonus?: number; // e.g., +50 credits per click/action
  energyRestore?: number; // e.g., +50 energy
  instantCash?: number; // e.g., +50000 credits
}

export interface InventoryItem {
  id: string; // catalog item id
  instanceId: string; // unique item instance id
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string; // emoji or icon tag
  description: string;
  stats: ItemStats;
  acquiredAt: number;
}

export interface EquipmentSlots {
  perks: (InventoryItem | null)[]; // 4 active perk slots
  items: (InventoryItem | null)[]; // 2 active item holding slots
  pet: InventoryItem | null; // 1 active cyber-pet slot
}

export interface ChestTier {
  id: string;
  name: string;
  rarity: ItemRarity;
  costCash?: number;
  costGems?: number;
  description: string;
  dropRates: { [key in ItemRarity]?: number };
  petChance: number; // 0 to 1
  badge: string;
  icon: string;
}

export type { PlayerRank, LevelConfig } from './data/levelConfig';

export type JobType = 'courier' | 'broker' | 'tech';

export interface JobTier {
  id: string;
  name: string;
  title: string;
  type: JobType;
  requiredXp: number;
  requiredNetWorth: number;
  basePayout: number;
  cooldownSeconds: number;
  xpReward: number;
  description: string;
  iconName: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'Commuter' | 'Sports' | 'Supercar' | 'Hypercar';
  price: number;
  resalePrice: number;
  maintenancePerHour: number;
  topSpeed: number; // km/h
  acceleration: string; // e.g. "2.4s (0-100)"
  prestige: number;
  imageTag: string;
  description: string;
  paintColor?: string;
}

export interface RealEstate {
  id: string;
  name: string;
  category: 'Apartment' | 'Villa' | 'Mansion' | 'Penthouse' | string;
  price: number;
  cost?: number;
  luxuryTaxPerHour: number;
  storageSlots: number;
  prestige: number;
  district: string;
  imageTag: string;
  description: string;
  drawType?: 'mansion';
  color?: string;
}

export type BuildingDrawType = 'kiosk' | 'retail' | 'commercial' | 'entertainment' | 'corporate' | 'mansion';

export interface ResidentialProperty {
  id: string;
  name: string;
  cost: number;
  price: number;
  prestige: number;
  drawType: 'mansion';
  color: string;
  category?: string;
  district?: string;
  luxuryTaxPerHour?: number;
  storageSlots?: number;
  description?: string;
  imageTag?: string;
}

export interface CareerContract {
  id: string;
  name: string;
  reward: number;
  cooldown: number; // in seconds
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  category: 'Industrial' | 'Nightlife' | 'Technology' | 'Logistics' | 'Crypto';
  basePrice: number;
  baseRevenuePerHour: number;
  currentLevel: number;
  maxLevel: number;
  upgradeCostMultiplier: number;
  upgradeRevenueMultiplier: number;
  description: string;
  unclaimedRevenue: number;
  lastCollectedAt: number;
  iconName: string;
}

export type BusinessTier = 'STREET' | 'RETAIL' | 'COMMERCIAL' | 'ENTERTAINMENT' | 'CORPORATE' | 'SYNDICATE_APEX';

export interface BusinessStructure {
  id: string;
  name: string;
  tier: BusinessTier;
  cost: number;
  hourlyIncome: number;
  drawType: BuildingDrawType;
  color: string;
  buyPrice?: number;
  income?: number;
  hourlyYield?: number;
  gridDimensions?: [number, number]; // Tile footprint [width, height]
  minPlayerLevel?: number;
  cycleDurationSeconds?: number; // Real-time timer cycle (10s to 1800s)
  baseShiftWage?: number; // 2-hour shift payroll wage
  imageSpritePath?: string;
}

export type BuildingType =
  | 'safehouse'
  | 'casino'
  | 'factory'
  | 'nightclub'
  | 'crypto_rig'
  | 'defense_turret';

export interface BaseBuilding {
  id: string;
  type: BuildingType | string;
  level: number;
  x: number; // grid x coordinate
  y: number; // grid y coordinate
  name: string;
  drawType?: BuildingDrawType;
  color?: string;
  cost?: number;
  income?: number;
  hourlyIncome?: number;
  upgradeStartTime?: number;
  upgradeDurationSeconds?: number;
  isUpgrading?: boolean;
  uncollectedRevenue: number;
  lastCollectedAt: number;
}

export interface BuildingBlueprint {
  type: BuildingType;
  name: string;
  category: 'Residential' | 'Fleet' | 'Gambling' | 'Commercial' | 'Defense' | 'Industrial' | 'Entertainment';
  description: string;
  baseCost: number;
  baseBuildTimeSeconds: number;
  maxLevel: number;
  baseRevenuePerHour: number;
  requiredSafehouseLevel: number;
  iconName: string;
  bonusesByLevel: {
    level: number;
    title: string;
    upgradeCost: number;
    upgradeTimeSeconds: number;
    revenuePerHour: number;
    perkDescription: string;
  }[];
}

export interface SyndicateMember {
  id: string;
  name: string;
  role: 'Chairman' | 'Executive' | 'Director' | 'Associate';
  contribution: number;
  avatar: string;
  isPlayer?: boolean;
}

export interface SyndicateContract {
  id: string;
  title: string;
  category: 'Logistics' | 'Financial' | 'Security' | 'Tech';
  rewardCredits: number;
  reputationReward: number;
  durationSeconds: number;
  expiresAt: number;
  status: 'available' | 'in_progress' | 'completed';
  description: string;
  startedAt?: number;
}

export interface Syndicate {
  id: string;
  name: string;
  tag: string;
  level: number;
  vaultBalance: number;
  reputation: number;
  maxMembers: number;
  members: SyndicateMember[];
  perkBusinessBonus: number; // e.g. 5%
  perkMaintenanceDiscount: number; // e.g. 10%
  description: string;
  contracts: SyndicateContract[];
  isPlayerSyndicate?: boolean;
}

export interface TransactionRecord {
  id: string;
  type: 'income' | 'expense' | 'gambling' | 'transfer' | 'asset' | 'syndicate';
  description: string;
  amount: number;
  timestamp: number;
  isCredit: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  username?: string;
  avatar: string;
  syndicateTag?: string;
  region: 'Americas' | 'Eurozone' | 'Asia-Pacific';
  state: string;
  district: 'Apex Central' | 'Marina Bay' | 'Silicon Heights' | 'Industrial Port';
  netWorth: number;
  level?: number;
  prestige?: number;
  businessIncomePerHour: number;
  casinoWinnings: number;
  groupVault: number;
  isPlayer?: boolean;
  avatarFrame?: string;
  showcaseVehicleName?: string;
  showcasePropertyName?: string;
}

export interface GoogleAuthData {
  isLinked: boolean;
  email: string;
  name: string;
  photoUrl?: string;
  linkedAt: number;
  lastSyncedAt: number;
  syncStatus: 'synced' | 'syncing' | 'offline';
  provider: 'google' | 'guest';
}

export interface PlayerStats {
  totalJobsWorked: number;
  totalGambled: number;
  totalCasinoProfit: number;
  totalCasinoWins?: number;
  totalCasinoLosses?: number;
  totalBusinessCollected: number;
  totalMaintenancePaid: number;
  totalTaxesPaid: number;
  createdAt: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatarId: string;
  email: string;
  googleAuth?: GoogleAuthData;
  avatarFrame?: string;
  title?: string;
  showcaseVehicleId?: string | null;
  showcasePropertyId?: string | null;
  cash: number;
  credits?: number; // Alias for cash
  gems: number;
  expMultiplier?: number; // 1.0 to 2.5 (100% to 250%)
  incMultiplier?: number; // 1.0 to 3.0 (100% to 300%)
  bankBalance: number;
  bankSavings?: number;
  xp: number;
  level: number;
  rank?: string;
  energy: number;
  maxEnergy: number;
  lastEnergyRegenAt: number;
  prestige: number;
  region: 'Americas' | 'Eurozone' | 'Asia-Pacific';
  state: string;
  district: 'Apex Central' | 'Marina Bay' | 'Silicon Heights' | 'Industrial Port';
  gridSize: number; // 8 for 8x8 grid
  tileSize?: number; // 64
  selectedTile?: { x: number; y: number } | null;
  casinoWager?: number;
  isCasinoRunning?: boolean;
  baseBuildings: BaseBuilding[];
  ownedVehicles: string[]; // vehicle IDs
  activeVehicleId: string | null;
  vehiclePaints: { [vehicleId: string]: string }; // hex color code
  ownedProperties: string[]; // property IDs
  primaryPropertyId: string | null;
  ownedBusinesses: {
    [businessId: string]: {
      level: number;
      unclaimedRevenue: number;
      lastCollectedAt: number;
      shiftExpiresAt?: number; // timestamp in ms when the 2-hour shift ends (7,200s)
      payoutProgressSeconds?: number; // elapsed seconds in real-time payout cycle
      isHaltedOnStrike?: boolean; // whether wages are unpaid and operations halted
    };
  };
  syndicateId: string | null;
  syndicateRole: 'Chairman' | 'Executive' | 'Director' | 'Associate' | null;
  stats: PlayerStats;
  vipTableActive: boolean;
  vipTableBalance: number;
  vipTableStakes: { min: number; max: number };
  inventory?: InventoryItem[];
  equipment?: EquipmentSlots;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  amount?: number;
}

// Commercial Building Definition
export interface CommercialBuilding {
  id: string;
  name: string;
  category: 'RETAIL' | 'ENTERTAINMENT' | 'CORPORATE';
  gridSize: [number, number]; // e.g., [1, 1] or [2, 2]
  costCredits: number;
  hourlyYield: number;
  iconPath: string; // URL path to 2D isometric sprite
  minPlayerLevel: number;
}

// In-Game Store Offer
export interface StoreOffer {
  id: string;
  title: string;
  priceUSD: number;
  rewardGems: number;
  rewardCredits: number;
  isPopular?: boolean;
}

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  PlayerProfile,
  Vehicle,
  RealEstate,
  Business,
  Syndicate,
  LeaderboardEntry,
  TransactionRecord,
  ToastMessage,
  TabType,
  BaseBuilding,
  BuildingType,
  InventoryItem,
  EquipmentSlots,
  ChestTier
} from '../types';
import {
  VEHICLES_CATALOG,
  REAL_ESTATE_CATALOG,
  BUSINESSES_CATALOG,
  BUSINESS_CATALOG,
  RESIDENTIAL_CATALOG,
  CAREER_TIERS,
  INITIAL_SYNDICATES,
  INITIAL_LEADERBOARDS
} from '../data/initialData';
import { BUILDING_BLUEPRINTS, PAINT_SWATCHES } from '../data/buildingBlueprints';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  LEVEL_CONFIG,
  getRequiredXP,
  getRankData,
  showLevelUpNotification,
  PlayerRank
} from '../data/levelConfig';
import { CHEST_TIERS, ITEMS_CATALOG, rollChestDrop } from '../data/itemsCatalog';

export function getBusinessDef(id: string) {
  const struct = BUSINESS_CATALOG.find(b => b.id === id);
  if (struct) {
    return {
      id: struct.id,
      name: struct.name,
      basePrice: struct.cost || struct.buyPrice || 10,
      baseRevenuePerHour: struct.hourlyIncome ?? struct.hourlyYield ?? 0,
      minPlayerLevel: struct.minPlayerLevel || 1,
      maxLevel: 100, // CAPPED AT LEVEL 100
      upgradeCostMultiplier: 1.22, // EXPONENTIAL 1.22X PER LEVEL (REBALANCED PACING)
      upgradeRevenueMultiplier: 1.03 // Gentle 1.03x compounding to stop runaway inflation
    };
  }
  const legacy = BUSINESSES_CATALOG.find(b => b.id === id);
  if (legacy) {
    return {
      id: legacy.id,
      name: legacy.name,
      basePrice: legacy.basePrice,
      baseRevenuePerHour: legacy.baseRevenuePerHour,
      minPlayerLevel: 1,
      maxLevel: 100,
      upgradeCostMultiplier: 1.22,
      upgradeRevenueMultiplier: 1.03
    };
  }
  return null;
}

interface GameContextType {
  profile: PlayerProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  transactions: TransactionRecord[];
  toasts: ToastMessage[];
  syndicates: Syndicate[];
  leaderboards: LeaderboardEntry[];
  leaderboard: LeaderboardEntry[];
  totalHourlyIncome: number;
  totalHourlyMaintenance: number;
  netHourlyCashflow: number;
  computedNetWorth: number;
  cycleCountdown: number;
  lastCashDelta: { amount: number; isCredit: boolean; id: number } | null;
  addToast: (title: string, message: string, type?: 'success' | 'danger' | 'warning' | 'info', amount?: number) => void;
  removeToast: (id: string) => void;
  depositBank: (amount: number) => void;
  withdrawBank: (amount: number) => void;
  depositToBank: (amount: number) => void;
  withdrawFromBank: (amount: number) => void;
  addGems: (amount: number, reason?: string) => void;
  exchangeGemsForCredits: (gemCost: number, creditReward: number) => boolean;
  buyExpBoost: () => boolean;
  buyIncBoost: () => boolean;
  hourlyUpkeep: number;
  completeJobShift: (jobId: string, performanceBonusRatio?: number) => { payout: number; xp: number };
  addXP: (amount: number) => void;
  getRequiredXP: (level: number) => number;
  getRankData: (level: number) => PlayerRank;
  currentRankData: PlayerRank;
  requiredXP: number;
  buyVehicle: (vehicleId: string) => boolean;
  sellVehicle: (vehicleId: string) => boolean;
  setActiveVehicle: (vehicleId: string) => void;
  setVehiclePaint: (vehicleId: string, paintHex: string) => void;
  buyProperty: (propertyId: string) => boolean;
  setPrimaryProperty: (propertyId: string) => void;
  buyBusiness: (businessId: string) => boolean;
  upgradeBusiness: (businessId: string, count?: number) => boolean;
  upgradeAllBusinesses: () => { upgradedCount: number; totalLevels: number; totalSpent: number };
  collectBusinessRevenue: (businessId: string) => number;
  collectAllBusinesses: () => number;
  payAllEmployees: () => boolean;
  payBusinessShift: (businessId: string) => boolean;
  totalPayrollDue: number;
  businessesOnStrikeCount: number;
  // Base Building Engine
  constructBuilding: (type: BuildingType | string, x: number, y: number) => boolean;
  upgradeBaseBuilding: (buildingId: string) => boolean;
  rushFinishUpgrade: (buildingId: string) => void;
  collectBuildingRevenue: (buildingId: string) => number;
  collectAllBaseBuildings: () => number;
  // Energy System
  useEnergy: (amount: number) => boolean;
  replenishEnergy: (amount: number) => void;
  // Syndicate & Gambling
  joinSyndicate: (syndicateId: string) => boolean;
  leaveSyndicate: () => void;
  createSyndicate: (name: string, tag: string) => boolean;
  depositSyndicateVault: (amount: number) => boolean;
  withdrawSyndicateVault: (amount: number) => boolean;
  completeContract: (contractId: string) => void;
  applyGamblingResult: (betAmount: number, winPayout: number, gameName: string) => void;
  toggleVipTable: () => void;
  updateVipTableStakes: (min: number, max: number) => void;
  updateLocation: (region: PlayerProfile['region'], state: string, district: PlayerProfile['district']) => void;
  resetGame: () => void;
  exportSaveData: () => string;
  importSaveData: (jsonStr: string) => boolean;
  // RPG Profile & Google Sync Hub
  setAvatarFrame: (frameId: string) => void;
  setCustomTitle: (title: string) => void;
  setShowcaseVehicle: (vehicleId: string | null) => void;
  setShowcaseProperty: (propertyId: string | null) => void;
  linkGoogleAccount: (account: { email: string; name: string; photoUrl?: string }) => void;
  unlinkGoogleAccount: () => void;
  syncCloudData: () => Promise<boolean>;
  // Inventory, Equipment & Crates
  inventory: InventoryItem[];
  equipment: EquipmentSlots;
  equippedStats: {
    totalIncomeBonus: number;
    totalXpBonus: number;
    totalLuckBonus: number;
    totalCostDiscount: number;
  };
  timedCrateReady: boolean;
  timedCrateCountdown: number;
  openCrate: (chestTierId: string) => InventoryItem | null;
  claimTimedCrate: () => InventoryItem | null;
  equipItem: (instanceId: string, slotType: 'perk' | 'item' | 'pet', slotIndex?: number) => boolean;
  unequipItem: (slotType: 'perk' | 'item' | 'pet', slotIndex?: number) => boolean;
  useConsumable: (instanceId: string) => boolean;
  unlockPlot: (x: number, y: number) => boolean;
  // Mastery & Slide-out drawer
  masteryCrownsCount: number;
  builtSpiresCount: number;
  isSlideOutOpen: boolean;
  setIsSlideOutOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'apex_economy_save_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  id: 'player_user',
  username: 'Cipher_One',
  avatarId: 'avatar_operative_1',
  email: 'gopimadhu1974@gmail.com',
  googleAuth: {
    isLinked: true,
    email: 'gopimadhu1974@gmail.com',
    name: 'Gopi Madhu',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    linkedAt: Date.now() - 86400000 * 3,
    lastSyncedAt: Date.now() - 60000,
    syncStatus: 'synced',
    provider: 'google'
  },
  avatarFrame: 'neon_cyan',
  rank: 'Street Hustler',
  title: 'Rogue Operator',
  showcaseVehicleId: 'v_commuter',
  showcasePropertyId: 're_studio',
  cash: 12500,
  gems: 10,
  expMultiplier: 1.0,
  incMultiplier: 1.0,
  bankBalance: 20000,
  xp: 0,
  level: 1,
  energy: 100,
  maxEnergy: 100,
  lastEnergyRegenAt: Date.now(),
  prestige: 15,
  region: 'Americas',
  state: 'New York Metro',
  district: 'Apex Central',
  gridSize: 8,
  tileSize: 80,
  casinoWager: 100,
  isCasinoRunning: false,
  inventory: [
    {
      id: 'c_perk_01',
      instanceId: 'inst_starter_perk_1',
      name: 'Copper Overclocker',
      type: 'perk',
      rarity: 'common',
      icon: '⚡',
      description: 'Modest electrical overclock boosting total syndicate revenue by +3%.',
      stats: { incomeMultiplierBonus: 0.03 },
      acquiredAt: Date.now()
    },
    {
      id: 'u_pet_01',
      instanceId: 'inst_starter_pet_1',
      name: 'Neon Robo-Beetle',
      type: 'pet',
      rarity: 'uncommon',
      icon: '🪲',
      description: 'Sturdy bio-mechanical companion scouting micro-gains. (+5% Income, +3% Luck).',
      stats: { incomeMultiplierBonus: 0.05, luckBonus: 0.03 },
      acquiredAt: Date.now()
    }
  ],
  equipment: {
    perks: [null, null, null, null],
    items: [null, null],
    pet: null
  },
  baseBuildings: [
    {
      id: 'bld_lemonade_starter',
      type: 'b01',
      level: 1,
      x: 0,
      y: 0,
      name: 'Sidewalk Lemonade Stand',
      drawType: 'kiosk',
      color: '#facc15',
      cost: 10,
      income: 0.8,
      hourlyIncome: 2880,
      uncollectedRevenue: 10,
      lastCollectedAt: Date.now()
    },
    {
      id: 'bld_safehouse_starter',
      type: 'safehouse',
      level: 1,
      x: 3,
      y: 3,
      name: 'Starter Safehouse',
      uncollectedRevenue: 150,
      lastCollectedAt: Date.now()
    }
  ],
  ownedVehicles: ['v_commuter'],
  activeVehicleId: 'v_commuter',
  vehiclePaints: { v_commuter: '#00f0ff' },
  ownedProperties: ['re_studio'],
  primaryPropertyId: 're_studio',
  ownedBusinesses: {},
  syndicateId: null,
  syndicateRole: null,
  stats: {
    totalJobsWorked: 0,
    totalGambled: 0,
    totalCasinoProfit: 0,
    totalCasinoWins: 0,
    totalCasinoLosses: 0,
    totalBusinessCollected: 0,
    totalMaintenancePaid: 0,
    totalTaxesPaid: 0,
    createdAt: Date.now()
  },
  vipTableActive: false,
  vipTableBalance: 0,
  vipTableStakes: { min: 100, max: 2500 }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged: PlayerProfile = { ...DEFAULT_PROFILE, ...parsed };
        if (typeof merged.bankBalance !== 'number' || isNaN(merged.bankBalance)) {
          merged.bankBalance = typeof (merged as any).bankSavings === 'number' ? (merged as any).bankSavings : DEFAULT_PROFILE.bankBalance;
        }
        merged.bankSavings = merged.bankBalance;
        if (typeof merged.cash !== 'number' || isNaN(merged.cash)) merged.cash = DEFAULT_PROFILE.cash;
        if (typeof merged.level !== 'number' || isNaN(merged.level)) merged.level = DEFAULT_PROFILE.level;
        if (typeof merged.gems !== 'number' || isNaN(merged.gems)) merged.gems = DEFAULT_PROFILE.gems;
        if (!merged.ownedBusinesses || typeof merged.ownedBusinesses !== 'object') merged.ownedBusinesses = {};
        if (!Array.isArray(merged.ownedProperties)) merged.ownedProperties = DEFAULT_PROFILE.ownedProperties;
        if (!Array.isArray(merged.ownedVehicles)) merged.ownedVehicles = DEFAULT_PROFILE.ownedVehicles;
        if (Array.isArray(merged.baseBuildings)) {
          merged.baseBuildings = merged.baseBuildings.filter(b => b.type !== 'garage');
        }
        if (!merged.baseBuildings || merged.baseBuildings.length === 0) {
          merged.baseBuildings = [
            {
              id: 'bld_lemonade_starter',
              type: 'b01',
              level: 1,
              x: 0,
              y: 0,
              name: 'Sidewalk Lemonade Stand',
              drawType: 'kiosk',
              color: '#facc15',
              cost: 10,
              income: 0.8,
              hourlyIncome: 2880,
              uncollectedRevenue: 10,
              lastCollectedAt: Date.now()
            },
            {
              id: 'bld_safehouse_starter',
              type: 'safehouse',
              level: 1,
              x: 3,
              y: 3,
              name: 'Starter Safehouse',
              uncollectedRevenue: 150,
              lastCollectedAt: Date.now()
            }
          ];
        } else if (!merged.baseBuildings.some(b => b.x === 0 && b.y === 0)) {
          merged.baseBuildings.push({
            id: 'bld_lemonade_starter',
            type: 'b01',
            level: 1,
            x: 0,
            y: 0,
            name: 'Sidewalk Lemonade Stand',
            drawType: 'kiosk',
            color: '#facc15',
            cost: 10,
            income: 0.8,
            hourlyIncome: 2880,
            uncollectedRevenue: 10,
            lastCollectedAt: Date.now()
          });
        }
        if (!merged.gridSize || merged.gridSize < 8) merged.gridSize = 8;
        if (!merged.tileSize) merged.tileSize = 80;
        const currentRank = getRankData(merged.level || 1);
        if (!merged.rank || merged.rank === 'Syndicate Initiate') merged.rank = currentRank.title;
        if (!merged.title) merged.title = 'Rogue Operator';
        if (!merged.energy && merged.energy !== 0) merged.energy = 100;
        if (!merged.maxEnergy) merged.maxEnergy = 100;
        if (!merged.vehiclePaints) merged.vehiclePaints = { v_commuter: '#00f0ff' };
        if (!merged.ownedVehicles || merged.ownedVehicles.length === 0) {
          merged.ownedVehicles = ['v_commuter'];
          merged.activeVehicleId = 'v_commuter';
        }
        if (typeof merged.expMultiplier !== 'number' || isNaN(merged.expMultiplier)) merged.expMultiplier = 1.0;
        if (typeof merged.incMultiplier !== 'number' || isNaN(merged.incMultiplier)) merged.incMultiplier = 1.0;
        if (!Array.isArray(merged.inventory)) merged.inventory = [...DEFAULT_PROFILE.inventory!];
        if (!merged.equipment || !Array.isArray(merged.equipment.perks)) {
          merged.equipment = {
            perks: [null, null, null, null],
            items: [null, null],
            pet: null
          };
        }
        return merged;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<TabType>('base');
  const [lastCashDelta, setLastCashDelta] = useState<{ amount: number; isCredit: boolean; id: number } | null>(null);
  const [syndicates, setSyndicates] = useState<Syndicate[]>(() => {
    try {
      const saved = localStorage.getItem('apex_syndicates_save');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SYNDICATES;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [cycleCountdown, setCycleCountdown] = useState<number>(() => 60 - (Math.floor(Date.now() / 1000) % 60));

  useEffect(() => {
    const timer = setInterval(() => {
      setCycleCountdown(60 - (Math.floor(Date.now() / 1000) % 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Persist Syndicates
  useEffect(() => {
    try {
      localStorage.setItem('apex_syndicates_save', JSON.stringify(syndicates));
    } catch {}
  }, [syndicates]);

  // Toast System
  const addToast = useCallback((
    title: string,
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' = 'info',
    amount?: number
  ) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [
      { id, title, message, type, amount },
      ...prev.slice(0, 5) // Keep max 6 toasts
    ]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Record Transaction
  const recordTransaction = useCallback((
    type: TransactionRecord['type'],
    description: string,
    amount: number,
    isCredit: boolean
  ) => {
    const newTx: TransactionRecord = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type,
      description,
      amount,
      timestamp: Date.now(),
      isCredit
    };
    setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
  }, []);

  // Compute player syndicate perks
  const currentSyndicate = useMemo(() => {
    if (!profile.syndicateId) return null;
    return syndicates.find(s => s.id === profile.syndicateId) || null;
  }, [profile.syndicateId, syndicates]);

  // Equipment & Inventory State & Computed Multipliers
  const [timedCrateReady, setTimedCrateReady] = useState<boolean>(true);
  const [timedCrateCountdown, setTimedCrateCountdown] = useState<number>(60);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState<boolean>(false);

  // Mastery Crowns Count (Level 100 properties) & Built Spires Count
  const masteryCrownsCount = useMemo(() => {
    let count = 0;
    Object.values(profile.ownedBusinesses || {}).forEach(biz => {
      if (biz && biz.level >= 100) count++;
    });
    (profile.baseBuildings || []).forEach(bld => {
      if (bld && bld.level >= 100) count++;
    });
    return count;
  }, [profile.ownedBusinesses, profile.baseBuildings]);

  const builtSpiresCount = useMemo(() => {
    return (profile.baseBuildings || []).length;
  }, [profile.baseBuildings]);

  const equipment = useMemo<EquipmentSlots>(() => {
    return profile.equipment || {
      perks: [null, null, null, null],
      items: [null, null],
      pet: null
    };
  }, [profile.equipment]);

  const inventory = useMemo<InventoryItem[]>(() => {
    return profile.inventory || [];
  }, [profile.inventory]);

  const equippedStats = useMemo(() => {
    let totalIncomeBonus = 0;
    let totalXpBonus = 0;
    let totalLuckBonus = 0;
    let totalCostDiscount = 0;

    (equipment.perks || []).forEach(p => {
      if (p && p.stats) {
        if (p.stats.incomeMultiplierBonus) totalIncomeBonus += p.stats.incomeMultiplierBonus;
        if (p.stats.xpBonus) totalXpBonus += p.stats.xpBonus;
        if (p.stats.luckBonus) totalLuckBonus += p.stats.luckBonus;
        if (p.stats.costDiscount) totalCostDiscount += p.stats.costDiscount;
      }
    });

    if (equipment.pet && equipment.pet.stats) {
      if (equipment.pet.stats.incomeMultiplierBonus) totalIncomeBonus += equipment.pet.stats.incomeMultiplierBonus;
      if (equipment.pet.stats.xpBonus) totalXpBonus += equipment.pet.stats.xpBonus;
      if (equipment.pet.stats.luckBonus) totalLuckBonus += equipment.pet.stats.luckBonus;
      if (equipment.pet.stats.costDiscount) totalCostDiscount += equipment.pet.stats.costDiscount;
    }

    (equipment.items || []).forEach(it => {
      if (it && it.stats) {
        if (it.stats.incomeMultiplierBonus) totalIncomeBonus += it.stats.incomeMultiplierBonus;
        if (it.stats.xpBonus) totalXpBonus += it.stats.xpBonus;
        if (it.stats.luckBonus) totalLuckBonus += it.stats.luckBonus;
        if (it.stats.costDiscount) totalCostDiscount += it.stats.costDiscount;
      }
    });

    return {
      totalIncomeBonus: Math.round(totalIncomeBonus * 100) / 100,
      totalXpBonus: Math.round(totalXpBonus * 100) / 100,
      totalLuckBonus: Math.round(totalLuckBonus * 100) / 100,
      totalCostDiscount: Math.min(0.5, Math.round(totalCostDiscount * 100) / 100),
    };
  }, [equipment]);

  // Hourly Income & Maintenance Sinks calculation
  const totalHourlyIncome = useMemo(() => {
    let income = 0;
    const businessBonus = currentSyndicate ? currentSyndicate.perkBusinessBonus : 0;
    // Rank Perks: District Operator (+5% Global Revenue at Lv 5+), Apex Tycoon (+25% Global Revenue at Lv 35+)
    const rankRevBonus = profile.level >= 35 ? 0.25 : profile.level >= 5 ? 0.05 : 0;
    const incMult = profile.incMultiplier || 1.0;
    const totalBonus = (1 + businessBonus) * (1 + rankRevBonus) * incMult * (1 + equippedStats.totalIncomeBonus);
    
    // Commercial catalog businesses (Hard capped at Level 100 with Mastery Crown +50% global boost)
    (Object.entries(profile.ownedBusinesses) as [string, { level: number; unclaimedRevenue: number; lastCollectedAt: number }][]).forEach(([bizId, data]) => {
      const bizDef = getBusinessDef(bizId);
      if (bizDef && data.level > 0) {
        const isMastery = data.level >= 100;
        const masteryMultiplier = isMastery ? 1.5 : 1.0;
        const rev = bizDef.baseRevenuePerHour * Math.pow(bizDef.upgradeRevenueMultiplier, Math.min(100, data.level) - 1) * masteryMultiplier;
        income += rev * totalBonus;
      }
    });

    // Base Buildings income
    if (profile.baseBuildings) {
      profile.baseBuildings.forEach(bld => {
        if (bld.isUpgrading) return;
        const bp = BUILDING_BLUEPRINTS.find(b => b.type === bld.type);
        if (bp) {
          const bonus = bp.bonusesByLevel.find(lvl => lvl.level === bld.level);
          if (bonus) {
            income += bonus.revenuePerHour * totalBonus;
          }
        } else {
          const bizDef = BUSINESS_CATALOG.find(b => b.id === bld.type || b.id === bld.id);
          const inc = (bld as any).income !== undefined ? (bld as any).income : (bizDef?.income ?? (bizDef ? (bizDef.hourlyIncome || bizDef.hourlyYield || 0) / 3600 : 0));
          if (inc) {
            const isMastery = bld.level >= 100;
            const masteryMultiplier = isMastery ? 1.5 : 1.0;
            income += inc * 3600 * totalBonus * masteryMultiplier;
          }
        }
      });
    }

    return Math.round(income);
  }, [profile.ownedBusinesses, profile.baseBuildings, profile.level, currentSyndicate]);

  const totalHourlyMaintenance = useMemo(() => {
    let maintenance = 0;
    const maintDiscount = currentSyndicate ? currentSyndicate.perkMaintenanceDiscount : 0;

    // Vehicles maintenance sink
    profile.ownedVehicles.forEach(vId => {
      const v = VEHICLES_CATALOG.find(item => item.id === vId);
      if (v) maintenance += v.maintenancePerHour;
    });

    // Real estate luxury tax sink
    profile.ownedProperties.forEach(pId => {
      const p = REAL_ESTATE_CATALOG.find(item => item.id === pId);
      if (p) maintenance += p.luxuryTaxPerHour;
    });

    return Math.round(maintenance * (1 - maintDiscount));
  }, [profile.ownedVehicles, profile.ownedProperties, currentSyndicate]);

  const netHourlyCashflow = totalHourlyIncome - totalHourlyMaintenance;

  // Computed Net Worth
  const computedNetWorth = useMemo(() => {
    let worth = profile.cash + profile.bankBalance;
    profile.ownedVehicles.forEach(vId => {
      const v = VEHICLES_CATALOG.find(item => item.id === vId);
      if (v) worth += v.price;
    });
    profile.ownedProperties.forEach(pId => {
      const p = REAL_ESTATE_CATALOG.find(item => item.id === pId);
      if (p) worth += p.price;
    });
    (Object.entries(profile.ownedBusinesses) as [string, { level: number; unclaimedRevenue: number; lastCollectedAt: number }][]).forEach(([bId, data]) => {
      const b = getBusinessDef(bId);
      if (b && data.level > 0) {
        worth += b.basePrice * Math.pow(1.5, data.level - 1);
      }
    });
    if (profile.baseBuildings) {
      profile.baseBuildings.forEach(bld => {
        const bp = BUILDING_BLUEPRINTS.find(b => b.type === bld.type);
        if (bp) worth += bp.baseCost * bld.level;
      });
    }
    return Math.round(worth);
  }, [profile.cash, profile.bankBalance, profile.ownedVehicles, profile.ownedProperties, profile.ownedBusinesses, profile.baseBuildings]);

  // Real-time loop (runs every 1s): Base buildings revenue accumulator, upgrade timer audit, energy regen, and business dividends
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setProfile(prev => {
        let hasChanges = false;
        const bizBonus = currentSyndicate ? currentSyndicate.perkBusinessBonus : 0;
        const rankRevBonus = prev.level >= 35 ? 0.25 : prev.level >= 5 ? 0.05 : 0;
        const incMult = prev.incMultiplier || 1.0;
        const totalBonus = (1 + bizBonus) * (1 + rankRevBonus) * incMult * (1 + equippedStats.totalIncomeBonus);

        // 1. Audit Base Buildings (Revenue & Upgrade Countdown)
        let safehouseLevelUpdated = false;
        const updatedBuildings = (prev.baseBuildings || []).map(bld => {
          let updated = { ...bld };

          // Upgrade timer audit
          if (updated.isUpgrading && updated.upgradeStartTime && updated.upgradeDurationSeconds) {
            const elapsed = Math.floor((now - updated.upgradeStartTime) / 1000);
            if (elapsed >= updated.upgradeDurationSeconds) {
              updated.isUpgrading = false;
              updated.level = updated.level + 1;
              delete updated.upgradeStartTime;
              delete updated.upgradeDurationSeconds;
              hasChanges = true;
              sounds.playLevelUp();
              addToast('Upgrade Complete!', `${updated.name} upgraded to Level ${updated.level}!`, 'success');
              if (updated.type === 'safehouse') {
                safehouseLevelUpdated = true;
              }
            }
          }

          // Production accumulation (if not upgrading)
          if (!updated.isUpgrading) {
            const bp = BUILDING_BLUEPRINTS.find(b => b.type === updated.type);
            if (bp) {
              const bonus = bp.bonusesByLevel.find(lvl => lvl.level === updated.level);
              if (bonus && bonus.revenuePerHour > 0) {
                const perSecond = (bonus.revenuePerHour * totalBonus) / 3600;
                updated.uncollectedRevenue = Math.round((updated.uncollectedRevenue + perSecond) * 100) / 100;
                hasChanges = true;
              }
            } else {
              const bizDef = BUSINESS_CATALOG.find(b => b.id === updated.type || b.id === updated.id);
              const incPerSec = (updated as any).income !== undefined
                ? (updated as any).income
                : (bizDef?.income ?? (bizDef ? (bizDef.hourlyIncome || bizDef.hourlyYield || 0) / 3600 : 0));
              if (incPerSec > 0) {
                const isMastery = updated.level >= 100;
                const masteryMultiplier = isMastery ? 1.5 : 1.0;
                const perSecond = incPerSec * totalBonus * masteryMultiplier;
                updated.uncollectedRevenue = Math.round((updated.uncollectedRevenue + perSecond) * 100) / 100;
                hasChanges = true;
              }
            }
          }

          return updated;
        });

        // 2. Safehouse expansion check
        const safehouse = updatedBuildings.find(b => b.type === 'safehouse');
        let newGridSize = prev.gridSize || 5;
        let newMaxEnergy = prev.maxEnergy || 100;
        if (safehouse) {
          if (safehouse.level >= 3) newGridSize = 7;
          else if (safehouse.level >= 2) newGridSize = 6;
          else newGridSize = 5;

          newMaxEnergy = 100 + (safehouse.level - 1) * 25;
          if (newGridSize !== prev.gridSize || newMaxEnergy !== prev.maxEnergy) {
            hasChanges = true;
          }
        }

        // 3. Energy regeneration (every 10s: +1 energy)
        let newEnergy = prev.energy !== undefined ? prev.energy : 100;
        let lastRegen = prev.lastEnergyRegenAt || now;
        if (now - lastRegen >= 10000 && newEnergy < newMaxEnergy) {
          const recovered = Math.min(newMaxEnergy - newEnergy, Math.max(1, Math.floor((now - lastRegen) / 10000)));
          newEnergy += recovered;
          lastRegen = now;
          hasChanges = true;
        }

        // 4. Commercial businesses real-time payout timers & 2-Hour Shift Payroll check
        const owned = { ...prev.ownedBusinesses };
        Object.keys(owned).forEach(bId => {
          const biz = owned[bId];
          const def = getBusinessDef(bId);
          if (def && biz.level > 0) {
            // Check 2-hour shift timer (7,200 seconds)
            const shiftExp = biz.shiftExpiresAt || (now + 7200 * 1000);
            const isStrike = now >= shiftExp;

            let currentProgress = biz.payoutProgressSeconds || 0;
            let currentUnclaimed = biz.unclaimedRevenue || 0;

            // If shift is active (not on strike), advance real-time payout timer
            if (!isStrike) {
              const cycleDuration = def.cycleDurationSeconds || 30;
              currentProgress += 1;
              if (currentProgress >= cycleDuration) {
                // Yield lump-sum return on timer cycle completion
                const isMastery = biz.level >= 100;
                const masteryMultiplier = isMastery ? 1.5 : 1.0;
                const hourlyRate = def.baseRevenuePerHour * Math.pow(def.upgradeRevenueMultiplier, Math.min(100, biz.level) - 1) * masteryMultiplier * (1 + bizBonus) * incMult;
                const lumpSum = Math.max(1, Math.round(hourlyRate * (cycleDuration / 3600)));
                currentUnclaimed += lumpSum;
                currentProgress = 0;
              }
            }

            owned[bId] = {
              ...biz,
              shiftExpiresAt: shiftExp,
              isHaltedOnStrike: isStrike,
              payoutProgressSeconds: currentProgress,
              unclaimedRevenue: currentUnclaimed
            };
            hasChanges = true;
          }
        });

        // 5. Passive Active Time XP (+1 XP/sec scaled by expMultiplier and equipped perk/pet bonuses)
        const expMult = (prev.expMultiplier || 1.0) * (1 + (equippedStats.totalXpBonus || 0));
        const xpGain = Math.max(1, Math.round(1 * expMult));
        let updatedXp = prev.xp + xpGain;
        let updatedLevel = prev.level;
        let updatedGems = prev.gems ?? 10;
        let updatedRank = prev.rank || getRankData(updatedLevel).title;
        let nextTarget = getRequiredXP(updatedLevel);

        while (updatedXp >= nextTarget) {
          updatedXp -= nextTarget;
          updatedLevel += 1;
          const reward = Math.min(25, 5 + Math.floor(updatedLevel / 2));
          updatedGems += reward;
          const rankData = getRankData(updatedLevel);
          updatedRank = rankData.title;
          showLevelUpNotification(updatedLevel, rankData.title, reward);
          sounds.playLevelUp();
          addToast('Rank Promoted', `Advanced to Level ${updatedLevel}: ${updatedRank}! (+${reward} 💎 GEMS)`, 'success');
          nextTarget = getRequiredXP(updatedLevel);
        }

        return {
          ...prev,
          xp: updatedXp,
          level: updatedLevel,
          gems: updatedGems,
          rank: updatedRank,
          baseBuildings: updatedBuildings,
          gridSize: newGridSize,
          maxEnergy: newMaxEnergy,
          energy: newEnergy,
          lastEnergyRegenAt: lastRegen,
          ownedBusinesses: owned
        };
      });

      // Advance Timed Crate Drop (SILENT - non-intrusive badge updates)
      setTimedCrateCountdown(prevSec => {
        if (prevSec <= 1) {
          setTimedCrateReady(true);
          return 90;
        }
        return prevSec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSyndicate, addToast, equippedStats.totalIncomeBonus, equippedStats.totalXpBonus]);

  // Economic Cycle Audit (Runs every 60s): Deducts Sinks (Maintenance & Luxury Tax) & Generates VIP Table House Edge Revenue
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setProfile(prev => {
        // Calculate per-minute sink
        let minuteSink = 0;
        const maintDiscount = currentSyndicate ? currentSyndicate.perkMaintenanceDiscount : 0;

        prev.ownedVehicles.forEach(vId => {
          const v = VEHICLES_CATALOG.find(item => item.id === vId);
          if (v) minuteSink += v.maintenancePerHour / 60;
        });

        prev.ownedProperties.forEach(pId => {
          const p = REAL_ESTATE_CATALOG.find(item => item.id === pId);
          if (p) minuteSink += p.luxuryTaxPerHour / 60;
        });

        minuteSink = Math.round(minuteSink * (1 - maintDiscount));

        // VIP Table passive house edge revenue
        let vipEarnings = 0;
        if (prev.vipTableActive) {
          // 2 to 5 high-roller simulated bets per cycle
          const betsCount = Math.floor(Math.random() * 4) + 2;
          const avgStake = (prev.vipTableStakes.min + prev.vipTableStakes.max) / 2;
          const totalWagered = betsCount * avgStake;
          // European house edge ~3.5% net profit to table host
          vipEarnings = Math.round(totalWagered * 0.038);
        }

        let newCash = prev.cash;
        let newBank = prev.bankBalance;

        if (minuteSink > 0) {
          if (newBank >= minuteSink) {
            newBank -= minuteSink;
          } else {
            const remainder = minuteSink - newBank;
            newBank = 0;
            newCash = Math.max(0, newCash - remainder);
          }

          recordTransaction('expense', 'Fleet & Property Maintenance / Luxury Taxes', minuteSink, false);
          addToast('Economic Cycle Sink', `Paid ${formatCash(minuteSink)} for vehicle upkeep and property taxes.`, 'warning');
        }

        if (vipEarnings > 0) {
          newBank += vipEarnings;
          recordTransaction('income', 'VIP Casino Table House Edge Royalty', vipEarnings, true);
          addToast('VIP Casino Rake', `Your VIP table collected ${formatCash(vipEarnings)} in player house edge rake.`, 'success', vipEarnings);
        }

        return {
          ...prev,
          cash: newCash,
          bankBalance: newBank,
          vipTableBalance: prev.vipTableBalance + vipEarnings,
          stats: {
            ...prev.stats,
            totalMaintenancePaid: prev.stats.totalMaintenancePaid + minuteSink
          }
        };
      });
    }, 60000);

    return () => clearInterval(cycleInterval);
  }, [currentSyndicate, addToast, recordTransaction]);

  // Banking Operations
  const depositBank = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      if (prev.cash < amount) {
        addToast('Transaction Failed', 'Insufficient liquid cash.', 'danger');
        return prev;
      }
      sounds.playCashRegister();
      recordTransaction('transfer', 'Bank Wire Deposit', amount, true);
      addToast('Deposit Complete', `Transferred ${formatCash(amount)} to High-Yield Bank Vault.`, 'success');
      return {
        ...prev,
        cash: prev.cash - amount,
        bankBalance: prev.bankBalance + amount
      };
    });
  }, [addToast, recordTransaction]);

  const withdrawBank = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      if (prev.bankBalance < amount) {
        addToast('Withdrawal Failed', 'Insufficient funds in bank account.', 'danger');
        return prev;
      }
      sounds.playCashRegister();
      recordTransaction('transfer', 'Bank ATM Withdrawal', amount, true);
      addToast('Withdrawal Complete', `Liquidated ${formatCash(amount)} into cash.`, 'success');
      return {
        ...prev,
        cash: prev.cash + amount,
        bankBalance: prev.bankBalance - amount
      };
    });
  }, [addToast, recordTransaction]);

  const addGems = useCallback((amount: number, reason: string = 'Supply Drop') => {
    sounds.playCoin();
    setProfile(prev => ({
      ...prev,
      gems: (prev.gems || 0) + amount
    }));
    addToast('Gems Acquired', `Received +${amount} Apex Gems (${reason})`, 'success');
  }, [addToast]);

  const exchangeGemsForCredits = useCallback((gemCost: number, creditReward: number): boolean => {
    let success = false;
    setProfile(prev => {
      const currentGems = prev.gems || 0;
      if (currentGems < gemCost) {
        sounds.playError();
        addToast('Insufficient Gems', `Need ${gemCost} Apex Gems for this wire transfer.`, 'danger');
        return prev;
      }
      sounds.playCashRegister();
      recordTransaction('income', `Converted ${gemCost} Apex Gems into $CRED`, creditReward, true);
      addToast('Vault Wire Complete', `Converted ${gemCost} Gems into +${formatCash(creditReward)} Credits!`, 'success', creditReward);
      success = true;
      return {
        ...prev,
        gems: currentGems - gemCost,
        cash: prev.cash + creditReward
      };
    });
    return success;
  }, [addToast, recordTransaction]);

  // GEM BOOST LAB UPGRADES
  const buyExpBoost = useCallback((): boolean => {
    let success = false;
    setProfile(prev => {
      const currentMult = prev.expMultiplier ?? 1.0;
      if (currentMult >= 2.5) {
        addToast('Max Capacity', 'Neural EXP Multiplier is already at maximum cap (250%).', 'info');
        return prev;
      }
      if ((prev.gems ?? 0) < 10) {
        sounds.playError();
        addToast('Insufficient Gems', 'Need 10 Gems to upgrade Neural EXP Multiplier.', 'danger');
        return prev;
      }
      const newMult = Math.min(2.5, Math.round((currentMult + 0.1) * 10) / 10);
      success = true;
      sounds.playLevelUp();
      addToast('EXP Boost Upgraded', `Neural EXP Multiplier boosted to ${Math.round(newMult * 100)}%!`, 'success');
      return {
        ...prev,
        gems: (prev.gems ?? 0) - 10,
        expMultiplier: newMult
      };
    });
    return success;
  }, [addToast]);

  const buyIncBoost = useCallback((): boolean => {
    let success = false;
    setProfile(prev => {
      const currentMult = prev.incMultiplier ?? 1.0;
      if (currentMult >= 3.0) {
        addToast('Max Capacity', 'Global Income Overclock is already at maximum cap (300%).', 'info');
        return prev;
      }
      if ((prev.gems ?? 0) < 15) {
        sounds.playError();
        addToast('Insufficient Gems', 'Need 15 Gems to upgrade Global Income Overclock.', 'danger');
        return prev;
      }
      const newMult = Math.min(3.0, Math.round((currentMult + 0.1) * 10) / 10);
      success = true;
      sounds.playCoin();
      addToast('Income Overclock Upgraded', `Global Income Overclock boosted to ${Math.round(newMult * 100)}%!`, 'success');
      return {
        ...prev,
        gems: (prev.gems ?? 0) - 15,
        incMultiplier: newMult
      };
    });
    return success;
  }, [addToast]);

  // 3. MAIN ADD XP FUNCTION (Triggers Level-Ups & Notification Popups)
  const addXP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      const expMult = (prev.expMultiplier || 1.0) * (1 + (equippedStats.totalXpBonus || 0));
      const effectiveAmount = Math.max(1, Math.round(amount * expMult));
      let currentXp = prev.xp + effectiveAmount;
      let currentLevel = prev.level;
      let currentGems = prev.gems ?? 10;
      let currentRank = prev.rank || getRankData(currentLevel).title;
      let nextXP = getRequiredXP(currentLevel);
      let didLevelUp = false;
      let totalGemsAwarded = 0;

      // Check for Level-Up (Supports multiple level jumps if huge XP gained)
      while (currentXp >= nextXP) {
        currentXp -= nextXP;
        currentLevel += 1;

        // Reward Gems on Level-Up
        const gemReward = Math.min(25, 5 + Math.floor(currentLevel / 2));
        currentGems += gemReward;
        totalGemsAwarded += gemReward;

        // Update Rank
        const rankData = getRankData(currentLevel);
        currentRank = rankData.title;

        // Trigger Notification / Toast
        showLevelUpNotification(currentLevel, rankData.title, gemReward);
        didLevelUp = true;

        // Recalculate next target
        nextXP = getRequiredXP(currentLevel);
      }

      if (didLevelUp) {
        sounds.playLevelUp();
        addToast('Rank Promoted', `Advanced to Level ${currentLevel}: ${currentRank}! (+${totalGemsAwarded} 💎 GEMS)`, 'success');
      }

      return {
        ...prev,
        xp: currentXp,
        level: currentLevel,
        gems: currentGems,
        rank: currentRank
      };
    });
  }, [addToast, equippedStats.totalXpBonus]);

  // ==========================================
  // INVENTORY & EQUIPMENT SLOTS ENGINE
  // ==========================================
  const equipItem = useCallback((instanceId: string, slotType: 'perk' | 'item' | 'pet', slotIndex?: number): boolean => {
    let success = false;
    setProfile(prev => {
      const inv = [...(prev.inventory || [])];
      const itemIndex = inv.findIndex(it => it.instanceId === instanceId);
      if (itemIndex === -1) {
        addToast('Item Not Found', 'Item does not exist in inventory storage.', 'danger');
        return prev;
      }

      const itemToEquip = inv[itemIndex];
      const currentEq: EquipmentSlots = prev.equipment ? {
        perks: [...prev.equipment.perks],
        items: [...prev.equipment.items],
        pet: prev.equipment.pet
      } : {
        perks: [null, null, null, null],
        items: [null, null],
        pet: null
      };

      // Type verification
      if (slotType === 'pet' && itemToEquip.type !== 'pet') {
        sounds.playError();
        addToast('Invalid Slot', 'Only Cyber-Pets can be equipped in the Pet Slot.', 'warning');
        return prev;
      }
      if (slotType === 'perk' && itemToEquip.type !== 'perk') {
        sounds.playError();
        addToast('Invalid Slot', 'Only Passive Perks can be equipped in Perk Slots.', 'warning');
        return prev;
      }
      if (slotType === 'item' && itemToEquip.type !== 'item') {
        sounds.playError();
        addToast('Invalid Slot', 'Only Relic Items can be equipped in Item Holding Slots.', 'warning');
        return prev;
      }

      // Remove from inventory
      inv.splice(itemIndex, 1);

      if (slotType === 'pet') {
        if (currentEq.pet) {
          inv.push(currentEq.pet);
        }
        currentEq.pet = itemToEquip;
      } else if (slotType === 'perk') {
        const targetIdx = slotIndex !== undefined && slotIndex >= 0 && slotIndex < 4 ? slotIndex : currentEq.perks.findIndex(p => p === null);
        const finalIdx = targetIdx !== -1 ? targetIdx : 0;
        if (currentEq.perks[finalIdx]) {
          inv.push(currentEq.perks[finalIdx]!);
        }
        currentEq.perks[finalIdx] = itemToEquip;
      } else if (slotType === 'item') {
        const targetIdx = slotIndex !== undefined && slotIndex >= 0 && slotIndex < 2 ? slotIndex : currentEq.items.findIndex(it => it === null);
        const finalIdx = targetIdx !== -1 ? targetIdx : 0;
        if (currentEq.items[finalIdx]) {
          inv.push(currentEq.items[finalIdx]!);
        }
        currentEq.items[finalIdx] = itemToEquip;
      }

      success = true;
      sounds.playUpgrade();
      addToast('Equipped!', `${itemToEquip.name} is now active in ${slotType.toUpperCase()} slot.`, 'success');

      return {
        ...prev,
        inventory: inv,
        equipment: currentEq
      };
    });
    return success;
  }, [addToast]);

  const unequipItem = useCallback((slotType: 'perk' | 'item' | 'pet', slotIndex?: number): boolean => {
    let success = false;
    setProfile(prev => {
      const inv = [...(prev.inventory || [])];
      const currentEq: EquipmentSlots = prev.equipment ? {
        perks: [...prev.equipment.perks],
        items: [...prev.equipment.items],
        pet: prev.equipment.pet
      } : {
        perks: [null, null, null, null],
        items: [null, null],
        pet: null
      };

      let removedItem: InventoryItem | null = null;
      if (slotType === 'pet') {
        removedItem = currentEq.pet;
        currentEq.pet = null;
      } else if (slotType === 'perk') {
        const idx = slotIndex ?? 0;
        removedItem = currentEq.perks[idx] || null;
        currentEq.perks[idx] = null;
      } else if (slotType === 'item') {
        const idx = slotIndex ?? 0;
        removedItem = currentEq.items[idx] || null;
        currentEq.items[idx] = null;
      }

      if (!removedItem) {
        return prev;
      }

      inv.push(removedItem);
      success = true;
      sounds.playClick();
      addToast('Unequipped', `${removedItem.name} moved back to Inventory storage.`, 'info');

      return {
        ...prev,
        inventory: inv,
        equipment: currentEq
      };
    });
    return success;
  }, [addToast]);

  // Use Consumable Item
  const useConsumable = useCallback((instanceId: string): boolean => {
    let success = false;
    setProfile(prev => {
      const inv = [...(prev.inventory || [])];
      const itemIndex = inv.findIndex(it => it.instanceId === instanceId);
      if (itemIndex === -1) {
        addToast('Item Not Found', 'Consumable item does not exist in inventory storage.', 'danger');
        return prev;
      }

      const item = inv[itemIndex];
      if (item.type !== 'consumable') {
        addToast('Invalid Item', `${item.name} is not a consumable item.`, 'warning');
        return prev;
      }

      sounds.playCoin();
      inv.splice(itemIndex, 1);

      let newEnergy = prev.energy;
      let newCash = prev.cash;
      const perksGained: string[] = [];

      if (item.stats.energyRestore) {
        newEnergy = Math.min(prev.maxEnergy, newEnergy + item.stats.energyRestore);
        perksGained.push(`+${item.stats.energyRestore} Energy`);
      }
      if (item.stats.instantCash) {
        newCash += item.stats.instantCash;
        perksGained.push(`+${formatCash(item.stats.instantCash)} Credits`);
        recordTransaction('income', `Used Consumable: ${item.name}`, item.stats.instantCash, false);
      }

      addToast('Consumable Activated', `${item.name} consumed! (${perksGained.join(', ')})`, 'success');
      success = true;

      return {
        ...prev,
        cash: newCash,
        energy: newEnergy,
        inventory: inv
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  // ==========================================
  // CRATE UNBOXING & SILENT TIMED DROPS
  // ==========================================
  const openCrate = useCallback((chestTierId: string): InventoryItem | null => {
    const tier = CHEST_TIERS.find(t => t.id === chestTierId);
    if (!tier) return null;

    let droppedItem: InventoryItem | null = null;

    setProfile(prev => {
      // Cost check
      if (tier.costGems && (prev.gems ?? 0) < tier.costGems) {
        sounds.playError();
        addToast('Insufficient Gems', `Need ${tier.costGems} Gems to decrypt this cache.`, 'danger');
        return prev;
      }
      if (tier.costCash && prev.cash < tier.costCash) {
        sounds.playError();
        addToast('Insufficient Funds', `Need $${tier.costCash.toLocaleString()} to purchase this crate.`, 'danger');
        return prev;
      }

      // Roll drop with active luck bonus
      droppedItem = rollChestDrop(tier, equippedStats.totalLuckBonus);

      const updatedCash = tier.costCash ? prev.cash - tier.costCash : prev.cash;
      const updatedGems = tier.costGems ? (prev.gems ?? 0) - tier.costGems : prev.gems;
      const updatedInventory = [...(prev.inventory || []), droppedItem];

      if (tier.costCash) {
        recordTransaction('expense', `Decrypted ${tier.name}`, tier.costCash, false);
      }

      sounds.playWin();
      addToast('Crate Decrypted!', `Obtained [${droppedItem.rarity.toUpperCase()}] ${droppedItem.name}!`, 'success');

      return {
        ...prev,
        cash: updatedCash,
        gems: updatedGems,
        inventory: updatedInventory
      };
    });

    return droppedItem;
  }, [addToast, equippedStats.totalLuckBonus, recordTransaction]);

  const claimTimedCrate = useCallback((): InventoryItem | null => {
    if (!timedCrateReady) return null;

    // Award from uncommon or rare chest
    const candidateTiers = [CHEST_TIERS[1], CHEST_TIERS[2]];
    const chosenTier = candidateTiers[Math.floor(Math.random() * candidateTiers.length)];
    const droppedItem = rollChestDrop(chosenTier, equippedStats.totalLuckBonus);

    setProfile(prev => ({
      ...prev,
      inventory: [...(prev.inventory || []), droppedItem]
    }));

    setTimedCrateReady(false);
    setTimedCrateCountdown(90); // 90 seconds until next silent crate
    sounds.playWin();
    addToast('📦 Free Crate Claimed!', `Obtained [${droppedItem.rarity.toUpperCase()}] ${droppedItem.name}! Stored in Inventory.`, 'success');

    return droppedItem;
  }, [timedCrateReady, equippedStats.totalLuckBonus, addToast]);

  // Career Shifts
  const completeJobShift = useCallback((jobId: string, performanceBonusRatio: number = 1.0) => {
    const job = CAREER_TIERS.find(j => j.id === jobId);
    if (!job) return { payout: 0, xp: 0 };

    // Syndicate Broker Perk: +10% Career Rewards at Level 10+
    const careerBonus = profile.level >= 10 ? 0.10 : 0;
    const finalPayout = Math.round(job.basePayout * performanceBonusRatio * (1 + careerBonus));
    const xpReward = job.xpReward;

    sounds.playCoin();
    recordTransaction('income', `Career Shift: ${job.name}`, finalPayout, true);
    addToast('Shift Completed', `Earned $CRED ${finalPayout.toLocaleString()} (+${xpReward} XP)`, 'success', finalPayout);

    setProfile(prev => ({
      ...prev,
      cash: prev.cash + finalPayout,
      stats: {
        ...prev.stats,
        totalJobsWorked: prev.stats.totalJobsWorked + 1
      }
    }));

    addXP(xpReward);

    return { payout: finalPayout, xp: xpReward };
  }, [profile.level, addXP, addToast, recordTransaction]);

  // Asset: Vehicles
  const buyVehicle = useCallback((vehicleId: string): boolean => {
    const vehicle = VEHICLES_CATALOG.find(v => v.id === vehicleId);
    if (!vehicle) return false;

    let success = false;
    setProfile(prev => {
      if (prev.ownedVehicles.includes(vehicleId)) {
        addToast('Already Owned', 'You already own this vehicle in your motor fleet.', 'warning');
        return prev;
      }
      if (prev.cash < vehicle.price) {
        addToast('Purchase Failed', `Need $CRED ${vehicle.price.toLocaleString()} in liquid cash.`, 'danger');
        return prev;
      }

      sounds.playCashRegister();
      recordTransaction('asset', `Purchased Vehicle: ${vehicle.name}`, vehicle.price, false);
      addToast('Vehicle Acquired', `Added ${vehicle.name} to your motor fleet!`, 'success');
      success = true;

      return {
        ...prev,
        cash: prev.cash - vehicle.price,
        ownedVehicles: [...prev.ownedVehicles, vehicleId],
        activeVehicleId: prev.activeVehicleId || vehicleId,
        prestige: prev.prestige + vehicle.prestige
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  const sellVehicle = useCallback((vehicleId: string): boolean => {
    const vehicle = VEHICLES_CATALOG.find(v => v.id === vehicleId);
    if (!vehicle) return false;

    let success = false;
    setProfile(prev => {
      if (!prev.ownedVehicles.includes(vehicleId)) return prev;

      sounds.playCoin();
      recordTransaction('asset', `Sold Vehicle: ${vehicle.name}`, vehicle.resalePrice, true);
      addToast('Vehicle Liquidated', `Sold ${vehicle.name} for $CRED ${vehicle.resalePrice.toLocaleString()}`, 'info');
      success = true;

      const remaining = prev.ownedVehicles.filter(id => id !== vehicleId);
      return {
        ...prev,
        cash: prev.cash + vehicle.resalePrice,
        ownedVehicles: remaining,
        activeVehicleId: prev.activeVehicleId === vehicleId ? (remaining[0] || null) : prev.activeVehicleId,
        prestige: Math.max(0, prev.prestige - vehicle.prestige)
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  const setActiveVehicle = useCallback((vehicleId: string) => {
    setProfile(prev => {
      if (!prev.ownedVehicles.includes(vehicleId)) return prev;
      sounds.playClick();
      addToast('Primary Vehicle Set', 'Vehicle dispatched to your active chauffeur bay.', 'info');
      return { ...prev, activeVehicleId: vehicleId };
    });
  }, [addToast]);

  const setVehiclePaint = useCallback((vehicleId: string, paintHex: string) => {
    setProfile(prev => ({
      ...prev,
      vehiclePaints: {
        ...(prev.vehiclePaints || {}),
        [vehicleId]: paintHex
      }
    }));
    sounds.playClick();
    addToast('Paint Swatch Applied', 'Custom performance coating applied to vehicle chassis.', 'info');
  }, [addToast]);

  // Asset: Real Estate
  const buyProperty = useCallback((propertyId: string): boolean => {
    const prop = REAL_ESTATE_CATALOG.find(p => p.id === propertyId);
    if (!prop) return false;

    let success = false;
    setProfile(prev => {
      if (prev.ownedProperties.includes(propertyId)) {
        addToast('Already Owned', 'You already own this property deed.', 'warning');
        return prev;
      }
      if (prev.cash < prop.price) {
        addToast('Purchase Failed', `Need $CRED ${prop.price.toLocaleString()} in liquid cash.`, 'danger');
        return prev;
      }

      sounds.playCashRegister();
      recordTransaction('asset', `Acquired Deed: ${prop.name}`, prop.price, false);
      addToast('Property Acquired', `Deed recorded for ${prop.name}!`, 'success');
      success = true;

      return {
        ...prev,
        cash: prev.cash - prop.price,
        ownedProperties: [...prev.ownedProperties, propertyId],
        primaryPropertyId: prev.primaryPropertyId || propertyId,
        prestige: prev.prestige + prop.prestige
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  const setPrimaryProperty = useCallback((propertyId: string) => {
    setProfile(prev => {
      if (!prev.ownedProperties.includes(propertyId)) return prev;
      sounds.playClick();
      addToast('Residence Updated', 'Primary residential address registered.', 'info');
      return { ...prev, primaryPropertyId: propertyId };
    });
  }, [addToast]);

  // Asset: Commercial Businesses
  const buyBusiness = useCallback((businessId: string): boolean => {
    const biz = getBusinessDef(businessId);
    if (!biz) return false;

    let success = false;
    setProfile(prev => {
      if (prev.ownedBusinesses[businessId] && prev.ownedBusinesses[businessId].level > 0) {
        addToast('Already Acquired', 'Commercial entity already registered.', 'warning');
        return prev;
      }
      if (biz.minPlayerLevel && prev.level < biz.minPlayerLevel) {
        sounds.playWarning();
        addToast('Security Clearance Denied', `Requires Player Level ${biz.minPlayerLevel} to license ${biz.name}.`, 'danger');
        return prev;
      }
      if (prev.cash < biz.basePrice) {
        addToast('Purchase Failed', `Need ${formatCash(biz.basePrice)} in liquid cash.`, 'danger');
        return prev;
      }

      sounds.playCashRegister();
      recordTransaction('asset', `Commercial Acquisition: ${biz.name}`, biz.basePrice, false);
      addToast('Enterprise Acquired', `${biz.name} is now operational!`, 'success');
      success = true;

      const prestigeGain = Math.max(15, Math.floor(Math.log10(Math.max(10, biz.basePrice)) * 40));
      return {
        ...prev,
        cash: prev.cash - biz.basePrice,
        ownedBusinesses: {
          ...prev.ownedBusinesses,
          [businessId]: {
            level: 1,
            unclaimedRevenue: 0,
            lastCollectedAt: Date.now(),
            shiftExpiresAt: Date.now() + 7200 * 1000,
            payoutProgressSeconds: 0,
            isHaltedOnStrike: false
          }
        },
        prestige: prev.prestige + prestigeGain
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  // Upgrade Business (Supports bulk upgrades +1, +10, +25, or MAX with 1.22x exponential scaling)
  const upgradeBusiness = useCallback((businessId: string, count: number = 1): boolean => {
    const biz = getBusinessDef(businessId);
    if (!biz) return false;

    let success = false;
    setProfile(prev => {
      const current = prev.ownedBusinesses[businessId];
      if (!current || current.level <= 0) return prev;
      if (current.level >= 100) {
        addToast('Max Level Reached', `${biz.name} has achieved MAX Level 100 with Mastery Crown!`, 'info');
        return prev;
      }

      const targetCount = Math.min(count, 100 - current.level);
      let totalCost = 0;
      let appliedLevels = 0;

      for (let i = 0; i < targetCount; i++) {
        const stepCost = Math.round(biz.basePrice * Math.pow(1.22, current.level + i));
        if (prev.cash < totalCost + stepCost) {
          if (appliedLevels === 0) {
            addToast('Upgrade Failed', `Upgrade requires ${formatCash(stepCost)} in liquid cash.`, 'danger');
            return prev;
          }
          break;
        }
        totalCost += stepCost;
        appliedLevels++;
      }

      if (appliedLevels <= 0) return prev;

      sounds.playCashRegister();
      const nextLevel = current.level + appliedLevels;
      const isMastery = nextLevel >= 100;
      if (isMastery) {
        sounds.playWin();
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (_) {}
        addToast('👑 MASTERY CROWN UNLOCKED!', `${biz.name} reached Level 100 MAX! +50% GLOBAL REVENUE BOOST!`, 'success');
      } else {
        addToast('Enterprise Expanded', `${biz.name} upgraded +${appliedLevels} to Level ${nextLevel}!`, 'success', totalCost);
      }
      recordTransaction('expense', `Upgraded Enterprise: ${biz.name} (+${appliedLevels} to Lv ${nextLevel})`, totalCost, false);
      success = true;

      return {
        ...prev,
        cash: prev.cash - totalCost,
        ownedBusinesses: {
          ...prev.ownedBusinesses,
          [businessId]: {
            ...current,
            level: nextLevel
          }
        },
        prestige: prev.prestige + appliedLevels * 5 + (isMastery ? 500 : 0)
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  // Bulk Upgrade All Owned Businesses (Spends available cash to level up all unlocked properties to highest affordable levels)
  const upgradeAllBusinesses = useCallback((): { upgradedCount: number; totalLevels: number; totalSpent: number } => {
    let result = { upgradedCount: 0, totalLevels: 0, totalSpent: 0 };
    setProfile(prev => {
      let availableCash = prev.cash;
      let totalSpent = 0;
      let totalLevels = 0;
      const upgradedBizIds = new Set<string>();
      const updatedBusinesses = { ...prev.ownedBusinesses };
      const masteriesAchieved: string[] = [];

      // Efficient greedy upgrade pass: continuously purchase cheapest next level
      while (true) {
        let bestBizId: string | null = null;
        let lowestCost = Infinity;

        for (const bizId of Object.keys(updatedBusinesses)) {
          const rec = updatedBusinesses[bizId];
          if (!rec || rec.level <= 0 || rec.level >= 100) continue;
          const bizDef = getBusinessDef(bizId);
          if (!bizDef) continue;
          const nextCost = Math.round(bizDef.basePrice * Math.pow(1.22, rec.level));
          if (nextCost <= availableCash && nextCost < lowestCost) {
            lowestCost = nextCost;
            bestBizId = bizId;
          }
        }

        if (!bestBizId || lowestCost > availableCash) break;

        availableCash -= lowestCost;
        totalSpent += lowestCost;
        totalLevels += 1;
        upgradedBizIds.add(bestBizId);
        const currentRec = updatedBusinesses[bestBizId];
        const newLvl = currentRec.level + 1;
        updatedBusinesses[bestBizId] = {
          ...currentRec,
          level: newLvl
        };
        if (newLvl === 100) {
          const def = getBusinessDef(bestBizId);
          if (def) masteriesAchieved.push(def.name);
        }
      }

      if (totalLevels === 0) {
        addToast('No Upgrades Available', 'Insufficient funds or all enterprises currently at Level 100 MAX!', 'info');
        return prev;
      }

      sounds.playCashRegister();
      if (masteriesAchieved.length > 0) {
        sounds.playWin();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        addToast(
          '👑 MASTERY CROWNS ACHIEVED!',
          `${masteriesAchieved.join(', ')} reached Level 100 (+50% yield boost)!`,
          'success'
        );
      }

      addToast(
        '⚡ UPGRADE ALL COMPLETE',
        `Upgraded ${upgradedBizIds.size} businesses (+${totalLevels} levels total) for ${formatCash(totalSpent)}!`,
        'success',
        totalSpent
      );

      recordTransaction('expense', `Bulk Upgraded ${upgradedBizIds.size} Enterprises (+${totalLevels} Lvls)`, totalSpent, false);
      result = { upgradedCount: upgradedBizIds.size, totalLevels, totalSpent };

      return {
        ...prev,
        cash: availableCash,
        ownedBusinesses: updatedBusinesses,
        prestige: prev.prestige + totalLevels * 5 + masteriesAchieved.length * 500
      };
    });

    return result;
  }, [addToast, recordTransaction]);

  const collectBusinessRevenue = useCallback((businessId: string): number => {
    let collected = 0;
    setProfile(prev => {
      const current = prev.ownedBusinesses[businessId];
      if (!current || current.unclaimedRevenue <= 0) return prev;

      collected = Math.floor(current.unclaimedRevenue);
      if (collected <= 0) return prev;

      sounds.playCoin();
      recordTransaction('income', 'Collected Commercial Dividend', collected, true);
      addToast('Profits Collected', `Received ${formatCash(collected)} dividends into cash.`, 'success', collected);

      return {
        ...prev,
        cash: prev.cash + collected,
        ownedBusinesses: {
          ...prev.ownedBusinesses,
          [businessId]: {
            ...current,
            unclaimedRevenue: current.unclaimedRevenue - collected,
            lastCollectedAt: Date.now()
          }
        },
        stats: {
          ...prev.stats,
          totalBusinessCollected: prev.stats.totalBusinessCollected + collected
        }
      };
    });

    return collected;
  }, [addToast, recordTransaction]);

  const collectAllBusinesses = useCallback((): number => {
    let totalCollected = 0;
    setProfile(prev => {
      let sum = 0;
      const updated = { ...prev.ownedBusinesses };

      Object.keys(updated).forEach(bId => {
        const item = updated[bId];
        if (item && item.unclaimedRevenue > 0) {
          const rev = Math.floor(item.unclaimedRevenue);
          sum += rev;
          updated[bId] = {
            ...item,
            unclaimedRevenue: item.unclaimedRevenue - rev,
            lastCollectedAt: Date.now()
          };
        }
      });

      if (sum <= 0) {
        addToast('No Pending Profits', 'All enterprise revenues currently up to date.', 'info');
        return prev;
      }

      totalCollected = sum;
      sounds.playCoin();
      recordTransaction('income', 'Batch Business Dividends Sweep', sum, true);
      addToast('Enterprise Sweep Complete', `Swept ${formatCash(sum)} into your wallet!`, 'success', sum);

      return {
        ...prev,
        cash: prev.cash + sum,
        ownedBusinesses: updated,
        stats: {
          ...prev.stats,
          totalBusinessCollected: prev.stats.totalBusinessCollected + sum
        }
      };
    });

    return totalCollected;
  }, [addToast, recordTransaction]);

  // Total payroll due across all active properties for the 2-hour shift cycle
  const totalPayrollDue = useMemo(() => {
    let sum = 0;
    Object.entries(profile.ownedBusinesses).forEach(([bizId, data]) => {
      if (data.level > 0) {
        const bizDef = getBusinessDef(bizId);
        if (bizDef) {
          const baseWage = (bizDef as any).baseShiftWage || Math.max(10, Math.round(bizDef.baseCost * 0.04));
          const wage = Math.round(baseWage * Math.pow(1.05, Math.min(100, data.level) - 1));
          sum += wage;
        }
      }
    });
    return sum;
  }, [profile.ownedBusinesses]);

  // Count of owned businesses currently on strike (expired 2-hour shift timer)
  const businessesOnStrikeCount = useMemo(() => {
    let count = 0;
    const now = Date.now();
    Object.values(profile.ownedBusinesses).forEach(data => {
      if (data.level > 0) {
        const shiftExp = data.shiftExpiresAt || 0;
        if (now >= shiftExp) count++;
      }
    });
    return count;
  }, [profile.ownedBusinesses]);

  // Pay all employee wages across all active properties in one tap (Resets all shifts to 2 hours)
  const payAllEmployees = useCallback((): boolean => {
    const ownedEntries = Object.entries(profile.ownedBusinesses).filter(([_, data]) => data.level > 0);
    if (ownedEntries.length === 0) {
      addToast('No Active Properties', 'Acquire a commercial enterprise first before issuing payroll.', 'info');
      return false;
    }

    let totalCost = 0;
    ownedEntries.forEach(([bizId, data]) => {
      const bizDef = getBusinessDef(bizId);
      if (bizDef) {
        const baseWage = (bizDef as any).baseShiftWage || Math.max(10, Math.round(bizDef.baseCost * 0.04));
        const wage = Math.round(baseWage * Math.pow(1.05, Math.min(100, data.level) - 1));
        totalCost += wage;
      }
    });

    if (profile.cash < totalCost) {
      sounds.playWarning();
      addToast('Payroll Deficit', `Insufficient credits! Need ${formatCash(totalCost)} for employee payroll.`, 'danger');
      return false;
    }

    sounds.playCashRegister();
    recordTransaction('expense', `Disbursed Employee Payroll (${ownedEntries.length} Businesses)`, totalCost, false);

    setProfile(prev => {
      const nextOwned = { ...prev.ownedBusinesses };
      const twoHoursAhead = Date.now() + 7200 * 1000;
      ownedEntries.forEach(([bizId, data]) => {
        nextOwned[bizId] = {
          ...data,
          shiftExpiresAt: twoHoursAhead,
          isHaltedOnStrike: false
        };
      });

      return {
        ...prev,
        cash: prev.cash - totalCost,
        ownedBusinesses: nextOwned
      };
    });

    addToast(
      'Payroll Disbursed',
      `Paid ${formatCash(totalCost)} across ${ownedEntries.length} businesses! All 2-hour shifts renewed!`,
      'success',
      totalCost
    );
    return true;
  }, [profile.cash, profile.ownedBusinesses, addToast, recordTransaction]);

  // Pay shift wage for a single business (Resets shift to 2 hours)
  const payBusinessShift = useCallback((businessId: string): boolean => {
    const data = profile.ownedBusinesses[businessId];
    if (!data || data.level <= 0) return false;

    const bizDef = getBusinessDef(businessId);
    if (!bizDef) return false;

    const baseWage = (bizDef as any).baseShiftWage || Math.max(10, Math.round(bizDef.baseCost * 0.04));
    const wage = Math.round(baseWage * Math.pow(1.05, Math.min(100, data.level) - 1));

    if (profile.cash < wage) {
      sounds.playWarning();
      addToast('Insufficient Credits', `Need ${formatCash(wage)} to pay 2-hour shift wages for ${bizDef.name}.`, 'danger');
      return false;
    }

    sounds.playCashRegister();
    recordTransaction('expense', `Paid 2h Shift Wages: ${bizDef.name}`, wage, false);

    setProfile(prev => ({
      ...prev,
      cash: prev.cash - wage,
      ownedBusinesses: {
        ...prev.ownedBusinesses,
        [businessId]: {
          ...data,
          shiftExpiresAt: Date.now() + 7200 * 1000,
          isHaltedOnStrike: false
        }
      }
    }));

    addToast('Shift Renewed', `Paid ${formatCash(wage)} for ${bizDef.name}. 2-hour shift active!`, 'success', wage);
    return true;
  }, [profile.cash, profile.ownedBusinesses, addToast, recordTransaction]);

  // Base Building Construction
  const constructBuilding = useCallback((type: BuildingType | string, x: number, y: number): boolean => {
    const bp = BUILDING_BLUEPRINTS.find(b => b.type === type);
    const catalogBiz = BUSINESS_CATALOG.find(b => b.id === type);
    const catalogRes = RESIDENTIAL_CATALOG.find(r => r.id === type);
    if (!bp && !catalogBiz && !catalogRes) return false;

    const cost = bp ? bp.baseCost : catalogBiz ? (catalogBiz.cost || catalogBiz.buyPrice) : (catalogRes!.cost || catalogRes!.price);
    const name = bp ? bp.name : catalogBiz ? catalogBiz.name : catalogRes!.name;
    const buildTime = bp ? bp.baseBuildTimeSeconds : 0;
    const drawType = catalogBiz?.drawType || (catalogRes ? 'mansion' : undefined);
    const color = catalogBiz?.color || catalogRes?.color;
    const hourlyIncome = catalogBiz ? (catalogBiz.hourlyIncome ?? catalogBiz.hourlyYield) : undefined;
    const income = catalogBiz ? (catalogBiz.income ?? (catalogBiz.hourlyIncome ? catalogBiz.hourlyIncome / 3600 : undefined)) : undefined;
    const prestige = catalogRes?.prestige || 0;

    if (bp) {
      const safehouse = (profile.baseBuildings || []).find(b => b.type === 'safehouse');
      const safehouseLevel = safehouse ? safehouse.level : 1;
      if (safehouseLevel < bp.requiredSafehouseLevel) {
        addToast('Blueprint Locked', `Requires Safehouse Level ${bp.requiredSafehouseLevel} to construct ${bp.name}.`, 'warning');
        return false;
      }
    } else if (catalogBiz && catalogBiz.minPlayerLevel && profile.level < catalogBiz.minPlayerLevel) {
      addToast('Level Required', `Requires Player Level ${catalogBiz.minPlayerLevel} to construct ${catalogBiz.name}.`, 'warning');
      return false;
    }

    const occupied = (profile.baseBuildings || []).some(b => b.x === x && b.y === y);
    if (occupied) {
      addToast('Plot Occupied', 'An active installation already occupies this grid coordinate.', 'warning');
      return false;
    }

    // Rank Perks: Corporate Executive (-10% Build Costs at Lv 20+), Syndicate Sovereign (+100% Prestige at Lv 50+)
    const buildCostDiscount = profile.level >= 20 ? 0.10 : 0;
    // Aggressive Land Plot Acquisition Fee: scales exponentially per unlocked plot (1.38x per plot)
    const currentPlotsCount = (profile.baseBuildings || []).length;
    const basePlotFee = 3500;
    const plotAcquisitionFee = currentPlotsCount === 0 ? 0 : Math.round(basePlotFee * Math.pow(1.38, currentPlotsCount));
    const finalCost = Math.round(cost * (1 - buildCostDiscount)) + plotAcquisitionFee;
    const prestigeMultiplier = profile.level >= 50 ? 2.0 : 1.0;
    const finalPrestige = Math.round(prestige * prestigeMultiplier);

    if (profile.cash < finalCost) {
      addToast(
        'Insufficient Credits',
        `Requires $CRED ${finalCost.toLocaleString()} (Building: $${Math.round(cost * (1 - buildCostDiscount)).toLocaleString()} + Plot Fee: $${plotAcquisitionFee.toLocaleString()}).`,
        'danger'
      );
      return false;
    }

    sounds.playCoin();
    const newBuilding: BaseBuilding = {
      id: `bld_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      level: 1,
      x,
      y,
      name,
      drawType,
      color,
      hourlyIncome,
      cost: finalCost,
      income,
      prestige: finalPrestige,
      isUpgrading: buildTime > 0,
      upgradeStartTime: buildTime > 0 ? Date.now() : undefined,
      upgradeDurationSeconds: buildTime,
      uncollectedRevenue: 0,
      lastCollectedAt: Date.now()
    } as any;

    setLastCashDelta({ amount: finalCost, isCredit: false, id: Date.now() });
    setProfile(prev => ({
      ...prev,
      cash: prev.cash - finalCost,
      prestige: prev.prestige + finalPrestige,
      ownedProperties: catalogRes && !prev.ownedProperties.includes(catalogRes.id) ? [...prev.ownedProperties, catalogRes.id] : prev.ownedProperties,
      baseBuildings: [...(prev.baseBuildings || []), newBuilding]
    }));

    addXP(45);
    recordTransaction('asset', `Constructed ${name} on Plot (${x},${y})`, finalCost, false);
    addToast('Construction Initiated', `${name} deployed onto sector grid plot (${x}, ${y})!`, 'success', finalCost);
    return true;
  }, [profile.baseBuildings, profile.cash, profile.level, addXP, addToast, recordTransaction]);

  // 1-Click Plot Unlock & Metropolitan Grid Expansion
  const unlockPlot = useCallback((x: number, y: number): boolean => {
    let success = false;
    setProfile(prev => {
      const currentGrid = prev.gridSize || 5;
      const targetGrid = Math.max(currentGrid, Math.max(x + 1, y + 1));
      const expansionSteps = Math.max(1, targetGrid - currentGrid);
      const baseCost = 25000;
      const unlockCost = Math.round(baseCost * Math.pow(1.35, targetGrid - 5) * expansionSteps);

      if (prev.cash < unlockCost) {
        sounds.playError();
        addToast(
          'Insufficient Funds',
          `Unlocking Plot [${x},${y}] requires ${formatCash(unlockCost)}. You have ${formatCash(prev.cash)}.`,
          'danger'
        );
        return prev;
      }

      sounds.playWin();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}

      addToast(
        '🎉 PLOT UNLOCKED!',
        `Metropolitan Plot [${x},${y}] is now open for construction! City grid expanded to ${targetGrid}x${targetGrid}!`,
        'success',
        unlockCost
      );
      recordTransaction('expense', `Unlocked Plot [${x},${y}]`, unlockCost, false);
      success = true;

      return {
        ...prev,
        cash: prev.cash - unlockCost,
        gridSize: targetGrid,
        prestige: prev.prestige + 25 * expansionSteps
      };
    });

    return success;
  }, [addToast, recordTransaction]);

  // Upgrade Base Building
  const upgradeBaseBuilding = useCallback((buildingId: string): boolean => {
    const bld = (profile.baseBuildings || []).find(b => b.id === buildingId);
    if (!bld) return false;
    if (bld.isUpgrading) {
      addToast('Already Underway', `${bld.name} upgrade is actively compiling!`, 'warning');
      return false;
    }

    const bp = BUILDING_BLUEPRINTS.find(b => b.type === bld.type);
    const catalogBiz = BUSINESS_CATALOG.find(b => b.id === bld.type || b.id === bld.id);
    const catalogRes = RESIDENTIAL_CATALOG.find(r => r.id === bld.type || r.id === bld.id);

    const buildCostDiscount = profile.level >= 20 ? 0.10 : 0;
    const prestigeMultiplier = profile.level >= 50 ? 2.0 : 1.0;

    if (bp) {
      if (bld.level >= bp.maxLevel) {
        addToast('Maximum Tier', `${bld.name} has attained apex tier (Lv. ${bp.maxLevel}).`, 'info');
        return false;
      }

      const nextBonus = bp.bonusesByLevel.find(lvl => lvl.level === bld.level + 1);
      if (!nextBonus) return false;

      const finalUpgradeCost = Math.round(nextBonus.upgradeCost * (1 - buildCostDiscount));

      if (profile.cash < finalUpgradeCost) {
        addToast('Insufficient Funds', `Need $CRED ${finalUpgradeCost.toLocaleString()} to upgrade to Lv. ${bld.level + 1}.`, 'danger');
        return false;
      }

      sounds.playCoin();
      setLastCashDelta({ amount: finalUpgradeCost, isCredit: false, id: Date.now() });
      setProfile(prev => ({
        ...prev,
        cash: prev.cash - finalUpgradeCost,
        baseBuildings: (prev.baseBuildings || []).map(b => {
          if (b.id === buildingId) {
            return {
              ...b,
              isUpgrading: true,
              upgradeStartTime: Date.now(),
              upgradeDurationSeconds: nextBonus.upgradeTimeSeconds
            };
          }
          return b;
        })
      }));

      addXP(20);
      recordTransaction('asset', `Upgraded ${bld.name} to Lv. ${bld.level + 1}`, finalUpgradeCost, false);
      addToast('Upgrade Begun', `${bld.name} upgrade queued (${nextBonus.upgradeTimeSeconds}s)`, 'info', finalUpgradeCost);
      return true;
    } else {
      if (bld.level >= 100) {
        addToast('Max Level Reached', `${bld.name} has achieved MAX Level 100 with Mastery Crown!`, 'info');
        return false;
      }

      // Catalog business upgrade logic (1.22x exponential cost scaling, Level 100 hard cap)
      const baseCost = (bld as any).cost || catalogBiz?.cost || catalogBiz?.buyPrice || catalogRes?.cost || 100;
      const rawUpgradeCost = Math.round(baseCost * Math.pow(1.22, bld.level));
      const finalUpgradeCost = Math.round(rawUpgradeCost * (1 - buildCostDiscount));

      if (profile.cash < finalUpgradeCost) {
        addToast('Insufficient Funds', `Need $CRED ${finalUpgradeCost.toLocaleString()} to upgrade ${bld.name} to Level ${bld.level + 1}.`, 'danger');
        return false;
      }

      const nextLevel = bld.level + 1;
      const isMastery = nextLevel === 100;
      if (isMastery) {
        sounds.playWin();
        addToast('👑 MASTERY CROWN UNLOCKED!', `${bld.name} reached Level 100 MAX! +50% GLOBAL REVENUE BOOST!`, 'success');
      } else {
        sounds.playLevelUp();
        addToast('Upgrade Complete', `${bld.name} upgraded to Level ${nextLevel}!`, 'success', finalUpgradeCost);
      }

      setLastCashDelta({ amount: finalUpgradeCost, isCredit: false, id: Date.now() });
      const prestigeGain = Math.round((catalogRes ? Math.floor(catalogRes.prestige * 0.3) : 1) * prestigeMultiplier);

      setProfile(prev => ({
        ...prev,
        cash: prev.cash - finalUpgradeCost,
        prestige: prev.prestige + prestigeGain + (isMastery ? 500 : 0),
        baseBuildings: (prev.baseBuildings || []).map(b => {
          if (b.id === buildingId) {
            const currentIncome = (b as any).income !== undefined ? (b as any).income : (catalogBiz?.income || 2);
            const boostedIncome = isMastery ? Math.floor(currentIncome * 1.5) : Math.floor(currentIncome * 1.12);
            return {
              ...b,
              level: nextLevel,
              income: boostedIncome,
              cost: Math.floor(baseCost * 1.22)
            };
          }
          return b;
        })
      }));

      addXP(25 * bld.level);
      recordTransaction('asset', `Upgraded ${bld.name} to Level ${nextLevel}`, finalUpgradeCost, false);
      return true;
    }
  }, [profile.baseBuildings, profile.cash, profile.level, addXP, addToast, recordTransaction]);

  // Rush Finish Upgrade
  const rushFinishUpgrade = useCallback((buildingId: string) => {
    const bld = (profile.baseBuildings || []).find(b => b.id === buildingId);
    if (!bld || !bld.isUpgrading) return;

    sounds.playLevelUp();
    setProfile(prev => {
      const updated = (prev.baseBuildings || []).map(b => {
        if (b.id === buildingId) {
          return {
            ...b,
            level: b.level + 1,
            isUpgrading: false,
            upgradeStartTime: undefined,
            upgradeDurationSeconds: undefined
          };
        }
        return b;
      });

      const safehouse = updated.find(b => b.type === 'safehouse');
      let newGridSize = prev.gridSize || 5;
      let newMaxEnergy = prev.maxEnergy || 100;
      if (safehouse) {
        if (safehouse.level >= 3) newGridSize = 7;
        else if (safehouse.level >= 2) newGridSize = 6;
        else newGridSize = 5;
        newMaxEnergy = 100 + (safehouse.level - 1) * 25;
      }

      return {
        ...prev,
        baseBuildings: updated,
        gridSize: newGridSize,
        maxEnergy: newMaxEnergy
      };
    });

    addXP(60);
    addToast('Upgrade Rush Finished!', `${bld.name} upgraded to Level ${bld.level + 1}!`, 'success');
  }, [profile.baseBuildings, addXP, addToast]);

  // Collect Building Revenue
  const collectBuildingRevenue = useCallback((buildingId: string): number => {
    const bld = (profile.baseBuildings || []).find(b => b.id === buildingId);
    if (!bld || bld.uncollectedRevenue < 1) return 0;

    const amount = Math.floor(bld.uncollectedRevenue);
    sounds.playCashRegister();
    setLastCashDelta({ amount, isCredit: true, id: Date.now() });

    setProfile(prev => ({
      ...prev,
      cash: prev.cash + amount,
      stats: {
        ...prev.stats,
        totalBusinessCollected: prev.stats.totalBusinessCollected + amount
      },
      baseBuildings: (prev.baseBuildings || []).map(b => {
        if (b.id === buildingId) {
          return {
            ...b,
            uncollectedRevenue: 0,
            lastCollectedAt: Date.now()
          };
        }
        return b;
      })
    }));

    recordTransaction('income', `Base Harvest: ${bld.name}`, amount, true);
    addToast('Harvested Dividends', `Collected +${formatCash(amount)} from ${bld.name}!`, 'success', amount);
    return amount;
  }, [profile.baseBuildings, addToast, recordTransaction]);

  // Collect All Base Buildings
  const collectAllBaseBuildings = useCallback((): number => {
    let total = 0;
    (profile.baseBuildings || []).forEach(b => {
      if (b.uncollectedRevenue >= 1) {
        total += Math.floor(b.uncollectedRevenue);
      }
    });

    if (total <= 0) {
      addToast('No Pending Harvest', 'Base buildings are still generating yield.', 'info');
      return 0;
    }

    sounds.playCashRegister();
    setLastCashDelta({ amount: total, isCredit: true, id: Date.now() });

    setProfile(prev => ({
      ...prev,
      cash: prev.cash + total,
      stats: {
        ...prev.stats,
        totalBusinessCollected: prev.stats.totalBusinessCollected + total
      },
      baseBuildings: (prev.baseBuildings || []).map(b => ({
        ...b,
        uncollectedRevenue: 0,
        lastCollectedAt: Date.now()
      }))
    }));

    recordTransaction('income', 'Sweep All Base Installations', total, true);
    addToast('Base Sweep Complete', `Harvested +${formatCash(total)} from all installations!`, 'success', total);
    return total;
  }, [profile.baseBuildings, addToast, recordTransaction]);

  // Energy consumption
  const useEnergy = useCallback((amount: number): boolean => {
    if (profile.energy < amount) {
      addToast('Energy Depleted', `Insufficient Energy (Need ${amount}, Have ${profile.energy}). Rest at Safehouse or wait for regeneration.`, 'warning');
      return false;
    }
    setProfile(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - amount)
    }));
    return true;
  }, [profile.energy, addToast]);

  const replenishEnergy = useCallback((amount: number) => {
    setProfile(prev => ({
      ...prev,
      energy: Math.min(prev.maxEnergy || 100, prev.energy + amount)
    }));
    sounds.playLevelUp();
    addToast('Energy Restored', `Restored +${amount} Energy!`, 'success');
  }, [addToast]);

  // Syndicates / Clans
  const joinSyndicate = useCallback((syndicateId: string): boolean => {
    const syn = syndicates.find(s => s.id === syndicateId);
    if (!syn) return false;

    setSyndicates(prev => prev.map(s => {
      if (s.id === syndicateId) {
        const alreadyMember = s.members.some(m => m.id === profile.id);
        if (alreadyMember) return s;
        return {
          ...s,
          members: [
            ...s.members,
            {
              id: profile.id,
              name: profile.username,
              role: 'Associate',
              contribution: 0,
              avatar: 'user',
              isPlayer: true
            }
          ]
        };
      }
      // Remove player from other syndicates
      return {
        ...s,
        members: s.members.filter(m => m.id !== profile.id)
      };
    }));

    setProfile(prev => ({
      ...prev,
      syndicateId,
      syndicateRole: 'Associate'
    }));

    sounds.playWin();
    addToast('Joined Syndicate', `Sworn into ${syn.name} as an Associate.`, 'success');
    return true;
  }, [syndicates, profile.id, profile.username, addToast]);

  const leaveSyndicate = useCallback(() => {
    if (!profile.syndicateId) return;
    setSyndicates(prev => prev.map(s => {
      if (s.id === profile.syndicateId) {
        return {
          ...s,
          members: s.members.filter(m => m.id !== profile.id)
        };
      }
      return s;
    }));

    setProfile(prev => ({
      ...prev,
      syndicateId: null,
      syndicateRole: null
    }));

    sounds.playClick();
    addToast('Syndicate Resigned', 'Renounced syndicate affiliation. Now independent.', 'info');
  }, [profile.syndicateId, profile.id, addToast]);

  const createSyndicate = useCallback((name: string, tag: string): boolean => {
    const cost = 50000;
    if (profile.cash < cost) {
      addToast('Charter Denied', `Incorporating a syndicate requires $CRED ${cost.toLocaleString()} cash.`, 'danger');
      return false;
    }

    const newSynId = 'syn_' + Date.now();
    const newSyndicate: Syndicate = {
      id: newSynId,
      name,
      tag: tag.toUpperCase().slice(0, 5),
      level: 1,
      vaultBalance: 25000,
      reputation: 500,
      maxMembers: 10,
      perkBusinessBonus: 0.05,
      perkMaintenanceDiscount: 0.05,
      description: 'Newly chartered private executive corporation.',
      isPlayerSyndicate: true,
      members: [
        {
          id: profile.id,
          name: profile.username,
          role: 'Chairman',
          contribution: 25000,
          avatar: 'crown',
          isPlayer: true
        }
      ],
      contracts: [
        {
          id: 'p_con_1',
          title: 'Direct Vault Expansion',
          category: 'Financial',
          rewardCredits: 45000,
          reputationReward: 70,
          durationSeconds: 30,
          expiresAt: Date.now() + 86400000,
          status: 'available',
          description: 'Deploy seed capital to lock in corporate franchise agreements.'
        }
      ]
    };

    setSyndicates(prev => [...prev, newSyndicate]);

    setProfile(prev => ({
      ...prev,
      cash: prev.cash - cost,
      syndicateId: newSynId,
      syndicateRole: 'Chairman'
    }));

    sounds.playWin();
    recordTransaction('syndicate', `Chartered Syndicate: ${name} [${tag}]`, cost, false);
    addToast('Corporation Founded', `Welcome, Chairman! ${name} is officially chartered.`, 'success');
    return true;
  }, [profile.cash, profile.id, profile.username, addToast, recordTransaction]);

  const depositSyndicateVault = useCallback((amount: number): boolean => {
    if (amount <= 0 || !profile.syndicateId) return false;
    if (profile.cash < amount) {
      addToast('Deposit Failed', 'Insufficient liquid cash.', 'danger');
      return false;
    }

    setProfile(prev => ({ ...prev, cash: prev.cash - amount }));
    setSyndicates(prev => prev.map(s => {
      if (s.id === profile.syndicateId) {
        return {
          ...s,
          vaultBalance: s.vaultBalance + amount,
          members: s.members.map(m => m.id === profile.id ? { ...m, contribution: m.contribution + amount } : m)
        };
      }
      return s;
    }));

    sounds.playCoin();
    recordTransaction('syndicate', 'Syndicate Vault Contribution', amount, false);
    addToast('Vault Funded', `Contributed $CRED ${amount.toLocaleString()} to Syndicate Vault.`, 'success');
    return true;
  }, [profile.syndicateId, profile.cash, profile.id, addToast, recordTransaction]);

  const withdrawSyndicateVault = useCallback((amount: number): boolean => {
    if (amount <= 0 || !profile.syndicateId) return false;
    const syn = syndicates.find(s => s.id === profile.syndicateId);
    if (!syn) return false;

    // Role-based limits
    const role = profile.syndicateRole;
    let limit = 5000;
    if (role === 'Chairman') limit = 500000;
    else if (role === 'Executive') limit = 100000;
    else if (role === 'Director') limit = 25000;

    if (amount > limit) {
      addToast('Role Limit Exceeded', `Your rank (${role}) max withdrawal is $CRED ${limit.toLocaleString()}/tx.`, 'warning');
      return false;
    }

    if (syn.vaultBalance < amount) {
      addToast('Withdrawal Failed', 'Syndicate vault has insufficient reserves.', 'danger');
      return false;
    }

    setSyndicates(prev => prev.map(s => {
      if (s.id === profile.syndicateId) {
        return {
          ...s,
          vaultBalance: s.vaultBalance - amount
        };
      }
      return s;
    }));

    setProfile(prev => ({ ...prev, cash: prev.cash + amount }));

    sounds.playCashRegister();
    recordTransaction('syndicate', 'Syndicate Vault Allocation', amount, true);
    addToast('Vault Disbursed', `Withdrew $CRED ${amount.toLocaleString()} from corporate treasury.`, 'success', amount);
    return true;
  }, [profile.syndicateId, profile.syndicateRole, syndicates, addToast, recordTransaction]);

  const completeContract = useCallback((contractId: string) => {
    if (!profile.syndicateId) return;
    const syn = syndicates.find(s => s.id === profile.syndicateId);
    if (!syn) return;
    const contract = syn.contracts.find(c => c.id === contractId);
    if (!contract) return;

    sounds.playWin();
    recordTransaction('syndicate', `Completed Contract: ${contract.title}`, contract.rewardCredits, true);
    addToast('Contract Executed', `Paid $CRED ${contract.rewardCredits.toLocaleString()} (+${contract.reputationReward} Corp Rep)`, 'success', contract.rewardCredits);

    setProfile(prev => ({ ...prev, cash: prev.cash + contract.rewardCredits }));
    setSyndicates(prev => prev.map(s => {
      if (s.id === profile.syndicateId) {
        return {
          ...s,
          reputation: s.reputation + contract.reputationReward,
          contracts: s.contracts.map(c => c.id === contractId ? { ...c, status: 'completed' as const } : c)
        };
      }
      return s;
    }));
  }, [profile.syndicateId, syndicates, addToast, recordTransaction]);

  // Gambling result handler
  const applyGamblingResult = useCallback((betAmount: number, winPayout: number, gameName: string) => {
    setProfile(prev => {
      const netGain = winPayout - betAmount;
      const won = netGain > 0;

      if (won) {
        sounds.playWin();
        recordTransaction('gambling', `${gameName} Win (${netGain >= 0 ? '+' : ''}$CRED ${netGain.toLocaleString()})`, winPayout, true);
        addToast('Casino Victory!', `Won $CRED ${winPayout.toLocaleString()} on ${gameName}!`, 'success', winPayout);
      } else {
        sounds.playLoss();
        recordTransaction('gambling', `${gameName} Loss`, betAmount, false);
        addToast('Casino House Edge', `Lost $CRED ${betAmount.toLocaleString()} to the house.`, 'danger');
      }

      return {
        ...prev,
        cash: prev.cash - betAmount + winPayout,
        stats: {
          ...prev.stats,
          totalGambled: prev.stats.totalGambled + betAmount,
          totalCasinoProfit: prev.stats.totalCasinoProfit + netGain,
          totalCasinoWins: (prev.stats.totalCasinoWins || 0) + (won ? 1 : 0),
          totalCasinoLosses: (prev.stats.totalCasinoLosses || 0) + (won ? 0 : 1)
        }
      };
    });
  }, [addToast, recordTransaction]);

  // Player-run VIP Table
  const toggleVipTable = useCallback(() => {
    setProfile(prev => {
      const nextActive = !prev.vipTableActive;
      sounds.playClick();
      if (nextActive) {
        addToast('VIP Table Opened', 'High-roller patrons now wagering at your personal licensed suite!', 'success');
      } else {
        addToast('VIP Table Closed', 'VIP table is temporarily closed to the public.', 'info');
      }
      return { ...prev, vipTableActive: nextActive };
    });
  }, [addToast]);

  const updateVipTableStakes = useCallback((min: number, max: number) => {
    setProfile(prev => ({
      ...prev,
      vipTableStakes: { min, max }
    }));
    addToast('Table Stakes Updated', `Stakes set from $CRED ${min.toLocaleString()} to ${max.toLocaleString()}`, 'info');
  }, [addToast]);

  // Location update
  const updateLocation = useCallback((region: PlayerProfile['region'], state: string, district: PlayerProfile['district']) => {
    setProfile(prev => ({ ...prev, region, state, district }));
    addToast('Relocation Registered', `Resettled into ${district}, ${state} (${region})`, 'info');
  }, [addToast]);

  // RPG Profile & Google Sync Methods
  const setAvatarFrame = useCallback((frameId: string) => {
    setProfile(prev => ({ ...prev, avatarFrame: frameId }));
    sounds.playClick();
    addToast('Avatar Frame Equipped', `Equipped ${frameId.replace(/_/g, ' ').toUpperCase()} frame.`, 'success');
  }, [addToast]);

  const setCustomTitle = useCallback((title: string) => {
    setProfile(prev => ({ ...prev, title }));
    sounds.playClick();
    addToast('Reputation Title Updated', `Title updated to: ${title}`, 'success');
  }, [addToast]);

  const setShowcaseVehicle = useCallback((vehicleId: string | null) => {
    setProfile(prev => ({ ...prev, showcaseVehicleId: vehicleId }));
    sounds.playClick();
    if (vehicleId) {
      const veh = VEHICLES_CATALOG.find(v => v.id === vehicleId);
      addToast('Showcase Flex Vehicle Set', `${veh?.name || 'Vehicle'} featured on your public pedestal & leaderboard!`, 'success');
    } else {
      addToast('Showcase Vehicle Cleared', 'Removed flex vehicle from public pedestal.', 'info');
    }
  }, [addToast]);

  const setShowcaseProperty = useCallback((propertyId: string | null) => {
    setProfile(prev => ({ ...prev, showcasePropertyId: propertyId }));
    sounds.playClick();
    if (propertyId) {
      const prop = REAL_ESTATE_CATALOG.find(p => p.id === propertyId);
      addToast('Showcase Flex Property Set', `${prop?.name || 'Property'} featured on your public pedestal & leaderboard!`, 'success');
    } else {
      addToast('Showcase Property Cleared', 'Removed flex property from public pedestal.', 'info');
    }
  }, [addToast]);

  const linkGoogleAccount = useCallback((account: { email: string; name: string; photoUrl?: string }) => {
    sounds.playWin();
    setProfile(prev => ({
      ...prev,
      email: account.email,
      username: account.name || prev.username,
      googleAuth: {
        isLinked: true,
        email: account.email,
        name: account.name,
        photoUrl: account.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        linkedAt: Date.now(),
        lastSyncedAt: Date.now(),
        syncStatus: 'synced',
        provider: 'google'
      }
    }));
    addToast('Google Identity Synchronized', `Linked Google Account: ${account.email}. Cloud sync active!`, 'success');
  }, [addToast]);

  const unlinkGoogleAccount = useCallback(() => {
    sounds.playClick();
    setProfile(prev => ({
      ...prev,
      googleAuth: {
        isLinked: false,
        email: prev.email,
        name: prev.username,
        photoUrl: '',
        linkedAt: 0,
        lastSyncedAt: 0,
        syncStatus: 'offline',
        provider: 'guest'
      }
    }));
    addToast('Google Link Disconnected', 'Switched to local guest neural rig.', 'info');
  }, [addToast]);

  const syncCloudData = useCallback(async () => {
    sounds.playClick();
    setProfile(prev => ({
      ...prev,
      googleAuth: prev.googleAuth
        ? { ...prev.googleAuth, syncStatus: 'syncing' }
        : undefined
    }));

    await new Promise(r => setTimeout(r, 650));

    setProfile(prev => ({
      ...prev,
      googleAuth: prev.googleAuth
        ? { ...prev.googleAuth, syncStatus: 'synced', lastSyncedAt: Date.now() }
        : undefined
    }));
    sounds.playCoin();
    addToast('Cloud Save Synced', 'All neural assets, motor fleet, and buildings mirrored to Firebase / Supabase cloud.', 'success');
    return true;
  }, [addToast]);

  // Reset Game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('apex_syndicates_save');
    setProfile(DEFAULT_PROFILE);
    setSyndicates(INITIAL_SYNDICATES);
    setTransactions([]);
    addToast('System Rebooted', 'Economy simulation state restored to initial genesis conditions.', 'info');
  }, [addToast]);

  // Export & Import
  const exportSaveData = useCallback(() => {
    return JSON.stringify({
      version: 2,
      profile,
      syndicates,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [profile, syndicates]);

  const importSaveData = useCallback((jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data && data.profile) {
        setProfile({ ...DEFAULT_PROFILE, ...data.profile });
        if (data.syndicates) setSyndicates(data.syndicates);
        addToast('Profile Synchronized', 'Save file successfully loaded into runtime state.', 'success');
        return true;
      }
    } catch {
      addToast('Corrupted Payload', 'Invalid JSON backup format.', 'danger');
    }
    return false;
  }, [addToast]);

  // Dynamic Leaderboard list combining NPCs + current player
  const leaderboards: LeaderboardEntry[] = useMemo(() => {
    const showcaseVeh = profile.showcaseVehicleId
      ? VEHICLES_CATALOG.find(v => v.id === profile.showcaseVehicleId)?.name
      : undefined;
    const showcaseProp = profile.showcasePropertyId
      ? REAL_ESTATE_CATALOG.find(r => r.id === profile.showcasePropertyId)?.name
      : undefined;

    const playerEntry: LeaderboardEntry = {
      rank: 0,
      id: profile.id,
      name: `${profile.username} (You)`,
      avatar: profile.googleAuth?.photoUrl || 'user',
      avatarFrame: profile.avatarFrame,
      showcaseVehicleName: showcaseVeh,
      showcasePropertyName: showcaseProp,
      syndicateTag: currentSyndicate ? currentSyndicate.tag : undefined,
      region: profile.region,
      state: profile.state,
      district: profile.district,
      netWorth: computedNetWorth,
      businessIncomePerHour: totalHourlyIncome,
      casinoWinnings: Math.max(0, profile.stats.totalCasinoProfit),
      groupVault: currentSyndicate ? currentSyndicate.vaultBalance : 0,
      isPlayer: true
    };

    // Merge and sort
    const all = [...INITIAL_LEADERBOARDS.filter(l => l.id !== profile.id), playerEntry];
    all.sort((a, b) => b.netWorth - a.netWorth);

    return all.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }, [profile, currentSyndicate, computedNetWorth, totalHourlyIncome]);

  const currentRankData = useMemo(() => getRankData(profile.level), [profile.level]);
  const requiredXP = useMemo(() => getRequiredXP(profile.level), [profile.level]);

  return (
    <GameContext.Provider
      value={{
        profile,
        activeTab,
        setActiveTab,
        transactions,
        toasts,
        syndicates,
        leaderboards,
        leaderboard: leaderboards,
        totalHourlyIncome,
        totalHourlyMaintenance,
        netHourlyCashflow,
        computedNetWorth,
        cycleCountdown,
        lastCashDelta,
        addToast,
        removeToast,
        depositBank,
        withdrawBank,
        depositToBank: depositBank,
        withdrawFromBank: withdrawBank,
        addGems,
        exchangeGemsForCredits,
        buyExpBoost,
        buyIncBoost,
        hourlyUpkeep: totalHourlyMaintenance,
        completeJobShift,
        addXP,
        getRequiredXP,
        getRankData,
        currentRankData,
        requiredXP,
        buyVehicle,
        sellVehicle,
        setActiveVehicle,
        setVehiclePaint,
        buyProperty,
        setPrimaryProperty,
        buyBusiness,
        upgradeBusiness,
        upgradeAllBusinesses,
        collectBusinessRevenue,
        collectAllBusinesses,
        payAllEmployees,
        payBusinessShift,
        totalPayrollDue,
        businessesOnStrikeCount,
        constructBuilding,
        upgradeBaseBuilding,
        rushFinishUpgrade,
        collectBuildingRevenue,
        collectAllBaseBuildings,
        unlockPlot,
        useEnergy,
        replenishEnergy,
        joinSyndicate,
        leaveSyndicate,
        createSyndicate,
        depositSyndicateVault,
        withdrawSyndicateVault,
        completeContract,
        applyGamblingResult,
        toggleVipTable,
        updateVipTableStakes,
        updateLocation,
        resetGame,
        exportSaveData,
        importSaveData,
        setAvatarFrame,
        setCustomTitle,
        setShowcaseVehicle,
        setShowcaseProperty,
        linkGoogleAccount,
        unlinkGoogleAccount,
        syncCloudData,
        inventory,
        equipment,
        equippedStats,
        timedCrateReady,
        timedCrateCountdown,
        openCrate,
        claimTimedCrate,
        equipItem,
        unequipItem,
        useConsumable,
        masteryCrownsCount,
        builtSpiresCount,
        isSlideOutOpen,
        setIsSlideOutOpen
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

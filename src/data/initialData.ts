import { Vehicle, RealEstate, Business, JobTier, Syndicate, LeaderboardEntry } from '../types';
import { RESIDENTIAL_CATALOG } from './residentialCatalog';
import { CAREER_CONTRACTS } from './careerContracts';

export { RESIDENTIAL_CATALOG, CAREER_CONTRACTS };

export const VEHICLES_CATALOG: Vehicle[] = [
  {
    id: 'v_commuter',
    name: 'Veloce Cyber Commuter',
    category: 'Commuter',
    price: 15000,
    resalePrice: 10500,
    maintenancePerHour: 25,
    topSpeed: 165,
    acceleration: '6.8s (0-100)',
    prestige: 10,
    imageTag: 'car_commuter',
    description: 'Standard-issue cybernetic commuter rig with efficient battery pack and automated lane tracking.'
  },
  {
    id: 'v_sedan',
    name: 'Veloce Metro EV',
    category: 'Commuter',
    price: 18000,
    resalePrice: 12600,
    maintenancePerHour: 35,
    topSpeed: 175,
    acceleration: '6.4s (0-100)',
    prestige: 15,
    imageTag: 'car_commuter',
    description: 'A nimble electric urban commuter with low maintenance footprint and smart battery regeneration.'
  },
  {
    id: 'v_coupe',
    name: 'Bavaria GT-6 Coupe',
    category: 'Commuter',
    price: 42000,
    resalePrice: 30000,
    maintenancePerHour: 80,
    topSpeed: 230,
    acceleration: '4.8s (0-100)',
    prestige: 40,
    imageTag: 'car_coupe',
    description: 'Twin-turbo executive sport coupe tuned for high-speed highway commuting.'
  },
  {
    id: 'v_sports',
    name: 'Stallion Monza V8',
    category: 'Sports',
    price: 110000,
    resalePrice: 82000,
    maintenancePerHour: 220,
    topSpeed: 295,
    acceleration: '3.6s (0-100)',
    prestige: 120,
    imageTag: 'car_sports',
    description: 'Raw naturally aspirated V8 with carbon-ceramic brakes and an aggressive aero kit.'
  },
  {
    id: 'v_vantage',
    name: 'Aether Vantage Spyder',
    category: 'Sports',
    price: 240000,
    resalePrice: 180000,
    maintenancePerHour: 450,
    topSpeed: 320,
    acceleration: '3.1s (0-100)',
    prestige: 280,
    imageTag: 'car_vantage',
    description: 'Bespoke hand-stitched leather luxury grand tourer favored by financial executives.'
  },
  {
    id: 'v_supercar',
    name: 'Apex P1 Carbon Edition',
    category: 'Supercar',
    price: 650000,
    resalePrice: 490000,
    maintenancePerHour: 1100,
    topSpeed: 355,
    acceleration: '2.4s (0-100)',
    prestige: 750,
    imageTag: 'car_supercar',
    description: 'Hybrid hyper-powertrain delivering instantaneous torque with active dynamic aerodynamics.'
  },
  {
    id: 'v_hypercar',
    name: 'Chronos Valkyrie Hyper-GT',
    category: 'Hypercar',
    price: 1850000,
    resalePrice: 1450000,
    maintenancePerHour: 2800,
    topSpeed: 412,
    acceleration: '1.8s (0-100)',
    prestige: 2400,
    imageTag: 'car_hypercar',
    description: 'F1-derived engineering sculpture featuring quad-electric hub motors and gold-foil heat shields.'
  }
];

export const REAL_ESTATE_CATALOG: RealEstate[] = [
  ...RESIDENTIAL_CATALOG,
  {
    id: 're_loft',
    name: 'Neon District Micro-Loft',
    category: 'Apartment',
    price: 75000,
    luxuryTaxPerHour: 45,
    storageSlots: 10,
    prestige: 50,
    district: 'Industrial Port',
    imageTag: 're_loft',
    description: 'Modern high-ceiling studio situated directly above the bustling commercial nightlife corridor.'
  },
  {
    id: 're_studio',
    name: 'Horizon Skyline Condo',
    category: 'Apartment',
    price: 260000,
    luxuryTaxPerHour: 160,
    storageSlots: 25,
    prestige: 190,
    district: 'Silicon Heights',
    imageTag: 're_condo',
    description: 'Panoramic glass-walled suite overlooking the tech district with dedicated high-speed terminal line.'
  },
  {
    id: 're_villa',
    name: 'Bel-Air Coastal Villa',
    category: 'Villa',
    price: 950000,
    luxuryTaxPerHour: 580,
    storageSlots: 60,
    prestige: 820,
    district: 'Marina Bay',
    imageTag: 're_villa',
    description: 'Private estate with infinity edge pool, private helipad landing pad, and smart subterranean vault.'
  },
  {
    id: 're_mansion',
    name: 'Grand Sovereign Compound',
    category: 'Mansion',
    price: 3200000,
    luxuryTaxPerHour: 1850,
    storageSlots: 150,
    prestige: 2900,
    district: 'Marina Bay',
    imageTag: 're_mansion',
    description: 'Guarded gated estate with climate-controlled 12-vehicle subterranean gallery and biometric security.'
  },
  {
    id: 're_penthouse',
    name: 'Apex Celestial Penthouse',
    category: 'Penthouse',
    price: 8500000,
    luxuryTaxPerHour: 4900,
    storageSlots: 350,
    prestige: 8000,
    district: 'Apex Central',
    imageTag: 're_penthouse',
    description: 'Top three floors of the Apex Tower overlooking the entire metropolis. Unrivaled status symbol.'
  }
];

import { BUSINESS_CATALOG, TIER_CONFIG, getBusinessStructureById } from './businessCatalog';
export { BUSINESS_CATALOG, TIER_CONFIG, getBusinessStructureById };
export const getBusinessDef = getBusinessStructureById;

export const BUSINESSES_CATALOG: Business[] = [
  {
    id: 'biz_workshop',
    name: 'Automated Logistics Depot',
    category: 'Logistics',
    basePrice: 50000,
    baseRevenuePerHour: 660,
    currentLevel: 0,
    maxLevel: 5,
    upgradeCostMultiplier: 1.8,
    upgradeRevenueMultiplier: 1.6,
    description: 'Fleet of automated delivery vans handling regional supply chains and warehouse fulfillment.',
    unclaimedRevenue: 0,
    lastCollectedAt: Date.now(),
    iconName: 'Truck'
  },
  {
    id: 'biz_club',
    name: 'Velvet Horizon Nightclub',
    category: 'Nightlife',
    basePrice: 180000,
    baseRevenuePerHour: 2310,
    currentLevel: 0,
    maxLevel: 5,
    upgradeCostMultiplier: 2.0,
    upgradeRevenueMultiplier: 1.7,
    description: 'High-end VIP club catering to affluent traders and corporate executives with bottle service.',
    unclaimedRevenue: 0,
    lastCollectedAt: Date.now(),
    iconName: 'Music'
  },
  {
    id: 'biz_tech',
    name: 'Quantum AI Research Foundry',
    category: 'Technology',
    basePrice: 620000,
    baseRevenuePerHour: 8525,
    currentLevel: 0,
    maxLevel: 5,
    upgradeCostMultiplier: 2.2,
    upgradeRevenueMultiplier: 1.8,
    description: 'Proprietary machine learning models licensing algorithmic models to global exchanges.',
    unclaimedRevenue: 0,
    lastCollectedAt: Date.now(),
    iconName: 'Cpu'
  },
  {
    id: 'biz_crypto',
    name: 'Sub-Zero Hydro Mining Facility',
    category: 'Crypto',
    basePrice: 1500000,
    baseRevenuePerHour: 21450,
    currentLevel: 0,
    maxLevel: 5,
    upgradeCostMultiplier: 2.3,
    upgradeRevenueMultiplier: 1.85,
    description: 'Renewable-powered ASIC mining array processing network transactions 24/7.',
    unclaimedRevenue: 0,
    lastCollectedAt: Date.now(),
    iconName: 'Server'
  },
  {
    id: 'biz_orbital',
    name: 'Aegis Orbital Freight Line',
    category: 'Industrial',
    basePrice: 4800000,
    baseRevenuePerHour: 70400,
    currentLevel: 0,
    maxLevel: 5,
    upgradeCostMultiplier: 2.5,
    upgradeRevenueMultiplier: 1.9,
    description: 'Suborbital heavy lift shuttles transporting premium high-value payloads across world capitals.',
    unclaimedRevenue: 0,
    lastCollectedAt: Date.now(),
    iconName: 'Rocket'
  }
];

export const CAREER_TIERS: JobTier[] = [
  // Courier Career
  {
    id: 'job_courier_1',
    name: 'Rapid Express Driver',
    title: 'Metro Dispatcher',
    type: 'courier',
    requiredXp: 0,
    requiredNetWorth: 0,
    basePayout: 450,
    cooldownSeconds: 8,
    xpReward: 35,
    description: 'Deliver time-sensitive priority documents across the central financial grid.',
    iconName: 'Navigation'
  },
  {
    id: 'job_courier_2',
    name: 'Armed Transit Specialist',
    title: 'Armored Escort',
    type: 'courier',
    requiredXp: 200,
    requiredNetWorth: 25000,
    basePayout: 1350,
    cooldownSeconds: 14,
    xpReward: 90,
    description: 'Transport bearer bonds and high-value silicon wafers in armored convoys.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'job_courier_3',
    name: 'Offshore Syndicate Hauler',
    title: 'Elite Transporter',
    type: 'courier',
    requiredXp: 800,
    requiredNetWorth: 150000,
    basePayout: 4200,
    cooldownSeconds: 22,
    xpReward: 240,
    description: 'Confidential midnight transport of sensitive corporate hardware and bullion.',
    iconName: 'Zap'
  },

  // Broker Career
  {
    id: 'job_broker_1',
    name: 'Junior Arbitrage Clerk',
    title: 'Floor Clerk',
    type: 'broker',
    requiredXp: 0,
    requiredNetWorth: 0,
    basePayout: 650,
    cooldownSeconds: 10,
    xpReward: 45,
    description: 'Execute split-second order book bid-ask fills on the secondary credit exchange.',
    iconName: 'TrendingUp'
  },
  {
    id: 'job_broker_2',
    name: 'High-Frequency Trader',
    title: 'Quant Trader',
    type: 'broker',
    requiredXp: 350,
    requiredNetWorth: 50000,
    basePayout: 2100,
    cooldownSeconds: 16,
    xpReward: 130,
    description: 'Ride micro-volatility waves and arbitrage liquidity imbalances across dark pools.',
    iconName: 'BarChart3'
  },
  {
    id: 'job_broker_3',
    name: 'Venture Capital Director',
    title: 'Managing Partner',
    type: 'broker',
    requiredXp: 1200,
    requiredNetWorth: 300000,
    basePayout: 6800,
    cooldownSeconds: 25,
    xpReward: 380,
    description: 'Syndicate sovereign debt rounds and engineer leveraged corporate buyouts.',
    iconName: 'Briefcase'
  },

  // Tech Career
  {
    id: 'job_tech_1',
    name: 'Junior Cloud Scripter',
    title: 'Junior Dev',
    type: 'tech',
    requiredXp: 0,
    requiredNetWorth: 0,
    basePayout: 550,
    cooldownSeconds: 9,
    xpReward: 40,
    description: 'Hotfix pipeline build failures and patch memory leaks in automated microservices.',
    iconName: 'Code'
  },
  {
    id: 'job_tech_2',
    name: 'Smart Contract Auditor',
    title: 'Security Auditor',
    type: 'tech',
    requiredXp: 280,
    requiredNetWorth: 35000,
    basePayout: 1800,
    cooldownSeconds: 15,
    xpReward: 110,
    description: 'Audit decentralized liquidity contracts for reentrancy bugs and flash-loan vulnerabilities.',
    iconName: 'Terminal'
  },
  {
    id: 'job_tech_3',
    name: 'Autonomous AI Architect',
    title: 'Chief Scientist',
    type: 'tech',
    requiredXp: 1000,
    requiredNetWorth: 200000,
    basePayout: 5900,
    cooldownSeconds: 24,
    xpReward: 320,
    description: 'Train trillion-parameter synthetic market predictors on distributed superclusters.',
    iconName: 'Brain'
  }
];

export const INITIAL_SYNDICATES: Syndicate[] = [
  {
    id: 'syn_apex',
    name: 'Apex Vanguard Corp',
    tag: 'APEX',
    level: 5,
    vaultBalance: 42800000,
    reputation: 9400,
    maxMembers: 25,
    perkBusinessBonus: 0.12, // +12% business earnings
    perkMaintenanceDiscount: 0.15, // -15% maintenance fees
    description: 'The dominant financial conglomerate controlling metro credit routes and prime properties.',
    members: [
      { id: 'm_1', name: 'Alexander Sterling', role: 'Chairman', contribution: 18500000, avatar: 'crown' },
      { id: 'm_2', name: 'Victoria Thorne', role: 'Executive', contribution: 12000000, avatar: 'gem' },
      { id: 'm_3', name: 'Marcus Vance', role: 'Director', contribution: 7400000, avatar: 'shield' },
      { id: 'm_4', name: 'Elena Rostov', role: 'Associate', contribution: 4900000, avatar: 'activity' }
    ],
    contracts: [
      {
        id: 'con_1',
        title: 'Capital Liquidity Injection',
        category: 'Financial',
        rewardCredits: 85000,
        reputationReward: 120,
        durationSeconds: 45,
        expiresAt: Date.now() + 86400000,
        status: 'available',
        description: 'Provide market-making liquidity to counter institutional short pressure.'
      },
      {
        id: 'con_2',
        title: 'High-Value Quantum Node Escort',
        category: 'Security',
        rewardCredits: 125000,
        reputationReward: 190,
        durationSeconds: 60,
        expiresAt: Date.now() + 86400000,
        status: 'available',
        description: 'Secure transport convoy moving prototype cryo-processors past rogue syndicates.'
      }
    ]
  },
  {
    id: 'syn_neon',
    name: 'Neon Syndicate',
    tag: 'NEON',
    level: 4,
    vaultBalance: 19500000,
    reputation: 6800,
    maxMembers: 20,
    perkBusinessBonus: 0.08,
    perkMaintenanceDiscount: 0.10,
    description: 'Underground nightlife and data-broker network with deep roots in the entertainment sector.',
    members: [
      { id: 'm_5', name: 'Dante Kuro', role: 'Chairman', contribution: 8500000, avatar: 'flame' },
      { id: 'm_6', name: 'Sora Tanaka', role: 'Executive', contribution: 6200000, avatar: 'zap' },
      { id: 'm_7', name: 'Jax Rivera', role: 'Director', contribution: 4800000, avatar: 'crosshair' }
    ],
    contracts: [
      {
        id: 'con_3',
        title: 'Dark Fiber Routing Contract',
        category: 'Tech',
        rewardCredits: 72000,
        reputationReward: 95,
        durationSeconds: 35,
        expiresAt: Date.now() + 86400000,
        status: 'available',
        description: 'Splice clandestine optic fibers under the Marina Bay financial district.'
      }
    ]
  },
  {
    id: 'syn_aegis',
    name: 'Aegis Orbital Alliance',
    tag: 'AEGIS',
    level: 3,
    vaultBalance: 11200000,
    reputation: 4300,
    maxMembers: 15,
    perkBusinessBonus: 0.06,
    perkMaintenanceDiscount: 0.08,
    description: 'Specialists in aerospace engineering, industrial mining hubs, and heavy logistics.',
    members: [
      { id: 'm_8', name: 'Helena Drake', role: 'Chairman', contribution: 5500000, avatar: 'rocket' },
      { id: 'm_9', name: 'Liam Cross', role: 'Executive', contribution: 3900000, avatar: 'cpu' },
      { id: 'm_10', name: 'Nadia Wu', role: 'Director', contribution: 1800000, avatar: 'anchor' }
    ],
    contracts: [
      {
        id: 'con_4',
        title: 'Rare Earth Heavy Transport',
        category: 'Logistics',
        rewardCredits: 95000,
        reputationReward: 140,
        durationSeconds: 50,
        expiresAt: Date.now() + 86400000,
        status: 'available',
        description: 'Charter heavy freight haulers from the industrial spaceport to refinery silos.'
      }
    ]
  }
];

export const INITIAL_LEADERBOARDS: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'p_alexander',
    name: 'Alexander Sterling',
    avatar: 'crown',
    avatarFrame: 'neon_gold',
    showcaseVehicleName: 'Chronos Valkyrie Hyper-GT',
    showcasePropertyName: 'Apex Celestial Penthouse',
    syndicateTag: 'APEX',
    region: 'Americas',
    state: 'New York Metro',
    district: 'Apex Central',
    netWorth: 84950000,
    businessIncomePerHour: 450000,
    casinoWinnings: 12800000,
    groupVault: 42800000
  },
  {
    rank: 2,
    id: 'p_victoria',
    name: 'Victoria Thorne',
    avatar: 'gem',
    avatarFrame: 'neon_purple',
    showcaseVehicleName: 'Apex P1 Carbon Edition',
    showcasePropertyName: 'Grand Sovereign Compound',
    syndicateTag: 'APEX',
    region: 'Eurozone',
    state: 'Monaco District',
    district: 'Marina Bay',
    netWorth: 62400000,
    businessIncomePerHour: 340000,
    casinoWinnings: 9400000,
    groupVault: 42800000
  },
  {
    rank: 3,
    id: 'p_dante',
    name: 'Dante Kuro',
    avatar: 'flame',
    avatarFrame: 'neon_crimson',
    showcaseVehicleName: 'Aether Vantage Spyder',
    showcasePropertyName: 'Bel-Air Coastal Villa',
    syndicateTag: 'NEON',
    region: 'Asia-Pacific',
    state: 'Tokyo Kanto',
    district: 'Silicon Heights',
    netWorth: 41800000,
    businessIncomePerHour: 220000,
    casinoWinnings: 18200000,
    groupVault: 19500000
  },
  {
    rank: 4,
    id: 'p_helena',
    name: 'Helena Drake',
    avatar: 'rocket',
    avatarFrame: 'neon_emerald',
    showcaseVehicleName: 'Stallion Monza V8',
    showcasePropertyName: 'Horizon Skyline Condo',
    syndicateTag: 'AEGIS',
    region: 'Americas',
    state: 'Texas Aerospace',
    district: 'Industrial Port',
    netWorth: 34200000,
    businessIncomePerHour: 290000,
    casinoWinnings: 4100000,
    groupVault: 11200000
  },
  {
    rank: 5,
    id: 'p_marcus',
    name: 'Marcus Vance',
    avatar: 'shield',
    syndicateTag: 'APEX',
    region: 'Americas',
    state: 'California Bay',
    district: 'Silicon Heights',
    netWorth: 28500000,
    businessIncomePerHour: 180000,
    casinoWinnings: 7300000,
    groupVault: 42800000
  },
  {
    rank: 6,
    id: 'p_sora',
    name: 'Sora Tanaka',
    avatar: 'zap',
    syndicateTag: 'NEON',
    region: 'Asia-Pacific',
    state: 'Osaka Kansai',
    district: 'Marina Bay',
    netWorth: 21600000,
    businessIncomePerHour: 145000,
    casinoWinnings: 11900000,
    groupVault: 19500000
  },
  {
    rank: 7,
    id: 'p_liam',
    name: 'Liam Cross',
    avatar: 'cpu',
    syndicateTag: 'AEGIS',
    region: 'Eurozone',
    state: 'London City',
    district: 'Apex Central',
    netWorth: 16800000,
    businessIncomePerHour: 110000,
    casinoWinnings: 3200000,
    groupVault: 11200000
  },
  {
    rank: 8,
    id: 'p_elena',
    name: 'Elena Rostov',
    avatar: 'activity',
    syndicateTag: 'APEX',
    region: 'Eurozone',
    state: 'Zurich Canton',
    district: 'Apex Central',
    netWorth: 13900000,
    businessIncomePerHour: 98000,
    casinoWinnings: 5500000,
    groupVault: 42800000
  },
  {
    rank: 9,
    id: 'p_jax',
    name: 'Jax Rivera',
    avatar: 'crosshair',
    syndicateTag: 'NEON',
    region: 'Americas',
    state: 'Florida Coast',
    district: 'Marina Bay',
    netWorth: 9750000,
    businessIncomePerHour: 72000,
    casinoWinnings: 8400000,
    groupVault: 19500000
  },
  {
    rank: 10,
    id: 'p_nadia',
    name: 'Nadia Wu',
    avatar: 'anchor',
    syndicateTag: 'AEGIS',
    region: 'Asia-Pacific',
    state: 'Singapore Straits',
    district: 'Industrial Port',
    netWorth: 7300000,
    businessIncomePerHour: 64000,
    casinoWinnings: 2800000,
    groupVault: 11200000
  }
];

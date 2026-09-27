import { BuildingBlueprint, BuildingType } from '../types';

export const BUILDING_BLUEPRINTS: BuildingBlueprint[] = [
  {
    type: 'safehouse',
    name: 'Command Safehouse',
    category: 'Residential',
    description: 'The fortified nucleus of your syndicate empire. Dictates maximum base grid boundary and unlocks advanced facilities.',
    baseCost: 0,
    baseBuildTimeSeconds: 0,
    maxLevel: 5,
    baseRevenuePerHour: 120,
    requiredSafehouseLevel: 1,
    iconName: 'ShieldAlert',
    bonusesByLevel: [
      {
        level: 1,
        title: 'Tier 1 Bunker',
        upgradeCost: 0,
        upgradeTimeSeconds: 0,
        revenuePerHour: 120,
        perkDescription: 'Provides 5x5 Base Grid (25 Plots). Unlocks Nightclub.'
      },
      {
        level: 2,
        title: 'Fortified Outpost',
        upgradeCost: 15000,
        upgradeTimeSeconds: 15,
        revenuePerHour: 350,
        perkDescription: 'Expands Grid to 6x6 (36 Plots). Unlocks Cyber Factory & Underground Casino. +25 Max Energy.'
      },
      {
        level: 3,
        title: 'Armored Compound',
        upgradeCost: 50000,
        upgradeTimeSeconds: 30,
        revenuePerHour: 800,
        perkDescription: 'Expands Grid to 7x7 (49 Plots). Unlocks Crypto Rig & Defense Turrets. +25 Max Energy.'
      },
      {
        level: 4,
        title: 'High-Tech Bastion',
        upgradeCost: 175000,
        upgradeTimeSeconds: 60,
        revenuePerHour: 2200,
        perkDescription: 'All base building production speed boosted by +20%. Unlocks Supercar fleet tier.'
      },
      {
        level: 5,
        title: 'Apex Sovereign Citadel',
        upgradeCost: 500000,
        upgradeTimeSeconds: 120,
        revenuePerHour: 5500,
        perkDescription: 'Ultimate syndicate headquarters. Permanent +50% dividend overclock across all base plots.'
      }
    ]
  },
  {
    type: 'factory',
    name: 'Cyber Hardware Factory',
    category: 'Industrial',
    description: 'Automated robotics fabricator pumping high-yield electronic components into planetary supply chains.',
    baseCost: 18000,
    baseBuildTimeSeconds: 12,
    maxLevel: 4,
    baseRevenuePerHour: 450,
    requiredSafehouseLevel: 2,
    iconName: 'Cpu',
    bonusesByLevel: [
      {
        level: 1,
        title: 'Fabrication Node',
        upgradeCost: 18000,
        upgradeTimeSeconds: 12,
        revenuePerHour: 450,
        perkDescription: 'Generates passive credit dividends with tap-to-harvest bubble.'
      },
      {
        level: 2,
        title: 'Automated Assembly Line',
        upgradeCost: 45000,
        upgradeTimeSeconds: 25,
        revenuePerHour: 1100,
        perkDescription: 'Increases credit generation to +$1,100/hr.'
      },
      {
        level: 3,
        title: 'Quantum Robotics Core',
        upgradeCost: 120000,
        upgradeTimeSeconds: 50,
        revenuePerHour: 2800,
        perkDescription: 'Harvest bubble capacity doubled. +$2,800/hr.'
      },
      {
        level: 4,
        title: 'Nano-Synthesis Mega-Foundry',
        upgradeCost: 350000,
        upgradeTimeSeconds: 100,
        revenuePerHour: 7500,
        perkDescription: 'Ultra-production node pumping +$7,500/hr.'
      }
    ]
  },
  {
    type: 'casino',
    name: 'Underground Casino',
    category: 'Gambling',
    description: 'Covert subterranean gaming speakeasy. Takes an automatic house rake from high-rollers and unlocks Fortune Wheel spins.',
    baseCost: 22000,
    baseBuildTimeSeconds: 15,
    maxLevel: 4,
    baseRevenuePerHour: 600,
    requiredSafehouseLevel: 2,
    iconName: 'Dices',
    bonusesByLevel: [
      {
        level: 1,
        title: 'Neon Speakeasy',
        upgradeCost: 22000,
        upgradeTimeSeconds: 15,
        revenuePerHour: 600,
        perkDescription: 'Generates house rake and grants 1 free Fortune Wheel spin daily.'
      },
      {
        level: 2,
        title: 'Velvet High-Stakes Salon',
        upgradeCost: 55000,
        upgradeTimeSeconds: 30,
        revenuePerHour: 1400,
        perkDescription: 'House rake increased to +$1,400/hr. Wheel of Fortune rewards +25% higher.'
      },
      {
        level: 3,
        title: 'Oligarch Gaming Vault',
        upgradeCost: 150000,
        upgradeTimeSeconds: 60,
        revenuePerHour: 3600,
        perkDescription: 'House rake +$3,600/hr. Unlocks exclusive high-limit jackpot wedge.'
      },
      {
        level: 4,
        title: 'Monaco Cyber Palace',
        upgradeCost: 400000,
        upgradeTimeSeconds: 120,
        revenuePerHour: 9500,
        perkDescription: 'Generates massive +$9,500/hr in passive casino profits.'
      }
    ]
  },
  {
    type: 'nightclub',
    name: 'Neon Nightclub',
    category: 'Entertainment',
    description: 'Pulsing cyber club catering to fixers and oligarchs. Provides continuous prestige and energy beverage bar.',
    baseCost: 12000,
    baseBuildTimeSeconds: 10,
    maxLevel: 4,
    baseRevenuePerHour: 300,
    requiredSafehouseLevel: 1,
    iconName: 'Radio',
    bonusesByLevel: [
      {
        level: 1,
        title: 'Sub-Level Lounge',
        upgradeCost: 12000,
        upgradeTimeSeconds: 10,
        revenuePerHour: 300,
        perkDescription: 'Generates +$300/hr and provides +20 Player Prestige.'
      },
      {
        level: 2,
        title: 'Strobe Horizon Club',
        upgradeCost: 32000,
        upgradeTimeSeconds: 22,
        revenuePerHour: 800,
        perkDescription: 'Energy regenerates 20% faster while active.'
      },
      {
        level: 3,
        title: 'Skyline Hologram Terrace',
        upgradeCost: 85000,
        upgradeTimeSeconds: 45,
        revenuePerHour: 2100,
        perkDescription: 'Prestige +80. Passive cash generation +$2,100/hr.'
      },
      {
        level: 4,
        title: 'Megacity Elysium Apex',
        upgradeCost: 260000,
        upgradeTimeSeconds: 90,
        revenuePerHour: 5500,
        perkDescription: 'Legendary hotspot delivering +$5,500/hr and VIP syndicate fame.'
      }
    ]
  },
  {
    type: 'crypto_rig',
    name: 'Sub-Zero Crypto Mine',
    category: 'Commercial',
    description: 'Gigawatt computational server cluster mining virtual currency tokens 24/7.',
    baseCost: 35000,
    baseBuildTimeSeconds: 18,
    maxLevel: 4,
    baseRevenuePerHour: 900,
    requiredSafehouseLevel: 3,
    iconName: 'Zap',
    bonusesByLevel: [
      {
        level: 1,
        title: 'ASIC Rack 01',
        upgradeCost: 35000,
        upgradeTimeSeconds: 18,
        revenuePerHour: 900,
        perkDescription: 'Automated cryptographic yield generator. +$900/hr.'
      },
      {
        level: 2,
        title: 'Sub-Zero Coolant Rack',
        upgradeCost: 80000,
        upgradeTimeSeconds: 35,
        revenuePerHour: 2200,
        perkDescription: 'Yield jumps to +$2,200/hr.'
      },
      {
        level: 3,
        title: 'Geothermal Hash Farm',
        upgradeCost: 190000,
        upgradeTimeSeconds: 70,
        revenuePerHour: 5200,
        perkDescription: 'High-hashrate cluster yielding +$5,200/hr.'
      },
      {
        level: 4,
        title: 'Quantum Synapse ASIC Grid',
        upgradeCost: 450000,
        upgradeTimeSeconds: 140,
        revenuePerHour: 12500,
        perkDescription: 'Maximum yield crypto powerhouse producing +$12,500/hr.'
      }
    ]
  },
  {
    type: 'defense_turret',
    name: 'Aegis Plasma Turret',
    category: 'Defense',
    description: 'Twin-linked plasma laser cannon protecting base plots and vault reserves from rival syndicate raids.',
    baseCost: 28000,
    baseBuildTimeSeconds: 15,
    maxLevel: 4,
    baseRevenuePerHour: 150,
    requiredSafehouseLevel: 3,
    iconName: 'Shield',
    bonusesByLevel: [
      {
        level: 1,
        title: 'EMP Sentry Post',
        upgradeCost: 28000,
        upgradeTimeSeconds: 15,
        revenuePerHour: 150,
        perkDescription: 'Provides +50 Base Security Defense. Security patrol stipend +$150/hr.'
      },
      {
        level: 2,
        title: 'Dual Laser Battery',
        upgradeCost: 65000,
        upgradeTimeSeconds: 30,
        revenuePerHour: 400,
        perkDescription: 'Security +120. Defends wallet against crime fee penalties.'
      },
      {
        level: 3,
        title: 'Kinetic Rail Sentry',
        upgradeCost: 160000,
        upgradeTimeSeconds: 60,
        revenuePerHour: 1000,
        perkDescription: 'Security +300. Grants +15% syndicate contract completion speed.'
      },
      {
        level: 4,
        title: 'Orbital Defense Beacon',
        upgradeCost: 380000,
        upgradeTimeSeconds: 110,
        revenuePerHour: 2800,
        perkDescription: 'Complete base perimeter invulnerability. Grants +$2,800/hr security contracts.'
      }
    ]
  }
];

export const PAINT_SWATCHES = [
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00f0ff', accent: '#ffffff' },
  { id: 'yellow', name: 'Neon Gold / Yellow', hex: '#fcee0a', accent: '#000000' },
  { id: 'magenta', name: 'Hot Magenta', hex: '#ff0055', accent: '#ffffff' },
  { id: 'green', name: 'Toxic Acid Green', hex: '#00ff66', accent: '#000000' },
  { id: 'stealth', name: 'Stealth Matte Black', hex: '#161b26', accent: '#00f0ff' },
  { id: 'purple', name: 'Ultra Violet', hex: '#9d4edd', accent: '#ffffff' },
  { id: 'gold', name: 'Monarch Gold', hex: '#e0a922', accent: '#000000' }
];

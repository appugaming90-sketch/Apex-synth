import { BusinessStructure } from '../types';

export const MAX_BUSINESS_LEVEL = 100;
export const EXPONENTIAL_COST_SCALE = 1.22; // 1.22x per level (late-game grind rebalance)
export const BASE_YIELD_NERF_FACTOR = 0.65; // 35% base yield nerf across all tiers
export const MASTERY_CROWN_BOOST = 1.50; // +50% global revenue boost at Level 100

// --- 60 UNIQUE REAL-WORLD BUSINESSES ACROSS 6 TIERS ---
const RAW_BUSINESS_CATALOG: BusinessStructure[] = [
  // ==========================================
  // TIER 1: Street Hustles & Kiosks (10 Entities)
  // ==========================================
  {
    id: 'b01',
    name: 'Sidewalk Lemonade Stand',
    tier: 'STREET',
    cost: 10,
    buyPrice: 10,
    hourlyIncome: 1584,
    hourlyYield: 1584,
    income: 0.44,
    drawType: 'kiosk',
    color: '#facc15',
    minPlayerLevel: 1,
    gridDimensions: [1, 1]
  },
  {
    id: 'b02',
    name: 'Cyber Hotdog Cart',
    tier: 'STREET',
    cost: 50,
    buyPrice: 50,
    hourlyIncome: 6336,
    hourlyYield: 6336,
    income: 1.76,
    drawType: 'kiosk',
    color: '#ef4444',
    minPlayerLevel: 1,
    gridDimensions: [1, 1]
  },
  {
    id: 'b03',
    name: 'Neopunk Newspaper Kiosk',
    tier: 'STREET',
    cost: 150,
    buyPrice: 150,
    hourlyIncome: 19800,
    hourlyYield: 19800,
    income: 5.5,
    drawType: 'kiosk',
    color: '#3b82f6',
    minPlayerLevel: 1,
    gridDimensions: [1, 1]
  },
  {
    id: 'b04',
    name: 'Alleyway Coffee Pod',
    tier: 'STREET',
    cost: 500,
    buyPrice: 500,
    hourlyIncome: 59400,
    hourlyYield: 59400,
    income: 16.5,
    drawType: 'kiosk',
    color: '#78350f',
    minPlayerLevel: 1,
    gridDimensions: [1, 1]
  },
  {
    id: 'b05',
    name: 'Streetwise Vape Shop',
    tier: 'STREET',
    cost: 1200,
    buyPrice: 1200,
    hourlyIncome: 138600,
    hourlyYield: 138600,
    income: 38.5,
    drawType: 'kiosk',
    color: '#a855f7',
    minPlayerLevel: 2,
    gridDimensions: [1, 1]
  },
  {
    id: 'b06',
    name: 'Artisan Pretzel Cart',
    tier: 'STREET',
    cost: 2500,
    buyPrice: 2500,
    hourlyIncome: 275000,
    hourlyYield: 275000,
    income: 76.4,
    drawType: 'kiosk',
    color: '#eab308',
    minPlayerLevel: 2,
    gridDimensions: [1, 1]
  },
  {
    id: 'b07',
    name: 'Organic Boba Tea Kiosk',
    tier: 'STREET',
    cost: 5000,
    buyPrice: 5000,
    hourlyIncome: 540000,
    hourlyYield: 540000,
    income: 150.0,
    drawType: 'kiosk',
    color: '#ec4899',
    minPlayerLevel: 2,
    gridDimensions: [1, 1]
  },
  {
    id: 'b08',
    name: 'Gourmet Taco Food Truck',
    tier: 'STREET',
    cost: 8500,
    buyPrice: 8500,
    hourlyIncome: 900000,
    hourlyYield: 900000,
    income: 250.0,
    drawType: 'kiosk',
    color: '#f97316',
    minPlayerLevel: 3,
    gridDimensions: [1, 1]
  },
  {
    id: 'b09',
    name: 'Vintage Shoe Shine Station',
    tier: 'STREET',
    cost: 12000,
    buyPrice: 12000,
    hourlyIncome: 1250000,
    hourlyYield: 1250000,
    income: 347.2,
    drawType: 'kiosk',
    color: '#84cc16',
    minPlayerLevel: 3,
    gridDimensions: [1, 1]
  },
  {
    id: 'b10',
    name: 'Metro Floral Botanical Stall',
    tier: 'STREET',
    cost: 18000,
    buyPrice: 18000,
    hourlyIncome: 1800000,
    hourlyYield: 1800000,
    income: 500.0,
    drawType: 'kiosk',
    color: '#14b8a6',
    minPlayerLevel: 3,
    gridDimensions: [1, 1]
  },

  // ==========================================
  // TIER 2: Retail & Neighborhood (10 Entities)
  // ==========================================
  {
    id: 'b11',
    name: '24/7 Holo-Mart Convenience',
    tier: 'RETAIL',
    cost: 25000,
    buyPrice: 25000,
    hourlyIncome: 2450000,
    hourlyYield: 2450000,
    income: 680.5,
    drawType: 'retail',
    color: '#10b981',
    minPlayerLevel: 4,
    gridDimensions: [1, 1]
  },
  {
    id: 'b12',
    name: 'Neon Arcade Alley',
    tier: 'RETAIL',
    cost: 40000,
    buyPrice: 40000,
    hourlyIncome: 3800000,
    hourlyYield: 3800000,
    income: 1055.5,
    drawType: 'retail',
    color: '#ec4899',
    minPlayerLevel: 4,
    gridDimensions: [1, 1]
  },
  {
    id: 'b13',
    name: 'Retro Laundromat',
    tier: 'RETAIL',
    cost: 65000,
    buyPrice: 65000,
    hourlyIncome: 6000000,
    hourlyYield: 6000000,
    income: 1666.6,
    drawType: 'retail',
    color: '#6366f1',
    minPlayerLevel: 5,
    gridDimensions: [1, 1]
  },
  {
    id: 'b14',
    name: 'Golden Crust Artisan Bakery',
    tier: 'RETAIL',
    cost: 100000,
    buyPrice: 100000,
    hourlyIncome: 9100000,
    hourlyYield: 9100000,
    income: 2527.7,
    drawType: 'retail',
    color: '#f59e0b',
    minPlayerLevel: 5,
    gridDimensions: [1, 1]
  },
  {
    id: 'b15',
    name: 'Underground Comic Vault',
    tier: 'RETAIL',
    cost: 150000,
    buyPrice: 150000,
    hourlyIncome: 13500000,
    hourlyYield: 13500000,
    income: 3750.0,
    drawType: 'retail',
    color: '#8b5cf6',
    minPlayerLevel: 6,
    gridDimensions: [1, 1]
  },
  {
    id: 'b16',
    name: 'Hi-Fi Vinyl Record Emporium',
    tier: 'RETAIL',
    cost: 220000,
    buyPrice: 220000,
    hourlyIncome: 19500000,
    hourlyYield: 19500000,
    income: 5416.6,
    drawType: 'retail',
    color: '#06b6d4',
    minPlayerLevel: 6,
    gridDimensions: [1, 1]
  },
  {
    id: 'b17',
    name: 'Neighborhood Hardware & Tools',
    tier: 'RETAIL',
    cost: 320000,
    buyPrice: 320000,
    hourlyIncome: 28000000,
    hourlyYield: 28000000,
    income: 7777.7,
    drawType: 'retail',
    color: '#64748b',
    minPlayerLevel: 7,
    gridDimensions: [1, 1]
  },
  {
    id: 'b18',
    name: 'Vintage Thrift & Streetwear',
    tier: 'RETAIL',
    cost: 450000,
    buyPrice: 450000,
    hourlyIncome: 39000000,
    hourlyYield: 39000000,
    income: 10833.3,
    drawType: 'retail',
    color: '#d946ef',
    minPlayerLevel: 7,
    gridDimensions: [1, 1]
  },
  {
    id: 'b19',
    name: '24h Compounding Pharmacy',
    tier: 'RETAIL',
    cost: 600000,
    buyPrice: 600000,
    hourlyIncome: 51000000,
    hourlyYield: 51000000,
    income: 14166.6,
    drawType: 'retail',
    color: '#0ea5e9',
    minPlayerLevel: 8,
    gridDimensions: [1, 1]
  },
  {
    id: 'b20',
    name: 'Cyber Cafe & LAN Center',
    tier: 'RETAIL',
    cost: 850000,
    buyPrice: 850000,
    hourlyIncome: 71000000,
    hourlyYield: 71000000,
    income: 19722.2,
    drawType: 'retail',
    color: '#22c55e',
    minPlayerLevel: 8,
    gridDimensions: [1, 1]
  },

  // ==========================================
  // TIER 3: Commercial Hubs & Facilities (10 Entities)
  // ==========================================
  {
    id: 'b21',
    name: 'District Power Substation',
    tier: 'COMMERCIAL',
    cost: 1200000,
    buyPrice: 1200000,
    hourlyIncome: 98000000,
    hourlyYield: 98000000,
    income: 27222.2,
    drawType: 'commercial',
    color: '#f97316',
    minPlayerLevel: 9,
    gridDimensions: [2, 1]
  },
  {
    id: 'b22',
    name: 'Cinema Multiplex IMAX',
    tier: 'COMMERCIAL',
    cost: 1800000,
    buyPrice: 1800000,
    hourlyIncome: 145000000,
    hourlyYield: 145000000,
    income: 40277.7,
    drawType: 'commercial',
    color: '#a855f7',
    minPlayerLevel: 10,
    gridDimensions: [2, 1]
  },
  {
    id: 'b23',
    name: 'Ironclad Fitness Mega-Gym',
    tier: 'COMMERCIAL',
    cost: 2600000,
    buyPrice: 2600000,
    hourlyIncome: 205000000,
    hourlyYield: 205000000,
    income: 56944.4,
    drawType: 'commercial',
    color: '#ef4444',
    minPlayerLevel: 11,
    gridDimensions: [2, 1]
  },
  {
    id: 'b24',
    name: 'Performance Auto Workshop',
    tier: 'COMMERCIAL',
    cost: 3800000,
    buyPrice: 3800000,
    hourlyIncome: 295000000,
    hourlyYield: 295000000,
    income: 81944.4,
    drawType: 'commercial',
    color: '#3b82f6',
    minPlayerLevel: 12,
    gridDimensions: [2, 1]
  },
  {
    id: 'b25',
    name: 'Craft Microbrewery & Taphouse',
    tier: 'COMMERCIAL',
    cost: 5500000,
    buyPrice: 5500000,
    hourlyIncome: 420000000,
    hourlyYield: 420000000,
    income: 116666.6,
    drawType: 'commercial',
    color: '#eab308',
    minPlayerLevel: 13,
    gridDimensions: [2, 1]
  },
  {
    id: 'b26',
    name: 'Rooftop Sunset Lounge',
    tier: 'COMMERCIAL',
    cost: 8000000,
    buyPrice: 8000000,
    hourlyIncome: 600000000,
    hourlyYield: 600000000,
    income: 166666.6,
    drawType: 'commercial',
    color: '#ec4899',
    minPlayerLevel: 14,
    gridDimensions: [2, 1]
  },
  {
    id: 'b27',
    name: 'ASIC Crypto Mining Farm',
    tier: 'COMMERCIAL',
    cost: 12000000,
    buyPrice: 12000000,
    hourlyIncome: 880000000,
    hourlyYield: 880000000,
    income: 244444.4,
    drawType: 'commercial',
    color: '#10b981',
    minPlayerLevel: 15,
    gridDimensions: [2, 1]
  },
  {
    id: 'b28',
    name: 'Commercial Freight Depot',
    tier: 'COMMERCIAL',
    cost: 18000000,
    buyPrice: 18000000,
    hourlyIncome: 1300000000,
    hourlyYield: 1300000000,
    income: 361111.1,
    drawType: 'commercial',
    color: '#6366f1',
    minPlayerLevel: 16,
    gridDimensions: [2, 1]
  },
  {
    id: 'b29',
    name: 'Autonomous Delivery Hub',
    tier: 'COMMERCIAL',
    cost: 26000000,
    buyPrice: 26000000,
    hourlyIncome: 1850000000,
    hourlyYield: 1850000000,
    income: 513888.8,
    drawType: 'commercial',
    color: '#06b6d4',
    minPlayerLevel: 17,
    gridDimensions: [2, 1]
  },
  {
    id: 'b30',
    name: 'Fashion Wholesale Showroom',
    tier: 'COMMERCIAL',
    cost: 38000000,
    buyPrice: 38000000,
    hourlyIncome: 2650000000,
    hourlyYield: 2650000000,
    income: 736111.1,
    drawType: 'commercial',
    color: '#f43f5e',
    minPlayerLevel: 18,
    gridDimensions: [2, 1]
  },

  // ==========================================
  // TIER 4: Entertainment & Nightlife (10 Entities)
  // ==========================================
  {
    id: 'b31',
    name: 'Cyber Nightclub Vault',
    tier: 'ENTERTAINMENT',
    cost: 55000000,
    buyPrice: 55000000,
    hourlyIncome: 3800000000,
    hourlyYield: 3800000000,
    income: 1055555.5,
    drawType: 'entertainment',
    color: '#d946ef',
    minPlayerLevel: 19,
    gridDimensions: [2, 2]
  },
  {
    id: 'b32',
    name: 'Speakeasy Velvet Casino',
    tier: 'ENTERTAINMENT',
    cost: 80000000,
    buyPrice: 80000000,
    hourlyIncome: 5400000000,
    hourlyYield: 5400000000,
    income: 1500000.0,
    drawType: 'entertainment',
    color: '#f59e0b',
    minPlayerLevel: 20,
    gridDimensions: [2, 2]
  },
  {
    id: 'b33',
    name: 'Grand Royale Casino Resort',
    tier: 'ENTERTAINMENT',
    cost: 120000000,
    buyPrice: 120000000,
    hourlyIncome: 8000000000,
    hourlyYield: 8000000000,
    income: 2222222.2,
    drawType: 'entertainment',
    color: '#06b6d4',
    minPlayerLevel: 21,
    gridDimensions: [2, 2]
  },
  {
    id: 'b34',
    name: 'Pro Esports Stadium Arena',
    tier: 'ENTERTAINMENT',
    cost: 180000000,
    buyPrice: 180000000,
    hourlyIncome: 11800000000,
    hourlyYield: 11800000000,
    income: 3277777.7,
    drawType: 'entertainment',
    color: '#8b5cf6',
    minPlayerLevel: 22,
    gridDimensions: [2, 2]
  },
  {
    id: 'b35',
    name: 'Five-Star Marina Yacht Club',
    tier: 'ENTERTAINMENT',
    cost: 260000000,
    buyPrice: 260000000,
    hourlyIncome: 16800000000,
    hourlyYield: 16800000000,
    income: 4666666.6,
    drawType: 'entertainment',
    color: '#0ea5e9',
    minPlayerLevel: 23,
    gridDimensions: [2, 2]
  },
  {
    id: 'b36',
    name: 'Skyline Helicopter Heliport',
    tier: 'ENTERTAINMENT',
    cost: 380000000,
    buyPrice: 380000000,
    hourlyIncome: 24200000000,
    hourlyYield: 24200000000,
    income: 6722222.2,
    drawType: 'entertainment',
    color: '#10b981',
    minPlayerLevel: 24,
    gridDimensions: [2, 2]
  },
  {
    id: 'b37',
    name: 'Holographic VR Theme Park',
    tier: 'ENTERTAINMENT',
    cost: 550000000,
    buyPrice: 550000000,
    hourlyIncome: 34500000000,
    hourlyYield: 34500000000,
    income: 9583333.3,
    drawType: 'entertainment',
    color: '#ec4899',
    minPlayerLevel: 25,
    gridDimensions: [2, 2]
  },
  {
    id: 'b38',
    name: 'Thermal Geo-Spa Sanctuary',
    tier: 'ENTERTAINMENT',
    cost: 800000000,
    buyPrice: 800000000,
    hourlyIncome: 49500000000,
    hourlyYield: 49500000000,
    income: 13750000.0,
    drawType: 'entertainment',
    color: '#14b8a6',
    minPlayerLevel: 26,
    gridDimensions: [2, 2]
  },
  {
    id: 'b39',
    name: 'Concert Mega-Colosseum',
    tier: 'ENTERTAINMENT',
    cost: 1200000000,
    buyPrice: 1200000000,
    hourlyIncome: 73500000000,
    hourlyYield: 73500000000,
    income: 20416666.6,
    drawType: 'entertainment',
    color: '#e11d48',
    minPlayerLevel: 28,
    gridDimensions: [2, 2]
  },
  {
    id: 'b40',
    name: 'Diamond Sky Penthouse Club',
    tier: 'ENTERTAINMENT',
    cost: 1750000000,
    buyPrice: 1750000000,
    hourlyIncome: 106000000000,
    hourlyYield: 106000000000,
    income: 29444444.4,
    drawType: 'entertainment',
    color: '#facc15',
    minPlayerLevel: 30,
    gridDimensions: [2, 2]
  },

  // ==========================================
  // TIER 5: Corporate Monopolies (10 Entities)
  // ==========================================
  {
    id: 'b41',
    name: 'Quantum Computing Server Core',
    tier: 'CORPORATE',
    cost: 2500000000,
    buyPrice: 2500000000,
    hourlyIncome: 150000000000,
    hourlyYield: 150000000000,
    income: 41666666.6,
    drawType: 'corporate',
    color: '#3b82f6',
    minPlayerLevel: 32,
    gridDimensions: [2, 2]
  },
  {
    id: 'b42',
    name: 'AI Robotics Assembly Plant',
    tier: 'CORPORATE',
    cost: 3600000000,
    buyPrice: 3600000000,
    hourlyIncome: 212000000000,
    hourlyYield: 212000000000,
    income: 58888888.8,
    drawType: 'corporate',
    color: '#06b6d4',
    minPlayerLevel: 34,
    gridDimensions: [2, 2]
  },
  {
    id: 'b43',
    name: 'Genetics Bio-Foundry Complex',
    tier: 'CORPORATE',
    cost: 5200000000,
    buyPrice: 5200000000,
    hourlyIncome: 302000000000,
    hourlyYield: 302000000000,
    income: 83888888.8,
    drawType: 'corporate',
    color: '#10b981',
    minPlayerLevel: 36,
    gridDimensions: [2, 2]
  },
  {
    id: 'b44',
    name: 'Transnational Fintech Bank HQ',
    tier: 'CORPORATE',
    cost: 7500000000,
    buyPrice: 7500000000,
    hourlyIncome: 430000000000,
    hourlyYield: 430000000000,
    income: 119444444.4,
    drawType: 'corporate',
    color: '#8b5cf6',
    minPlayerLevel: 38,
    gridDimensions: [2, 2]
  },
  {
    id: 'b45',
    name: 'Advanced Aerospace Hangar',
    tier: 'CORPORATE',
    cost: 11000000000,
    buyPrice: 11000000000,
    hourlyIncome: 620000000000,
    hourlyYield: 620000000000,
    income: 172222222.2,
    drawType: 'corporate',
    color: '#6366f1',
    minPlayerLevel: 40,
    gridDimensions: [2, 2]
  },
  {
    id: 'b46',
    name: 'Global Media Broadcast Spire',
    tier: 'CORPORATE',
    cost: 16000000000,
    buyPrice: 16000000000,
    hourlyIncome: 890000000000,
    hourlyYield: 890000000000,
    income: 247222222.2,
    drawType: 'corporate',
    color: '#d946ef',
    minPlayerLevel: 42,
    gridDimensions: [2, 2]
  },
  {
    id: 'b47',
    name: 'Extreme EUV Semiconductor Fab',
    tier: 'CORPORATE',
    cost: 24000000000,
    buyPrice: 24000000000,
    hourlyIncome: 1320000000000,
    hourlyYield: 1320000000000,
    income: 366666666.6,
    drawType: 'corporate',
    color: '#f59e0b',
    minPlayerLevel: 44,
    gridDimensions: [2, 2]
  },
  {
    id: 'b48',
    name: 'Autonomous Drone Defense Complex',
    tier: 'CORPORATE',
    cost: 35000000000,
    buyPrice: 35000000000,
    hourlyIncome: 1900000000000,
    hourlyYield: 1900000000000,
    income: 527777777.7,
    drawType: 'corporate',
    color: '#ef4444',
    minPlayerLevel: 46,
    gridDimensions: [2, 2]
  },
  {
    id: 'b49',
    name: 'Tokamak Fusion Energy Plant',
    tier: 'CORPORATE',
    cost: 50000000000,
    buyPrice: 50000000000,
    hourlyIncome: 2700000000000,
    hourlyYield: 2700000000000,
    income: 750000000.0,
    drawType: 'corporate',
    color: '#00f0ff',
    minPlayerLevel: 48,
    gridDimensions: [2, 2]
  },
  {
    id: 'b50',
    name: 'Orbital Heavy Rocket Spaceport',
    tier: 'CORPORATE',
    cost: 75000000000,
    buyPrice: 75000000000,
    hourlyIncome: 4000000000000,
    hourlyYield: 4000000000000,
    income: 1111111111.1,
    drawType: 'corporate',
    color: '#ec4899',
    minPlayerLevel: 50,
    gridDimensions: [2, 2]
  },

  // ==========================================
  // TIER 6: Syndicate Apex Megastructures (10 Entities)
  // ==========================================
  {
    id: 'b51',
    name: 'Apex Sovereign Sky Citadel',
    tier: 'SYNDICATE_APEX',
    cost: 110000000000,
    buyPrice: 110000000000,
    hourlyIncome: 5800000000000,
    hourlyYield: 5800000000000,
    income: 1611111111.1,
    drawType: 'corporate',
    color: '#ffb703',
    minPlayerLevel: 52,
    gridDimensions: [2, 2]
  },
  {
    id: 'b52',
    name: 'Global Bullion Deep Reserve',
    tier: 'SYNDICATE_APEX',
    cost: 160000000000,
    buyPrice: 160000000000,
    hourlyIncome: 8300000000000,
    hourlyYield: 8300000000000,
    income: 2305555555.5,
    drawType: 'corporate',
    color: '#fbbf24',
    minPlayerLevel: 54,
    gridDimensions: [2, 2]
  },
  {
    id: 'b53',
    name: 'Planetary Satellite Defense Array',
    tier: 'SYNDICATE_APEX',
    cost: 240000000000,
    buyPrice: 240000000000,
    hourlyIncome: 12200000000000,
    hourlyYield: 12200000000000,
    income: 3388888888.8,
    drawType: 'corporate',
    color: '#38bdf8',
    minPlayerLevel: 56,
    gridDimensions: [2, 2]
  },
  {
    id: 'b54',
    name: 'Transcontinental Hyperloop Central',
    tier: 'SYNDICATE_APEX',
    cost: 360000000000,
    buyPrice: 360000000000,
    hourlyIncome: 18000000000000,
    hourlyYield: 18000000000000,
    income: 5000000000.0,
    drawType: 'corporate',
    color: '#a855f7',
    minPlayerLevel: 58,
    gridDimensions: [2, 2]
  },
  {
    id: 'b55',
    name: 'Deep Oceanic Data Citadel',
    tier: 'SYNDICATE_APEX',
    cost: 520000000000,
    buyPrice: 520000000000,
    hourlyIncome: 25500000000000,
    hourlyYield: 25500000000000,
    income: 7083333333.3,
    drawType: 'corporate',
    color: '#06b6d4',
    minPlayerLevel: 60,
    gridDimensions: [2, 2]
  },
  {
    id: 'b56',
    name: 'Orbital Space Elevator Anchor',
    tier: 'SYNDICATE_APEX',
    cost: 780000000000,
    buyPrice: 780000000000,
    hourlyIncome: 37500000000000,
    hourlyYield: 37500000000000,
    income: 10416666666.6,
    drawType: 'corporate',
    color: '#f43f5e',
    minPlayerLevel: 65,
    gridDimensions: [2, 2]
  },
  {
    id: 'b57',
    name: 'Asteroid Refining Smelter',
    tier: 'SYNDICATE_APEX',
    cost: 1150000000000,
    buyPrice: 1150000000000,
    hourlyIncome: 54500000000000,
    hourlyYield: 54500000000000,
    income: 15138888888.8,
    drawType: 'corporate',
    color: '#eab308',
    minPlayerLevel: 70,
    gridDimensions: [2, 2]
  },
  {
    id: 'b58',
    name: 'Dyson Orbital Solar Swarm',
    tier: 'SYNDICATE_APEX',
    cost: 1700000000000,
    buyPrice: 1700000000000,
    hourlyIncome: 79500000000000,
    hourlyYield: 79500000000000,
    income: 22083333333.3,
    drawType: 'corporate',
    color: '#22c55e',
    minPlayerLevel: 75,
    gridDimensions: [2, 2]
  },
  {
    id: 'b59',
    name: 'Singularity Quantum Brain Matrix',
    tier: 'SYNDICATE_APEX',
    cost: 2500000000000,
    buyPrice: 2500000000000,
    hourlyIncome: 115000000000000,
    hourlyYield: 115000000000000,
    income: 31944444444.4,
    drawType: 'corporate',
    color: '#a855f7',
    minPlayerLevel: 80,
    gridDimensions: [2, 2]
  },
  {
    id: 'b60',
    name: 'Citadel of the Archons: Apex Spire',
    tier: 'SYNDICATE_APEX',
    cost: 4000000000000,
    buyPrice: 4000000000000,
    hourlyIncome: 180000000000000,
    hourlyYield: 180000000000000,
    income: 50000000000.0,
    drawType: 'corporate',
    color: '#ffd700',
    minPlayerLevel: 85,
    gridDimensions: [2, 2]
  }
];

/**
 * Exact Level-Gated Unlock Curve:
 * - Player Lvl 1 to 50: Unlock 1 business every 5 Levels (Lvl 5, 10, 15, etc.). First business unlocked at Lvl 1.
 * - Player Lvl 51 to 100: Unlock 1 business every 4 Levels (Lvl 54, 58, 62, etc.).
 * - Player Lvl 101+: Unlock 1 business every 3 Levels (Lvl 103, 106, 109, etc.).
 */
export function getRequiredLevelForBusiness(index: number): number {
  if (index === 0) return 1;
  // Lvl 1 to 50: 1 every 5 levels (index 1 -> Lvl 5, index 2 -> Lvl 10, ..., index 10 -> Lvl 50)
  if (index <= 10) {
    return index * 5;
  }
  // Lvl 51 to 100: 1 every 4 levels (index 11 -> Lvl 54, index 12 -> Lvl 58, ..., index 22 -> Lvl 98)
  if (index <= 22) {
    return 50 + (index - 10) * 4;
  }
  // Lvl 101+: 1 every 3 levels (index 23 -> Lvl 103, index 24 -> Lvl 106, index 25 -> Lvl 109, etc.)
  return 100 + (index - 22) * 3;
}

/**
 * Payout cycle durations for real-time timers:
 * - Tier 1 (STREET): 15 seconds (10s - 30s)
 * - Tier 2 (RETAIL): 45 seconds (30s - 60s)
 * - Tier 3 (COMMERCIAL): 180 seconds (3 mins)
 * - Tier 4 (ENTERTAINMENT): 420 seconds (7 mins)
 * - Tier 5 (CORPORATE): 900 seconds (15 mins)
 * - Tier 6 (SYNDICATE_APEX): 1800 seconds (30 mins)
 */
export function getTierCycleSeconds(tier: BusinessStructure['tier']): number {
  switch (tier) {
    case 'STREET':
      return 15;
    case 'RETAIL':
      return 45;
    case 'COMMERCIAL':
      return 180;
    case 'ENTERTAINMENT':
      return 420;
    case 'CORPORATE':
      return 900;
    case 'SYNDICATE_APEX':
      return 1800;
    default:
      return 30;
  }
}

export const BUSINESS_CATALOG: BusinessStructure[] = RAW_BUSINESS_CATALOG.map((biz, index) => {
  // Smooth logarithmic tier progression: Business 1 = $100 up to Business 60 = ~600T
  // Strictly prevents overflow past safe integers while maintaining authentic tycoon ladder
  const baseCost = Math.round(100 * Math.pow(1.65, index));
  // Heavily nerfed passive cashflow: 3.5% base yield per hour to eliminate runaway inflation
  const hourlyYield = Math.max(1, Math.round(baseCost * 0.035));
  const incomePerSec = Number((hourlyYield / 3600).toFixed(4));
  const minLvl = getRequiredLevelForBusiness(index);
  const cycleSeconds = getTierCycleSeconds(biz.tier);
  // Base 2-hour shift payroll wage: ~4% of base acquisition cost
  const shiftWage = Math.max(10, Math.round(baseCost * 0.04));

  return {
    ...biz,
    cost: baseCost,
    buyPrice: baseCost,
    hourlyIncome: hourlyYield,
    hourlyYield: hourlyYield,
    income: incomePerSec,
    minPlayerLevel: minLvl,
    cycleDurationSeconds: cycleSeconds,
    baseShiftWage: shiftWage
  };
});

export const TIER_CONFIG: Record<BusinessStructure['tier'], {
  name: string;
  badgeColor: string;
  borderClass: string;
  glowClass: string;
  description: string;
}> = {
  STREET: {
    name: 'Tier 1: Neighborhood Kiosks',
    badgeColor: 'text-[#00f0ff] bg-[#00f0ff]/15 border-[#00f0ff]/40',
    borderClass: 'border-[#00f0ff]/30',
    glowClass: 'shadow-neon-cyan',
    description: 'Ground-level kiosks, stands, and sidewalk vendors generating quick cash on tight capital.'
  },
  RETAIL: {
    name: 'Tier 2: Retail Hubs',
    badgeColor: 'text-[#00ff66] bg-[#00ff66]/15 border-[#00ff66]/40',
    borderClass: 'border-[#00ff66]/30',
    glowClass: 'shadow-neon-green',
    description: 'Corner shops, laundromats, convenience stores, and neighborhood retail emporiums.'
  },
  COMMERCIAL: {
    name: 'Tier 3: Tech/Creative',
    badgeColor: 'text-[#fcee0a] bg-[#fcee0a]/15 border-[#fcee0a]/40',
    borderClass: 'border-[#fcee0a]/30',
    glowClass: 'shadow-neon-yellow',
    description: 'Multiplex cinemas, fitness complexes, crypto server rooms, and tech innovation studios.'
  },
  ENTERTAINMENT: {
    name: 'Tier 4: Commercial Real Estate',
    badgeColor: 'text-[#ff0055] bg-[#ff0055]/15 border-[#ff0055]/40',
    borderClass: 'border-[#ff0055]/30',
    glowClass: 'shadow-neon-magenta',
    description: 'High-roller casinos, speakeasies, mega concert colosseums, and luxury properties.'
  },
  CORPORATE: {
    name: 'Tier 5: Industrial Corporate',
    badgeColor: 'text-[#a855f7] bg-[#a855f7]/15 border-[#a855f7]/40',
    borderClass: 'border-[#a855f7]/30',
    glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    description: 'High-altitude corporate headquarters, AI robotics plants, semiconductor fabs, and heavy industry.'
  },
  SYNDICATE_APEX: {
    name: 'Tier 6: Elite Megastructures',
    badgeColor: 'text-[#ffb703] bg-[#ffb703]/20 border-[#ffb703]/50',
    borderClass: 'border-[#ffb703]/50',
    glowClass: 'shadow-[0_0_20px_rgba(255,183,3,0.5)]',
    description: 'Orbital spires, satellite defense matrices, Dyson arrays, and Archon Citadel Megastructures.'
  }
};

/**
 * Universal lookup helper to find a business definition by ID from BUSINESS_CATALOG
 */
export function getBusinessStructureById(id: string): BusinessStructure | undefined {
  if (!id) return undefined;
  const direct = BUSINESS_CATALOG.find(b => b.id === id);
  if (direct) return direct;

  if (id.startsWith('biz_')) {
    const numPart = id.replace('biz_', '');
    const padded = numPart.padStart(2, '0');
    const mapped = BUSINESS_CATALOG.find(b => b.id === `b${padded}`);
    if (mapped) return mapped;
  }

  if (id.startsWith('b') && id.length === 2) {
    const padded = 'b' + id.slice(1).padStart(2, '0');
    const mapped = BUSINESS_CATALOG.find(b => b.id === padded);
    if (mapped) return mapped;
  }

  return undefined;
}

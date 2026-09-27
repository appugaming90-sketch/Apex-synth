import { ChestTier, InventoryItem, ItemRarity, ItemType, ItemStats } from '../types';

export const CHEST_TIERS: ChestTier[] = [
  {
    id: 'chest_common',
    name: 'Common Supply Coffer',
    rarity: 'common',
    costCash: 500,
    description: 'Standard district supply stash containing salvaged components, starter utility perks, and common pets.',
    dropRates: {
      common: 0.88,
      uncommon: 0.117,
      rare: 0.003
    },
    petChance: 0.08,
    badge: 'TIER 1 • ENTRY',
    icon: '📦'
  },
  {
    id: 'chest_uncommon',
    name: 'Uncommon Cyber Crate',
    rarity: 'uncommon',
    costCash: 2500,
    description: 'Black-market shipment with military-grade parts and low-tier companion bio-drones (<0.5% legendary chance).',
    dropRates: {
      uncommon: 0.70,
      rare: 0.26,
      epic: 0.038,
      legendary: 0.002
    },
    petChance: 0.12,
    badge: 'TIER 2 • TACTICAL',
    icon: '🧰'
  },
  {
    id: 'chest_rare',
    name: 'Rare Syndicate Locker',
    rarity: 'rare',
    costCash: 10000,
    description: 'Seized syndicate safe containing encrypted ledger keys and trained cyber-hounds (<0.5% mythic chance).',
    dropRates: {
      rare: 0.60,
      epic: 0.34,
      legendary: 0.056,
      mythic: 0.004
    },
    petChance: 0.18,
    badge: 'TIER 3 • SYNDICATE',
    icon: '💼'
  },
  {
    id: 'chest_epic',
    name: 'Epic Matrix Vault',
    rarity: 'epic',
    costCash: 50000,
    description: 'High-security quantum-locked vault loaded with corporate cyberware and predatory AI beasts (<0.5% god-tier exotic).',
    dropRates: {
      epic: 0.55,
      legendary: 0.36,
      mythic: 0.086,
      exotic: 0.004
    },
    petChance: 0.25,
    badge: 'TIER 4 • HIGH-ROLLER',
    icon: '🔐'
  },
  {
    id: 'chest_legendary',
    name: 'Legendary Apex Cache',
    rarity: 'legendary',
    costCash: 250000,
    description: 'Executive megacorp treasure containing apex overclocks, mythical dragons, and rare exotic god-perks.',
    dropRates: {
      legendary: 0.60,
      mythic: 0.35,
      exotic: 0.05
    },
    petChance: 0.35,
    badge: 'TIER 5 • APEX OVERLORD',
    icon: '👑'
  },
  {
    id: 'chest_mythic',
    name: 'Mythic Singularity Box',
    rarity: 'mythic',
    costCash: 1000000,
    costGems: 100,
    description: 'Cosmic quantum artifact bending reality with immense syndicate multipliers and divine familiars.',
    dropRates: {
      mythic: 0.70,
      exotic: 0.30
    },
    petChance: 0.45,
    badge: 'TIER 6 • SINGULARITY',
    icon: '🌌'
  },
  {
    id: 'chest_exotic',
    name: 'Exotic Overlord Reliquary',
    rarity: 'exotic',
    costGems: 250,
    description: 'The supreme echelon of apex power. Guarantees top-tier exotic relics and titanic god-tier cyber-pets.',
    dropRates: {
      exotic: 1.00
    },
    petChance: 0.50,
    badge: 'TIER 7 • GOD TIER',
    icon: '⚡'
  }
];

export interface BaseCatalogItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  description: string;
  stats: ItemStats;
}

export const ITEMS_CATALOG: BaseCatalogItem[] = [
  // ==================== COMMON TIER ====================
  {
    id: 'c_perk_01',
    name: 'Copper Overclocker',
    type: 'perk',
    rarity: 'common',
    icon: '⚡',
    description: 'Modest electrical overclock boosting total syndicate revenue by +3%.',
    stats: { incomeMultiplierBonus: 0.03 }
  },
  {
    id: 'c_perk_02',
    name: 'Street Cred Lanyard',
    type: 'perk',
    rarity: 'common',
    icon: '📇',
    description: 'Basic courier networking credentials granting +5% bonus experience.',
    stats: { xpBonus: 0.05 }
  },
  {
    id: 'c_perk_03',
    name: 'Lucky Penny Chip',
    type: 'perk',
    rarity: 'common',
    icon: '🪙',
    description: 'Implanted micro-capacitor that gives a slight +2% luck boost.',
    stats: { luckBonus: 0.02 }
  },
  {
    id: 'c_perk_04',
    name: 'Scavenger Blueprint',
    type: 'perk',
    rarity: 'common',
    icon: '📜',
    description: 'Recycled architecture schematics reducing construction costs by 2%.',
    stats: { costDiscount: 0.02 }
  },
  {
    id: 'c_item_01',
    name: 'Rusty Data Disc',
    type: 'item',
    rarity: 'common',
    icon: '💾',
    description: 'An old magnetic storage unit containing legacy corporate contracts.',
    stats: { clickBonus: 10 }
  },
  {
    id: 'c_item_02',
    name: 'Sub-District Transit Pass',
    type: 'item',
    rarity: 'common',
    icon: '🎫',
    description: 'Low-tier metro card for underground transportation.',
    stats: { costDiscount: 0.01 }
  },
  {
    id: 'c_pet_dog',
    name: 'Dog',
    type: 'pet',
    rarity: 'common',
    icon: '🐶',
    description: 'A loyal, cheerful pup companion fetching extra pocket credits! (+4% Income, +2% Luck).',
    stats: { incomeMultiplierBonus: 0.04, luckBonus: 0.02 }
  },

  // ==================== UNCOMMON TIER ====================
  {
    id: 'u_perk_01',
    name: 'Sub-Net Wiretap',
    type: 'perk',
    rarity: 'uncommon',
    icon: '📡',
    description: 'Intercepts municipal communications to yield +6% syndicate income.',
    stats: { incomeMultiplierBonus: 0.06 }
  },
  {
    id: 'u_perk_02',
    name: 'Neural Cache Mk.I',
    type: 'perk',
    rarity: 'uncommon',
    icon: '🧠',
    description: 'Expanded neural pathways boosting XP acquisition rate by +10%.',
    stats: { xpBonus: 0.10 }
  },
  {
    id: 'u_perk_03',
    name: 'Loaded Cyber-Dice',
    type: 'perk',
    rarity: 'uncommon',
    icon: '🎲',
    description: 'Magnetic counter-weights providing +5% luck in the casino and crate rolls.',
    stats: { luckBonus: 0.05 }
  },
  {
    id: 'u_perk_04',
    name: 'Bulk Wholesaler Permit',
    type: 'perk',
    rarity: 'uncommon',
    icon: '📑',
    description: 'Permit for discounted district materials; cuts building costs by 4%.',
    stats: { costDiscount: 0.04 }
  },
  {
    id: 'u_item_01',
    name: 'Encrypted Syndicate Flash',
    type: 'item',
    rarity: 'uncommon',
    icon: '🗝️',
    description: 'Contains high-frequency financial algorithms.',
    stats: { incomeMultiplierBonus: 0.02 }
  },
  {
    id: 'u_pet_01',
    name: 'Neon Robo-Beetle',
    type: 'pet',
    rarity: 'uncommon',
    icon: '🪲',
    description: 'Sturdy bio-mechanical companion scouting micro-gains. (+5% Income, +3% Luck).',
    stats: { incomeMultiplierBonus: 0.05, luckBonus: 0.03 }
  },
  {
    id: 'u_pet_02',
    name: 'Cyber-Drone Sparrow',
    type: 'pet',
    rarity: 'uncommon',
    icon: '🕊️',
    description: 'Agile aerial drone streaming telemetry feeds. (+8% XP, +3% Income).',
    stats: { xpBonus: 0.08, incomeMultiplierBonus: 0.03 }
  },

  // ==================== RARE TIER ====================
  {
    id: 'r_perk_01',
    name: 'High-Yield Arbitrage Bot',
    type: 'perk',
    rarity: 'rare',
    icon: '📈',
    description: 'High-frequency algorithmic trade runner generating +12% syndicate revenue.',
    stats: { incomeMultiplierBonus: 0.12 }
  },
  {
    id: 'r_perk_02',
    name: 'Deep Neural Accelerator',
    type: 'perk',
    rarity: 'rare',
    icon: '💡',
    description: 'Cranial overclocking device driving +18% bonus experience gain.',
    stats: { xpBonus: 0.18 }
  },
  {
    id: 'r_perk_03',
    name: 'Casino VIP Signet',
    type: 'perk',
    rarity: 'rare',
    icon: '💍',
    description: 'Gold-plated ring recognized by pit bosses. Grants +10% casino and drop luck.',
    stats: { luckBonus: 0.10 }
  },
  {
    id: 'r_perk_04',
    name: 'Zoning Exemption Treaty',
    type: 'perk',
    rarity: 'rare',
    icon: '🏛️',
    description: 'Bypasses city building inspectors, reducing all plot and spire costs by 7%.',
    stats: { costDiscount: 0.07 }
  },
  {
    id: 'r_item_01',
    name: 'Titanium Quantum RAM',
    type: 'item',
    rarity: 'rare',
    icon: '🎛️',
    description: 'Ultra-dense processing unit primed for holding slot trading or compute boosts.',
    stats: { incomeMultiplierBonus: 0.05, xpBonus: 0.05 }
  },
  {
    id: 'r_pet_01',
    name: 'Cyber-Hound K-9',
    type: 'pet',
    rarity: 'rare',
    icon: '🐕',
    description: 'Loyal armored hound trained in security and scenting riches. (+12% Income, +8% Luck).',
    stats: { incomeMultiplierBonus: 0.12, luckBonus: 0.08 }
  },
  {
    id: 'r_pet_02',
    name: 'Holo-Chameleon',
    type: 'pet',
    rarity: 'rare',
    icon: '🦎',
    description: 'Camouflaged cyber-reptile evading corporate taxes. (+15% XP, +10% Luck).',
    stats: { xpBonus: 0.15, luckBonus: 0.10 }
  },
  {
    id: 'r_pet_shiba',
    name: 'Shiba Inu',
    type: 'pet',
    rarity: 'rare',
    icon: '🐕',
    description: 'Much wow! Very crypto! Beloved high-roller companion multiplying empire revenue. (+16% Income, +12% Luck).',
    stats: { incomeMultiplierBonus: 0.16, luckBonus: 0.12 }
  },

  // ==================== EPIC TIER ====================
  {
    id: 'e_perk_01',
    name: 'Zero-Day Market Siphon',
    type: 'perk',
    rarity: 'epic',
    icon: '👾',
    description: 'Military-grade cyber-weapon routing offshore bank dividends. (+20% Income).',
    stats: { incomeMultiplierBonus: 0.20 }
  },
  {
    id: 'e_perk_02',
    name: 'Quantum Synapse Matrix',
    type: 'perk',
    rarity: 'epic',
    icon: '🔮',
    description: 'Synapses operating at sub-atomic frequencies. Grants +28% bonus XP.',
    stats: { xpBonus: 0.28 }
  },
  {
    id: 'e_perk_03',
    name: 'Lady Fortune Nanites',
    type: 'perk',
    rarity: 'epic',
    icon: '✨',
    description: 'Sub-dermal luck manipulators providing an impressive +16% luck bonus.',
    stats: { luckBonus: 0.16 }
  },
  {
    id: 'e_perk_04',
    name: 'Megacorp Prefab Monopoly',
    type: 'perk',
    rarity: 'epic',
    icon: '🏗️',
    description: 'Direct supply lines from corporate foundries; slashes costs by 12%.',
    stats: { costDiscount: 0.12 }
  },
  {
    id: 'e_item_01',
    name: 'Zero-Gravity Gyroscope',
    type: 'item',
    rarity: 'epic',
    icon: '🧭',
    description: 'Pristine space station guidance relic valued immensely by collectors.',
    stats: { incomeMultiplierBonus: 0.08, luckBonus: 0.06 }
  },
  {
    id: 'e_pet_01',
    name: 'Apex Cyber-Panther',
    type: 'pet',
    rarity: 'epic',
    icon: '🐆',
    description: 'Sleek predatory android radiating lethal style. (+22% Income, +15% Luck).',
    stats: { incomeMultiplierBonus: 0.22, luckBonus: 0.15 }
  },
  {
    id: 'e_pet_02',
    name: 'Mecha-Falcon Razor',
    type: 'pet',
    rarity: 'epic',
    icon: '🦅',
    description: 'High-altitude razor bird striking profitable opportunities. (+25% XP, +18% Luck).',
    stats: { xpBonus: 0.25, luckBonus: 0.18 }
  },
  {
    id: 'e_pet_shadow_wolf',
    name: 'Shadow Wolf',
    type: 'pet',
    rarity: 'epic',
    icon: '🐺',
    description: 'Fearsome nocturnal beast prowling the shadows with critical stealth multipliers. (+28% Income, +20% Luck, +15% XP).',
    stats: { incomeMultiplierBonus: 0.28, luckBonus: 0.20, xpBonus: 0.15 }
  },

  // ==================== LEGENDARY TIER ====================
  {
    id: 'l_perk_01',
    name: 'Orbital Uplink Core',
    type: 'perk',
    rarity: 'legendary',
    icon: '🛰️',
    description: 'Direct satellite grid handshake flooding your accounts with +32% income.',
    stats: { incomeMultiplierBonus: 0.32 }
  },
  {
    id: 'l_perk_02',
    name: 'Omniscient Mind Imprint',
    type: 'perk',
    rarity: 'legendary',
    icon: '🧬',
    description: 'Transfers decades of tactical mastermind instincts. (+40% XP bonus).',
    stats: { xpBonus: 0.40 }
  },
  {
    id: 'l_perk_03',
    name: 'Crown of the High-Roller',
    type: 'perk',
    rarity: 'legendary',
    icon: '👑',
    description: 'Legendary casino relic bending odds to your favor. (+25% Luck).',
    stats: { luckBonus: 0.25 }
  },
  {
    id: 'l_perk_04',
    name: 'Nanotech Matter Condenser',
    type: 'perk',
    rarity: 'legendary',
    icon: '⚛️',
    description: 'Materializes construction elements on-demand; -18% to all empire costs.',
    stats: { costDiscount: 0.18 }
  },
  {
    id: 'l_item_01',
    name: 'Sovereign Syndicate Seal',
    type: 'item',
    rarity: 'legendary',
    icon: '🔱',
    description: 'The golden emblem of a ruling syndicate executive.',
    stats: { incomeMultiplierBonus: 0.15, luckBonus: 0.10 }
  },
  {
    id: 'l_pet_01',
    name: 'Cyber-Dragon Ignis',
    type: 'pet',
    rarity: 'legendary',
    icon: '🐉',
    description: 'Mythical cybernetic beast breathing plasma fire. (+35% Income, +25% Luck, +20% XP).',
    stats: { incomeMultiplierBonus: 0.35, luckBonus: 0.25, xpBonus: 0.20 }
  },
  {
    id: 'l_pet_02',
    name: 'Hydra Matrix Core',
    type: 'pet',
    rarity: 'legendary',
    icon: '🐍',
    description: 'Multi-headed bio-synthesized serpent regenerating wealth. (+30% Income, +30% XP, +22% Luck).',
    stats: { incomeMultiplierBonus: 0.30, xpBonus: 0.30, luckBonus: 0.22 }
  },
  {
    id: 'l_pet_shadow_dragon',
    name: 'Shadow Dragon',
    type: 'pet',
    rarity: 'legendary',
    icon: '🐉',
    description: 'Roblox-legendary dark phantom dragon commanding phantom void wealth! (+45% Income, +30% Luck, +30% XP).',
    stats: { incomeMultiplierBonus: 0.45, luckBonus: 0.30, xpBonus: 0.30 }
  },

  // ==================== MYTHIC TIER ====================
  {
    id: 'm_perk_01',
    name: 'Singularity Money-Engine',
    type: 'perk',
    rarity: 'mythic',
    icon: '🌀',
    description: 'Compresses economic spacetime to multiply empire income by +50%.',
    stats: { incomeMultiplierBonus: 0.50 }
  },
  {
    id: 'm_perk_02',
    name: 'Quantum Destiny Weave',
    type: 'perk',
    rarity: 'mythic',
    icon: '🌌',
    description: 'Manipulates reality probability matrices. Grants +35% cosmic luck.',
    stats: { luckBonus: 0.35 }
  },
  {
    id: 'm_perk_03',
    name: 'Architect of Reality',
    type: 'perk',
    rarity: 'mythic',
    icon: '🏛️',
    description: 'Spire materials cost 25% less across all sectors and tiers.',
    stats: { costDiscount: 0.25 }
  },
  {
    id: 'm_item_01',
    name: 'Infinite Matrix Core',
    type: 'item',
    rarity: 'mythic',
    icon: '💎',
    description: 'A glowing singularity gem holding infinite financial computations.',
    stats: { incomeMultiplierBonus: 0.25, luckBonus: 0.20 }
  },
  {
    id: 'm_pet_01',
    name: 'Singularity Fenrir God-Wolf',
    type: 'pet',
    rarity: 'mythic',
    icon: '🐺',
    description: 'Devourer of financial empires. Bestows tremendous cosmic power (+50% Income, +35% Luck, +40% XP).',
    stats: { incomeMultiplierBonus: 0.50, luckBonus: 0.35, xpBonus: 0.40 }
  },
  {
    id: 'm_pet_02',
    name: 'Quantum Leviathan',
    type: 'pet',
    rarity: 'mythic',
    icon: '🐋',
    description: 'Majestic deep-network leviathan surfing the digital cosmos. (+45% Income, +40% Luck, +50% XP).',
    stats: { incomeMultiplierBonus: 0.45, luckBonus: 0.40, xpBonus: 0.50 }
  },
  {
    id: 'm_pet_fire_phoenix',
    name: 'Fire Phoenix',
    type: 'pet',
    rarity: 'mythic',
    icon: '🔥',
    description: 'Roblox-legendary bird of blazing rebirth! Ignites immense economic prosperity. (+55% Income, +40% Luck, +45% XP).',
    stats: { incomeMultiplierBonus: 0.55, luckBonus: 0.40, xpBonus: 0.45 }
  },

  // ==================== EXOTIC TIER (GOD-TIER) ====================
  {
    id: 'x_perk_01',
    name: 'God-Code: Apex Dominance',
    type: 'perk',
    rarity: 'exotic',
    icon: '♾️',
    description: 'Transcends all network limits. Grants unprecedented +75% global empire income overclock.',
    stats: { incomeMultiplierBonus: 0.75 }
  },
  {
    id: 'x_perk_02',
    name: 'Crown of the Cyber-Deity',
    type: 'perk',
    rarity: 'exotic',
    icon: '👑',
    description: 'Ultimate divine authorization. Grants +50% Luck and +60% XP Gain.',
    stats: { luckBonus: 0.50, xpBonus: 0.60 }
  },
  {
    id: 'x_item_01',
    name: 'Omniverse Processor Relic',
    type: 'item',
    rarity: 'exotic',
    icon: '🌟',
    description: 'An extraterrestrial computational cube harvested from deep orbital anomalies.',
    stats: { incomeMultiplierBonus: 0.40, luckBonus: 0.30, xpBonus: 0.40 }
  },
  {
    id: 'x_pet_01',
    name: 'Celestial Apex Phoenix',
    type: 'pet',
    rarity: 'exotic',
    icon: '🦚',
    description: 'Divine immortal bird reborn from digital supernova flames (+80% Income, +50% Luck, +75% XP).',
    stats: { incomeMultiplierBonus: 0.80, luckBonus: 0.50, xpBonus: 0.75 }
  },
  {
    id: 'x_pet_02',
    name: 'Cyber-Deity Anubis',
    type: 'pet',
    rarity: 'exotic',
    icon: '🐕‍🦺',
    description: 'The ancient underworld guardian reincarnated as supreme cybernetic protector (+75% Income, +60% Luck, +70% XP).',
    stats: { incomeMultiplierBonus: 0.75, luckBonus: 0.60, xpBonus: 0.70 }
  },
  {
    id: 'x_pet_titanic_dragon',
    name: 'Titanic Golden Dragon',
    type: 'pet',
    rarity: 'exotic',
    icon: '🐲',
    description: 'The supreme Roblox-style titan! Gigantic shimmering 24K pure gold dragon granting god-tier empire mastery (+100% Income, +60% Luck, +80% XP).',
    stats: { incomeMultiplierBonus: 1.00, luckBonus: 0.60, xpBonus: 0.80 }
  },

  // ==================== RECOVERY & CONSUMABLES ====================
  {
    id: 'con_energy_01',
    name: 'Neon Adrenaline Drink',
    type: 'consumable',
    rarity: 'common',
    icon: '⚡',
    description: 'Electrolyte stim-drink restoring +25 Energy immediately.',
    stats: { energyRestore: 25 }
  },
  {
    id: 'con_credit_voucher_01',
    name: 'Scavenger Credit Voucher',
    type: 'consumable',
    rarity: 'uncommon',
    icon: '🎟️',
    description: 'Redeemable sub-district coupon granting $15,000 instant liquid credits.',
    stats: { instantCash: 15000 }
  },
  {
    id: 'con_stamina_02',
    name: 'Cyber Stamina Stimpack',
    type: 'consumable',
    rarity: 'rare',
    icon: '💉',
    description: 'Military neuro-enhancer restoring +60 Energy and granting quick action burst.',
    stats: { energyRestore: 60 }
  },
  {
    id: 'con_overclock_01',
    name: 'Quantum Overclock Serum',
    type: 'consumable',
    rarity: 'epic',
    icon: '🧪',
    description: 'Experimental syndicate compound instantly boosting wealth reserves with $100,000 credits & +80 Energy.',
    stats: { energyRestore: 80, instantCash: 100000 }
  },
  {
    id: 'con_archon_elixir',
    name: 'Archon Singularity Elixir',
    type: 'consumable',
    rarity: 'legendary',
    icon: '🏺',
    description: 'Mythical cyber-alchemical flask granting full +100 Max Energy and $500,000 treasury windfall.',
    stats: { energyRestore: 100, instantCash: 500000 }
  }
];

/**
 * Generate a drop from a chest based on chest tier, drop tables, and player luck bonus
 */
export function rollChestDrop(chest: ChestTier, playerLuckBonus: number = 0): InventoryItem {
  // Luck bonus modifies probability of higher tiers
  const roll = Math.random();
  const effectiveLuck = Math.max(0, playerLuckBonus);

  // Check pet drop first
  const effectivePetChance = Math.min(0.9, chest.petChance * (1 + effectiveLuck));
  const isPetDrop = Math.random() < effectivePetChance;

  let selectedRarity: ItemRarity = 'common';

  // Calculate cumulative probabilities with luck bias towards higher rarities
  const rarities: ItemRarity[] = ['exotic', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
  let cumulative = 0;

  for (const r of rarities) {
    let rate = chest.dropRates[r] || 0;
    if (rate > 0) {
      // Luck boosts higher tier rates
      if (r === 'exotic' || r === 'mythic' || r === 'legendary') {
        rate = rate * (1 + effectiveLuck * 0.5);
      }
      cumulative += rate;
      if (roll <= cumulative) {
        selectedRarity = r;
        break;
      }
    }
  }

  // Filter available items
  let candidates = ITEMS_CATALOG.filter(item => {
    if (isPetDrop) {
      return item.type === 'pet' && item.rarity === selectedRarity;
    }
    return item.rarity === selectedRarity;
  });

  // If no candidates found for exact rarity & pet criteria, broaden criteria safely
  if (candidates.length === 0) {
    candidates = ITEMS_CATALOG.filter(item => item.rarity === selectedRarity);
  }
  if (candidates.length === 0) {
    candidates = ITEMS_CATALOG;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    id: chosen.id,
    instanceId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    name: chosen.name,
    type: chosen.type,
    rarity: chosen.rarity,
    icon: chosen.icon,
    description: chosen.description,
    stats: { ...chosen.stats },
    acquiredAt: Date.now()
  };
}

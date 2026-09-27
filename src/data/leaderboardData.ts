export interface LeaderboardPlayer {
  id: string;
  username: string;
  rankTitle: string;
  level: number;
  netWorth: number;
  gems: number;
  buildingsCount: number;
  clout: number;
  badge: string;
  isOnline: boolean;
  avatarChar: string;
}

export type LeaderboardCategory = 'netWorth' | 'level' | 'gems' | 'buildings';

export const MOCK_LEADERBOARD_PLAYERS: LeaderboardPlayer[] = [
  {
    id: 'p_01',
    username: 'Sovereign_Zero',
    rankTitle: 'Syndicate Sovereign',
    level: 58,
    netWorth: 85400000,
    gems: 2450,
    buildingsCount: 62,
    clout: 15,
    badge: '👑 Syndicate Overlord',
    isOnline: true,
    avatarChar: 'Ω'
  },
  {
    id: 'p_02',
    username: 'NeonValkyrie',
    rankTitle: 'Syndicate Sovereign',
    level: 52,
    netWorth: 64200000,
    gems: 1890,
    buildingsCount: 56,
    clout: 12,
    badge: '⚡ Megacorp Apex',
    isOnline: true,
    avatarChar: 'V'
  },
  {
    id: 'p_03',
    username: 'Vektor_Prime',
    rankTitle: 'Apex Tycoon',
    level: 46,
    netWorth: 48900000,
    gems: 1320,
    buildingsCount: 48,
    clout: 9,
    badge: '💎 Cyber Whale',
    isOnline: false,
    avatarChar: 'K'
  },
  {
    id: 'p_04',
    username: 'KuroNeko_99',
    rankTitle: 'Apex Tycoon',
    level: 41,
    netWorth: 37500000,
    gems: 980,
    buildingsCount: 42,
    clout: 7,
    badge: '🔥 Casino Legend',
    isOnline: true,
    avatarChar: '猫'
  },
  {
    id: 'p_05',
    username: 'Hex_Overlord',
    rankTitle: 'Corporate Executive',
    level: 35,
    netWorth: 26800000,
    gems: 820,
    buildingsCount: 38,
    clout: 6,
    badge: '🛡️ Fortress Architect',
    isOnline: true,
    avatarChar: 'H'
  },
  {
    id: 'p_06',
    username: 'Cipher_Ghost',
    rankTitle: 'Corporate Executive',
    level: 29,
    netWorth: 18400000,
    gems: 640,
    buildingsCount: 31,
    clout: 5,
    badge: '🕶️ Ghost Operator',
    isOnline: false,
    avatarChar: 'Ψ'
  },
  {
    id: 'p_07',
    username: 'Aethel_Corp',
    rankTitle: 'Syndicate Broker',
    level: 24,
    netWorth: 12100000,
    gems: 510,
    buildingsCount: 26,
    clout: 4,
    badge: '📊 High-Yield Broker',
    isOnline: true,
    avatarChar: 'A'
  },
  {
    id: 'p_08',
    username: 'Nyx_Runner',
    rankTitle: 'Syndicate Broker',
    level: 19,
    netWorth: 7800000,
    gems: 390,
    buildingsCount: 20,
    clout: 3,
    badge: '🚀 Speed Hustler',
    isOnline: false,
    avatarChar: 'N'
  },
  {
    id: 'p_09',
    username: 'Sol_Dominus',
    rankTitle: 'District Operator',
    level: 14,
    netWorth: 4200000,
    gems: 260,
    buildingsCount: 15,
    clout: 2,
    badge: '☀️ District Builder',
    isOnline: true,
    avatarChar: 'S'
  },
  {
    id: 'p_10',
    username: 'ByteBaron',
    rankTitle: 'District Operator',
    level: 9,
    netWorth: 1850000,
    gems: 140,
    buildingsCount: 10,
    clout: 1,
    badge: '⚙️ Grid Tech',
    isOnline: true,
    avatarChar: 'B'
  }
];

/**
 * Asynchronous simulated API fetch to load the latest syndicate global rankings
 */
export async function fetchSyndicateLeaderboard(
  category: LeaderboardCategory = 'netWorth'
): Promise<LeaderboardPlayer[]> {
  // Simulate network roundtrip latency
  await new Promise(resolve => setTimeout(resolve, 350));

  const copy = [...MOCK_LEADERBOARD_PLAYERS];

  copy.sort((a, b) => {
    if (category === 'netWorth') return b.netWorth - a.netWorth;
    if (category === 'level') return b.level - a.level;
    if (category === 'gems') return b.gems - a.gems;
    if (category === 'buildings') return b.buildingsCount - a.buildingsCount;
    return b.netWorth - a.netWorth;
  });

  return copy;
}

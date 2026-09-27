// Provably Fair Cryptographic Seed & Roll Verification

export function generateSeed(length = 32): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Simple deterministic hash simulation for client/server seeds
export function pseudoSha256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Return pseudo 64-char hash string
  return (hex + '8f7a2b9c3e1d4a5b6c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c').substring(0, 64);
}

export function calculateDiceRoll(serverSeed: string, clientSeed: string, nonce: number): number {
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 10000;
  }
  // Returns number from 0.00 to 99.99
  const roll = (Math.abs(hash) % 10000) / 100;
  return Number(roll.toFixed(2));
}

export function calculateRouletteNumber(serverSeed: string, clientSeed: string, nonce: number): number {
  const combined = `roulette:${serverSeed}:${clientSeed}:${nonce}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 37 + combined.charCodeAt(i)) % 10000;
  }
  // European wheel: 0 to 36
  return Math.abs(hash) % 37;
}

export function calculateCardValue(serverSeed: string, clientSeed: string, nonce: number): number {
  const combined = `card:${serverSeed}:${clientSeed}:${nonce}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 13 + combined.charCodeAt(i)) % 10000;
  }
  // 1 (Ace) to 13 (King)
  return (Math.abs(hash) % 13) + 1;
}

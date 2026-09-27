// Universal compact number and currency formatting for Apex Economy Tycoon
// Strictly prevents massive strings of zeros from overflowing UI containers and screen margins.

const COMPACT_SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg',
  'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'Tg'
];

/**
 * Format any positive or negative number to compact notation:
 * 500 -> "500"
 * 1,250 -> "1.25K"
 * 15,200 -> "15.2K"
 * 1,500,000 -> "1.5M"
 * 12,400,000,000 -> "12.4B"
 * 50,000,000,000,000 -> "50T"
 */
export function formatCompactNumber(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  if (!isFinite(num)) return '∞';

  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs < 1000) {
    if (Number.isInteger(num)) return sign + abs.toString();
    return sign + abs.toFixed(abs < 10 ? 2 : 1);
  }

  const tier = Math.min(COMPACT_SUFFIXES.length - 1, Math.floor(Math.log10(abs) / 3));
  const scale = Math.pow(10, tier * 3);
  const scaled = abs / scale;
  const suffix = COMPACT_SUFFIXES[tier] || '';

  let formatted: string;
  if (scaled >= 100) {
    formatted = scaled.toFixed(1);
  } else if (scaled >= 10) {
    formatted = scaled.toFixed(decimals > 1 ? 1 : decimals);
  } else {
    formatted = scaled.toFixed(decimals);
  }

  // Remove redundant trailing zeros (e.g. 1.00M -> 1M, 1.50M -> 1.5M)
  formatted = formatted.replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');

  return `${sign}${formatted}${suffix}`;
}

/**
 * Standard Cash Currency Formatter:
 * $500
 * $1.25K
 * $1.5M
 * $12.4B
 * $50T
 */
export function formatCash(amount: number | string | null | undefined, decimals = 2): string {
  if (amount === null || amount === undefined) return '$0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';
  if (!isFinite(num)) return '$∞';

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs < 1000) {
    return `${sign}$${Math.floor(abs).toLocaleString()}`;
  }

  return `${sign}$${formatCompactNumber(abs, decimals)}`;
}

/**
 * Format active shift countdown timer as hh:mm:ss:
 * e.g. 7199s -> "01:59:59"
 */
export function formatShiftTimer(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * MANDATORY helper formatNum(val) wraps EVERY number (K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc)
 */
export const formatNum = formatCompactNumber;


/**
 * Format hourly yield or rate per second:
 * e.g. "+$180/hr" or "+$1.25M/hr"
 */
export function formatRatePerHour(hourly: number | string | null | undefined): string {
  const num = typeof hourly === 'string' ? parseFloat(hourly) : (hourly || 0);
  const prefix = num >= 0 ? '+' : '';
  return `${prefix}${formatCash(num)}/hr`;
}

/**
 * Format rate per second:
 * e.g. "+$0.05/s" or "+$2.50K/s"
 */
export function formatPerSec(rate: number | string | null | undefined): string {
  const num = typeof rate === 'string' ? parseFloat(rate) : (rate || 0);
  const prefix = num >= 0 ? '+' : '';
  if (Math.abs(num) < 1 && Math.abs(num) > 0) {
    return `${prefix}$${num.toFixed(2)}/s`;
  }
  return `${prefix}${formatCash(num)}/s`;
}

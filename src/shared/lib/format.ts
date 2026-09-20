/** Display helpers shared across features. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Parse a `YYYY-MM-DD` (or ISO) string as a local date, avoiding the UTC shift. */
export function parseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `YYYY-MM-DD` in local time, the format the API stores. */
export function toDateKey(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** "Sat, 20 Sep" */
export function formatDay(value: string | Date | undefined | null): string {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return '—';
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** "20 Sep 2026" */
export function formatDate(value: string | Date | undefined | null): string {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return '—';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "9:30 AM" from a Date. */
export function formatClock(date: Date): string {
  const hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${suffix}`;
}

/** Minutes since midnight from "9:00 AM" / "17:30"; null when unparseable (mirrors the API). */
export function parseClock(value: string | undefined | null): number | null {
  if (!value) return null;
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(value.trim());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const suffix = match[3]?.toUpperCase();
  if (suffix === 'PM' && hours < 12) hours += 12;
  if (suffix === 'AM' && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Hours between two clock strings, or 0 when either is invalid. */
export function hoursBetween(start: string, end: string): number {
  const a = parseClock(start);
  const b = parseClock(end);
  if (a === null || b === null || b <= a) return 0;
  return (b - a) / 60;
}

/** "$45.00" */
export function formatMoney(amount: number | undefined | null, currency = 'usd'): string {
  const value = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

/** "2h ago", "Yesterday", "12 Mar" */
export function formatRelative(value: string | Date | undefined | null): string {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** "Ada L." */
export function shortName(first?: string, last?: string): string {
  const f = first?.trim() ?? '';
  const l = last?.trim() ?? '';
  return l ? `${f} ${l[0]}.` : f;
}

export function fullName(user?: { FirstName?: string; LastName?: string } | null): string {
  if (!user) return '';
  return [user.FirstName, user.LastName].filter(Boolean).join(' ');
}

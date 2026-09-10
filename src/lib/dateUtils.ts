// ==========================================
// Bangladesh Standard Time (BST, UTC+6) Utilities
// ==========================================

export const BST_TIMEZONE = 'Asia/Dhaka';
export const OPERATIONAL_BUFFER_MINUTES = 30;

/**
 * Returns the current calendar date in Bangladesh Standard Time (BST, UTC+6)
 * formatted strictly as "YYYY-MM-DD". Standardized using formatToParts to avoid locale discrepancies.
 */
export function getCurrentBSTDate(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

/**
 * Returns the UTC Date objects representing the exact start (00:00:00.000)
 * and end (23:59:59.999) of a calendar day in Bangladesh Standard Time (+06:00).
 */
export function getBSTDayBoundaries(dateStr: string): {
  startOfDayBST: Date;
  endOfDayBST: Date;
} {
  const startOfDayBST = new Date(`${dateStr}T00:00:00.000+06:00`);
  const endOfDayBST = new Date(`${dateStr}T23:59:59.999+06:00`);

  return { startOfDayBST, endOfDayBST };
}


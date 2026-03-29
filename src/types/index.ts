/**
 * Core Data Types and Interfaces
 */

export interface Ticket {
  id: string;
  status: string;
  category: string;
  createdDate: string;
  lastUpdatedDate: string;
  priority?: string;
  title?: string;
  description?: string;
  assignee?: string;
  product?: string;
}

export interface IssueCategory {
  name: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UnresolvedTicket {
  id: string;
  status: string;
  reason: string;
  daysSinceUpdate: number;
}

export interface KeyPattern {
  pattern: string;
  impact: string;
  recommendation: string;
}

export interface ManagerSummary {
  executiveSummary: string;
  topIssues: IssueCategory[];
  unresolvedTickets: UnresolvedTicket[];
  keyPatterns: KeyPattern[];
}

export interface AnalysisError {
  message: string;
  code: string;
  timestamp: string;
}

export interface GeminiAnalysisRequest {
  tickets: Ticket[];
  context?: string;
}

export interface GeminiAnalysisResponse {
  executiveSummary: string;
  topIssues: Array<{
    name: string;
    count: number;
    percentage: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  unresolvedTickets: Array<{
    id: string;
    status: string;
    reason: string;
    daysSinceUpdate: number;
  }>;
  keyPatterns: Array<{
    pattern: string;
    impact: string;
    recommendation: string;
  }>;
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Utility function to normalize category names
 * Converts any case variation to consistent title case
 * Examples: "product quality", "PRODUCT QUALITY", "Product Quality" -> "Product Quality"
 */
export function normalizeCategory(category: string): string {
  if (!category || typeof category !== 'string') return 'Uncategorized';
  
  return category
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Utility function to normalize status names
 * Converts any case variation to consistent title case
 * Examples: "open", "OPEN", "Open" -> "Open"
 * Examples: "in progress", "IN PROGRESS", "In Progress" -> "In Progress"
 * Examples: "closed", "CLOSED", "Closed" -> "Closed"
 * Examples: "resolved", "RESOLVED", "Resolved" -> "Resolved"
 */
export function normalizeStatus(status: string): string {
  if (!status || typeof status !== 'string') return 'Unknown';
  
  return status
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
/**
 * Parse date in multiple formats: DD-MM-YYYY, MM-DD-YYYY, YYYY-MM-DD, YYYY-DD-MM
 * With separators: - or /
 * Supports 2-digit and 4-digit years
 * Examples: 01-03-26, 2026/03/01, 02-03-2026, 2026-03-02
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date();
  }

  dateStr = dateStr.trim();

  // Strategy 1: YYYY-MM-DD or YYYY/MM/DD (unambiguous - year first)
  const iso4DigitYearMatch = dateStr.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (iso4DigitYearMatch) {
    const [, year, month, day] = iso4DigitYearMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) return date;
  }

  // Strategy 2: DD-MM-YYYY or MM-DD-YYYY (ambiguous, but need to detect)
  const threePartMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (threePartMatch) {
    const [, first, second, year] = threePartMatch;
    const firstNum = parseInt(first);
    const secondNum = parseInt(second);

    // If first > 12, it must be day
    // If second > 12, it must be day (so first is month)
    // If both <= 12, assume DD-MM format (more common internationally)
    let day, month;
    if (firstNum > 12) {
      day = firstNum;
      month = secondNum;
    } else if (secondNum > 12) {
      month = firstNum;
      day = secondNum;
    } else {
      // Both could be month/day, assume DD-MM format
      day = firstNum;
      month = secondNum;
    }

    const date = new Date(parseInt(year), month - 1, day);
    if (!isNaN(date.getTime())) return date;
  }

  // Strategy 3: DD-MM-YY or MM-DD-YY format (2-digit year)
  const twoDigitYearMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2})$/);
  if (twoDigitYearMatch) {
    const [, first, second, yearStr] = twoDigitYearMatch;
    const firstNum = parseInt(first);
    const secondNum = parseInt(second);
    let year = parseInt(yearStr);

    // Convert 2-digit year to 4-digit (00-99 -> 2000-2099)
    if (year < 100) {
      year += 2000;
    }

    let day, month;
    if (firstNum > 12) {
      day = firstNum;
      month = secondNum;
    } else if (secondNum > 12) {
      month = firstNum;
      day = secondNum;
    } else {
      day = firstNum;
      month = secondNum;
    }

    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) return date;
  }

  // Fallback: try JavaScript's default parser
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Calculate days since a given date (from today's perspective)
 * Returns 0 if date is in the future
 */
export function getDaysSinceDate(dateStr: string): number {
  const parsedDate = parseDate(dateStr);
  const today = new Date();

  // Normalize both dates to start of day
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

  const diffTime = startOfToday.getTime() - startOfDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Merge related category names for cleaner reporting
 * Always merges: Delivery-related, Product-related categories
 * Conditionally merges: Wrong/Missing Item (if includeWrongMissing=true)
 */
export function mergeCategory(category: string, includeWrongMissing: boolean = true): string {
  if (!category) return 'Uncategorized';

  const lower = category.toLowerCase();

  // Always merge delivery/shipping related categories
  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('dispatch')) {
    return 'Delivery / Shipping Delay';
  }

  // Always merge product quality/defect related categories
  if (lower.includes('quality') || lower.includes('defect') || lower.includes('authenticity')) {
    return 'Product Quality / Defect';
  }

  // Conditionally merge wrong/missing item categories
  if (includeWrongMissing && (lower.includes('wrong') || lower.includes('missing'))) {
    return 'Wrong / Missing Item';
  }

  // Return original category if no merge rules apply
  return category;
}
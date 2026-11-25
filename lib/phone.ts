/** Accepts 8-20 characters: digits, spaces and dashes, with an optional leading +. e.g. +855 10 569 063 or 010569063 */
export function isValidPhone(p: string): boolean {
  return /^\+?[0-9][0-9\s-]{6,18}$/.test(p.trim());
}
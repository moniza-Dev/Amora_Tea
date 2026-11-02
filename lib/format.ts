// Pure helpers, safe to import from client components (no db).
export const formatUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Khmer names are optional; the UI falls back to English when nameKm is empty. */
export const displayName = (p: { name: string; nameKm: string | null }, lang: "en" | "km" = "en") =>
  lang === "km" && p.nameKm ? p.nameKm : p.name;

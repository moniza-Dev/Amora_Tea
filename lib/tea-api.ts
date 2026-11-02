import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiMeta, Category, Characteristic, HealthBenefit, Ingredient, Tea, TeaType } from "./tea-types";

const DAY = 60 * 60 * 24;
const BASES = [process.env.TEA_API_BASE ?? "https://theteaapi.site", "https://theteaapi.com"];
const DATA_DIR = process.env.TEA_API_DATA_DIR ?? path.join(process.cwd(), "data", "api");
// Live fetch is opt-in (TEA_API_LIVE=1). The local snapshot is the source of truth and the fallback.
const LIVE = process.env.TEA_API_LIVE === "1";

async function snapshot<T>(file: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    throw new Error(`Tea API snapshot missing: ${path.join(DATA_DIR, file)}. Add the JSON files to data/api/.`);
  }
}

async function load<T>(file: string): Promise<T> {
  if (LIVE) {
    for (const base of BASES) {
      try {
        const res = await fetch(`${base}/api/v1/${file}`, { next: { revalidate: DAY } });
        if (res.ok) return (await res.json()) as T;
      } catch {
        /* try next base, then snapshot */
      }
    }
  }
  return snapshot<T>(file);
}

let warned = false;
/** Without a snapshot the shop still runs on custom products and gift sets only (teas list = empty) and warns once. */
export const getTeas = async (): Promise<Tea[]> => {
  try {
    return await load<Tea[]>("teas.json");
  } catch (e) {
    if (!warned) { warned = true; console.warn(`[tea-api] ${(e as Error).message} Continuing with no API teas.`); }
    return [];
  }
};
export const getCategories = () => load<Category[]>("categories.json");
export const getTeaTypes = () => load<TeaType[]>("tea-types.json");
export const getIngredients = () => load<Ingredient[]>("ingredients.json");
export const getHealthBenefits = () => load<HealthBenefit[]>("health-benefits.json");
export const getCharacteristics = () => load<Characteristic[]>("characteristics.json");
export const getMeta = () => load<ApiMeta>("meta.json");

export async function getTea(slug: string): Promise<Tea | null> {
  if (LIVE) {
    for (const base of BASES) {
      try {
        const res = await fetch(`${base}/api/v1/teas/${encodeURIComponent(slug)}.json`, { next: { revalidate: DAY } });
        if (res.ok) return (await res.json()) as Tea;
      } catch {
        /* fall through to snapshot */
      }
    }
  }
  return (await getTeas()).find((t) => t.slug === slug) ?? null;
}

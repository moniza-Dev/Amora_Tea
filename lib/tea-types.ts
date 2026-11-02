// Types written from the verified shape of data/api/teas.json (26 teas). No guessed fields.
export type CaffeineLevel = "none" | "low" | "medium" | "high";

export interface Category {
  id: number;
  slug: "true-tea" | "blend" | "tisane";
  name: string;
  description: string;
  tea_count?: number; // documented on categories.json
}
export interface TeaType {
  id: number;
  slug: "green" | "white" | "black" | "oolong" | "puerh" | "yellow";
  name: string;
  description: string;
}
export interface Characteristic { id: number; name: string }
export interface HealthBenefit { id: number; name: string }
export interface Ingredient { id: number; name: string; description: string; image_url: string }
export interface CompositionItem { amount: string; ingredient: Ingredient } // amount e.g. "99%"

export interface Tea {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  origin: string;
  caffeine_level: CaffeineLevel;
  temperature_celsius: number;
  steeping_time_minutes: number;
  brewing_instructions: string;
  category: Category;
  tea_type: TeaType | null;
  base_type: TeaType | null;
  characteristics: Characteristic[];
  health_benefits: HealthBenefit[];
  composition: CompositionItem[];
}

// meta.json shape not verified yet: kept loose on purpose.
export type ApiMeta = Record<string, unknown>;

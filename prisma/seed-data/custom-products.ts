// Amora-Tea's own blends and gift sets (no API tea). Photos are resolved by slug in lib/tins.ts.

/* ---------- Pricing (cents) ----------
 * Every signature tin (50g) sells for $10.99-$12.49. A gift set is priced from what is inside it:
 *   value = tins + box/extras, price = value less ~10%, rounded to the nearest $x.99.
 * Change a tin or extra price here and every set re-prices itself, so sets stay consistent. */
const TIN = { jasmine: 1199, oolong: 1249, earlGrey: 1149, hibiscus: 1099, chamomile: 1199, rooibos: 1099 } as const;
const EXTRA = { keepsakeBox: 400, roundBox: 500, smallGiftBox: 300, tote: 699, woodenBox: 600, infuserBottle: 999, teaTowel: 399, honeyDipper: 299, towerPack: 600, mug: 699 } as const;
const SET_DISCOUNT = 0.1;
const sum = (parts: number[]) => parts.reduce((a, b) => a + b, 0);
/** Returns the shelf value of the contents (shown struck through) and the set price (what the customer pays). */
function setPrice(parts: number[]) {
  const value = sum(parts);
  const price = Math.round((value * (1 - SET_DISCOUNT)) / 100) * 100 - 1;
  return { base: price, compareAt: value };
}

export interface CustomSeed {
  slug: string;
  name: string;
  nameKm?: string;
  kind: "custom" | "gift_set";
  tags: string[];
  description: string;
  base: number; // 50g price in cents (custom) or fixed price in cents (gift_set)
  compareAt?: number; // gift sets: combined value of the contents in cents. Seed this into compareAtCents so the "was" price is real.
  featured?: boolean;
  details?: { ingredients: string[]; benefits: string[]; flavor: string[]; brewing: { temperatureC: number; minutes: number; instructions: string } };
}

export const CUSTOM_PRODUCTS: CustomSeed[] = [
  {
    slug: "ceylon-cinnamon-tea", name: "Ceylon Cinnamon Tea", kind: "custom", tags: ["cinnamon"], base: 1099,
    description: "Black tea warmed with sweet cinnamon bark. Smooth, comforting and lovely with a splash of milk.",
    details: { ingredients: ["Black tea", "Cinnamon bark"], benefits: ["Warming and comforting", "Pairs well after meals"], flavor: ["Warm", "Sweet", "Spiced"],
      brewing: { temperatureC: 95, minutes: 4, instructions: "Use 1 tsp per cup. Pour just-boiled water and steep for 4 minutes." } },
  },
  {
    slug: "cinnamon-orange-spice", name: "Cinnamon Orange Spice", kind: "custom", tags: ["cinnamon", "herbal"], base: 1149, featured: true,
    description: "Caffeine-free cinnamon and dried orange peel with a gentle clove finish.",
    details: { ingredients: ["Cinnamon bark", "Orange peel", "Clove"], benefits: ["Caffeine-free", "Cosy evening cup"], flavor: ["Citrus", "Spiced"],
      brewing: { temperatureC: 100, minutes: 6, instructions: "Use 1 heaped tsp per cup. Steep in boiling water for 6 minutes." } },
  },
  {
    slug: "mixed-berry-infusion", name: "Mixed Berry Infusion", kind: "custom", tags: ["fruit-infusion", "herbal"], base: 1049,
    description: "A bright, caffeine-free blend of hibiscus, strawberry and blackcurrant. Wonderful hot or iced.",
    details: { ingredients: ["Hibiscus", "Strawberry", "Blackcurrant", "Apple pieces"], benefits: ["Caffeine-free", "Refreshing iced"], flavor: ["Fruity", "Tart"],
      brewing: { temperatureC: 100, minutes: 7, instructions: "Use 2 tsp per cup. Steep 7 minutes. For iced tea, double the leaf and pour over ice." } },
  },
  {
    slug: "tropical-mango-infusion", name: "Tropical Mango Infusion", kind: "custom", tags: ["fruit-infusion"], base: 1049, featured: true,
    description: "Sun-ripe mango and pineapple with a soft green tea base.",
    details: { ingredients: ["Green tea", "Mango", "Pineapple", "Marigold petals"], benefits: ["Light caffeine", "Naturally fruity"], flavor: ["Fruity", "Sweet"],
      brewing: { temperatureC: 80, minutes: 3, instructions: "Use 1 tsp per cup. Steep in 80°C water for 3 minutes." } },
  },
  {
    slug: "daily-detox-blend", name: "Daily Detox Blend", kind: "custom", tags: ["detox", "herbal"], base: 1199,
    description: "Ginger, lemongrass and peppermint for a clean, lively cup any time of day.",
    details: { ingredients: ["Ginger", "Lemongrass", "Peppermint", "Lemon peel"], benefits: ["Caffeine-free", "Light and refreshing after meals"], flavor: ["Zesty", "Fresh"],
      brewing: { temperatureC: 100, minutes: 5, instructions: "Use 1 tsp per cup. Steep in boiling water for 5 minutes." } },
  },
  {
    slug: "tea-lover-gift-box", name: "Tea Lover Gift Box", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, TIN.oolong, TIN.earlGrey, EXTRA.keepsakeBox]), featured: true,
    description: "Four 50g tins (Jasmine Green, Hibiscus, Oolong, Earl Grey) in a green keepsake box with a note card.",
  },
  {
    slug: "morning-ritual-set", name: "Morning Ritual Set", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, TIN.oolong, TIN.earlGrey, EXTRA.woodenBox, EXTRA.infuserBottle, EXTRA.teaTowel, EXTRA.honeyDipper]),
    description: "Four 50g tins with a glass infuser bottle, tea towel and honey dipper, packed in a wooden box.",
  },
  {
    slug: "wellness-trio-set", name: "Wellness Trio Set", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, TIN.earlGrey, EXTRA.smallGiftBox, EXTRA.mug]),
    description: "Three 50g tins (Jasmine Green, Hibiscus, Earl Grey) and an Amora mug in a pink gift box.",
  },
  {
    slug: "garden-round-gift-box", name: "Garden Round Gift Box", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.oolong, TIN.hibiscus, TIN.earlGrey, EXTRA.roundBox]),
    description: "Four 50g tins (Jasmine Green, Oolong, Hibiscus, Earl Grey) nestled in a sage-green round box with a satin ribbon and tag.",
  },
  {
    slug: "tote-and-gift-bag-set", name: "Tote & Gift Bag Set", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, EXTRA.smallGiftBox, EXTRA.tote]),
    description: "Two 50g tins (Jasmine Green, Hibiscus) in a ribbon-tied gift box, with a botanically illustrated tote.",
  },
  {
    slug: "four-flavors-tower", name: "Four Flavors Tower", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, TIN.oolong, TIN.chamomile, EXTRA.towerPack]),
    description: "Four stacked flavour boxes (Jasmine Green, Hibiscus, Oolong, Chamomile & Lavender) tied with a cream bow, plus a matching gift bag.",
  },
  {
    slug: "amora-jasmine-green-tea", name: "Jasmine Green Tea", kind: "custom", tags: ["green","jasmine"], base: TIN.jasmine, featured: true,
    description: "Green tea scented with fresh jasmine blossoms. Fragrant, soothing and rich in antioxidants.",
    details: { ingredients: ["Green tea","Jasmine blossoms"], benefits: ["100% natural","Calms the mind","Rich in antioxidants"], flavor: ["Floral","Fresh"],
      brewing: { temperatureC: 80, minutes: 3, instructions: "Use 1 tsp per cup. Steep in 80°C water for 3 minutes." } },
  },
  {
    slug: "amora-oolong-tea", name: "Oolong Tea", kind: "custom", tags: ["oolong"], base: TIN.oolong, featured: true,
    description: "A smooth, floral oolong with a gentle roasted finish. Supports metabolism and is rich in polyphenols.",
    details: { ingredients: ["Oolong tea leaves"], benefits: ["100% natural","Boosts metabolism","Rich in polyphenols"], flavor: ["Smooth","Floral"],
      brewing: { temperatureC: 90, minutes: 4, instructions: "Use 1 tsp per cup. Steep in 90°C water for 4 minutes." } },
  },
  {
    slug: "amora-earl-grey-tea", name: "Earl Grey Tea", kind: "custom", tags: ["black","earl-grey"], base: TIN.earlGrey, featured: true,
    description: "Classic black tea with bright bergamot. Citrusy, elegant and perfect with a slice of lemon.",
    details: { ingredients: ["Black tea","Bergamot oil","Cornflower petals"], benefits: ["100% natural","Improves focus","Supports heart health"], flavor: ["Citrus","Elegant"],
      brewing: { temperatureC: 95, minutes: 4, instructions: "Use 1 tsp per cup. Pour just-boiled water and steep for 4 minutes." } },
  },
  {
    slug: "amora-hibiscus-tea", name: "Hibiscus Tea", kind: "custom", tags: ["fruit-infusion","herbal"], base: TIN.hibiscus, featured: true,
    description: "A ruby-red, caffeine-free infusion. Refreshing and tangy, wonderful hot or iced.",
    details: { ingredients: ["Hibiscus petals","Rose hip"], benefits: ["100% natural","Rich in vitamin C","Supports immune system"], flavor: ["Tangy","Fruity"],
      brewing: { temperatureC: 100, minutes: 6, instructions: "Use 2 tsp per cup. Steep in boiling water for 6 minutes." } },
  },
  {
    slug: "amora-chamomile-lavender-tea", name: "Chamomile & Lavender Tea", kind: "custom", tags: ["herbal"], base: TIN.chamomile, featured: true,
    description: "Whole chamomile flowers and lavender buds for a calm, relaxing evening cup.",
    details: { ingredients: ["Chamomile flowers","Lavender buds"], benefits: ["100% natural","Reduces stress","Better sleep"], flavor: ["Floral","Calming"],
      brewing: { temperatureC: 100, minutes: 5, instructions: "Use 1 heaped tsp per cup. Steep in boiling water for 5 minutes." } },
  },
  {
    slug: "amora-rooibos-tea", name: "Rooibos Tea", kind: "custom", tags: ["herbal"], base: TIN.rooibos, featured: true,
    description: "Naturally sweet, caffeine-free red bush tea with a smooth, honeyed finish.",
    details: { ingredients: ["Rooibos"], benefits: ["100% natural","Caffeine free","Supports relaxation"], flavor: ["Sweet","Smooth"],
      brewing: { temperatureC: 100, minutes: 6, instructions: "Use 1 tsp per cup. Steep in boiling water for 6 minutes." } },
  },
  {
    slug: "keepsake-gift-box", name: "Keepsake Gift Box", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.hibiscus, TIN.oolong, TIN.earlGrey, EXTRA.smallGiftBox]),
    description: "Four 50g tins (Jasmine Green, Hibiscus, Oolong, Earl Grey) in a sage-green keepsake box with a handwritten-style note card.",
  },
  {
    slug: "tea-collection-gift-box", name: "Tea Collection Gift Box", kind: "gift_set", tags: ["gift"], ...setPrice([TIN.jasmine, TIN.earlGrey, TIN.chamomile, TIN.rooibos, TIN.hibiscus, TIN.chamomile, EXTRA.keepsakeBox]),
    description: "Six 50g tins (Jasmine Green, Black, Chamomile, Spiced, Hibiscus, Chamomile & Lavender) in a floral keepsake box with satin lining.",
  },
];
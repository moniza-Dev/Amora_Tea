import type { Tea } from "@/lib/tea-types";

/** Amora tin photos (public/images/tins). Square crops for cards, `-scene` full frames for banners/tiles. */
export type TinKey = "green" | "black" | "herbal" | "oolong" | "cinnamon" | "white" | "fruit" | "detox";
export const TIN_SRC: Record<TinKey | "gift-set", string> = {
  green: "/images/tins/green.webp",
  black: "/images/tins/black.webp",
  herbal: "/images/tins/herbal.webp",
  oolong: "/images/tins/oolong.webp",
  cinnamon: "/images/tins/cinnamon.webp",
  white: "/images/tins/white.webp",
  fruit: "/images/tins/fruit.webp",
  detox: "/images/tins/detox.webp",
  "gift-set": "/images/tins/gift-set.webp",
};

/** Portrait scene per collection (keys match HOME_CATEGORIES). */
export const SCENE_SRC: Record<string, string> = {
  green: "/images/tins/green-scene.webp",
  black: "/images/tins/black-scene.webp",
  herbal: "/images/tins/herbal-scene.webp",
  oolong: "/images/tins/oolong-scene.webp",
  cinnamon: "/images/tins/cinnamon-scene.webp",
  white: "/images/tins/white-scene.webp",
  "fruit-infusions": "/images/tins/fruit-scene.webp",
  "detox-wellness": "/images/tins/detox-scene.webp",
};
export const TIN_FOR_CATEGORY: Record<string, string> = {
  green: TIN_SRC.green, black: TIN_SRC.black, herbal: TIN_SRC.herbal, oolong: TIN_SRC.oolong,
  cinnamon: TIN_SRC.cinnamon, white: TIN_SRC.white, "fruit-infusions": TIN_SRC.fruit, "detox-wellness": TIN_SRC.detox,
};

export const BANNERS = { collections: "/images/collections-banner.webp", gifts: "/images/gifts-banner.webp" } as const;
/** New Amora signature tins (public/images/amora), keyed by product slug. */
export const AMORA_TINS = [
  { slug: "amora-jasmine-green-tea", key: "jasmine", name: "Jasmine Green Tea", note: "Fragrant & Soothing", src: "/images/amora/jasmine-green.webp" },
  { slug: "amora-oolong-tea", key: "oolong", name: "Oolong Tea", note: "Smooth & Floral", src: "/images/amora/oolong.webp" },
  { slug: "amora-earl-grey-tea", key: "earl-grey", name: "Earl Grey Tea", note: "Citrusy & Elegant", src: "/images/amora/earl-grey.webp" },
  { slug: "amora-hibiscus-tea", key: "hibiscus", name: "Hibiscus Tea", note: "Refreshing & Tangy", src: "/images/amora/hibiscus.webp" },
  { slug: "amora-chamomile-lavender-tea", key: "chamomile", name: "Chamomile & Lavender Tea", note: "Relaxing & Calm", src: "/images/amora/chamomile-lavender.webp" },
  { slug: "amora-rooibos-tea", key: "rooibos", name: "Rooibos Tea", note: "Naturally Sweet & Smooth", src: "/images/amora/rooibos.webp" },
] as const;

/** Gift set photos (public/images/gifts), keyed by product slug. */
export const GIFT_SETS = [
  { slug: "tea-lover-gift-box", title: "A little cup of happiness", includes: ["4 × 50g tins: Jasmine Green, Hibiscus, Oolong, Earl Grey", "Green keepsake box", "Handwritten-style note card"], src: "/images/gifts/green-box.webp", alt: "Green keepsake gift box with four Amora tea tins and a note card" },
  { slug: "garden-round-gift-box", title: "Tea brings people closer", includes: ["4 × 50g tins: Jasmine Green, Oolong, Hibiscus, Earl Grey", "Sage-green round box", "Satin ribbon and gift tag"], src: "/images/gifts/round-box.webp", alt: "Round sage-green gift box with four tins and a ribbon tag" },
  { slug: "tote-and-gift-bag-set", title: "Sweet moments with tea", includes: ["2 × 50g tins: Jasmine Green, Hibiscus", "Ribbon-tied gift box", "Botanical canvas tote"], src: "/images/gifts/tote-set.webp", alt: "Botanical tote bag with a small ribbon-tied gift box" },
  { slug: "morning-ritual-set", title: "Enjoy your tea journey", includes: ["4 × 50g tins: Jasmine Green, Hibiscus, Oolong, Earl Grey", "Glass infuser bottle, tea towel and honey dipper", "Wooden gift box with note card"], src: "/images/gifts/wooden-box.webp", alt: "Wooden gift box with four tins, a glass infuser bottle and a towel" },
  { slug: "four-flavors-tower", title: "Four flavors, one happiness", includes: ["4 flavour boxes: Jasmine Green, Hibiscus, Oolong, Chamomile & Lavender", "Cream satin bow and tag", "Matching gift bag"], src: "/images/gifts/tower-set.webp", alt: "Four-tier tea tower gift box with a cream bow and gift bag" },
  { slug: "wellness-trio-set", title: "Good tea, better days", includes: ["3 × 50g tins: Jasmine Green, Hibiscus, Earl Grey", "Amora ceramic mug", "Pink gift box"], src: "/images/gifts/pink-box.webp", alt: "Pink gift box with three tins and a white Amora mug" },
  { slug: "keepsake-gift-box", title: "A little cup of happiness", includes: ["4 × 50g tins: Jasmine Green, Hibiscus, Oolong, Earl Grey", "Sage-green keepsake box", "Handwritten-style note card"], src: "/images/gifts/gift-box-rectangle.webp", alt: "Open sage-green gift box with four tins and a note card" },
  { slug: "tea-collection-gift-box", title: "Six flavours, one box", includes: ["6 × 50g tins: Jasmine Green, Black, Chamomile, Spiced, Hibiscus, Chamomile & Lavender", "Floral keepsake box", "Satin lining"], src: "/images/gifts/gift-collection-box.webp", alt: "Tea Collection gift box with six premium tins in a garden" },
] as const;

/** Garden photo set shown on the Collections page (public/images/scenes). */
export const TIN_SCENES = [
  { name: "Jasmine Green Tea", src: "/images/scenes/jasmine.webp" },
  { name: "Hibiscus Tea", src: "/images/scenes/hibiscus.webp" },
  { name: "Earl Grey Tea", src: "/images/scenes/earl-grey.webp" },
  { name: "Chamomile & Lavender Tea", src: "/images/scenes/chamomile.webp" },
  { name: "Oolong Tea", src: "/images/scenes/oolong.webp" },
  { name: "Rooibos Tea", src: "/images/scenes/rooibos.webp" },
] as const;
export const TEA_COLLECTION_BOX = "/images/scenes/tea-collection-box.webp";

const lc = (s: string) => s.toLowerCase();

/** Pick the matching Amora tin for a product, most specific flavour first. Pure (client-safe, no db). */
export function tinFor(input: { kind: "tea" | "custom" | "gift_set"; slug: string; name: string; tags: string[]; tea: Tea | null }): string {
  if (input.kind === "gift_set") return GIFT_SETS.find((g) => g.slug === input.slug)?.src ?? TIN_SRC["gift-set"];
  const amora = AMORA_TINS.find((t) => t.slug === input.slug);
  if (amora) return amora.src;
  const { tea } = input;
  const words = lc(`${input.name} ${input.slug} ${input.tags.join(" ")}`);
  const ingredients = lc(tea?.composition.map((c) => c.ingredient.name).join(" ") ?? "");
  const chars = lc(tea?.characteristics.map((c) => c.name).join(" ") ?? "");
  const has = (re: RegExp) => re.test(words) || re.test(ingredients);
  const type = tea?.tea_type?.slug ?? tea?.base_type?.slug;

  if (has(/cinnamon|spice|chai|clove|cardamom|anise/)) return TIN_SRC.cinnamon;
  if (has(/berry|fruit|hibiscus|strawberry|raspberry|mango|peach|apple|rose/) || /fruity|tart/.test(chars)) return TIN_SRC.fruit;
  if (has(/detox|lemongrass|ginger|mint|lemon|turmeric/)) return TIN_SRC.detox;
  if (has(/chamomile|lavender|herbal|jasmine/) || tea?.category.slug === "tisane") return TIN_SRC.herbal;
  if (type === "white" || has(/white/)) return TIN_SRC.white;
  if (type === "oolong" || has(/oolong/)) return TIN_SRC.oolong;
  if (type === "black" || type === "puerh" || has(/black/)) return TIN_SRC.black;
  return TIN_SRC.green; // green, yellow, matcha and anything unclassified
}

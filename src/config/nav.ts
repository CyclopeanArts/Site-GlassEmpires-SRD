/**
 * Navigation for the SRD sidebar.
 *
 * Format:
 *   "slug"                — leaf page; label comes from the file's title
 *   { slug, children }    — section with landing page; label from the file's title
 *   { label, href }       — explicit link (external, ?args, non-content pages)
 *   { label, children }   — section with no landing page (grouping only)
 *
 * Slugs are resolved at build time by scanning all content collections.
 * Move files between folders freely — slugs stay the same, nav stays correct.
 * Display order is array position; no `order` frontmatter needed.
 */

export type NavItem =
  | string
  | { slug: string; children?: NavItem[] }
  | { label: string; href?: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: "Introduction", children: [
    "what-this-game-is", "dice-notation", "characters", "actions", "facts", "saves", "money", "campaigns",
  ]},
  { label: "Character Creation", children: [
    "creation-process", "origins",
    { slug: "races", children: ["coraler", "harpy", "human", "salamander"] },
    { slug: "classes", children: [
      "lord", "magistrate", "magician", "burgher", "warlord", "gangster",
    ]},
    { slug: "magical-traditions", children: [
      "origami-assassin", "forester", "metallurge", "jester", "snowmime", "telluric-priest",
    ]},
    "level-retainer",
    "party-cooperation",
  ]},
  { label: "Factions", children: [
    "what-is-a-faction", "sovereignty-subfactions",
    "families-capitals",
    { slug: "faction-moves", children: [
      "action-capital-relocation",
      "action-create-subfaction",
      "action-faction-activity",
      "action-sabotage",
      "action-grow-followers",
      "action-make-asset",
      "action-plunder-settlement"
    ]},
    "faction-resolution",
    "hidden-factions",
    "party-is-faction",
    { slug: "faction-types", children: [
      "type-government",
      "type-financier",
      "type-business",
      "type-army",
      "type-godscult",
      "type-personality-cult",
      "type-mine-clan",
    ]},
    "growing-settlement",
    "resources",
  ]},
  { label: "Magic", children: [
    "magic-spell-dice-totems", "action-casting",
    "using-corpses-spirits", "extracting-spirits", "ritual-cooking", "divination",
  ]},
  { label: "Marketplace", children: [
    "on-prices-and-power", "debt-credit", "equipment", "retainers-hirelings", "construction-projects",
  ]},
  { label: "Adventure", children: ["encumbrance", "foresight", "conditions", "negotiation-persuasion", "resting", "movement", "travel", "hunting", "advancement"] },
  { label: "Combat", children: [
    { slug: "skirmishes", children: ["movement-space", "skirmish-actions", "engagement", "flight-pursuit", "panic-fear", "mounted-combat"] },
    { slug: "battles", children: ["battle-rating", "battle-procedure", "end-of-battle"] },
    "damage-types", "armor", "damage-death", "mutations-and-wounds", "funerals",
  ]},
  { label: "Armies", children: [
    "axioms",
    "raising-armies",
    "army-proficiency",
    "cultural-retinues",
    "personal-retinues",
    "siege-blockade",
  ]},
  { label: "Lore", children: [
    { slug: "world-of-aia", children: ["elements-spirits", "metals-materials"] },
    { slug: "island-of-glass", children: ["geography-geodestiny", "architecture", "wonders"] },
    "history",
    { slug: "scenario", children: [
      "house-eagle", "house-arcades", "house-beacon",
      "commons-revolt", "glass-coralers",
      "imperial-family", "oropolis-and-kain", "minor-powers",
    ]},
    "society",
    "religion-and-gods",
    { slug: "the-moon", children: ["getting-there-and-back", "lunarian-kingdom", "practical-role"] },
  ]},
  { label: "Bestiary", children: [
    { label: "By Alphabetical", href: "/bestiary" },
    { label: "By Tag", href: "/bestiary/tags" },
  ]},
  { label: "Indices", children: [
    { label: "Actions",      href: "/actions" },
    { label: "Conditions", href: "/conditions" },
  ]},
];

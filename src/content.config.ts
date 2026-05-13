import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Prose collections (MDX) ─────────────────────────────────────────────────
// Required: title only. Everything else is optional or defaults.

const proseSchema = z.object({
  title: z.string(),
  order: z.number().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  summary: z.string().optional(),           // used in nav tooltips / index cards
});

const rules = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/rules' }),
  schema: proseSchema,
});

const gmGuide = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gm-guide' }),
  schema: proseSchema,
});

const lore = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lore' }),
  schema: proseSchema,
});

// ── Data collections (YAML) ─────────────────────────────────────────────────
// The Ref component renders whatever fields are present — nothing is assumed.
// Templates fill missing optional fields with undefined; render nothing if absent.

const dataSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),           // short description; used for hover tooltips
  see_also: z.array(z.string()).default([]), // slugs of related entries (any collection)
}).passthrough();                            // allow arbitrary extra fields without schema error

const conditions = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/conditions' }),
  schema: dataSchema,
});

const moves = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/moves' }),
  schema: dataSchema,
});

const bestiary = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,mdx}', base: './src/content/bestiary' }),
  schema: dataSchema.extend({
    // Bestiary-specific fields.
    //
    // summary (from dataSchema): used for card/tooltip text. Keep it short (one sentence).
    //
    hd:         z.int(), // Hit Dice. Assumed default HP for most NPCs is 4 × HD unless they're *exceptionally* well-rested.
    level:      z.int().optional(), // if entity is assumed to rule a Faction, input Level corresponding to Faction Level (see Faction Level rules).
    // HP is automatically computed from Level + HD, see rules
    armor:      z.int().optional(), // Armor score. 0 = none, 1 = light/leather, 2 = medium/chain, 4 = heavy/plate.
    // AP is automatically computed from Armor × HD, see rules
    // BR = (level + hd) * ((armor / 4) + 1) * ([sum(positive feature `combat` scores)] + 1) / ([sum (negative feature `combat` scores)] + 1)
        // mounts: if you have a mount, add the mount's Power. if mounted, use an averaged Armor score. mount attacks are only added if the mount is a sapient combatant. mount positive/negative features are added if applicable.
    damagemultiplier: z.float32(),
    // max. damage per turn, divided by 4. must be reasoned out from all weapons & Damage-boosting Features, accounting for the rules on Actions (Major, Minor, etc.) per turn plus Strike mechanics. If 0, entity is presumed harmless. cannot be determined until you know the entire statblock!
    size:       z.int().optional(), // size of entity in ft. think cylindrical volume, diameter & height. preferred increments are 1', 2', 5', 10', 15', 20', 30', 40', 60'. bigger ones should use round numbers i.e. 100' but it gets increasingly silly, of course.
    speeds:     z.object({ // 1' of Speed = ~1 mile traveled per day over terrain, or 1' per Turn in a Round in a Skirmish
      run:      z.int().optional(), // ground speed in feet, if present; preferably, in 5' increments; human avg is 25'. even flying creatures have a Run speed, even if it's only 5' or less.
      fly:      z.int().optional(), // flight speed
      swim:      z.int().optional(), // swimming speed (if an entity cannot SURVIVE in water, do not give them this; Run can be used for swimming for non-aquatic entities)
      dig:      z.int().optional(),   // burrowing/tunneling speed
    }).optional(),
    weight:     z.float32(), // creature Weight as stone # (1# = 10lb). the ONLY fractional values acceptable are 0.25 & 0.5, rendered as 1/2# or 1/4#. should match real weight, if real references are available. we prefer increments of 3# wherever possible.
    maxload:    z.float32(), // maximum carrying capacity. normally equal to 2/3 of Weight. same fraction rules as Weight.
    group:      z.string(), // otherwise known as "No. appearing". group sizes & collective nouns. a skeleton might show up as "Party 2d6". several possibilities are separated by slashes. "Solo / Sounder 3d6 / Warband 3d6 × 10". if solo, always "Solo".
    desc:       z.string(), // terse punchy Fact describing creature physical appearance, smell, sounds. think: what might affect an action this creature takes? what's its most distinctive qualities?
    wants:      z.string(), // terse punchy Fact describing creature's most important desires. think: what can the players use as leverage?
    intellect:  z.string(), // terse punchy Fact describing creature's intellectual capacity. try to think: how what is the best thing you can say to get the GM to understand how to think like this thing?
    morality:   z.string(), // terse punchy Fact describing the nuances of the creature's morality. try to cover what the creature *cares* about in the sense of moral compunction.
    // end of stat table
    features: z.array(z.object({ // renamed from 'abilities'. A list of all Features, including any (Natural Weapon), (Weapon) and (Equipment) entries.
      name: z.string(),
      text: z.string(),                         // multiline OK — use YAML `|` block scalar
      combat: z.float32(), // indicates if the feature is combat-applicable and if it's positive or negative. valid values are -1, -0.5, 0, 0.5, and 1. Most should be straightforwardly -1, 0, or 1; the half-values are for edge cases or niche abilities. Features that just improve how much Damage a character can output on their turn (i.e. extra Strike capacity) are rolled into the `damagemultiplier` integer instead of being counted separately. weapon-features with weird effects that aren't just Damage scores might have a positive or negative combat score.
    })).default([]),
    // end of Feature list
    lore:       z.string().optional(), // free prose rendered after the stat table. should be very brief/punchy/amusing unless there are substantial rules or GM advice to cover beyond what the other data can support. 
    // end of lore
    treasure:   z.string(), // valuables, if any. might include skin, but if nothing semantically interesting, some $ value in creature parts is ok. many unintelligent creatures have none. if none, "N/A". if complicated, write a table or three.
    gm_note: z.object({
      heading: z.string(),           // callout title, e.g. "Playing a Glassian Commoner"
      body:    z.string(),           // GM-facing advice prose
    }).optional(),
    when_eaten: z.object({
      flavor: z.string(),            // terse description of taste & if notable, physical experience
      notes:  z.string(),            // rules / caveats about consumption.
    }).optional(),
    tables: z.array(z.object({ // supplementary tables to generate.
      label:   z.string(), // table name
      die:     z.string().default('d6'), // die size. normally, d6, 2d6, 3d6, or d66.
      // d66 tables are numbered 11–66. 1d6 is the 10s die, 1 is the 1s die. so you get 11, 12, 13, 14, 15, 16, 21, 22, 23 [...] 65, 66, for 36 entries max, or 18 if 2 results are assigned per entry, or 12 if 3 are.
      entries: z.array(z.object({
        roll:   z.int(), // min of range, max determined by next entry in table. if next entry skips digits, then this table entry's range is increased. rendered on canvas as X–Y i.e. if two entries are specified at roll 1 & 3 on a d6. it is INVALID for multiple entries to have overlapping roll-max ranges.
        max:    z.int().optional(), // if left out, max = roll. only used for ranges i.e. 3 entries numbered 1–3, 4–5, 6 would be set up as roll:1 max:3, roll:4 max:5, roll:6.
        result: z.string(), // text of entry.
      })),
    })).default([]),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/glossary' }),
  schema: dataSchema.extend({
    definition: z.string().optional(),      // full definition text
    related_rule: z.string().optional(),    // slug of the rules page that covers this term
  }),
});

const tables = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tables' }),
  schema: z.object({
    name: z.string(),
    die: z.string().default('d6'),
    tags: z.array(z.string()).default([]),
    entries: z.array(z.object({
      roll: z.string(),
      result: z.string(),
    })),
  }),
});

const spirits = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/spirits' }),
  schema: dataSchema.extend({
    tier: z.enum(['tradition', 'commodity', 'trophy']).optional(),
    hd: z.string().optional(),
    cost: z.string().optional(),            // HP cost to cast
    spellhome: z.string().optional(),
  }),
});

export const collections = {
  rules,
  'gm-guide': gmGuide,
  lore,
  conditions,
  moves,
  bestiary,
  glossary,
  tables,
  spirits,
};

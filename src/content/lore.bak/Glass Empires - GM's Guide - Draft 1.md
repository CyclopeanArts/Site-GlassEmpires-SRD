---
tags:
  - tg/glassempire
draft: true
---
# Goals & Thesis

We're building an OSR compatible faction-crawler with a gameplay loop that's about sandbox faction warfare. The players are semi-superheroic lunatics who are notably more powerful than the Average Man and are so endowed because they're

- capable rulers
- who have murdered or gathered a large quantity of treasure

the game starts, by default, at the average osr's equivalent of level 4. or something. point is, the players already control a small group by default & start with some power.

you loop by finding/befriending/subjugating factions. you have to **fight their leader into submission** through physical confrontation or diplomacy. they subsequently give you magical powers via magical oaths that are a sort of magical spell.

you gather enough power & then you become the new Emperor of Glass.

Everyone can murder.

we'll try to do it without XP or Levels. we might keep Levels, maybe, but ... eh.

## Gameplay loop

The game is separated into 2 main stages.

- **Adventurer**: You have not yet accrued a power base sufficient enough to engage in wider politics. In the midst of Glass' wartime chaos, you are seeking to obtain enough power to raise yourself to a meaningful status through one of a few common methods:
	- **Temple-raiding**: The dwarven megatemples under Glass still hold secrets, especially in Theomni. Some of those secrets could make their holders into demigods. It's happened before.
	- **Intrigue**: Nothing stopping you from stabbing or seducing your way into power. It's just a slow-going road.
	- **Murder**: You can just kill your way into (personal) might.
- **Warlord**: You already have a Faction. Possibly a large one. You're probably a weirdo from the nobility & you've definitely got the skill to survive in the fight for the future of Glass. Good luck fighting the gods. In any case, your main method for advancement is...
	- **Conquest**: Of bigger Factions. The end goal is the conquest of all Glass, requiring the subduing of every major Faction vying for dominance.

> We ... do like dungeon crawls, but the emphasis is on warlording. Make sure that works. Adventuring should mostly set people up to become weird warlords.
> 
> All heroes, in any case, should be weird for some reason. They're idealists or maniacs or possessed by fairies. They're shrine-keepers who went berserk.

### Problem: Where in this cycle does money fit?

Money is actually way less useful than cashflow or problem-solving. We'll need a way to measure income for Factions, probably, but we'll also want a way to measure the value of treasure since almost all OSR systems use discrete cash instead of cashflow as rewards.

### we go out & kill some dudes (wartime movement)

- take your faction army & leave your base camp
- **TRAVEL** to new location
	- city? **NEW BASE CAMP** or **SIEGE** it.
	- enemy? **FIGHT**.
- treasure? **LOOT**
- GM: **EXECUTE ENEMY ACTIONS**
- WEEK ENDS

("how do we restore the army's health/capabilities?")
("where do we get money from? what's our reward in combat?")

### we commit violence against local factions



## Character backgrounds

Who is actually COMPETING in this environment?

- Warrior
	- Bastard Aristocrat
	- Coraler raider
	- Undying (reincarnationist scum)
	- Warlord-in-training
	- Countryside bandit
- Magician
	- Necromancer (ancestralist scum)
	- Shrinemaster (Maiden/priest overseeing a shrine)
	- Jester (wandering god-speaker)
	- Twintail priest (Solar Cultists)

These are *backgrounds*. Their means would be similar — by magic or by sword. That means that your actual "classes" should be heavily restricted, and possibly skill- or proficiency-gated in terms of capabilities.

"The Factions you're part of dictate what proficiencies you can take when you gain a Level."

sigh. i guess we'll just go with **Features**, and that will be how we do stuff. Fuck levels and fuck recording classes. You just get Features & write them down as you go.

# Design notes

## @ Standard Comparisons

Since we don't use logarithmic numbers as a *general rule* (@ 2025.01.10 after deciding that faction-size-as-level and value-as-log-scale was kinda dumb), we need standard comparison methods to compare linear values in a log method to avoid fixed comparisons.

the comparison methods must be trivial to compute for humans running the math & produce a curve of acceptable fidelity.

- **equal**: within ±10% of value
- **greater/lesser than**: more than 10% difference between values
- **double**: one value is at least 2× the smaller value
- **multiple**: one value is 3× or greater the size of the smaller value
	- *error*: this can be *hard to eyeball* for uneven numbers. it should only be used in cases where granularity is really important.
- **10-fold**: one value is at least 10× the other. this is usually an instant win, i guess?
	- look at ascendant for comparison. a +4 advantage (×16, 1 2 4 8 16) on a check there is enough to always secure auto-victory. a +3 is 8×. my value says 10× is the instant win.

and that's kinda all we need. this works for weight (24# ≥ 5#? it's 4×) as well as for any other value.

## Level is Faction size

Instead of tracking these directly & syncing them, I'm just gonna point out that I've already boiled "the benefits of Levels" down to "more HD/HP" plus "get weird powers" and it'd be better & easier to just say that:

- You get weird powers from *killing big monsters* and/or *conquering Factions*, or possibly from *subjugating the leaders of Factions*
- You get more HP from the *biggest Faction you directly control*.

Now your "Level" is the same thing as Faction Scale.

---

eh, after some work it's apparent that this abstraction offers no real benefits. we might as well just use raw numbers & maintain readability & comparison capabilities with other systems.

## No Morale

A Morale stat is normally used for tracking the intricate details of a character's opinion of you based on a variety of events that probably happen in great number before that Morale matters. It is also used to determine a percentage chance when monsters will flee. In wargame-like systems, it is used to differentiate granularly between units' individual loyalties & willingness to subject themselves to the throes of combat.

We discarded it because it proved to be annoying to track the Morale or Loyalty of many factions of questionable motives who all had *interests* rather than *loyalties*. We also believe that a state machine-like existence of vassal/friendly/neutral/hostile provides a more easily remembered & intuitive system that better reflects real human behavior on a wider spectrum. On top of that, a Morale score tends to encourage "softer" punishments than are deserved. −1 Morale instead of a % chance of a collapse of a truce? It's more dice-rolling & more book-keeping with no *punch* gained from it.

People *do* count & add up slights, but functionally, you cannot see that score. And when it breaks, it tends to break suddenly & unexpectedly. Therefore, there is no meaningful difference between a stochastic % chance of breaking vs a Morale track.

## 3 Game Theory is incomplete

Cassidy identified that there are three rough categories of focus that one can play in during a "standard" campaign, but he made an error. There's another focus, which is what *level of emergent behavior* you choose to abstract.

You cannot simulate factionalism by modeling individual humans. There is no logarithmic scale of human behavior. Or economics. You can't predict the physical activity that occurs in a single transaction by modeling supply & demand.

A Wealth score is an adequate reflection of how you might functionally obtain an item if you're wealthy. It is inadequate when you're scraping by with discrete units of coinage. It is adequate when you're scraping by but the focus isn't on day-to-day survival.

### Three-Game Theory is Wrong

*Each game is trying to model different things at different levels of abstraction.* My assertion is that the entire system should be *one set of rules*, all of which are always applicable at their own scales & that are compatible with each other in a way that naturally produces the expected world as an outcome.

Put another way; we may have rules for handling specific circumstances ("chases in urban environments"), but that doesn't mean that those specific circumstances are separate "games".

> This is kinda playing definitions. What is a subsystem? A "sub-game"? XCOM's "tactical game" versus "strategic game", and so on. They *are* separate subsystems within the complete whole, and they're all required in order to have the complete experience.
> 
> If TRPGs are different, it's mostly because there's a high degree of overlap between the rulesets. You're arguing that rules for healing in a dungeon ought to be applicable *anywhere* if the simulation demands it. If they aren't, something's wrong.
>
> But Cassidy does, actually, have a point: formalizing these "games" as specific loops & patterns is critical to knowing what the game you're designing is actually about, and putting them into that structure gives the GM some idea of what's actually required to make each individual subsection work properly.

Heh. Actually, on that note:

- We should have the Event Save *naturally create plot hooks & opportunities for players to inject themselves* either by having Factions explicitly reach out to or engage with the party *or* by giving the party weird events to go & interfere with.
- Every element of the game should constantly expose the party to the Factions, who by definition are probably the important groups the world has to offer.
- If the party has no intrinsic motive to go be dungeon-dwellers & cannot muster the resources to compete with the local Factions scene on their own, then this can serve as the primary driver to get them involved by plunging them into dungeons or inter-Faction combat as external agents hired or coerced into participation. This should naturally create the environment for players to start caring about Factions — even if that's in a "they won't fucking stop messing with us" way.

we should also figure out if we actually care about dungeon crawling. the actual gameplay loop might not really involve it.

### Addendum

uh

- do we want to compete? why?
	- uniqueness & "tired of copying good stuff from other people"
	- significant threat from cassidy if he feels i'm infringing too much on what he designs without giving due income
		- this can be limited by acknowledging that ==the system rules for Glass Empires will be free==.
			- but not entirely. you must still write everything yourself without obvious external influence.
	- it's senseless to copy directly without understanding the reasons for the decisions that were made. cassidy's brain produces as much *garbage* as it does useful content, and blindly trusting it is unlikely to be as valuable as you think.
- you want to do war simulations. war across britain. war between 5 different factions. war that takes place in weeks of time, with each faction using what it has to kill the others.

d

## War procedures

This is kinda just faction turns, but the Players might leave & lead an army (possibly consisting exclusively of themselves) over through the wilderness. Then they may lay siege to places. Our wilderness procedures may need to account for things like army maneuvering and encountering other armies in the world. It also needs to handle speed & logistics.

- Would an army be its own Faction?
	- yeah, it would be.
- Could a fortress be its own Faction?
	- "are cities a faction?" the people *inside* the cities are factions. this is a strong indicator that sieges should probably not be handled like battles & should involve their own procedure.

can we do all that without ... using a hex map?

## Also we'll have issues determining what is & isn't a dungeon crawl

because obviously it sucks doing a heist with "dungeon crawl" rules. like, holy fuck. which leads you to ask wtf you're meant to do instead?

## Every skill should actually be its own separate block of rules

yeah. pretty much. if it would be a "skill" it's actually important enough to do this for.

persuasion
intimidation
lying?
knowing things

## No Damage, HP, or HD from Features

==WE ARE STRICTLY FORBIDDEN FROM WRITING FEATURES THAT *DIRECTLY* INCREASE DAMAGE, MAXIMUM HP, OR HD.== This is because of the way the Battles engine works. A Feature that directly raises these attributes:

1) would be written in more than one place on the character sheet, because it would also be recorded as an adjustment to HP or to Damage, or as an increase to the basic number or kind of attacks or weapons allowed for;
2) would be likely treated as a *multiplier* for Battle Score in combat, even though its contribution to character power would already be implicitly counted due to the 1st reason.

If we have a Feature that grants an additional natural weapon ... that will instead be recorded as a natural weapon or attack, which is a *separate* part of the character sheet.

EDIT: nah fuck this. the new Battle Rating system includes a section for this. still, not terribly important!

## Thinking: How do you minimally start a game of Glass Empires?

GM must prepare the campaign world (the broad-strokes outline of what's happening).

- **Physics**: Anything that impacts how the game is actually played out. This includes cosmology & the general structure of the world. It really doesn't matter if the game takes place on a discworld (hello, Aia!) until someone starts asking about curvature.
- **Local realm**: Answer the following questions:
	- Who's in charge here, if anyone?
	- Why would anyone want to overthrow them?
- **Settlement**: The game should start in a settlement no smaller than a village.
	- @ Settlement Generation
- **Settlement Factions**: The GM should generate 12 Factions for the settlement.
	- @ Faction Generation

Many OSR games assume that the world is "fallen". Glass Empires doesn't make this assumption because the core gameplay loop doesn't require ruins or dungeons to work; it is principally about conflict between factions & rulers. Instead, we assume the world is *in a state of turbulence*.

## @ GM Guidance: Institutions Are People

### The Fundamental Fiction

**Institutions do not exist.** Banks, kingdoms, guilds, & armies are convenient abstractions—they are always, ultimately, collections of people acting in patterns.

- **The Kingdom cannot hate you.** Only the King can hate you.
- **A Guild cannot be loyal.** Only the Guildmaster and her members can be loyal.
- **The State** is trained bureaucrats acting _as if_ The State exists—performing their roles according to shared fictions written on paper.

The story *is real* ... to the people who live inside it. And because they act as if it were real, it *becomes* real, as a manifestation of their collective action.

This matters mechanically because:

1. **Factions have no independent agency.** Their Mood is their Leader's Mood. Their Moves are their Leader's Moves. When you negotiate with a Faction, you negotiate with its Leader.
2. **Features belong to Leaders, not Factions.** Banks don't know how to be banks—people who run banks know how to be banks. The special capabilities of institutions derive from the knowledge and skills of those who manage them.
3. **Groups can hate you statistically, but only members can hate you personally.** We model Faction relationships as aggregates because we can't track every individual. Remember this is a useful simplification, not metaphysical truth.

### Why Social Classes Structure the Game

**Social classes are downstream from economic and political reality.** They are not arbitrary narrative categories; they describe how people *actually relate* to power, wealth, and violence in the setting.

This makes social class the **natural organizing principle** for character abilities.

- **Features communicate world-truths.** A Lord's military training Feature tells you Glass values martial nobility. A Burgher's commercial contacts Feature tells you trade networks matter. The mechanics _are_ the setting.
- **Different classes learn different lessons.** A mercenary and a knight both fight, but what they know & how they fight differs enormously. Generic "Fighter" archetypes strip this specificity out — & lose the flavor & mechanical variety that comes from social context.
- **Classes provide levers for engaging with the world.** If you want players to interact meaningfully with Glass's debt economy, give Burghers Features about debt and credit. If you want factional intrigue, give Magistrates Features about bureaucratic manipulation. The abilities teach players what's possible.

If you look carefully at traditional RPG frameworks, you will realize that this is *also* true for *them* — but instead of money, the currency is *violence*. The tank, healer, & DPS found in many an MMORPG are fundamentally *socioeconomic roles* — humans playing a part relative to an economy. By expanding the scope of the economy-game away from violence through damage & HP (i.e. to dungeons), you can broaden the number of distinct niches (i.e. by adding thieves). Glass Empires broadens the scope of the game to all of human politics; this is the only reason we can add political Classes as a meaningful & compelling role to play.

### Design Implications

**When building Features:**

- Root them in socioeconomic context whenever possible
- Ask: "What does someone in this position _learn_ that others don't?"
- Prefer specific over generic (not "Combat Bonus" but "Duel Challenge Rite")
- Use Features to show players what kinds of power exist in the world

**When modeling Factions:**

- Treat Leader and Faction as coupled but distinct (Faction Scale ≠ Leader power, but Leader Mood = Faction Mood)
- Don't give Factions abilities independent of their Leaders
- Remember institutional continuity is a _social achievement_, not automatic—new Leaders may transform the institution entirely

**When adjudicating social interactions:**

- "The Church demands..." means "The Archbishop demands..."
- Institutional opposition requires specific people making specific choices
- If a Faction's Leader is absent/incapacitated, the institution becomes paralyzed or factions within it activate

### Related Connections

This principle reinforces why:

- **Chargen embeds players in social structure** - you can't understand your abilities without understanding where you came from
- **Subfactions can pursue contrary goals** - different Leaders, different intentions, even within same institution
- **Debt is personal before institutional** - you owe the creditor, who happens to represent a bank
- **Victory requires defeating/converting Leaders** - capturing the palace doesn't win if the King escapes

The game models society as a web of personal relationships formalized through institutional fictions. Players succeed by understanding both layers: the formal structure (what institutions claim to do) & the personal reality (what Leaders actually want).

## Power Dynamics > Economics

This really ought to be bolded & in all caps.

**WE ARE NOT MODELING AN ECONOMY. WE ARE MODELING HUMAN POWER DYNAMICS.**

This is a subtle difference & one that is easy to confuse. When we look at an economy, we are looking at a network of dependencies.

## Classes are Socioeconomic Niches

Because all games are economies & vice versa, all agent strategies ("types") within the economy are classes. Because agents played by humans are intrinsically social, all human-played classes form around *socioeconomic* niches.

This is true even for "traditional" role-playing game classes in a dungeon, where *the economy is combat*. In combat, all that matters is **damage**. There are three roles:

- Tank: Block damage.
- DPS: Deal damage.
- Healer: Heal damage.

If you add additional *domains of conflict*, such as space & positioning or buffing/debuffing (force multiplication), you can add some additional combat-exclusive roles.

We can generalize "domains of conflict" into a description of *any* game scope expansion. For example, *traditional* D&D extends the game scope into the Thief *only* because the game scope encompasses dungeon-crawling & therefore the skillsets involved in dungeon-crawling (such as ... sneaking, or unlocking doors).

(Even still, people feel the need to make the thief a competitor in combat as well. This is a separate problem.)

Modern D&D, in its ignorance to *anything* not regarding XP for murder, treats every class as having a flavored but mechanically indistinct combat economy role.

Pathfinder can be observed following a similar trajectory in how it treats specialists such as artificers & alchemists, who in reality play a specialized niche in a human society that is largely unsuitable for a combat economy. They contain tightly-engineered assumptions that prohibit them from impacting the baseline (in reality, almost entirely ignored) nature of the worldly economy outside themselves.

After all, if Pathfinder allowed the artificer to act as one, it would *break the economy* — there's no modeling for it! You *can't* have an artificer who is at once useful for combat (the assumed game) & also for a human society (the broader game).

If Glass Empires can support a broad variety of Classes, it is **only** because we are modeling a broader economic structure, & furthermore that we treat that structure as the game itself. We can have Classes that specialize in non-combat activities *only because* the scope of the economy is broadened to encompass *all* of human (& non-human) society.

## @ Army Composition

Army composition in the muster tables are based on the expected percentage of people who can express a skill within a given population.

@ basically, we can't expect 100% of the population to be a longbowman.

## @ Why such an absurdly complex resources system?

Because the instant you factor in the pricing of goods, you find out that wars are funded off the spice trade, that maritime activity doesn't exist without the movement of dyes & gemstones & gold, and that players given the slightest whiff of the notion of the importance of an economy at war will pull on every single lever possible, which includes the entire economic substrate underlying any particular order of affairs.

Basically, when you have a wargame, the zone of conflict expands unbounded until every single aspect of reality is subject to war. In real life, trade routes were the basis for a huge number of wars — we might say that *access to resources* is the single most important driver of wars & that includes the role of luxury & other emotionally significant goods, not just things that are strategically significant.

In truth, goods that are only of emotional significance take on strategic significance as a direct consequence. Because people love sugar & spice, they spend money on it; because they spend money on it, you create nodes of resources — he who controls the sugar & spice. Because he who controls the sugar & spice controls the wealth of nations, the sugar & spice industry's material inputs & outputs are a valid target if you want to pressure/shape the decision-making of its owner.

If you want to convince Sugar & Spice Man to leave your kingdom alone, the best way is to be able to demonstrate to him that you can, on a whim, obliterate the basis of his empire.

Therefore, all significant resources are components of the game.

---

We can make some limited exceptions. We don't track grain, wheat, rice, beer, or any other broadly manufactured & largely fungible category of goods.

# Setting Engineering Notes

whatever an empire *actively suppresses* & *maintains exclusive control over* is its principal dependency for survival.

hydraulic empires (qing, egypt) do not enable engineering knowledge to spread outside state power controls

this is seen also in rome, ottomans, america & all other empires.

# Character Creation Structure - GM Guidance

## Overview

Character creation in Glass Empires uses a modular table system designed to make coherent & interesting characters who are already embedded in the factional landscape with clear mechanical and narrative hooks.

## Required Components

1. **Classes** - The socio-economic classes available in your game region that could conceivably generate PCs who can participate in the campaign you envision.
2. **Crisis Table** - 18 or 36-entry table of transformative disruptions that shaped a PC's life.
3. **Distinction Table** - 36-entry d66 table of physical/personality color.
4. **Follower Table** - 36-entry d66 table describing starting Factions/Followers from those available within the region.

All of these entries should be tailored to the region where the campaign is taking place.

## Class

Each Class represents a literal socioeconomic class in your world, defined principally by socio-economic relationships (we count religious, martial, etc. bonds as being in some way social or economic).

If you include a Class, you're asserting that social position exists and matters in your setting for this campaign. The two required tables are **Class Features** & **Origins**. You also require a **list of acceptable Race & Sex options**.

### Race & Sex

Simple qualifier lists at the top of the class entry. May include extra notes on setting perspectives. Players may pick from the available options.

- **EXAMPLE 1**:
	- **Race**: Human, Harpy, or Salamander.
	- **Sex**: Male or female. Stereotypically female.
- **EXAMPLE 2**:
	- **Race**: Coraler only.
	- **Sex**: Male only, in theory. Hidden exceptions permitted.

### Class Features

- 11, 12, or 18 entries (your choice based on design difficulty)
- Each Feature is a *mechanical ability* tied to that social Class's *actual role within society* & that enables the exercise of that role.
	- **EXAMPLE**: A Mercenary Class would have powers related to murder, organization of military units, auxiliary skills (siege, bribery & trickery), & so on & so forth.
- Named after the social/mechanical capability it represents
- Can be shared across Classes where thematically appropriate

Design principles:

- Features should be approximately 2× character power each.
- Focus on special actions, social mechanics, or capability expansions. Asymmetrical & incomparable abilities are always preferred over mechanical adjustments.
- **Never** make a Feature that is just equivalent to a Fact (+1 bonus on some kind of Save) in function. It's BORING as FUCK.
- **Never** directly increase Damage, HP, or HD. You can *add* Strikes to Attacks, but this is like the most boring of all possible Class Features.
- Name should evoke the *social reality* that grants the ability. If you're stuck on what a Class should be able to do, ask yourself what extraordinary or weird unique things a social class *can* do (& what limitations they have) and then try to figure out how to *mechanize* that as an interesting & useful active or passive ability.
- Features can be stronger than a 2× advantage if they have negative components to balance out the benefits. This should only be used if the negative components are flavorful expansions of the social class's real limitations within the context of society.

### Origins

- Variable size. Minimum: 6 entries (flat 1d6). Standard: 11 weighted entries (2d6) or 12 entries (1d6 for column, 1d6 for row). Expanded: 18 entries (1d6 for subtable [1-2, 3-4, 5-6], then 1d6 on subtable).
- Each entry has two components: A *shorthand title*, and a *description*. Both provide *social context* & together *implies lessons*. They should *not* be redundant; the title describes the *thing-it-was*, and the excerpt provides *a memorable & defining snippet of life*. Neither should state a lesson outright but leave open gaps to inform the sort of lessons or take-away wisdom that the Origin may have granted.
- We immediately ask the Player to write down their Origin & then formulate a Fact that describes the lesson they learnt from their Origin with the template "Because I was a(n) [Origin], I learned [Lesson]." **EXAMPLES**: 
	- "**Impoverished farmhand**. My dad nearly sold himself to pay for us."
	- "**Court banker's kid**. The lords never took my family seriously as threats."
	- "**Street-painter**. I grew up waging colorful turf-wars against rival gangs." 
	- "**Favored child**. Dad imposed on every chance he had to see I'd grow up his perfect little heir."
	- "**Desperate Orphan**. My village's stilt-houses made great hiding spots for hide-and-go-seek ... and also for smuggling & spying."

Design principles:

- Should describe a single tangible concrete *thing* that happened to the character as they grew up in or existed within the context of their Class's social environment.
- Must co-exist with & not depend on Crisis & Follower table entries *without* causing impossibilities.
- Implies social relationships & past history.
- A good/strong Origin should support at least 11 unique interesting entries. If you can't think of more, you need to flesh out how the Class interacts & defines itself socially, economically, religiously, magically, martially, etc. in the world in greater detail.

## Crisis Table (18 or 36 entries)

**Purpose:** Transformative disruption that changes trajectory

**Format:** "[Event] that [consequence/response]"

**Design Principles:**

- Must work with any Origin × any Class combination
- Dramatic enough to justify character becoming adventurer/warlord/weirdo in order to escape/fulfill revenge/seize poweer
- Implies action taken or lesson learned. Players have to extrapolate from it in the same manner as with their Origin. We immediately ask the Player to write down their Origin & then formulate a Fact that describes the lesson they learnt from their Origin with the template "Because [Crisis], I learned [Lesson]."
- Should reference region-specific events/factions where possible

**Example Entries:**

1. **A Coraler raid swept through**. Everything was burned; my family slaughtered.
2. **My mentor was executed for treason**. I knew he was innocent; the magistrate walked free.
3. **I won a duel**. And was *immediately* exiled for "dishonoring" my opponent.
4. **An old book of magic led me to that crone**. I could never unlearn the secrets she taught me.
5. **A spirit showed me how to bind it ... to my flesh**. It now haunts my every dream.

### Distinction Table (36 entries, d66)

**Purpose:** Physical or personality color that transcends class

**Format:** Brief descriptor with implied social/mechanical impact

**Design Principles:**

- Universally applicable regardless of class
- Concrete and actionable
- Suggests how NPCs might react
- Can be physical, behavioral, or presence-based

**Example Entries:**

1. Strikingly beautiful; people stare and stumble over words
2. Ritual scars covering arms and face in precise patterns
3. Unnaturally tall; you loom over crowds and doorways
4. Soft-spoken but radiates intensity; people lean in to hear
5. Move with trained grace; never fumble or drop things
6. Heterochromatic eyes; unsettling to meet your gaze directly
7. @ [additional distinctions]

### Follower Table (36 entries, d66)

**Purpose:** Defines starting Lv2 Faction AND primary Follower as one entity

**Format:** "[Faction composition/type] led/served by [primary Follower role]"

**Design Principles:**

- Follower IS the Faction at this scale
- Should work with any Class (leads to interesting combinations)
- Defines relationship dynamic and resources
- Implies limitations and complications

**Example Entries:**

1. **Extended family** (parents, siblings, cousins) who depend on you; your eldest sibling manages daily affairs
2. **Mercenary band** of five swords-for-hire; your veteran lieutenant handles discipline and contracts
3. **Secret cult** of ancestor-worshippers (dozen members); your most devoted acolyte serves as your voice
4. **Merchant partnership** with two traders and apprentices; your business partner handles negotiations
5. **Household servants** from former estate; your old steward who raised you refuses abandonment
6. **Military deserters** - your squad who followed you into exile; your shield-brother watches your back
7. **Temple followers** - handful of shrine-keepers who see you as chosen; eldest priestess interprets omens
8. **Bandit warband** gathered in wilderness; your ruthless second-in-command keeps them through fear
9. @ [additional follower types]

## Combinatorial Math

With the modular structure:

- 6-18 Origins per Class
- 18-36 Crises
- 36 Distinctions
- 36 Followers
- Variable Class Features

**Minimum variety per Class:** 6 × 18 × 36 × 36 = 139,968 combinations **Maximum variety per Class:** 18 × 36 × 36 × 36 = 839,808 combinations

Plus variation in Class Features within each Class and optional Follower Class Feature substitution.

## Design Workflow

### Creating a New Region

1. **Identify social classes** - What positions of power exist here?
2. **Create Classes** - One per identified social position
3. **Write Class Features** - 11-18 per Class minimum
4. **Write Origins** - 6-18 per Class based on design time available
5. **Write Follower table** - 36 entries covering all relationship types
6. **Adapt or create Crisis table** - Use setting-wide or region-specific
7. **Adapt or create Distinction table** - Use setting-wide or region-specific

### Time Budget Estimates

**Minimal viable region:**

- 3-5 Classes × 11 Features each = 33-55 Feature entries
- 3-5 Classes × 6 Origins each = 18-30 Origin entries
- 1 Follower table = 36 entries
- Crisis & Distinction can be reused from setting-wide tables

**Total:** ~90-120 entries for minimal viable region

**Fully developed region:**

- 5-8 Classes × 18 Features each = 90-144 Feature entries
- 5-8 Classes × 18 Origins each = 90-144 Origin entries
- 1 Follower table = 36 entries
- Custom Crisis table = 36 entries
- Custom Distinction table = 36 entries

**Total:** ~290-390 entries for fully developed region

## Class Feature Design Notes

> Hey, uh, I'd like to note that *it is not possible to make good Features that are untethered from a specific place & time in human history*. In fact, the notion of a *class* is itself essentially downstream from *being part of a social class*.
> 
> Every good, entertaining, inspiring *class* is about being from a certain *class* of person.
> 
> Furthermore, since you're trying to categorize Feature availability based on organization type, I'd like to point out to you something that should be very obvious: Doing this requires that you categorize organizations into *types* of organizations, either implicitly or explicitly. And if you do *that*, there's little or nothing reasonable stopping you from just ... making it a formal class system *based on the actual classes of Glass*.

Features are Facts with special rules, yes, but more specifically, they:

- Are things granted by Faction control & improvement
- Empower a character with mundane or supernatural abilities relating to the achievements they've managed to achieve with growing the power & variety of their Factions
- Provide players with useful tools for progressing towards the default game loop of the game, which is
	1. "take on missions to expand your influence or to ward off oncoming threats"
	2. "beat the shit out of/persuade & ally/subjugate/kill/trade with people until you have things you want"
	3. "use those things to develop your power base"
	4. repeat
- Speaking quite generally, Features that grant additional "you can do [thing] in a special, more convenient way than most characters can" are good & fine.
- Should encourage genre-friendly behaviors.
- Are approximately 2× power each

Features are not:

- Anything that serves as just a flat bonus or buff to a category or type of Save. We don't even *have* "skills" in Glass Empires, nor will we. If a Feature is only good because it serves as a Fact for bonuses, or gives a Fact or whatever, then it's fucked & stupid.
- Intrinsically, obviously spell-like. Godlike divine powers or miracles are sort of the limit for what Features should do. A Feature is never a spell-like ability ("you can turn someone to stone") unless *maybe if* it's in the vein of what a spirit or god could do in a historical, mythological polytheistic practice sense.
- To do with raw combat power.

Class Features should never increase HD. That's the design space of killing & eating monsters to gain their power. You eat big monsters and get HD for it.

**NEVER**: Break the link between Spirit Power & caster Damage taken while casting spells. This is a critical conceit that prevents state-sponsored magicians from having infinite blood sacrifices to power infinite blood magic. Aztecs on crack because the shit works, and it's also critical for curtailing the overall power of magicians by forcing their works to be dependent upon their own health. SPECIFIC SPIRITS may still ask you to murder things for them, but that's because those SPIRITS are murderous.

okay, ideas list

- **murderer**: gain an extra Strike per Attack.
- **Find weak link**: identify a guy inside an organization who's vulnerable in some way that you can exploit in a chosen manner (i.e. blackmail, befriending)
- **No surprise**: You can't be surprised by anything, ever, if you don't want to be. anything that hits you is never due to lack of awareness.
	- this should be narrowed strictly to a combat awareness, probably. it competes with Meditation. @
- **Meditation**: You don't sleep; you meditate. never surprised while resting. very short sleep durations. all locations count as safe & comfortable while Resting.
	- Redundant with "No surprise"? Find alternative benefits to this.
- **Defeat Means Friendship**: People you defeat in combat may under some conditions join you & your organization.
	- maybe linked to HD. yours or the enemies' hit dice? both?
- **Magical Detection**: Determine the function of something spiritual.

> it just occurred to me that costs measured via in-game time are not *necessarily* sensible game design. (Or are they?)

- **acrobatist**: comically high jumps & leaps. maybe "as long & far as your Run"?
	- fast climbing could go with it
	- super fast blitz-movement that ignores physical durability or things like iron bars?
	- honestly this could be a whole category of shounen/wuxia movement stunts
- **Magician's eyes**: In bright light, you can see invisible things as a faint lensing outline. Through eye contact, you can tell if someone is possessed, charmed, divine, or soulless. Magical items glow a faint octarine hue.
- **Mob**: Raise & calm mobs of people easily provided everyone can hear you & you can speak for 10 minutes uninterrupted.
- **Befriend**: Need a way to charm/beguile people that doesn't lead to mind-control shenanigans or implausibility. and it might be redundant with the Negotiation rules, possibly.
- **Turn into an animal**: you can turn into an animal :^) but just one, themed after the faction in question
- **Stability & movement**: You can climb walls & ceilings like walking.
- **Teleport**: Move to spot within sight faster than anything can track. You must still physically pass through the space between where you are & the target location, but are not constrained by distance, space, time, etc. Costs something, like HP maybe.
- **Chase**: Movement rate is never less than twice your current fastest pursuer or quarry, provided you are in a chase.
- **Laborer**: You can personally work as a number of men equal to your Level's average number of Followers in its capital.
	- *...what use is this? it does decouple labor output from the faction kinda, but in practice it's just sort of saying that you can build at 1 level above the faction's actual output. right? but isn't that just equivalent to a single Fact bonus? a +1?*
- **Animal bonding**: You can sense through the senses of an animal whom you have befriended. You can befriend any animal by spending a week with them as a Move.
	- *we should have more features that let you do weird stuff like this as Moves? maybe. i dunno.*
- **Natural weaponry**: You have natural weapons that deal heavy weapons + 1 damage. big damage. i dunno like 8 or 10 damage. it's nuts.
	- you're not allowed to do this bro.
- **iron will**: immune to literally all external compulsions, desires, or influences. no mind control, no starvation pressures, no panic from breathing. pain has no effect. complete and utter dominance of the body by the mind, complete immunity to external influence.
- **command 2**: you can sense through the senses of any Retainer who's pledged their allegiance to you in a formal ceremony etc etc. it's animal bonding but for commanders.
- **unseen, unknown**: if you aren't in the immediate, direct, obvious physical presence of someone, you cannot be identified as being present by them. you have to be actually seen in strong light, or heard speaking aloud; if you are putting in literally any effort to conceal yourself, you aren't discovered.
- **gemseer**: you can see through every gem you've ever touched provided it has not been shattered or cut further.
- **natural immunity**: gain an Immunity to one type of damage.
- **natural weapons**: gain a natural weapon. it can be hidden if desired. it deals like 7 damage or something a bit above that of a heavy weapon. you can use it regardless of whether you make other attacks.
- **hunter**: you & any retainers under your direct command (but not their followers or Factions they or you rule) are immune to starvation & exhaustion while traveling. if you're in a party, the party rolls an extra time for journey duration & may take the lowest result rolled.
- **shadowwalk**: move from one shadow to another within sight. you can see shadows & things in them as if fully illuminated, provided that a light source is nearby or within line-of-sight

we can & should expand this list by taking character actions that serve as notable tropes or patterns of behavior in media & turning the best, most significant, or important components into Features that players would actually want to use.

NO NICHE PROTECTION BTW. these Features can be ANYTHING. but we try to keep it reasonably balanced.

**Performance**: Given a stage to perform on, you may attempt a mass Persuasion Save (p. @) against an entire audience. A performance can only be used to convey a general lesson or teaching, not specifics to a present case, but you may attempt a Save for performance quality to qualify you for Persuasion's incentive requirement ("Does the target like you?").

**Magical Wisdom**: You have mastered the art of being implicitly treated as an authority on almost any topic relating to the supernatural, spiritual, & divine. Your warnings & instructions are taken with paranoid, superstitious credence, provided consistency (p. @) is met. Only other magicians are unaffected by this.

**Teach By Experience**: Anyone you've been traveling with for more than a week can, while traveling with you, borrow any Facts of yours that describe lessons or experiences (not skills) that are unambiguously describable as wisdom for use on their own Saves.

## Hidden Powers

- Agility
	- **Bird on Water**: You may move at your full Run speed over any surface that could support a bird.
	- **Wall Climber**: You can use your Run speed to climb any surface, including ceilings. You fall if knocked prone.
	- **Iron Shirt Diamond Body**: You naturally possess an Armor score of 2.
	- **Turtle Breath**: Hold your breath for up to 1 hour. Appear dead at will. Survive burial, drowning, poison gas.
	- **Drunken Fist**: Treat intoxication as a bonus to all combat & athletic/acrobatic Saves instead of a penalty.
- Senses
	- **Tremorsensor**: Detect footsteps, heartbeats & speech through solid elemental earth from up to 100' away.
	- **Sense Intent**: You can't be surprised by anything intending you harm within 30'. You know if someone within that range means you harm.
	- **Third Eye**: See through invisibility & enchantments. You know when someone is possessed or lying to conceal their intent.
- Combat
	- **Point Strike**: Your natural weapons are armor-piercing, attacking HP directly.
	- **Dragon Roar**: Deals 3d6 Mind Damage (or flat 10 to unnamed characters) & subsequently panics everyone in earshot of your ordinary yell (~500').
	- **Unblockable Strike**: Target suffers a blow from a weapon of yours as per a Crit. No dodging, no reduction, no deflection, no exceptions; this overrides all protective measures.
	- **Finger Flick**: Accelerate any small object (smaller than a pen) to lethal speeds as a 30' range weapon, dealing Damage equal to your Power.
	- **Acupuncture**: When landing a successful Strike with a Damage-dealing natural weapon, instead of dealing Damage, you may roll for a Wound & disable that body part for 10 minutes.
	- **Redirection**: If an enemy manages a Seven, Fail, or Fumble, you may redirect the avoided Damage & effects to a target of your choice within the enemy's weapon's reach.
- Esoteric
	- **Thousand Faces**: You can perfectly mimic any specific person you've observed for at least 1 hour. Voice, gait, mannerisms. Lasts until you choose to drop it or are physically injured.
		- Some kind of stalking creature? Doppelganger? Shapeshifter? Slenderman?
	- **Poison Mastery**: You are immune to Poison Damage. When you consume something containing poison, instead of suffering its effects, you may secrete it back out through your saliva into a single-dose concentrated form.
	- **Yama**: Upon sight, you know the three greatest sins (as defined by the local law) of the person you are looking at, but none of the specifics; merely that the act was performed.
	- **Debt Enforcement**: You & all other parties take 1 Damage while declaring an oath in service to a debt owed. The oath becomes a Fact. Whenever you act to violate the oath, take a −1 penalty to that act. If the oath is broken in a permanent manner, suffer a −1 penalty on everything forever.
	- **Tea Diplomacy**: If you share a cup of tea with another character, the two of you are bound by the rules of hospitality for 1 day. Neither of you can act to harm the other, cannot deny a bed if you possess one, cannot deny food if you possess it, & cannot deny good-faith negotiation if you are capable of it.
		- Put this one on a demon who is actually incapable of good-faith negotiation. :^) A vampire, maybe.
- Cultivation
	- **Inner Furnace**: You generate enormous internal heat. You're immune to Cold Damage; natural weapons deal Fire Damage; you melt 1 inch of ice per minute.
	- **Life-Sucking**: When grappling a target, steal 1d6 HP from them. This cannot reduce a foe to less than 0 HP. There is no cap to how much HP you can gain.
- Meta
	- **Martial Arts**: You may obtain the benefits of Ritual Cooking if you both defeat a living creature in combat & spend a month learning from them as a teacher. They must still have more HD than you & you can still suffer Mutations.

# Generators

## Generator: Local region

Before we start on a **local region**, we assume you already have a *campaign world* (with 2-5 major Factions & ongoing crises) & a loose *cosmos* to go with it. This is all you need to start here.

- **30–50k square miles**: This guarantees a region large enough to encompass several Lv10 settlements (of approximately 10–30k citizens), making the whole region equal to a small kingdom. This is a realistic target to conquer given a few in-game years & is therefore an implicit *aspirational goal* that restricts the size & focus of the initial campaign to something that's manageable for a GM to assemble quickly.
	- For comparison to OSR systems, this is a region the size of Greece or England; approximately 30×40 if measured in 5-mile squares, or 30×30 if you use 6-mile hexes.
- **All major Factions included**: The local region should encompass as many of the campaign world's major Factions as possible — preferably all of them should be represented, even if that's as a tiny exclave holdout.
- **In a contested area**: This is related to the prior criteria; the best region to start a campaign is one where the whole region is a contested battlefield or unsettled wilderness. Because no singular Faction has an iron grip over the area, there is far greater leeway for breakaway or independent Factions — such as the Party, if they don't want to side with an extant group — to establish themselves & become a larger threat. Wilderness regions have the additional benefit of being relatively far from the centers of power for the campaign world's major Factions, which further decreases the threat that can be mustered to crush upstarts.

> [!tip] Does the map measurement matter?
> The form of measurement does not matter, only that the scale be in miles. Glass Empires does not use a standardized hex, square, or other regional terrain measurement for determining controlled area, movement mechanics, or other factors. All you need is a terrain map with a scale in miles — a grid is only used for estimating distances (& for this reason we prefer square grids, but a ruler is superior).

### Regional terrain

You will need a rough draft of a region's broad-strokes terrain layout. You will want to take note of forests, rough/hilly areas, mountains, rivers, lakes, marshes, dry wastes (hot or cold), & any other terrain you feel is sufficient enough to impact people in the world.

While the process of designing a world based on certain criteria (i.e. realistic or fantastic climate engineering, etc.) is beyond the scope of this guide, it's recommended that you sketch a map using pencil & paper, a cartography program, or paint software, or other non-destructive editable tools. Nothing you set down right now should or will be set in stone — & remember, even after you're "finished", the players — or you — might end up changing the layout of the world years down the line. You'll want backups & iterative potential.

### Establish Settlements

A **Settlement** is a city, town, village, fortress, farmstead, castle, temple, resource extraction site, or other semi-permanent or permanent establishment that's marked as a distinct location on the region map & contains a (normally) consistent population of Families who manage the Settlement.

| Families<br>in Capital | Faction<br>Level | Capital<br>Size | Approx. Required<br>Realm Families |
| ---------------------- | :--------------: | --------------- | ---------------------------------- |
| 0                      |        —         | —               | 10                                 |
| 1+                     |        1         | Cottage         | 30                                 |
| 3+                     |        2         | Manor           | 100                                |
| 10+                    |        3         | Hamlet          | 300                                |
| 30+                    |        4         | Small village   | 1,000                              |
| 100+                   |        5         | Village         | 3,000                              |
| 300+                   |        6         | Small town      | 10k                                |
| 1,000+                 |        7         | Large town      | 30k                                |
| 3,000+                 |        8         | City            | 100k                               |
| 10k+                   |        9         | Large city      | 300k                               |
| 30k+                   |        10        | Metropolis      | 1m                                 |
| 100k+                  |        11        | Megalopolis     | 3m                                 |
| 300k+                  |        12        | Rome            | 10m                                |

@ this is related to the imperial/kingdom/citystate distinction. wildly different capital-to-total-pop ratios.

1. **Tier 1**: Place 2–4 large static city Settlements in the *best* locations to settle. The first should be Lv10 & is the region's nominal Capital. The rest should be Lv9.
	- If this is the capital region of your campaign world's whole empire, increase (or decrease) the Level of the largest Settlement to match the approximate size of your empire's total population, based on the Approximate Required Realm Families column in the adjacent table.
2. **Tier 2**: Around each Tier 1 Settlement, place an approximate ring of 1d6+1 1k–9k Fam. city & town Settlements, about 30 to 50 miles away.
3. **Tier 3**: Around each Tier 2 Settlement, place 1d6+1 100–999 Fam. Settlements approx. 10 to 30 miles away. These can be towns, villages, fortresses, resource extraction sites, etc. Place larger settlements near fertile, flat, water-rich areas & smaller settlements near sparse, empty, resource-focused areas.
4. **Roads**: Interconnect the Settlements in approximately a triangular or hexagonal lattice of trade routes. Roads between major capitals are major paved highways; all other roads are unpaved.

This will leave you an average of around 35 Settlements. You can name & label the most famous or important ones, but beyond that, anything extra is extra credit that you should only do if you find it fun; names will make assembling a Faction hierarchy easier later, but it isn't necessary so long as you can identify what each Settlement *is* & *is doing*.

For Tier 3 Settlements, you may roll to determine their nature (or part of their nature) instead of deciding via fiat:

| 2d6 | Settlement Type                                        |
| :-: | ------------------------------------------------------ |
|  2  | Mobile mercenary corps & encampment                    |
|  3  | (*Ruled by a local god; roll again.*)                  |
|  4  | Traveling caravan (*trader/circus/god-followers*)      |
|  5  | Temple                                                 |
|  6  | God-shrine                                             |
|  7  | Settlement (*Town/village/city*)                       |
|  8  | Resource extraction (*roll on Resource Type subtable*) |
|  9  | Trading post                                           |
| 10  | Castle & town                                          |
| 11  | (*Ruled by youkai; roll again.*)                       |
| 12  | Rural mansion/palace                                   |

| 1d6 | Resource Type                |
| :-: | ---------------------------- |
|  1  | Lumbermill                   |
|  2  | Stone quarry                 |
|  3  | Farm, plantation, or pasture |
|  4  | Mine                         |
|  5  | Fishing                      |
|  6  | Hunting/trapping             |

If the results don't make sense based on the location, default to the closest applicable table entry or find a fun way to make it work (fishing might occur underground, or via lake).

### Determine Settled Areas

Identify arable regions between the Settlements. Anywhere that's good for farmland is populated with an innumerable number of small hamlets & villages numbering 1 to 200 people each. For all intents & purposes, peasantry can be found in abundance in these regions; every inch of arable land is likely occupied with rice, pasture, orchards, or other agricultural activity.

Mark these settled regions as if they were forests, mountains, or other large geographic regions. Their precise boundaries don't matter much, but it's good to know where the rural people are living.

Settled regions do not include forests or other dense, rough unihabitable wilderness.

### Fortress Placement

Place 3d6 Lv3–6 fortresses as additional Settlements. These should be embedded near towns, chokepoints, & other defensible or high-value regions.

Fortresses may have surrounding castle-towns on a case-by-case basis.

### Ruins & Lairs

Place 3d6 **ruins** & **lairs** in empty wilderness regions between Capitals. These may be the Capital or Settlements of youkai Factions, great subterranean complexes bearing many secrets & evils, or simply the lairs of local beasts.

### Regional resources

Roll 2d6 times & attach all results to extant Settlements. Try to evenly disperse them across the region.

| d66 | Resource                                                                  | d66 | Resource                                                   |
| :-: | ------------------------------------------------------------------------- | :-: | ---------------------------------------------------------- |
| 11  | Alchemical crystal/mineral deposits                                       | 41  | Pearl-diving coastline                                     |
| 12  | Ancient olive/fruit groves                                                | 42  | Porcelain-grade clay beds                                  |
| 13  | Archive containing proof of old debts, claims, & blackmail                | 43  | Quarriable marble/granite                                  |
| 14  | Bridge-city controlling major river chokepoint                            | 44  | Rapids-bypassing shipping canal                            |
| 15  | Burial site & temple to regional hero; spirit loyal to current protectors | 45  | Rich iron deposits                                         |
| 16  | Complete library of old military tactics, surveys, & engineering          | 46  | Salt deposits                                              |
| 21  | Deep-water harbor on otherwise cliff-lined coast                          | 51  | Seasonal fairy rings                                       |
| 22  | Dense gemstone veins                                                      | 52  | Semi-stable portal to a distant land                       |
| 23  | Divine coronation site, required to claim legitimacy                      | 53  | Silk groves                                                |
| 24  | Harvest/disaster-predicting observatory                                   | 54  | Spice-growing microclimate                                 |
| 25  | Imprisoned god that grants boons for sacrifices                           | 55  | Sulferic springs                                           |
| 26  | Ivory megafauna reservations                                              | 56  | Temple with national regalia, required to claim legitimacy |
| 31  | Last operational regional military shipyard                               | 61  | Terraced valleys feed an inordinately large mountain city  |
| 32  | Major magician's college & guild                                          | 62  | The only functioning regional gold mine                    |
| 33  | Medicinal herb forests/wilderness                                         | 63  | The only navigable pass through impassable mountains       |
| 34  | Mollusk-dye waterbeds                                                     | 64  | Volcanic obsidian flows                                    |
| 35  | Nationally prestigious hunting grounds & forests                          | 65  | Warbird nesting site                                       |
| 36  | Natural fortress plateau overlooking region                               | 66  | Warhorse breeding grounds                                  |

### Determine Faction Allegiances

Your region, assuming you followed requirements, inherited all major Factions from the campaign world.

1. Figure out what all of the local representatives of the world Factions look like. Write them down.
2. Figure out which areas of the region they control & assign them the largest Settlement in those regions as their Capital.
3. Figure out which regions are *contested*, *wilderness*, or *borderlands*.

The next step is Subfactions. All Settlements that exist within the territory held by a major Faction & that are not fortresses, ruins, youkai-led, or otherwise fortified/self-sufficient are automatically Subfactions to the major Faction of that territory.

(This is where having named your many little Settlements will be useful. If you named them, you can build a map of Faction allegiances *without needing to know anything* about the Rulers of each Faction. All you need to know is that the village Riverwood is Subfaction to Chester Castle, which is Subfaction to Lancaster, which is Subfaction to London.)

Start with the *largest* Settlements. They're Subfactions to the main Faction. Alexandria & Egypt bows to Rome. Work your way down the chain & create additional loyalties. While usually loyal to the ruler of the nearest next-largest Settlement, smaller Settlements may actually hold loyalty to distant lords, creating a patchwork of enclaves & exclaves.

Once you're finished, you'll be left with uncertain borderland Settlements. For each of these, roll 1d6 on the adjacent table.

| 1d6 | Settlement Liege                          |
| :-: | ----------------------------------------- |
| 1-3 | Major Faction (*roll to determine which*) |
| 4-6 | Sovereign (*or see note below*)           |

If a Sovereign Faction's *closest neighboring Capital* is another Sovereign Faction (not a Subfaction), then it becomes a Subfaction of that Sovereign.

### Choose a starting location

At this point, the only thing left to do is to pick a Settlement to start the game in. It's recommended you start with an independent or bordering Settlement where conflict is likely to be more prevalent.

It's possible to continue developing the setting using the Settlement, Faction, & NPC generators, but to a certain extent it's best to not overload yourself with unnecessary preparation; you can't be sure what it is that the Party will end up doing.

@ This may deserve expansion in the future.

## @ Generator: Factions

In most cases, you won't generate a Faction blind. You'll already know some of these details. Just fill what you've already settled on in as you go through the process.

### Level

A Faction's Level is determined based on its Followers in its Capital. Therefore, there are only two places a Faction's Capital can be found:

- On the map as a marked Settlement;
- Inside a Settlement that serves as another Faction's Capital.

No Faction's Level can exceed the Level of its host Settlement (there's nobody else close enough to bring in as a Follower).

If a Faction's Level is unknown, it's 1d6−1 Levels lower than the Settlement's Level.

| Level | Followers |
| :---: | --------- |
|   1   | 0         |
|   2   | 1         |
|   3   | 3         |
|   4   | 10        |
|   5   | 30        |
|   6   | 100       |
|   7   | 300       |
|   8   | 1,000     |
|   9   | 3,000     |
|  10   | 10k       |
|  11   | 30k       |
|  12   | 100k      |
|  13   | 300k      |
|  14   | 1m        |

### Leader



### Capital

### Allegiances

### Abilities & Assets

### Subfactions

### Agendas

## @ Encounters

@ Write soon

> [!tip] @ What encounters are appropriate?
> Encounters shouldn't be "You pass a caravan. Do you want to suddenly inject yourself in their business, disrupting your plans?" Encounters should intrinsically carry the assumption that you already have a reason to believe it's valuable to intervene ... or rob you of the choice by intervening on *YOU*. The same caravan; let's say it's a circus. We'd reframe it as "When you were about to stop for the night, you happened upon a large traveling circus. They invite you to their camp to share stories & songs." And if you camp with them, you get a chance to jump their clown, or treasury box. It's an active opportunity.

### @ Generator: Random Encounters

@ Write soon

# @ Optional Rules

## @ Faction Tech Level

> Math is the only revolution. New math applied to the world's nature, we call *science*; new math applied to human nature, we call *finance*. The intersection & overlap of science & finance reveals a price discovery mechanism we call *technology*.

By default, Glass Empires deals with Glass, an island caught up in the gap between the Gunpowder & Mechanical (or *Medieval*) era. As a consequence, we don't track the technological capabilities of Factions on a granular level. That said, your game may involve Factions whose armies & societies are of dramatically different capabilities.

It should be noted that what we call *technology* must be defined as the knowledge, societal patterns, & infrastructural developments that enable a society to develop increasingly potent means of extracting value from their environment. It covers everything from organizational strategies to industrial techniques. The suggested Tech Level table adjacent is composed primarily based on societal competitiveness.

| Tech | Name       | Reasoning                                                                                       |
| :--: | ---------- | ----------------------------------------------------------------------------------------------- |
|  0   | Stone      | You are a tribal word-wielding ape.                                                             |
|  1   | Bronze     |                                                                                                 |
|  2   | Iron       | Iron-working *obliterates* bronze.                                                              |
|  3   | Mechanical | Mechanical labor & institutional integrity overpowers slave-driven economics.                   |
|  4   | Gunpowder  | Gunpowder (or windguns, in these rules) gradually eliminates *training costs* at a grand scale. |
|  5   | Industrial | The early industrial age is the absolute limit of what Glass Empires can simulate.              |

# @ Notes about what else you need

- [ ] The core rules reference lists of Locations for the region.
- [ ] They also reference Encounter tables.
- [ ] And Monster tables.
- [ ] And Spirit (Spell) tables.

## What do we want in this game?

We want players to be able to conduct war in a strategically/tactically engaging manner & have a satisfying experience in climbing the power ladder in Glass to become the Most Outrageous Warlords.

Factions will always sacrifice every single resource & asset they have to protect themselves from foreign attack.

## Points of reference

- Everyone of significance can kill
	- Faction Scale = Level
	- this actually implies that merely *holding* an office will give you power over time.
		- which is against how power in aia *should* work. that's why this is such a weird inversion.
		- we can keep the old system that says that *this only happens in Glass because the nobility are so fanatical about plunging their kin into monster hunts & false warfare*.
		- And by extension, the nobles are largely warrior-scholars. And therefore, almost everyone who manages an office will have combat experience.
		- Offices that *aren't* inherited tend to have been built up by the current office-holder.
			- A Faction leader normally has a Level equal to *Scale − (2d6 keep lowest 1)*.
- Holding titles gives you power related to that Faction
	- Corollary: You can borrow the powers of all direct Subfactions beneath you?

okay, i've got it. you can get HP & "Levels" from Factions very easily.

a boy crowned emperor will be imbued with *enormous* personal spirit & divine protection (from his position as a leader). BUT. he will be UNSKILLED, and EASILY BEATEN in a fight if he does not prove himself via learning *Lessons* and by taking *Features* from defeated foes.



## Royalty in Glass

Order of descent

- Emperor (Scale 14)

## Setup

Map of the region containing at least:

- Locations of settlements (Faction capitals)
- Terrain
	- Encounter tables
	- Movement-affecting features (roads, mountains, cliffs, rivers)
- A scale (miles)

In order to conquer a Faction, what do you ... have to do to it?

- Abstracted dice mechanics
	- Just roll repeatedly with mechanics for attack timing until you destroy or absorb the target? What's the healthbar, metaphorically? If it's land/territory divisions, we need clear rules for hashing that out.
- Actual mechanisms?
	- Kill/capture the leader?
		- How?
	- Dethrone its Leader from its Capitol?
	- Combat through mass combat?

We *must* have combat, either as duels or as battles, as a key consideration for conquering a Faction. It's required by the core combat system relying heavily on player vs. enemy combat. (It will also be required for that Touhou hack you'll totally make someday.)

Therefore, we *cannot* have combat be wholly relegated to abstracted dice mechanics, which would be somewhat boring anyways.

But we *must* have it as an *option*, because we will have to simulate fights *between opposing Factions* without engaging in detailed warfare.

In either case, we must *also* allow for territorial exchange, because territory must physically change hands. By conquering people, mostly.

---

in order to conquer a faction, you have to

- declare war
- raise an army
- march it & yourself over there
- challenge the leader to a duel
- maybe win? it'd make it easy.
	- if you lose, or if they hate you, you can have a real battle (but this harms your reputation sharply since you're a sore loser)
- now you have a new subordinate! (a "Friend".)
	- learn his secret magic tricks
	- or eat his heart to gain them maybe i dunno

### Conclusions

- ==Core Game==
	- Steal Feature (**Move**)
		- By cooking & eating a character, you can make a Save to steal one of their Features. In doing so, you also threaten to take on their other attributes.
			- You might mutate.
			- You might develop a mindset similar to theirs (duplicate one of their Lessons exactly as-is & lose a single contradictory Lesson you already have, if any).
			- You might die horribly.
			- You can save repeatedly, up to once per Feature.
			- Meals split with others can only be split up to the number of Features possessed.
- **Mode**: Battle
	- Armies fight, somebody wins. Triangle man.
	- The actual outcome of the battle (Faction capitulation, capture of territory, etc.) becomes *contextually dependent*.
- **Mode**: Overworld
	- Travel (**Move**)
- **Mode**: Settlement
	- Gathering Information (**Move**)
		- You must set out with knowledge of what *kind* of information you want to collect & from *whom*. Success is based on whether
	- Raising an army (**Move**)
		- Creates an Army on the map.
		- Moving an Army is done with the *Travel* Move, just as for parties of any size.
	- Infiltration (**Move**)
		- heavily variable based on the quality of the fortifications & surveillance
		- Save.
			- **Crit**: Success, plus a substantial Advantage is achieved towards whatever your reason for infiltration is.
			- **Pass**: Success.
			- **Seven**: Failure but escaped.
			- **Fail**: Discovered but escaped.
			- **Fumble**: Discovered & caught.
- **Mode**: Duel
	- A tactical fight between 2 to 20 people. Should take place on a structured battlefield map.
- ==Diplomacy== (Goal)
	- I think this would be done by sending a Retainer on a Travel Move plus a Negotiation move. We could combine it I guess. There shouldn't be a need to track the Retainer's movement if we know the average distance to the destination.
	- it'd also be stupid to have a Move just for this particular thing, jeez.
		- We could have it be a kind of mission to send ... well, we could just use the Negotiation rules. "The time taken to execute is equal to 3 times the time to get information/messages from you to the other party being negotiated with. Use the Negotiation rules to determine the outcome whenever they return."
- Sabotage/subterfuge (Goal)
	- Infiltrator must actually Travel to the location, & then Infiltrate it. He can then commit sabotage or other acts of violence.
	- Does anything change if we send NPCs to do this for us? (*not really. but they might twist things to their own ends or demand rewards, which deserves its own section.*)
- War (Goal)
	- Measures abstracted time required to raise an army, move it, & force a major engagement on the battlefield between each side's armies. Also measures each leader's individual capacities to engage in lengthy battles, accounting for factors like subterfuge, spies, trades & foreign diplomacy, etc.
	- Outcome results in ==tangible territory, assets, etc. swapping hands== — not in immediate dissolution.
	- Cannot result in destruction of the opposition unless ==all assets have already been transferred or destroyed==, at which point the Faction is *de facto* defunct.
	- Therefore, we have to define "Damage" at this scale & how to map that onto territory changing hands, dis/advantages gained/lost, deaths, Facts, faction leader capture, etc. (maybe Damage = Victory Points or VP, save it between rounds, invest in successes? maybe just use a random outcome generator instead. pay X to roll on this table, or roll while adding bonus from your round.)
	- Save:
		- **Crit**: As Pass, but Damage dealt is doubled.
		- **Pass**: Damage dealt to losing side is equal to 1 minimum, doubled for each Level the victor has over the loser (i.e. w/ a 2 level difference, 4 Damage is dealt).
		- **Seven**: Both sides take 1 Damage.

So we'd want a Save like ...

| Result  | Effect                       |
| ------- | ---------------------------- |
| Crit    | Severe damage done to 1 side |
| Pass    | Damage done to 1 side        |
| Seven   | Damage done to both sides    |
| Failure | reverse                      |
| Fumble  | severe reverse ditto         |

maybe with the intensity of the damage dealt based on the rolled value ... or else on the faction scale difference.

take 1 point of damage. double it for each Level you have over the target (if you're larger).

- Raise Faction Power
	- When your leadership leads to your Faction gaining a Level, you also gain a free Feature rolled randomly from one of the pools most approximating the source of your Faction's power ... or your active Subfactions with Leaders who are your Retainers. (That's right; if you have a sect of 3 spies under a spymaster, you can pick Subterfuge even if you're ordinarily a librarian.)
		- Bureaucracy
		- Brute force
		- Religion
		- Subterfuge
		- Mercantilism

## Example structure

It is July 12

- **Lord Greenmont** (*Barony of Starterdom Lv6*): Build a new stone watchtower in town (August 22nd)
	- *Hates*: Orcus, Lord Barrowpire
	- **==Knight Shintaro==** (*Town Guard Lv5*)
		- *Hates*: Sha the Wizard
		- **Squire Anko**: Make friends with the strongest town guard (July 20)
		- **Headmistress Ene** (*Kisaragi Manor Staff Lv3*): n/a
	- **==Sha the Wizard==** (*Sha's Tower Lv1*): 
		- *Likes*: Knight Shintaro, Mayor Belfast
		- **Apprentice Lance**: n/a
	- **Mayor Belfast** (*Starterdom Village Lv5*): Deforest the entwoods to make room for more farms (September 1st)
- **Orcus** (*Orc Warband Lv8*): Convince Olga the Witch to side with them in preparation for an invasion of Adjacency (August 1st)
	- **Mendal the Shaman** (*Tribe Shamans Lv2*)
- **Lord Barrowpire** (*Barony of Adjacency Lv7*)
	- **Knight Enemy** (*Berryfields Lv4*)
		- *Likes*: Knight House
	- **Knight House** (*Homestead Lv2*)
		- *Hates*: Knight Enemy
		- **Wife Olga** (*The Witchery Lv1*)
			- **Apprentice Eno**

ok that's a scenario.

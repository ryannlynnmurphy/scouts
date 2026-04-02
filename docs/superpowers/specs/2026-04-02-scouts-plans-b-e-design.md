# SCOUTS -- Plans B through E Design Spec

**Date:** 2026-04-02
**Author:** Ryann Murphy + Claude Code
**Prerequisite:** Plan A (Engine) is complete. Phaser 3 canvas, dialogue system, fracture/suspicion managers, all scene scripts, placeholder art, audio skeleton.
**Source specs:** `2026-04-01-scouts-game-overhaul-design.md`, `2026-04-01-scouts-visual-design-deep-dive.md`, `2026-04-01-scouts-suspicion-system-design.md`, `2026-04-01-scouts-frontend-system-vision.md`

---

## Design Principles

1. **Every interaction confronts toxic masculinity.** There are no rest stops. The monologues crush you from a different angle. The campfire crushes you head-on. The Gay Shit scenes let you breathe -- but even breathing costs something.
2. **Dream sequences are self-contained.** They have their own mechanics and emotional logic. They do not feed fracture or suspicion. You feel them but the meters don't know why.
3. **All dialogue is voiced.** Every line, every scene, every character. Pre-rendered via ElevenLabs. Shipped as static audio assets.
4. **The game is experience-first, not completionist.** Multiple endings exist but are not numbered or tracked. After credits, the player sees a named path archetype (e.g., "The Performer," "The Survivor") -- enough to provoke curiosity, never a checklist.

---

## Plan B: Interactive Dream Sequences

### Overview

The 7 monologue scenes transform from void-spotlight-text into fully animated, interactive dream/memory spaces. Each one is a mini-world with its own visual language, objects to interact with, and mechanics that embody how toxic masculinity breaks that specific boy. These are the most visually expressive scenes in the game -- surreal, dreamlike, unbound by the campfire's realism.

The player controls Simon's perspective in Simon's dream. In every other dream, the player inhabits THAT boy -- you become Noah, Josh, Lucas, Sam, Brent. You feel the machine from inside their skin.

### Dream 1: Noah's Room

**Space:** A bedroom. Desk with PSAT book. XBOX on the floor. Mom's voice from another room. Window showing nothing -- just dark.

**Mechanic -- The Grind:**
- The desk and XBOX are the two interactable zones
- Sitting at the desk: a study mini-game. Match vocabulary words. The PSAT score on the wall climbs. But the room gets colder -- colors desaturate, mom's voice gets more distant, the window gets darker
- Playing XBOX: the room warms up, colors return, mom's voice is closer and kinder. But the PSAT score drops visibly. A text notification pops up: "noah ur gonna waste ur potential"
- The trap: you can't do both. Studying kills the warmth. Playing kills the future. The room punishes you either way
- **Exit condition:** After ~90 seconds of oscillating, the room freezes. Noah's voice: "I got a 1400 on my PSAT. No bitches though." Fade to black

**Art direction:** Warm suburban bedroom that drains to clinical blue-white under study mode. The XBOX glows orange like a campfire. Mom is never visible -- just a silhouette through a door crack and a voice.

### Dream 2: Simon's Sky

**Space:** Open sky. Dolphins, mermaids, butterflies swimming/flying through the air around Simon. Pastel colors. Dreamy, fluid, safe.

**Mechanic -- Reaching:**
- Beautiful things drift past. The player can reach for them (click/tap). When you touch a dolphin, mermaid, or butterfly, it shimmers and Simon smiles. A warmth counter fills
- Then the red truck. Sound of engine, tires, a horn. The beautiful things scatter. The word FAGGOT appears in the sky in harsh red, letter by letter
- After the truck: the beautiful things come back, but now when you reach for them, they flinch away. You can still catch them but it takes longer. Each one you catch, the word FAGGOT pulses brighter
- The choice: keep reaching (the things you love are still there but grabbing them hurts) or stop reaching (the word fades but so does everything beautiful)
- **Player choice** (no timer): "And these guys passed me. It was this big red truck..."
  - "They screamed FAGGOT. And... I think I am one." [Authentic -- the beautiful things stop flinching. They come to Simon]
  - "They screamed FAGGOT. But whatever. It doesn't bother me." [Performed -- the things freeze mid-air, lifeless]
  - "They screamed FAGGOT. I don't want to think about it." [Deflect -- everything slowly drifts away]
- **Exit condition:** Scene resolves based on choice. Fade through the strawberry/tomato monologue text, then to black

**Art direction:** The most colorful scene in the game. Watercolor-style pixel art. The red truck is the only hard-edged, realistic object -- it tears through the dreamscape like a wound.

### Dream 3: Lucas's Collection

**Space:** Lucas's room. Shelves lined with dinosaur figures, bug terrariums, meme printouts, a Spiderman poster. Everything he loves, displayed proudly.

**Mechanic -- Disappearing:**
- Each object can be examined. When you interact with one, Lucas talks about why he loves it. Earnest, weird, no filter
- But after examining an item, there's a chance it shrinks. Then disappears. A voice (not Lucas's -- an ambient, male, mocking voice): "That's weird, bro." "Why do you like that?" "That's kinda gay"
- The room shrinks as items vanish. Walls close in. The shelves empty
- The player can try to PROTECT items by not examining them -- but then Lucas says nothing and the room is just silence
- The trap: engaging with what you love destroys it. Protecting it means never expressing it. The pick-me instinct is the only survival strategy: if you examine the Spiderman poster (a "masculine" interest), it stays. The butterflies? Gone
- **Exit condition:** The room is mostly empty. Lucas picks up one remaining item (whichever the player examined last). "I think it's about serving women." Fade to black

**Art direction:** Starts as a maximalist kid's room -- every surface covered. Bright, cluttered, alive. Ends sparse and sterile. The vanishing items leave dust outlines on the shelves like something was there.

### Dream 4: Josh's Garage

**Space:** A garage. Concrete floor. A punching bag. Marine recruitment poster on the wall. Dad's belt hanging on a hook by the door. Pizza boxes stacked in the corner.

**Mechanic -- The Drill:**
- The game makes you do pushups. Button mashing. A counter climbs. Josh's breathing gets heavier
- If you stop mashing: dad's voice. "GET UP." "YOU'RE SOFT." "MY SON ISN'T A QUITTER." The belt on the hook swings slightly
- If you keep going: Josh's arms shake (sprite animation). The counter climbs but the screen starts tunneling. The pizza boxes are right there -- you can see them. You're hungry
- Interact with pizza: "Real men don't eat when they're training." The pizza box closes. Dad's voice: "You want to be fat like your mother?"
- Interact with the belt: Josh flinches. No dialogue. Just a flinch. The pushup counter resets to zero
- Interact with the recruitment poster: Josh stands taller. The room brightens for a second. Then: "Eagle Scout. Then Marines. Then maybe dad will..." The sentence never finishes
- **Exit condition:** Josh collapses from pushups or the player stops and endures dad's voice for 10 seconds without restarting. "I'm gonna be a Marine. That's not... that's not nothing." Fade to black

**Art direction:** Cold fluorescent lighting. Everything gray-green. The belt is the most detailed object in the room -- it catches light. The recruitment poster is the only color (red, white, blue). The pizza boxes are warm-toned but you can never get to them.

### Dream 5: Simon & Sam -- The Performance

**Space:** A liminal theater. Curtain behind them. Audience seats visible but empty. A single spotlight.

**Mechanic -- Breaking the Fourth Wall:**
- Simon and Sam address the player directly. "You know this is a performance, right?"
- Interactive props appear: a MASK (put it on / take it off), a MIRROR (look at yourself / turn it around), a SCRIPT (read the next line / improvise)
- Each object is a choice about authenticity vs. performance. The mask muffles your voice but keeps you safe. The mirror shows Simon but the reflection changes based on what you've done so far. The script has the "right" lines but they feel wrong
- Sam keeps asking: "Is this real? Are we real? Or are we just doing what they wrote for us?"
- The player realizes the game is talking about itself. The choices you've been making in the campfire scenes -- were those YOUR choices or the game's?
- **Player choice** (no timer):
  - "Do I like guys?" -- acknowledge [Authentic]
  - "I AM A GUY. And I'm secure in that." -- push it down [Performed]
  - "I feel different. I don't know why." [Deflect]
- **Exit condition:** The spotlight narrows. "This is one big performance." The theater goes dark. Fade to black

**Art direction:** Stark. Black stage, red curtain, wooden floorboards. The spotlight is warm gold (matching the production's monologue lighting). The empty seats are barely visible -- just enough to feel watched.

### Dream 6: Sam's Bedroom

**Space:** A bedroom at night. Bed with rumpled sheets. Pillow clutched tight. Window with moonlight. A Bible on the nightstand.

**Mechanic -- The Prayer:**
- Sam is in bed. The player chooses how to pray. Every option is some version of "please don't let me be gay"
- Prayer options cycle: "Lord, please take this away." / "Lord, please make me normal." / "Lord, please don't let anyone find out." / "Lord, please let me like girls."
- Between prayers, the room shifts. Moonlight through the window is warm and beautiful. The pillow is soft. These are tender, comforting details
- Interacting with tender things (moonlight, pillow, the warmth of the bed) raises a GUILT meter visible as a faint glow around Sam's chest. The glow is beautiful -- it looks like love. But Sam reads it as sin
- Interacting with the Bible lowers the glow but the room gets colder, darker, the moonlight dims
- The trap: comfort = guilt. Prayer = coldness. Being at peace with yourself is the thing that scares you most
- **Exit condition:** Sam buries his face in the pillow. "Please Lord don't let me be gay." The glow doesn't go away. It never goes away. Fade to black

**Art direction:** Blue moonlight (matching the production's Gay Shit lighting). The bedroom is soft, safe-looking -- this should feel like a place you WANT to be. The Bible is the only hard object. The guilt glow is lavender-pink -- Simon's color. Sam is literally glowing with the person he loves and it's killing him.

### Dream 7: Brent's Empty House

**Space:** A living room. Dad's chair (empty). A map of the US on the wall with San Francisco circled. Flowers in a vase on the windowsill. A mirror.

**Mechanic -- The Cage:**
- The player is Brent. Everything in the room is something Brent wants but can't have
- Touch the flowers: Brent's hand reaches, then SLAPS the vase off the table. "Flowers are for fags." But his eyes linger where the vase was
- Sit in dad's chair: "He's not coming back." Brent stands up immediately. The chair rocks empty
- Look at the San Francisco circle: "Your daddy's a faggot." Brent's fist goes through the map. The hole stays
- Look in the mirror: Brent sees himself. Blood on his face (from the fight). "It's me. The bad guy." The reflection doesn't move when Brent moves. It just stares
- Touch the flowers again (if the player tries): they're gone. Just broken glass and water on the floor. You can't go back
- The room has no exit. No door. No window that opens. Brent is trapped in a space full of things he destroyed
- **Exit condition:** Brent stands in the middle of the empty room. "Do I have to be a man?" No answer. The longest silence in the game. Fade to black

**Art direction:** Suburban living room, beige walls, overhead light that's too bright. The empty chair is the focal point. The flowers are the only soft thing -- and they're destroyed within seconds if the player touches them. After the vase breaks, the room never fully recovers. Water stain on the floor for the rest of the scene.

---

## Plan C: Voice System (ElevenLabs)

### Overview

Every line of dialogue in the game is voiced. Audio is pre-rendered during development using ElevenLabs' API, then shipped as static `.mp3` files. No runtime API calls. No cost per play.

### Voice Design

Six distinct voices, built from scratch in ElevenLabs:

| Character | Voice Profile | Quality |
|-----------|--------------|---------|
| **Simon** | Soft, slightly high, hesitant. Trails off at the ends of sentences. The voice trying to take up less space | Breathy, uncertain. Gets smaller under pressure. Opens up in Gay Shit scenes |
| **Sam** | Warm, steady, a touch deeper than Simon. Measured. The voice that makes you feel safe | Gentle but present. Never loud. The calm in every storm |
| **Brent** | Loud, cracking between man and boy. Barking orders but the pitch breaks. 16 performing 25 | Aggressive, strained. You hear the kid underneath the alpha. Monologue voice is completely different -- quiet, broken |
| **Josh** | Blunt, clipped, military cadence. Declarative. Says things like they're facts | Flat affect. Doesn't ask questions. The rare moments of fear hit harder because of the baseline |
| **Noah** | Fast, sharp, slightly nasal. Over-articulates. Talks too much because silence is scary | Nervous energy masked as confidence. The smartest voice in the room and he needs you to know it |
| **Lucas** | Earnest, uneven pace. Says weird things sincerely. No filter between thought and mouth | Warm but awkward. The cadence is unpredictable -- he'll pause in strange places and rush through others |

### Audio Pipeline

1. **Voice creation:** Design 6 voices in ElevenLabs. Generate test lines, iterate on settings (stability, similarity, style)
2. **Script extraction:** Pull every dialogue line from all 23 scene files (`game/data/scenes/*.ts`), tagged with character and emotion context
3. **Generation script:** Node.js script that reads extracted lines, calls ElevenLabs API, saves `.mp3` files to `public/assets/audio/voice/`
4. **Naming convention:** `{scene}-{character}-{line-number}.mp3` (e.g., `scene1-oath-brent-001.mp3`)
5. **Manifest file:** Generated JSON mapping each dialogue node ID to its audio file path
6. **DialogueManager integration:** When rendering a line, load and play the corresponding audio file. Typewriter text syncs to audio duration rather than a fixed speed
7. **Dream sequence audio:** Dream sequences have their own voice lines plus ambient voice (dad's voice in Josh's garage, mom in Noah's room, the mocking voice in Lucas's room). These are separate voice designs -- not the boys

### Auxiliary Voices

| Voice | Used In | Profile |
|-------|---------|---------|
| **Josh's Dad** | Dream 4 (garage) | Deep, clipped, disappointed. Military bearing. Never yells -- the quiet is worse |
| **Noah's Mom** | Dream 1 (bedroom) | Warm but distant. Muffled through a door. You can't quite make out the words sometimes |
| **Mocking Voice** | Dream 3 (Lucas) | Ambient, male, teenage. Generic cruelty. Could be anyone. That's the point |
| **Sam's Internal** | Dream 6 (bedroom) | Sam's voice but whispered. The prayer voice. More vulnerable than his speaking voice |

### File Budget Estimate

- ~16 campfire/ceremony scene scripts: ~400 lines
- ~7 dream sequences: ~100 lines
- ~3 Gay Shit scenes + anthem: ~80 lines
- ~1 ending: ~20 lines
- Auxiliary voices: ~30 lines
- **Total: ~630 voice lines**

At ~5 seconds average per line, that's ~52 minutes of voiced audio. ElevenLabs generation at this volume is feasible in a single session with a pro plan.

---

## Plan D: Art Upgrade

### Overview

Replace placeholder pixel art with production-quality assets. The visual design language follows the Fordham production's lighting and staging while pushing into surreal territory for dream sequences.

### Character Sprites (48x64, campfire scenes)

Each character gets a world sprite with **posture states** (Simon only has fracture-driven states; others have scene-appropriate states):

**Simon's posture states (fracture-driven):**
- Intact (0-25%): Weight on one hip, tote bag strap, head up. Open
- Cracking (26-50%): Centered, arms closer, head level. Guarded
- Fracturing (51-75%): Hunched, arms crossed, head down. Protecting
- Shattered (76+%): Small, curled, taking up less space. Disappearing

**Other characters:** 2-3 states each (e.g., Brent: pacing/aggressive/broken. Sam: attentive/worried/brave).

### Portraits (128x128)

6 characters x 6 expressions each = 36 portraits. Already have 28 placeholder portraits. Upgrade to production quality with:
- Consistent style across all characters
- Expression transitions (not just swaps -- brief tween between expressions)
- BSA uniform details visible at portrait scale
- Simon's pink undershirt visible at collar

### Backgrounds (960x540)

5 locations, each with animated elements:

| Location | Key Animations | Fracture Response |
|----------|---------------|-------------------|
| **Campfire Clearing** | Fireflies, wind in trees, branch arch closing over the course of the game | Desaturation, trees close in, stars dim, crickets quiet |
| **The Cliff** | Wind in Simon's hair, stars twinkling, valley depth parallax | None -- safe space. Colors RESTORE |
| **The Meadow** | Flowers swaying, bees, dappled light movement | None -- safe space. Full saturation |
| **The Lake** | Water reflections, star reflections, gentle ripples | None -- safe space. Most saturated scene |
| **The Void** | Single spotlight cone, dust particles in light | Spotlight tints to character's color |

### Dream Sequence Art (7 unique environments)

Each dream has its own art style pushing beyond the campfire's pixel realism:

- **Noah's Room:** Warm suburban, drains to clinical. XBOX glow vs desk cold
- **Simon's Sky:** Watercolor pixel art. Most colorful scene in the game. Red truck is hard-edged wound
- **Lucas's Collection:** Maximalist kid's room that empties. Dust outlines on shelves
- **Josh's Garage:** Cold fluorescent gray-green. Belt is the most detailed object. Pizza boxes are unreachable warmth
- **Simon & Sam Theater:** Stark black stage, red curtain, gold spotlight. Empty audience barely visible
- **Sam's Bedroom:** Blue moonlight. Soft and safe. Bible is the only hard object. Lavender-pink guilt glow
- **Brent's House:** Suburban beige, too-bright overhead. Empty chair focal point. Permanent water stain after vase breaks

### Special Visual Effects

- **Viewport shrinking:** Black bars creep in with fracture (960x540 → 780x440). Snaps back during Gay Shit
- **Gay Shit National Anthem:** Rainbow particle explosion, pride flag color cycling, all sprites dancing. Most visually alive moment
- **Branch arch animation:** 4-stage closing across the game (open → narrowing → cage → sealed)
- **Post-credits inventory display:** All items shown with final tooltips. Flower in full color even if everything else is cracked/gray

---

## Plan E: Polish + Full Flow

### Overview

Wire everything into a complete, playtestable experience from title screen to credits. This is integration, tuning, and the moments between moments.

### Scene Flow

The complete play sequence, in order:

1. Black screen → "The woods of a Boy Scout Camp. The dead of night."
2. Fade to Campfire Clearing. Boys in formation
3. **Scene 1 Block 1:** Oath + Sam's Interrogation (2 choices)
4. **Dream 1:** Noah's Room
5. **Scene 1 Block 2:** Squirrel Sacrifice (1 choice with nested follow-up)
6. **Dream 2:** Simon's Sky (1 choice)
7. **Scene 1 Block 3:** Kiss Test + Oath (3 choices)
8. **Dream 3:** Lucas's Collection
9. **Scene 1 Block 4:** Pickup Lines + Sex Doll (1 choice with follow-up)
10. **Dream 4:** Josh's Garage
11. **Scene 1 Block 5:** Resistance (1 choice)
12. **Dream 5:** Simon & Sam Theater (1 choice)
13. **Gay Shit National Anthem** (non-interactive, color explosion)
14. **Gay Shit Act 1:** The Cliff (3 choices)
15. **Gay Shit Act 2:** The Meadow (1 choice)
16. **Gay Shit Act 3:** The Lake (2 choices)
17. **Dream 6:** Sam's Bedroom
18. **The Ceremony** (3 choices, escalating timers)
19. **The Fight** (2 choices, rapid timers)
20. **Dream 7:** Brent's Empty House
21. **Ending text** (determined by fracture level + suspicion + key choices)
22. Credits over starfield
23. Post-credits: inventory display with final tooltips

### Ending Paths

Named archetypes shown after credits (player sees the name, not a number):

| Path | Conditions | Ending Text |
|------|-----------|-------------|
| **The Survivor** | Low fracture (< 30%) | "Simon walked out of the woods different from how he walked in. Not because Brent made a man out of him. Because he didn't let Brent take away who he already was." |
| **The Haunted** | Medium fracture (30-60%) | "Simon walked out of the woods. He wasn't sure who he was anymore. But he knew one thing: Sam's hand was warm, and the stars were still there." |
| **The Shattered** | High fracture (> 60%) | "Simon walked out of the woods. He didn't talk for three days. When he finally did, the only word that came out was Sam's name." |
| **The Alone** | Deflected all Gay Shit choices | "Simon walked out of the woods alone. Sam called after him. He didn't turn around." |
| **The Exposed** | Suspicion critical (0.8+) | Brent discovers Simon and Sam. The ceremony turns into a targeted attack. The ending is the most devastating -- the safety of the Gay Shit scenes is retroactively poisoned |

Players who replay and compare with friends will discover the paths naturally. The archetype name is the only hint that other paths exist.

### Timer Tuning

| Context | Timer | Rationale |
|---------|-------|-----------|
| Brent's first questions | 15s | Player is learning the system |
| Mid-game pressure | 8-12s | Tension building |
| The fight | 3-5s | Breaking point, no time to think |
| Gay Shit scenes | No timer | Safety. Time doesn't exist here |
| Dream sequences | No timer | Self-contained, exploratory |
| Forced participation (oath, chants) | 5s per line before Brent forces it | Compliance is easy, resistance takes courage |

### Transition Design

| Transition | Visual | Audio |
|-----------|--------|-------|
| Campfire → Dream | Screen cracks like glass, shards fall away revealing dream space | Ambient cuts to silence, then dream ambient fades in |
| Dream → Campfire | Dream space dissolves like watercolor in rain, campfire bleeds through | Dream ambient washes out, crickets return |
| Campfire → Gay Shit | National Anthem explosion, then soft color resolve to new location | Anthem audio, then gentle ambient of safe space |
| Gay Shit → Campfire | Colors drain. Like someone turned off the lights. Hard cut | Safe ambient cuts sharply to forest. The contrast is the cruelty |
| Scene → Void | Fade to black. Spotlight snaps on | All ambient gone. Silence. Then voice |

### Credits

- "SCOUTS by Ryann Lynn Murphy" over slowly scrolling starfield
- The stars are the same stars from the campfire background -- but now they're bright, uncovered, free of the canopy
- Character names and their path archetype
- After credits: inventory grid. Each item with its final-state tooltip. The flower from Sam is in full color no matter what. Everything else may be cracked, faded, gray -- but the flower is alive

---

## Implementation Order

**Plan B (Dream Sequences)** first -- these are the biggest new creative work and define the game's identity. The campfire scenes already function; the dreams don't exist yet.

**Plan C (Voice)** second -- once dreams are built, we know every line that needs voicing. The audio pipeline generates all files in one pass.

**Plan D (Art Upgrade)** third -- with gameplay and audio locked, art upgrades are visual polish on a working game.

**Plan E (Polish + Flow)** last -- integration, tuning, and the connective tissue. This is where the game becomes a complete experience.

Each plan is its own implementation cycle: spec → plan → build → review.

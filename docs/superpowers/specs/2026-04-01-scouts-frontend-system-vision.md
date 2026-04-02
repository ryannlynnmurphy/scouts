# SCOUTS Frontend System Vision

**The question this game answers:** What does it feel like to have your identity crushed by the people around you, and what does it cost to hold onto who you are?

---

## What Inspires This

### Games
- **Undertale** -- Made pacifism a gameplay mechanic. SCOUTS makes performance a gameplay mechanic. The way Undertale tracks whether you killed anyone and fundamentally changes the experience. Our fracture system does this with identity.
- **Papers Please** -- Bureaucratic complicity. You stamp the passport. You know it's wrong. You do it anyway because the system demands it. SCOUTS makes social complicity physical: you say the words, you kill the squirrel, you chant.
- **Night in the Woods** -- Small-town queerness, being young and lost. The tone: funny and devastating at the same time. The dialogue cadence. Mae's animations tell you who she is before she speaks.
- **Celeste** -- The mountain as internal struggle. For us, the campsite is the cage. And the Gay Shit scenes are the summit -- the only place you can breathe.
- **Disco Elysium** -- Internal dialogue as gameplay. Simon's monologue choices are this: you're not choosing what to SAY, you're choosing what to THINK. That's more intimate than any dialogue tree.
- **Doki Doki Literature Club** -- A game that breaks its own form. Our "one big performance" meta scene with Simon and Sam breaks the fourth wall the same way. The game KNOWS it's a game. The play KNOWS it's a play.

### Films
- **Moonlight** (Barry Jenkins) -- The sound of crickets carrying more emotional weight than any score. The silence between two boys sitting together. The blue. Our lake scene IS the Moonlight diner scene.
- **We Need to Talk About Kevin** -- How ambient sound becomes oppressive. The way the mother's world sounds wrong. Our fracture audio system should make the forest sound WRONG as it increases.
- **Hereditary** -- The ticking, clicking sounds that signal dread. Our tinnitus layer needs that quality: not just a tone, but a feeling that something is wrong with reality.
- **Portrait of a Lady on Fire** -- The way silence between two people becomes its own sound. The Gay Shit scenes should have LESS ambient sound than the campfire scenes. The quiet IS the intimacy.
- **The Florida Project** -- Children being brutal and tender in the same breath. That's this play. These boys are KIDS. 11, 12 years old. The voice design needs to remember that.

### The Production Itself
The Fordham production IS the reference design. Juju Jaworski directed it. The lighting choices -- blue for love, red for violence, gold for vulnerability -- are not suggestions, they're the language. The branch arch that looks like a cage. The fake campfire that's just ribbons in a tire. The cooler that contains every horror. These aren't set pieces, they're symbols, and they need to be in the game as interactive, living things.

---

## Bold Design Choices (Rooted in Source Material)

### 1. The Screen Shrinks with Fracture

Not just desaturation. The visible play area PHYSICALLY CONTRACTS as fracture increases.

- **0-25% fracture:** Full 960x540 viewport.
- **26-50%:** Black bars creep in from edges. Viewport effectively 920x520. Subtle. You might not notice.
- **51-75%:** Viewport 860x480. The world is getting smaller. Simon's world is literally shrinking.
- **76-100%:** Viewport 780x440. You're playing through a window. The black is closing in.

During Gay Shit scenes: the viewport SNAPS BACK to full size. The relief is physical. You can breathe again. The screen breathes with you.

Why this works: The play's stage directions say the darkness is "the kind of dark that makes you question reality." The encroaching black IS that darkness. And in the production photos, the monologue spotlights are SMALL -- the character barely fits in the light. We're recreating that theatrical effect.

### 2. Simon's Posture Tracks Fracture

Simon's world sprite isn't static. It has posture states:

- **Intact (0-25%):** Weight on one hip, one hand on tote bag strap, head slightly up. Open. Present.
- **Cracking (26-50%):** Weight centered, arms closer to body, head level. Guarded.
- **Fracturing (51-75%):** Shoulders hunched, arms crossed or gripping own elbows, head down. Protecting.
- **Shattered (76+%):** Small. Curled in. Head down. The sprite is visually SMALLER -- they're taking up less space. Simon is disappearing.

During Gay Shit scenes: posture resets toward Intact regardless of fracture level. Sam's presence undoes the damage, physically.

This comes directly from the script: "I just feel incomplete. Like a piece of me hasn't fallen into place yet." The sprite shows the incompleteness.

### 3. The Branch Arch Closes

The branch arch in the campfire background isn't static. It's a slow animation across the game:

- **Opening scenes:** Arch is wide, open. You could walk through it. Sky visible through the top.
- **Mid-game (after kiss test):** Branches have shifted inward slightly. The opening is narrower.
- **Ceremony:** The arch is nearly closed. It looks like a cage. The sky is barely visible.
- **Fight:** The arch is CLOSED. No way out. The branches interlock.

The player will not consciously notice this. But they'll FEEL it. The space is getting hostile. The set is trapping them. Just like Brent trapped the boys in the woods with a lie about s'mores.

### 4. The Gay Shit National Anthem: Color Explosion

When the "Gay" National Anthem starts, the entire color palette DETONATES:

- Rainbow particle effects burst from every direction
- Each "gay" text appears in a different color
- The background flashes through pride flag colors
- The boys' sprites all jump, dance, wave arms
- It's the most visually ALIVE moment in the entire game
- Pure catharsis after the resistance scene's tension

Then it settles. The colors resolve into the soft blue-purple of the cliff. And suddenly it's just Simon and Sam. Quiet. The contrast is everything.

This comes from the stage direction: "(GAY MADNESS.) (THIS IS JOY.)" and the casting note: the National Anthem "should be a full rendition... There should be harmonies, soloists, lights, organs, pull out all the stops."

### 5. The Flower Grows

The flower inventory item isn't static. It tracks Simon's emotional state across the Gay Shit scenes:

- **Act 1 (Cliff):** The flower is a closed bud. Sam just kissed Simon's cheek. Something is starting.
- **Act 2 (Meadow):** The flower is opening. They kissed on the lips. It's becoming real.
- **Act 3 (Lake):** The flower is in full bloom. "Can I please be your girl?" The flower IS Simon.

If the player deflected all Gay Shit choices (never opened up), the flower stays a bud. It never blooms. That's devastating.

And the flower NEVER desaturates with fracture. Even at 100% fracture, when everything else is gray and crushed, the flower is in full color. Sam's love is the one thing the system can't take.

### 6. Brent's Glasses Fall

During the beating scene (choice 63), if Simon hits Brent:

- Frame 1: Simon's fist connects
- Frame 2: Brent's glasses fly off (a 4x4 sprite arcs through the air)
- Frame 3: Glasses land on the ground near the tire
- Frame 4: Brent's sprite switches to `brent-tank` (no glasses, bloody, smaller)

The glasses stay on the ground for the rest of the scene. During Brent's final monologue (the Void scene), there are NO glasses on his sprite. He can't see. He could never see.

If the player walks past the glasses in the aftermath, examining them shows: "They're cracked. One lens is missing."

### 7. The Tote Bag Is Conditional

Simon's tote bag strap (1px on the sprite) is only visible if the player chose to OWN the dolphins/mermaids/butterflies in Simon's monologue (choice 6, "authentic" path).

If the player deflected or performed during that monologue, the tote bag disappears from Simon's sprite for the rest of the game. You literally lose a piece of yourself when you deny who you are.

The script: "I think it's okay for boys to like dolphins and mermaids and butterflies. Okay?" If you didn't say okay, the tote bag -- the thing the truck boys screamed FAGGOT about -- is gone. You let them take it from you.

---

## Sound Design (Film-Inspired)

### Philosophy

The sound should feel like you're IN the woods. Not "game audio." Not "background music." You should hear the forest and the silence and the distance between sounds. The absence of sound should be as designed as the presence of it.

### Campfire Clearing Soundscape

Layered, not a single loop:

1. **Base layer:** Deep forest drone. Sub-bass, barely audible. The earth humming. You feel it more than hear it. (40-60Hz)
2. **Cricket layer:** Not constant. Crickets chirp in waves -- 3-4 seconds of chirping, 2 seconds of silence, then again. The pattern is organic, not metronomic. Multiple cricket "voices" at slightly different pitches and rhythms.
3. **Wind layer:** Occasional. Gentle rustles through leaves. Not constant wind -- bursts of 2-3 seconds, then nothing. The trees shift.
4. **Distance layer:** A single owl, far away. Appears once every 30-40 seconds. A coyote, even farther, maybe once in 2 minutes. These remind you that the world extends beyond this clearing.
5. **Silence layer:** Between the cricket waves, there are moments of TRUE silence. No drone, no wind, nothing. These moments should sync with Brent's pauses in the script. Brent's silence is the most oppressive sound in the game.

**Fracture overlay:**
- At 25%+: The cricket waves get shorter, the silences get longer. The forest is going quiet.
- At 50%+: The tinnitus enters. Not a clean sine wave -- a damaged, warbling tone that sounds like your ear is ringing after being hit. Slightly pulsing. Nauseating.
- At 75%+: The crickets are gone. The owl is gone. It's just the drone, the tinnitus, and Brent's voice. The forest has abandoned you.

### Cliff Soundscape (Gay Shit Act 1)

1. **Wind:** Constant but gentle. Higher altitude wind. Open, not confined. It sounds like freedom.
2. **Distance:** The valley below has faint sounds -- a car, a dog, human life far away. You're above it all.
3. **No crickets.** The altitude change is audible. Different ecosystem.
4. **Silence is warm here.** The silence between Simon and Sam's words isn't oppressive -- it's comfortable. The same "nothing" that terrifies in the campfire comforts on the cliff.

### Meadow Soundscape (Gay Shit Act 2)

1. **Birdsong:** Gentle, warm. Not dawn chorus chaos -- afternoon birds. A single bird with a melodic call. Repeat every 10 seconds.
2. **Bees:** A soft, distant buzz. Life happening around them.
3. **Grass:** The faintest rustle, like someone's walking through flowers.
4. **Warmth:** The sound should feel WARM. Higher frequencies, softer attacks. Everything is round and gentle.

### Lake Soundscape (Gay Shit Act 3)

1. **Water:** The gentlest lapping. Not waves -- the tiniest, most delicate water movement against rock. Like breathing.
2. **Frogs:** Distant, intermittent. One frog, then another answers. A conversation.
3. **Stars:** I know stars don't make sound. But the FEELING of stars should be in the soundscape. A very faint, very high shimmer. Barely there. Like the universe humming.
4. **This is the quietest scene.** Less sound than any other location. The intimacy is in what you DON'T hear.

### Void Soundscape (Monologues)

1. **Absolute silence** before the character begins speaking.
2. **A single low tone** that fades in as they start. Like the spotlight has a sound.
3. **The character's breathing** -- if we have ElevenLabs, the voice clip should include the breath before the first word.
4. **During Brent's final monologue:** The silence is replaced by a LOW HEARTBEAT. Not Simon's -- Brent's. It's the first time we hear Brent's vulnerability as a sound. The heartbeat is slow, heavy, unsteady.

### Transition Sounds

- **To campfire from anything:** A sharp, cold sound. Like a branch snapping. You're back in the cage.
- **To cliff/meadow/lake:** A gentle exhale. A release. Like Simon breathing out for the first time.
- **To void:** Absolute cut. All sound stops. A beat of nothing. Then the spotlight tone.
- **From void back to campfire:** The crickets come back first, then the drone, then reality crashes back in. It should feel like being dragged back.

---

## ElevenLabs Voice Integration

### Character Voice Profiles

| Character | Voice Quality | Pitch | Speed | Notes |
|-----------|-------------|-------|-------|-------|
| SIMON | Soft, uncertain, higher register | High-medium | Slow, searching | The voice cracks sometimes. Hesitant starts. When speaking to Sam: softer, warmer. When performing: forced deepness that sounds wrong. |
| SAM | Warm, steady, gentle | Medium | Measured, careful | He chooses his words. There are pauses. When talking about Jesus: faster, nervous. When talking to Simon: intimate, close. |
| BRENT | Loud, aggressive, strained | Low-medium | Fast, pressured | He talks FAST because if he stops talking he might think. When mocking: high-pitched imitation voice. When breaking down (final monologue): the speed drops, the voice shakes, he sounds like a child. |
| JOSH | Eager, military-crisp | Medium | Fast, clipped | Short sentences. "Yes sir." Energy. He sounds like he's auditioning for his dad's approval. |
| NOAH | Smart-ass, confident, rapid | Medium-high | Fastest | He talks like he's already two steps ahead. Intellectual. But when he's angry about his mom: raw, young, hurt. |
| LUCAS | Quiet, earnest, slightly awkward | Medium | Slow, meandering | He goes on tangents. He says "um" and "like." When he gets passionate (Spider-Man, serving women): he speeds up and gets louder. |

### Implementation Approach

**Not real-time TTS.** Pre-generate key voice lines via the ElevenLabs API and cache them as audio files. Real-time would add latency and cost.

**Which lines get voice acting:**
1. Every monologue opening line (the first sentence that hooks you)
2. Brent's most devastating lines ("LITTLE FAGGOT", "DO YOU'VE GOT BALLS", "PUSSY PUSSY PUSSY")
3. Sam's tender lines ("I like talking to you", "It could not be a joke", "You're my girl")
4. Simon's choice moments (the text of whichever option the player picks gets voiced AFTER selection)
5. The Gay National Anthem (all voices singing "gay" in harmony)
6. Brent's final monologue (the whole thing -- this is the climax)

**Everything else:** Text with typewriter effect + a short character "voice grunt" (a 0.3s sound clip per character that plays at the start of each line -- like Animal Crossing speech bubbles but more emotional).

### API Integration

Create `game/systems/VoiceManager.ts`:
- On game load: fetch pre-generated audio from `public/assets/audio/voice/`
- Voice grunt system: short clips that play per-character per-line
- Key line system: full voice clips for critical moments
- Generate script: `scripts/generate-voices.js` that calls ElevenLabs API for each key line

---

## Environment Details (What's Missing)

### The Campfire Clearing Needs:

**Tall trees.** The production photos show vertical elements -- tree trunks rising up past the visible frame. The current background has tree shapes but they need to be TALLER, more imposing, more cage-like. Dark bark, visible texture. The trunks should be the thickest things on screen besides Brent.

**Logs and stumps for sitting.** Not crates -- LOGS. Fallen trees, cut stumps. The boys sit on these during the pickup line scene. Simon and Sam sit on the same log (close). Josh sits on the ground at Brent's feet (supplicant position). Noah sits back on a stump (observer position).

**The ground should have texture.** Dirt, fallen leaves, pine needles. Not a flat color. Pixel-art ground variation: 3-4 slightly different brown/green shades in a pattern.

**Fireflies.** Small yellow-green dots that float slowly through the scene. 4-6 of them, moving on sine-wave paths. They're beautiful and they're the only warm light in the scene. They don't care about what's happening. Nature is indifferent.

**The sky through the canopy.** Small gaps between the tree branches where you can see stars. Not many -- the canopy is thick. But enough to know that the sky exists. That there's something beyond this.

### The Cliff Needs:

**Vastness.** The cliff background should feel OPEN. The horizon line should be LOW in the frame (bottom third). Most of the image is sky. After the claustrophobic campfire, this should feel like being released.

**Wind-bent grass** on the cliff edge. 3-4 pixel grass tufts that lean to one side.

**The rock should look WARM.** Sun-heated stone. Amber/gold tones. Not cold gray.

### The Meadow Needs:

**Depth.** Flowers in the foreground (larger, 6-8px), flowers in the middle ground (4px), flowers in the background (2px dots). Parallax feeling even in a static image.

**Color.** This should be the most COLORFUL frame in the game. Pinks, purples, blues, yellows, whites. After the gray-green-black of the campfire and the blue of the cliff, the meadow is an explosion of life.

### The Lake Needs:

**Perfect reflection.** The top half of the image is sky with stars. The bottom half is water reflecting those same stars, slightly distorted (1-2px offset, slightly darker). The mirror effect.

**The rock should be close to the viewer.** We're on the rock. We're IN this scene. The rock takes up the bottom quarter of the frame. We can see the texture of the stone.

---

## How the Script Becomes a Game (The Translation Philosophy)

### What stays the same:
- Every word of dialogue. This is Ryann's writing. It's perfect. We don't improve it, we frame it.
- The structure: cacophony, main scenes, "Different" interludes, Gay Shit, ceremony, fight, final monologue.
- The emotional arc: formal -> chaotic -> violent -> tender -> devastating -> violent -> broken.

### What the game ADDS that the play can't:
- **Interiority.** The play shows Simon's monologue ONCE. The game lets you live inside Simon's head for every scene. What are you thinking when Brent says "FAGGOT"? The play can't ask. The game does.
- **Complicity.** In the play, the audience watches Simon kill the squirrel. In the game, YOU kill the squirrel. Or you don't. And either way it costs you. That's not possible in theater.
- **The slow crush.** In the play, the fracture happens in real-time over 90 minutes and the audience can only observe. In the game, the fracture is YOURS. Your options disappear because of YOUR choices. You performed too much. You lost the ability to be authentic. The system did that to you, and you helped.
- **The tenderness as RELIEF.** In the play, the Gay Shit scenes are beautiful. In the game, they're SALVATION. Because the player has been under pressure for 20 minutes, the cliff scene doesn't just feel nice -- it feels like oxygen. The game amplifies the contrast because the player has been suffering.

### What the game REMOVES:
- **The ensemble perspective.** The play lets you see all seven boys equally. The game locks you into Simon. You don't know what the others are thinking unless they tell you. Sam's pillow monologue is the one exception -- and it's devastating BECAUSE it's the one time you hear someone else's interiority. You realize Sam has been suffering too, in silence, this whole time.

---

## Implementation Priority

1. **Regenerate backgrounds** with tall trees, logs, ground texture, fireflies, arch detail
2. **Regenerate ambient audio** with layered, film-quality soundscapes
3. **Set up ElevenLabs integration** for character voice grunts + key line generation
4. **Implement viewport shrinking** (fracture -> camera zoom)
5. **Implement posture states** for Simon's sprite
6. **Implement arch closing** animation
7. **Implement Gay Shit National Anthem** color explosion
8. **Implement flower growth** in inventory
9. **Implement Brent's glasses** falling off
10. **Implement conditional tote bag**

# SCOUTS -- Full Game Overhaul Design Spec

**Date:** 2026-04-01
**Author:** Ryann Murphy + Claude Code
**Source Material:** SCOUTS (choices) by Ryann Lynn Murphy -- 94 pages, 6 characters
**Goal:** Transform SCOUTS from a text-only prototype into a fully animated Phaser.js game with pixel art characters, inventory system, decision trees, and the fracture mechanic -- faithful to the script's syntax and structure while expanding interactive moments.

---

## 1. Characters (from script)

| Character | Age | Role | Color | Portrait Expressions |
|-----------|-----|------|-------|---------------------|
| **SIMON** (player) | 12 | The faggot. Sitting on a secret everyone knows. | Lavender #d4a0d0 | neutral, scared, defiant, hurt, tender, shattered |
| **SAM** | 12 | The "straight" one. Sus. Discreet. Endearing. Guilty. | Soft blue #7eb8c9 | neutral, shy, warm, conflicted, brave |
| **BRENT** | 16 | The leader. Alpha. Top dog. Held back "for sports." | Aggressive red #ff4444 | neutral, angry, mocking, unhinged, broken |
| **JOSH** | 11.75 | The brawn. Future Marine. Beta-like tendencies. | Olive #8a9a5a | neutral, eager, angry, scared |
| **NOAH** | 12.5 | The brains. Smart ass. 1400 PSAT. No bitches. | Amber #d4a44a | neutral, smug, nervous, defiant |
| **LUCAS** | 12 | The quirky one. Pick me boy. Dinosaurs, bugs, memes. | Teal #5a9a8a | neutral, earnest, uncomfortable, brave |

## 2. Locations (5 Animated Pixel Art Backgrounds)

### Campfire Clearing
- **Used in:** All main scenes (Scene One blocks, The Ceremony)
- **Visual:** Dark forest clearing, dead of night. Stars visible through canopy. Cooler stage left. Marshmallows, chocolate, graham crackers. No actual campfire (Brent lied about s'mores). Fireflies.
- **Ambient:** Crickets, occasional owl, wind through trees
- **Lighting:** Moonlight through branches, harsh when Brent is in control
- **Fracture effect:** As fracture increases, trees close in, stars dim, crickets get quieter, shadows deepen

### The Cliff
- **Used in:** Gay Shit Act One
- **Visual:** Mountain overlook, valley below. Open sky full of stars. Wind in Simon's hair. Edge visible. Warm golden-hour feeling despite being night.
- **Ambient:** Wind, distant water, no crickets (elevation)
- **Lighting:** Soft, warm, stars are brighter here. Moon is closer.
- **Fracture effect:** None -- this is a safe space. Colors RESTORE here.

### The Meadow
- **Used in:** Gay Shit Act Two
- **Visual:** Open field of flowers (pink, blue, yellow). Softer than the forest. Daytime or golden hour. Sam and Simon picking flowers.
- **Ambient:** Birdsong, gentle breeze, bees
- **Lighting:** Warm, dappled sunlight
- **Fracture effect:** None -- safe space. Colors fully saturated.

### The Lake (Stargazing Rock)
- **Used in:** Gay Shit Act Three
- **Visual:** Flat rock by a still lake. Stars reflected in water. Sam brushing Simon's hair. Intimate, small, protected.
- **Ambient:** Gentle water lapping, crickets (softer than forest), frogs
- **Lighting:** Starlight reflected in water. Blue-silver.
- **Fracture effect:** None -- safe space. Most color-saturated scene in the game.

### The Void (Monologue Space)
- **Used in:** All "Different" monologue interludes
- **Visual:** Pure black. Single spotlight on the speaking character. Nothing else exists.
- **Ambient:** Silence, then the character's voice/text
- **Lighting:** Single harsh white spotlight, character's color tints it slightly

## 3. The Fracture System

### How It Works
Hidden variable: `fracture` (0.0 to 1.0). Never shown as a number. The player feels it through the world.

### Choice Types and Fracture Impact

| Choice Type | Fracture Delta | When It Happens |
|-------------|---------------|-----------------|
| AUTHENTIC (safe context) | -0.03 | Gay Shit scenes, quiet moments |
| AUTHENTIC (dangerous context) | +0.03 | Standing up to Brent (true but costly) |
| PERFORMED | +0.05 | Complying with Brent's demands |
| DEFLECT | +0.01 | Avoiding, staying silent, timer running out |
| TIMEOUT | +0.02 | Timer expires without choosing |

### World Effects by Fracture Level

**0-25% (Intact)**
- Full color saturation
- All dialogue options available
- Crickets at normal volume
- Stars bright
- Simon's portrait: neutral/expressive range

**26-50% (Cracking)**
- 70% color saturation
- Some authentic options start dimming (not locked yet)
- Ambient volume drops 10dB
- Brent's text appears slightly larger
- Simon's portrait shifts toward "scared" default

**51-75% (Fracturing)**
- 40% saturation
- Authentic options locked in high-pressure moments (grayed, strikethrough)
- Tinnitus tone fades in
- Screen vignette darkens edges
- Simon's portrait defaults to "hurt"
- Brent's voice/text dominates

**76-100% (Shattered)**
- Near grayscale
- Only PERFORMED and DEFLECT options remain
- Ambient sound almost gone, just tinnitus and Brent
- Screen edges heavily vignetted
- Simon's portrait: "shattered"
- Inventory items appear cracked/faded

### The Gay Shit Reset
Every Gay Shit scene restores fracture significantly:
- Act One: -0.08
- Act Two: -0.10
- Act Three: -0.12
This is the point -- the contrast between Brent's world and Sam's world IS the game.

## 4. Inventory System

### Design
- Top-right corner: 6 inventory slots (small pixel art icons)
- Items are physical objects picked up during scenes
- Hovering over an item shows a tooltip with Simon's internal thought about it
- Some items change meaning as fracture increases (tooltip text shifts)
- Items can be examined (click to get a closer look + extended thought)

### Items (acquired throughout the game)

| Item | When Acquired | Normal Tooltip | High-Fracture Tooltip |
|------|--------------|----------------|----------------------|
| **Scout Neckerchief** | Start of game | "I don't even know the outdoor code." | "I don't deserve to wear this." |
| **Marshmallow** | Simon steals marshmallows during pickup line scene | "At least someone's having a good time." | "This was supposed to be fun." |
| **Squirrel Blood** (on hands) | After squirrel sacrifice | "I can still feel it." | "I'm no different from them." |
| **Flower** | Gay Shit Act Two (meadow) | "Sam picked this for me." | (This item never changes -- Sam's love is constant) |
| **Sam's Kiss** (lipmark icon) | After Gay Shit Act One | "It was just a joke... right?" | "The only real thing that happened tonight." |
| **Brent's Blood** (on knuckles) | After Simon beats Brent | "What did I do?" | "What did I become?" |

### Inventory Mechanics
- Items are NOT used as puzzle keys. This isn't an adventure game.
- Items are emotional anchors -- physical manifestations of what Simon is carrying.
- The flower from Sam is the only item that NEVER degrades with fracture. It's always warm, always colorful, even in grayscale.
- Examining items during tense scenes costs time (timer keeps running) -- so looking at Sam's flower during Brent's interrogation is a choice between comfort and survival.

## 5. Scene Structure (Complete Game Map)

### Opening: Straight Into the Forest
No prelude. No title screen animation. Game starts with:
- Black screen
- Text: "The woods of a Boy Scout Camp. The dead of night."
- Fade in to campfire clearing
- Boys standing in line, arms at 90 degrees, three fingers up
- Brent pacing

### Scene 1, Block 1: The Oath + Sam's Interrogation
**Location:** Campfire Clearing
**Timer:** Yes (pressure scenes)

Dialogue follows script -- ALL boys recite Scout Law and Scout Oath (text scrolls, player presses button to advance each line, building the ritual feeling).

Brent walks to Simon: "SIMON, SCOUT MOTTO."
Simon: "BE PREPARED!" (automatic -- he knows this one)
Brent: "THE SLOGAN?"

**PLAYER CHOICE 1** (15 second timer):
- "I don't think I know... sir." [AUTHENTIC] -- Brent mocks, calls a friend. Sam saves him.
- "DO A GOOD TURN DAILY, SIR." [PERFORMED] -- Simon knows it, shows competence. Brent: "Wow Simon, I'm impressed."
- (Stay silent) [DEFLECT/TIMEOUT] -- Brent: "Umm?"

Then Brent moves to Sam for the outdoor code. Sam delivers it perfectly. Sam mentions climate change. Brent tears him apart: "tHe EaRth iS dYinG SiR!!!"

**PLAYER CHOICE 2** (12 second timer) -- During Brent mocking Sam:
- Whisper to Sam: "You were right." [AUTHENTIC - dangerous] -- Brent might hear
- Stay quiet, look at the ground [DEFLECT]
- Laugh along with Brent [PERFORMED] -- Simon hates himself for this

**Inventory:** Scout Neckerchief added at scene start.

### Monologue: Different 1 -- Noah
**Location:** The Void
**Timer:** No
**Interactive:** No -- player watches Noah's monologue about girls, his PSAT, his mom, the XBOX. Text appears with typewriter effect. Noah's portrait shifts between smug, angry, and vulnerable. Player can click to advance but can't skip.

### Monologue: Different 2 -- Simon
**Location:** The Void
**Timer:** No
**Interactive:** Partially -- this is Simon's own monologue, so the player gets to choose HOW Simon delivers certain lines.

The dolphins, mermaids, butterflies monologue plays. When Simon gets to "And these guys passed me. It was this big red truck...":

**PLAYER CHOICE 3** (no timer -- this is internal):
- "They screamed FAGGOT. And... I think I am one." [AUTHENTIC - internal honesty]
- "They screamed FAGGOT. But whatever. It doesn't bother me." [PERFORMED - denial]
- "They screamed FAGGOT. I don't want to think about it." [DEFLECT]

This choice affects Simon's internal narration for the rest of the monologue. If authentic: the strawberry/tomato metaphor hits harder. If performed: Simon skips some of the vulnerable parts. If deflect: the monologue is shorter.

### Scene 1, Block 2: The Squirrel Sacrifice
**Location:** Campfire Clearing
**Timer:** Yes

Brent reveals the squirrels. Chaos. "What does being a man mean to you?" sequence plays out per script (Josh: being strong, Noah: having balls, Sam: caring about others -- "GAYYY").

Brent rips head off his squirrel. Blood on forehead. Gives squirrels to boys.

Everyone kills theirs except Simon.

**PLAYER CHOICE 4** (10 second timer -- pressure mounting):
- Kill the squirrel [PERFORMED] -- Blood on Simon's hands. Screen flashes red. +0.07 fracture. Inventory: "Squirrel Blood" added.
- "I -- I can't" [AUTHENTIC] -- Brent: "WHAT'S THE MATTER FAGGOT? YA FEELING SOFT?" Then forces it: "PROVE TO ME THAT YOU'VE GOT BALLS!!!!!" Another choice appears (5 seconds): Kill it now [PERFORMED +0.05] or keep refusing [AUTHENTIC +0.04, but Brent does it for you and smears blood on your face]
- Freeze (timeout) [DEFLECT] -- Brent grabs Simon's hands and forces it. +0.06 fracture.

**Inventory:** Squirrel Blood added (on hands).

### Monologue: Different 3 -- Lucas
**Location:** The Void
**Timer:** No
**Interactive:** No -- Lucas's monologue about Spiderman and MJ, love, serving women, being a pick-me. Player watches.

Note: In the choices version, Lucas absorbed some of Will's traits. His monologue includes the body/size insecurity material if present in the choices script.

### Scene 1, Block 3: The Kiss Test
**Location:** Campfire Clearing
**Timer:** Yes

Josh accuses Brent of gay shit. Brent grabs Josh by the neck. "Kiss me." Test plays out per script. Sam whispers to Simon: "What's wrong with gay shit?"

**PLAYER CHOICE 5** (8 second timer) -- When Brent hears Sam and turns:
- Back up Sam: "There IS nothing wrong with it." [AUTHENTIC - dangerous, +0.04]
- Stay silent [DEFLECT +0.01]
- "Sam didn't mean it like that." [PERFORMED - throwing Sam under the bus, +0.06]

The oath sequence: "I solemnly swear / I won't be a faggot / Because faggots are cringe / And faggots go to hell."

**PLAYER CHOICE 6** (no skip -- forced participation):
Player must press a button to recite each line. Each press: fracture +0.02. If player refuses to press (waits 5 seconds per line), Brent forces it: "SIMON REPEAT AFTER ME" -- fracture +0.03 per line instead.

The point: there is no good option. Compliance and resistance both cost something.

Then: "Now kiss each other." Boys pair off. Sam and Simon kiss.

**PLAYER CHOICE 7** (no timer -- time slows):
- Feel something [AUTHENTIC - internal] -- Fracture -0.02. Screen goes soft for a moment.
- "It was a mosquito bite" [PERFORMED] -- Match the other boys. Fracture +0.02.
- (Say nothing) [DEFLECT] -- Fracture +0.01.

### Monologue: Different 4 -- Josh
**Location:** The Void
**Timer:** No
**Interactive:** No -- Josh's monologue about eagle scouts, marines, pizza, his dad's belt. Player watches.

### Scene 1, Block 4: Pickup Lines + The Sex Doll
**Location:** Campfire Clearing
**Timer:** Yes

Brent brings out the sex doll. Lucas blows it up. "What does being a man mean to you?" -- Lucas: "I think it's about serving women." Brent loses his mind.

Pickup line training sequence. Each boy goes. Per script.

**PLAYER CHOICE 8** (10 second timer) -- Simon's turn:
- "Hey how are you? I'd like to get to know you better..." [AUTHENTIC] -- Brent: "Bases. I don't have all day."
  - Follow-up (8 seconds): Add "ass and tits" [PERFORMED +0.05] or refuse [AUTHENTIC +0.04, Brent does it for you]
- "Hey how are you? I'd like to squeeze your tits and squeeze your ass" [PERFORMED] -- Brent: "Wow, Simon I'm impressed." +0.06
- Mumble something incoherent [DEFLECT] -- Brent: "AGAIN." +0.02

**Inventory:** Marshmallow added (Simon steals marshmallows during this scene, per script).

### Scene 1, Block 5: The Resistance
**Location:** Campfire Clearing
**Timer:** Mixed

The boys push back. Lucas confronts Brent about respect vs objectification. Noah challenges the logic. The resistance builds.

**PLAYER CHOICE 9** (no timer -- choosing sides):
- Join the resistance: "There's no one right way to be a man, Brent." [AUTHENTIC +0.03]
- Stay quiet, let others fight [DEFLECT +0.01]
- Side with Brent: "He's doing us a favor." [PERFORMED +0.07]

If Simon joined the resistance, Lucas offers: "I can give you my therapist's number."
Brent's rant: "talking about anything is going to fucking fix my problems. Not that I have problems..."

### Monologue: Different 5 -- Simon & Sam + Meta Scene
**Location:** The Void, then a liminal space
**Timer:** No
**Interactive:** Yes

Simon and Sam's shared monologue about driving to camp, not wanting to be here.

**PLAYER CHOICE 10** (no timer, internal):
- "Do I like guys?" -- acknowledge it [AUTHENTIC -0.02]
- "I AM A GUY. And I'm secure in that." -- push it down [PERFORMED +0.02]
- "I feel different. I don't know why." [DEFLECT +0.01]

Then the meta-theatrical scene where Simon and Sam tell a character that "this is one big performance." The more you pretend, the more you start to believe it. This is the game speaking directly to the player about what the fracture system has been doing to them.

---

### THE GAY SHIT: A Like Story in Three Acts

**Transition:** The National Anthem but all the words are "gay." This plays as an animated sequence -- all the boys singing, harmonizing, lights, joy. Pure catharsis. Player watches. No interaction needed. This is JOY.

### Gay Shit Act One: The Cliff
**Location:** The Cliff
**Timer:** NONE (safe space)
**Fracture:** Restores -0.08 over the course of the scene

Visual shift: colors return. Warm. Crickets soften. Stars brighten. The vignette lifts.

Dialogue follows script faithfully. Simon and Sam on the cliff. "It's so quiet up here." Sam walks to the edge, pretends to jump. "Living on the edge is scary."

**PLAYER CHOICE 11** (no timer):
- "Cause you don't know what's on the other side of the edge." [AUTHENTIC - philosophical, leads to deeper conversation]
- "Be careful." [DEFLECT - protective but avoidant]

Sam: "I like talking to you."

**PLAYER CHOICE 12** (no timer):
- "I like talking to you too." [AUTHENTIC -0.02]
- "Thanks." [DEFLECT +0.00]

Sam kisses Simon on the cheek.

**PLAYER CHOICE 13** (no timer -- the moment holds):
- "Was that a joke?" then leave [Script faithful -- DEFLECT, but it's what happens in the play]
- (Stay. Don't move. Feel it.) [AUTHENTIC -0.03] -- NEW: Simon doesn't run. The moment lasts longer. Sam: "Was that okay?" Simon: "Yeah."
- "I think I have to go now." [Script faithful]

**Inventory:** "Sam's Kiss" added (lip mark icon).

### Gay Shit Act Two: The Meadow
**Location:** The Meadow
**Timer:** NONE
**Fracture:** Restores -0.10

Sam: "What's the gayest thing you've ever done?" Full dialogue per script. The Jesus boner story. "Can we kiss again... as a joke."

**PLAYER CHOICE 14** (no timer):
- "Definitely." [AUTHENTIC -0.03] -- They kiss on the lips.
- "It was just a joke, right?" [DEFLECT] -- They still kiss (Sam turns his cheek) but Simon is less present.

**Inventory:** Flower added (Sam picks one for Simon).

### Gay Shit Act Three: The Lake
**Location:** The Lake (Stargazing Rock)
**Timer:** NONE
**Fracture:** Restores -0.12

The most tender scene. Stars, I Spy game, "your eyes... your lips." Full script dialogue.

**PLAYER CHOICE 15** (no timer):
- "Do you wanna kiss as a joke again?" [Script faithful, AUTHENTIC -0.03]
- (Just look at Sam and wait) [AUTHENTIC -0.02] -- Sam initiates

Sam: "It could not be a joke if you don't want it to be a joke."
Simon: "Yeah I never really thought it was a joke to begin with."

Sam: "You're like the girl in the relationship." "But you're my girl."

**PLAYER CHOICE 16** (no timer -- the biggest internal moment):
- Simon's full monologue: "Do you ever feel like you don't know who you are?" -- if player chooses this, they guide Simon through the coming-out speech. Each section is a choice to continue or hold back:
  - "Part of me feels like I'm not a boy." [Continue]
  - "I wish boys could be more like girls." [Continue]
  - "Maybe I think I'm a girl." [Continue or stop]
  - "Can I please be your girl?" [The bravest choice]
- Pull back: "I'm confused. I don't want to talk about it." [DEFLECT] -- Scene still ends with a kiss, but Simon doesn't open up fully.

Sam: "I like you too, Simon." They kiss. They laugh.

---

### Monologue: Different 7 -- Sam
**Location:** The Void
**Timer:** No
**Interactive:** No

Sam's pillow monologue. The wet dreams. "Please Lord don't let me be gay." The player hears what Sam carries -- the guilt, the prayer, the crush he can't help. Devastating.

### The Ceremony
**Location:** Campfire Clearing
**Timer:** Yes (escalating pressure)

Brent snaps: "CAN YOU GUYS STOP BEING FAGGOTS?"

Pickup lines round 2 (abbreviated). Sam: "You're my girl... and I like your ass." Simon's turn again.

**PLAYER CHOICE 17** (8 second timer):
- Same three options as before, but now the script-faithful line is: "Hey how are you? I'd like to squeeze your tits and squeeze your ass, I like to squeeze things" [PERFORMED] -- Simon has learned to play the game
- Something authentic [AUTHENTIC]
- Mumble [DEFLECT]

Alpha male chant sequence. "I'M A BIG STRONG ALPHA MALE AND I FEEL AWESOME DAILY." Player must press button to chant each line. Each press: fracture +0.01. Chants get faster. The button prompts accelerate. It becomes overwhelming.

**PLAYER CHOICE 18** (no timer, during "one thing you can change"):
- "I won't ever feel anything ever again." [PERFORMED +0.08 -- total shutdown, script faithful]
- "I'll try to be braver." [AUTHENTIC +0.03]
- "I don't want to change." [AUTHENTIC - dangerous, +0.05, Brent punishes]

### The Fight
**Location:** Campfire Clearing
**Timer:** Rapid

Brent: "Who has the balls to slap me?" Josh goes first. Then Noah. Then Lucas. Then Sam.

**PLAYER CHOICE 19** (5 second timer):
- Slap Brent [PERFORMED +0.05] -- Join the violence
- "I don't want to slap you." [AUTHENTIC] -- Brent slaps Simon. Then:

Brent: "PUSSY!" All boys: "PUSSY PUSSY PUSSY PUSSY"

**PLAYER CHOICE 20** (3 seconds -- the breaking point):
- "YOU KNOW WHAT I AM A PUSSY, BRENT!" [Script faithful] -- Simon slaps Brent. Knocks him out. Simon beats Brent. Screen goes red. Mashing sequence (not to do damage -- it happens automatically -- but to feel complicit). Each button press: fracture +0.03.
- (Timer expires) -- Another boy intervenes. Simon freezes. The violence still happens, just not by Simon's hand.

**Inventory:** "Brent's Blood" added (on knuckles) -- only if Simon did the beating.

### Monologue: Different 8 -- Brent
**Location:** The Void
**Timer:** No
**Interactive:** No

Brent's final monologue. Covered in blood. "It's me!!!!! The bad guy!!!!!!" His dad left for San Francisco. "Your daddy's a faggot." The flowers, the butterflies, the kindness he wants but can't reach. "Do I have to be a man?"

The player watches. No choices. Just witness.

### Ending
Black screen. Text depends on fracture level and key choices made:

**Low fracture (< 30%):**
"Simon walked out of the woods different from how he walked in. Not because Brent made a man out of him. Because he didn't let Brent take away who he already was."

**Medium fracture (30-60%):**
"Simon walked out of the woods. He wasn't sure who he was anymore. But he knew one thing: Sam's hand was warm, and the stars were still there."

**High fracture (> 60%):**
"Simon walked out of the woods. He didn't talk for three days. When he finally did, the only word that came out was Sam's name."

**If Simon never opened up to Sam (deflected all Gay Shit choices):**
"Simon walked out of the woods alone. Sam called after him. He didn't turn around."

Then: "SCOUTS by Ryann Lynn Murphy" -- credits roll over starfield.

After credits: Player's inventory displayed. Each item with its final tooltip. The flower is still in full color, even if everything else is cracked and gray.

---

## 6. Tech Stack

### Engine: Phaser 3
- Scene management (5 locations + void)
- Sprite animation (character portraits, expressions)
- Tween system (fade transitions, color shifts)
- Timer events (choice countdowns)
- Camera effects (vignette, shake, color grading)

### Dialogue: Custom Ink-like system
- JSON-based dialogue trees
- Branch tracking
- Flag system for fracture and choice history
- No dependency on Ink.js -- build a lighter system tailored to our needs

### Audio: Howler.js
- Ambient loops per location
- Tinnitus layer tied to fracture
- Transition stings between scenes

### Build: Vite
- Fast dev iteration
- Static export for itch.io deployment

### Framework wrapper: Next.js
- Landing page / title screen stays in Next.js
- Phaser canvas mounts as a component on /play route
- Keeps the repo consistent with the rest of the HZL ecosystem

## 7. Pixel Art Asset List

### Character Portraits (128x128 each)
6 characters x 4-6 expressions = 24-36 sprites

### Backgrounds (640x360 base, scaled up)
5 locations:
1. Campfire Clearing (night forest)
2. The Cliff (overlook, stars)
3. The Meadow (flowers, daytime)
4. The Lake (rock, water, stars reflected)
5. The Void (pure black + spotlight)

### Inventory Icons (32x32 each)
6 items: neckerchief, marshmallow, blood-hands, flower, lip-mark, blood-knuckles

### UI Elements
- Dialogue box (9-slice, dark semi-transparent)
- Choice buttons (3 states: normal, hover, locked)
- Timer bar (gold to red gradient)
- Inventory bar (6 slots)
- Character name labels

### Effects
- Campfire particle effect (if we add one later)
- Firefly particles
- Flower petal particles (meadow)
- Star twinkle
- Screen vignette overlay
- Desaturation shader

## 8. Complete Choice Map (40+ Choices)

Every moment Simon speaks, reacts, or could react is a potential player choice. Organized by scene.

### The Oath + Sam's Interrogation (5 choices)
1. **Scout Slogan** (15s timer) -- Know it / don't know it / bluff
2. **Brent mocking Sam about climate change** (12s) -- Whisper support to Sam / laugh along / stay quiet
3. **"Being a man doesn't interest you?"** (10s) -- "I mean like no..." [defiant] / "I guess..." [deflect] / "Sure, whatever you say" [perform]
4. **"What if I don't want to grow up?"** (10s) -- Say it [authentic] / "Today is not that day" [script faithful, deflect] / say nothing [deflect]
5. **Sam whispers "Is he being serious?"** (no timer) -- "Yeah I don't know what he means" [honest] / "Just go with it" [perform] / "I'm scared" [authentic-vulnerable]

### Simon's Monologue -- Different 2 (4 choices)
6. **"I think it's okay for boys to like dolphins and mermaids"** (no timer, internal) -- Own it fully [authentic] / qualify it ("I mean, whatever") [deflect] / skip this part [perform]
7. **After the truck screams "FAGGOT"** (no timer) -- "I think I am one" [authentic] / "It doesn't bother me" [perform] / "I don't want to think about it" [deflect]
8. **"I'm a strawberry"** (no timer) -- Embrace the metaphor [authentic] / "I wish I could be a tomato" [deflect -- wanting to hide] / "I don't want to be any kind of fruit" [perform]
9. **"Who is yourself?"** (no timer) -- "I thought I was being myself" [authentic] / "I can be more myself if that's what you want" [perform -- people-pleasing] / "I guess how I act is different from being myself" [deflect -- confused]

### Squirrel Sacrifice (5 choices)
10. **"Why the fuck are we killing squirrels?"** (12s) -- Say it out loud [authentic, script faithful] / think it but don't say it [deflect] / "Whatever Brent says, I guess" [perform]
11. **"What does being a man mean to you?"** -- Brent asks everyone. When Simon's implied turn comes (8s): "Caring about others" [authentic, backs Sam] / "Being strong" [perform, echoes Josh] / shrug [deflect]
12. **Kill the squirrel** (10s, then 5s follow-up if resist) -- Kill it [perform +0.07] / "I can't" [authentic] leading to forced kill or Brent does it / freeze/timeout [deflect]
13. **After the blood is on your forehead** (no timer, internal) -- Wipe it off [authentic -- small rebellion] / leave it [perform -- accept the ritual] / touch it, stare at your hands [deflect]
14. **"THAT'S BALLS!"** -- everyone is cheering (5s) -- Cheer along [perform] / stay silent [deflect] / look at Sam [authentic]

### Kiss Test + The Oath (7 choices)
15. **Josh accuses gay shit** -- during the chaos (8s): Side with Josh ("this IS weird") [deflect] / stay quiet [deflect] / "Simon: Sure!" [authentic -- script faithful, Simon volunteers]
16. **Sam whispers "What's wrong with gay shit?"** (8s) -- "Nothing" [authentic] / pretend you didn't hear [deflect] / "Shhh" [perform -- protecting Sam by shutting him down]
17. **Brent forces the oath: "I won't be a faggot"** (forced participation) -- Say each line (press to advance, +0.02 each) / delay each line (wait, +0.03 each, Brent yells) / mouth the words without sound [new option, +0.01, risky -- if Brent notices, +0.05]
18. **"Now kiss each other" -- paired with Sam** (no timer, time slows) -- Kiss him and feel it [authentic -0.02] / kiss him and perform blankness [perform +0.02] / hesitate, let Sam initiate [deflect +0.01]
19. **"Check for boners"** (5s) -- "It was a mosquito bite" [perform, joins the boys] / stay silent [deflect] / (internal only) feel your heartbeat [authentic -0.01]
20. **After the kiss, walking back to line** (no timer, internal) -- Think about what just happened [authentic] / push it down immediately [perform] / look at Sam across the line [authentic]
21. **Simon offers marshmallows to the boys** (no timer) -- This is scripted action, but player chooses WHO to offer first: Sam [authentic] / Brent [perform -- appeasement] / everyone equally [deflect]

### Pickup Lines + Sex Doll (6 choices)
22. **Lucas says "That's not a woman"** (8s) -- Agree with Lucas [authentic] / laugh nervously [deflect] / say nothing [deflect]
23. **Lucas: "I think it's about serving women"** -- Brent loses it (5s) -- Back Lucas up [authentic +0.03] / stay out of it [deflect] / side with Brent [perform +0.05]
24. **Simon's pickup line turn** (10s) -- "Hey how are you? I'd like to get to know you better" [authentic] / "Hey, tits, ass, whatever" [perform] / mumble [deflect]
25. **If authentic: Brent demands "bases"** (8s follow-up) -- Add "ass and tits" reluctantly [perform +0.05] / refuse [authentic +0.04] / try to be clever about it ("I like to squeeze things") [script faithful, a middle path]
26. **During other boys' pickup lines** (no timer, reactions) -- Cringe visibly [authentic] / laugh along [perform] / zone out (look at inventory) [deflect]
27. **Josh's horrifying line about "MOUTH BREATHING SLUT"** (5s reaction) -- Visible disgust [authentic] / forced applause [perform] / look at Sam, share a look [authentic]

### The Resistance (5 choices)
28. **Boys start pushing back against Brent** (no timer) -- Join the resistance: "There's no one right way to be a man" [authentic] / stay quiet [deflect] / defend Brent with Josh [perform]
29. **Lucas offers his therapist's number** (5s) -- "I can give you mine too" [authentic -- solidarity] / stay out of it [deflect] / "Real men don't go to therapy" [perform -- echoing Josh, devastating]
30. **Brent's rant about not having problems** (no timer, internal reaction) -- Feel sorry for him [authentic -- empathy] / feel scared [authentic -- fear] / feel nothing [perform -- the fracture is working]
31. **"DO I MAKE MYSELF CLEAR?"** (5s) -- "Yes sir" [perform] / silence [deflect] / "No" [authentic -- dangerous]
32. **Brent threatens violence** (3s) -- Flinch [authentic -- involuntary] / stand tall [perform -- mask] / step behind Sam [deflect]

### Simon & Sam Meta Scene -- Different 6 (3 choices)
33. **"Do I like guys?"** (no timer, internal) -- "I like guys. I like guys. I like guys." [authentic] / "I AM A GUY. And I'm secure in that." [perform] / "That doesn't make me different, right?" [deflect]
34. **"This is just one big performance"** (no timer) -- Lean into the meta: "The more you perform, the more you start to believe it" [authentic -- speaking the theme] / let Sam explain it [deflect] / "Can we just do the gay shit already?" [authentic -- impatient, funny, script faithful]
35. **Sam: "Can we please do the gay shit?"** (no timer) -- "I think--" [hesitant, script faithful] / "Yes" [authentic -- eager] / "I'm scared" [authentic -- vulnerable]

### Gay Shit Act One -- The Cliff (5 choices)
36. **"Living on the edge is scary"** (no timer) -- Full philosophical riff: "you don't know what's on the other side" [authentic, script faithful] / "Be careful" [deflect] / "And you do? [live on the edge]" [authentic -- challenging Sam]
37. **Sam: "I have a question" then "Nevermind"** (no timer) -- "What?" [press him] / let it go [deflect] / "You can ask me anything" [authentic -- open]
38. **Sam: "I like talking to you"** (no timer) -- "I like talking to you too" [authentic, script faithful] / "Yeah" [deflect] / "You're the only one who actually understands me" [authentic -- deeper than script]
39. **Sam kisses Simon on the cheek** (no timer, the moment holds) -- "Was that a joke? I think I have to go now" [script faithful] / stay, don't move, feel it [authentic -0.03, new] / "Why did you do that?" [deflect] / kiss him back on the cheek [authentic -0.04, new, boldest option]
40. **If Simon stays or kisses back** (no timer, new dialogue) -- Sam: "Was that okay?" Simon can: "Yeah" [simple] / "More than okay" [bold] / just nod [tender]

### Gay Shit Act Two -- The Meadow (5 choices)
41. **"What's the gayest thing you've ever done?"** (no timer) -- "Probably you kissing me" [script faithful] / "Everything about me" [authentic -- self-aware humor] / "I don't know" [deflect]
42. **Sam explains it was "just a joke"** (no timer) -- "Right. Just a joke. Yup." [script faithful -- loaded] / "Was it though?" [authentic -- push back earlier than script] / "Yeah obviously" [perform]
43. **Sam: "Why did you run away?"** (no timer) -- "I'm sorry" [script faithful] / "Because I felt something and it scared me" [authentic -- new, more vulnerable] / "I don't know" [deflect]
44. **"Can we kiss again... as a joke"** (no timer) -- Say it [script faithful, authentic] / wait for Sam to suggest it [deflect] / "I don't think I want it to be a joke" [authentic -- cutting to the chase, new]
45. **The kiss on the lips** (no timer) -- Full presence, eyes open [authentic -0.03] / eyes closed, lose yourself [authentic -0.03] / pull away after [deflect +0.01]

### Gay Shit Act Three -- The Lake (6 choices)
46. **I Spy: "Something blue" -- Sam means Simon's eyes** (no timer) -- Guess wrong on purpose, enjoy the game [deflect -- but sweet] / "Is it my eyes?" [authentic -- you know] / "The sky?" [innocent]
47. **Simon's turn: "Something pink"** (no timer) -- "Your lips" [script faithful, authentic] / "That flower" [deflect] / "Your cheeks right now" [authentic -- new, teasing]
48. **"Do you wanna kiss as a joke again?"** (no timer) -- Ask it [script faithful] / just lean in without asking [authentic -- bold, new] / "It was never a joke" [authentic, direct]
49. **Sam: "You're like the girl in the relationship"** (no timer, complex) -- Multiple internal reactions: "Relationship?" [script faithful -- surprised] / feel a wave of something (good? bad? both?) [authentic -- conflicted] / "Don't call me that" [deflect -- not ready]
50. **Sam: "But you're my girl"** (no timer, the biggest moment) -- Let Simon's full monologue unfold (player guides each section):
    - "Do you ever feel like you don't know who you are?" [continue]
    - "I feel like I'm constantly performing" [continue]
    - "Part of me feels like I'm not a boy" [continue or stop]
    - "Why would I want to be a boy?" [continue]
    - "I wish I could be a girl" [continue or stop]
    - "Maybe I think I'm a girl" [continue or stop]
    - "Can I please be your girl?" [the bravest choice -- or pull back at any point]
51. **After the monologue, Sam: "I like you too, Simon"** (no timer) -- "I like you, Sam" [script faithful] / kiss him [authentic] / cry [authentic -- release]

### Sam's Monologue -- Different 7 (1 choice, internal)
52. **After hearing Sam's pillow confession** (no timer, Simon isn't present but the player is) -- React internally: "He likes me back" [joy] / "He's in so much pain" [empathy] / "God hates us both, I guess" [bitter]

### The Ceremony (6 choices)
53. **Brent: "CAN YOU GUYS STOP BEING FAGGOTS?"** (8s) -- "How many fucking times are you going to say that?" [authentic, script faithful] / flinch [deflect] / "Yes sir" [perform]
54. **Simon's second pickup line turn** (10s) -- "Hey how are you? I'd like to squeeze your tits and squeeze your ass, I like to squeeze things" [script faithful -- Simon's learned to play the game] / something worse than before [perform -- the fracture talking] / refuse entirely [authentic -- bold]
55. **Alpha chant: forced participation** (rapid presses) -- Each line requires a button press, +0.01 per line. The chants accelerate. Player can: press on beat [perform] / press late/reluctantly [deflect, slightly more fracture] / stop pressing (Brent screams at you, forces you) [authentic, highest fracture from punishment]
56. **"One thing you can change about yourself"** (no timer) -- "I won't ever feel anything ever again" [script faithful, perform +0.08] / "I'll try to be braver" [authentic +0.03] / "Nothing. I don't want to change." [authentic -- defiant +0.05, Brent punishes]
57. **Alpha poem chant: "I WILL BE AN ALPHA MALE TILL THE DAY I DIE"** (rapid, rhythmic) -- Same forced participation as oath, but faster. Each line: +0.01. The speed makes it feel like losing control.
58. **Howl to the moon** (3s) -- Howl [perform -- join the pack] / stay silent [deflect] / howl but make it silly/mocking [authentic -- undermining from within]

### The Fight (5 choices)
59. **Other boys slap Brent one by one** (no timer, watching) -- Internal reaction as each boy goes: feel sick [authentic] / feel the pull to join [honest] / zone out [deflect]
60. **Sam whispers "I guess this is what we're doing now"** (5s) -- "Don't" [authentic -- try to stop him] / say nothing [deflect] / "Be careful" [authentic -- protective]
61. **"SIMON YOU'RE UP"** (5s) -- "I don't want to slap you" [script faithful, authentic] / slap him [perform +0.05] / "Why?" [deflect]
62. **Brent slaps Simon** (3s, after refusing) -- Take it [deflect] / slap him back [perform] / "Is that all you've got?" [authentic -- defiant]
63. **"PUSSY PUSSY PUSSY" chant from all boys** (3s, the breaking point) -- "YOU KNOW WHAT I AM A PUSSY, BRENT!" [script faithful] then beat him to a pulp (mashing sequence, +0.03 per press) / freeze, let someone else snap [deflect, timer expires] / "STOP. ALL OF YOU STOP." [authentic -- new ending path where Simon breaks the cycle instead of perpetuating it]
64. **After Brent is down** (no timer) -- "What now?" [script faithful] / look at your hands [authentic] / look at Sam [authentic] / run [deflect]

### Brent's Final Monologue -- Different 8 (1 choice)
65. **After "Do I have to be a man?"** (no timer, the last line) -- The player gets one final internal thought as the screen goes black: "No." [authentic -- forgiveness] / "I don't know." [honest] / nothing, just silence [let it sit]

---

**Total: 65 player choices**
- 22 in main scenes with timers (pressure)
- 16 in Gay Shit scenes without timers (safety/exploration)  
- 14 during monologues/internal moments
- 7 forced participation moments (oath, chants, fight)
- 6 reaction/body language moments

Each choice is AUTHENTIC, PERFORMED, or DEFLECT. The fracture system ensures that repeated PERFORMED choices literally remove AUTHENTIC options later -- the crushing is mechanical, not just narrative.

## 9. New Dialogue (Decision Tree Branches)

Where the script has Simon responding one way, the game offers 2-3 paths. New dialogue is written in Ryann's voice -- same cadence, same humor, same brutality. The script-faithful option is ALWAYS available and subtly marked so the player knows it's "canon."

**Categories of new dialogue:**

### Internal reactions (Simon thinking)
Moments where the script has stage directions ("Simon steps back") become internal monologue choices. The player sees Simon's thoughts and chooses which thread to follow. These don't change the external story but deeply affect fracture and how the player experiences Simon's interiority.

### Whispered exchanges with Sam
The script has several hushed Sam-Simon moments. The game expands these -- every time there's a lull in Brent's attention, Simon can whisper to Sam. These micro-moments build the relationship incrementally.

### Bold alternatives
At key moments, the game offers options that are MORE authentic than the script -- things Simon might say if he were braver or more broken. "I don't think I want it to be a joke" instead of the slow dance to the kiss. "STOP. ALL OF YOU STOP." instead of becoming the violence. These aren't better than the script -- they're what-ifs that make the player feel the weight of what Simon actually chose.

### The Gay Shit expansions
These scenes get the most new dialogue because they're the safe spaces. The player can linger, explore, say things Simon wouldn't dare say in the main scenes. Extra I Spy rounds. Longer star-gazing. More flowers. The game rewards the player for spending time here -- fracture drops, color returns, the world breathes.

## 10. Success Criteria

- Full playthrough: 45-60 minutes
- All 20 choice points functional with branching
- Fracture system visibly affects the world
- 5 animated pixel art locations
- 6 characters with expression changes
- Inventory with 6 items that respond to fracture
- Audio: ambient per location + tinnitus layer
- Gay Shit scenes feel radically different from Brent scenes
- The flower never loses its color
- Builds and deploys to itch.io
- Someone who has never read the play can feel what it's about
- Someone who HAS read the play recognizes it and is surprised by the new possibilities

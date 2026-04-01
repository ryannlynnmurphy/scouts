# SCOUTS Architecture

## Overview

SCOUTS is an interactive narrative game built on three core systems:

1. **Narrative Engine** (Ink.js) -- Handles branching story logic, variable tracking, and choice management
2. **Rendering Layer** (PixiJS) -- Renders character sprites, backgrounds, and visual effects
3. **Audio System** (Howler.js) -- Manages ambient sounds, music, and sound effects

## Story Flow

```
Player Input -> Ink.js Story Engine -> Parse Tags/Text -> Render UI
                                    -> Trigger Audio Cues
                                    -> Update PixiJS Scene
```

## File Structure

```
app/
  page.tsx              -- Landing page
  play/
    page.tsx            -- Game interface
public/
  assets/
    audio/              -- Music, ambience, SFX, voice
    sprites/            -- Character art, backgrounds
    ui/                 -- Interface elements
  dialogue/             -- Compiled Ink.js story files
src/
  dialogue/             -- Ink source files
  managers/             -- Game state, save/load
  scenes/               -- Scene definitions
  systems/              -- Core game systems
```

## Roadmap

- v0.1.0: Static narrative prototype with choices
- v0.2.0: Full Ink.js integration with compiled story
- v0.3.0: PixiJS rendering for characters and environments
- v0.4.0: Audio integration (ambient + SFX)
- v1.0.0: Complete playable experience

import { Howl, Howler } from "howler";

export type AmbientKey = "forest" | "cliff" | "meadow" | "lake" | "silence";
export type TransitionType = "campfire" | "safe" | "void";
export type CharacterKey = "simon" | "sam" | "brent" | "josh" | "noah" | "lucas";

export class AudioManager {
  private ambientLoops: Map<string, Howl> = new Map();
  private tinnitus: Howl | null = null;
  private heartbeat: Howl | null = null;

  // Named transition sounds
  private transitionCampfire: Howl | null = null;
  private transitionSafe: Howl | null = null;
  private transitionVoid: Howl | null = null;

  // Character voice grunts
  private grunts: Map<CharacterKey, Howl> = new Map();

  private currentAmbient: string | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Ambient loops -- load from subdirectory (v2 layout)
    const ambients: Record<string, string> = {
      forest: "assets/audio/ambience/forest-ambient.wav",
      cliff:  "assets/audio/ambience/cliff-wind.wav",
      meadow: "assets/audio/ambience/meadow-birds.wav",
      lake:   "assets/audio/ambience/lake-water.wav",
    };

    for (const [key, src] of Object.entries(ambients)) {
      this.ambientLoops.set(
        key,
        new Howl({ src: [src], loop: true, volume: 0, preload: true }),
      );
    }

    // Fracture effects
    this.tinnitus = new Howl({
      src: ["assets/audio/sfx/tinnitus.wav"],
      loop: true,
      volume: 0,
      preload: true,
    });

    this.heartbeat = new Howl({
      src: ["assets/audio/sfx/heartbeat.wav"],
      loop: true,
      volume: 0,
      preload: true,
    });

    // Transition sounds
    this.transitionCampfire = new Howl({
      src: ["assets/audio/sfx/transition-to-campfire.wav"],
      volume: 0.7,
      preload: true,
    });

    this.transitionSafe = new Howl({
      src: ["assets/audio/sfx/transition-to-safe.wav"],
      volume: 0.6,
      preload: true,
    });

    this.transitionVoid = new Howl({
      src: ["assets/audio/sfx/transition-to-void.wav"],
      volume: 0.8,
      preload: true,
    });

    // Character voice grunts
    const gruntKeys: CharacterKey[] = ["simon", "sam", "brent", "josh", "noah", "lucas"];
    for (const key of gruntKeys) {
      this.grunts.set(
        key,
        new Howl({
          src: [`assets/audio/voice/grunt-${key}.wav`],
          volume: 0.5,
          preload: true,
        }),
      );
    }
  }

  // Switch ambient based on scene, with 1-second crossfade
  setAmbient(key: AmbientKey): void {
    if (!this.initialized) this.init();

    if (this.currentAmbient && this.ambientLoops.has(this.currentAmbient)) {
      const current = this.ambientLoops.get(this.currentAmbient)!;
      current.fade(current.volume(), 0, 1000);
      setTimeout(() => current.stop(), 1000);
    }

    if (key === "silence") {
      this.currentAmbient = null;
      return;
    }

    const next = this.ambientLoops.get(key);
    if (next) {
      next.play();
      next.fade(0, 0.3, 1500);
      this.currentAmbient = key;
    }
  }

  // Update fracture-reactive audio (call after every choice)
  updateFracture(fracture: number): void {
    if (!this.initialized) return;

    // Ambient volume drops as fracture rises
    if (this.currentAmbient) {
      const ambient = this.ambientLoops.get(this.currentAmbient);
      if (ambient) {
        const vol = 0.3 * (1 - fracture * 0.8);
        ambient.volume(vol);
      }
    }

    // Tinnitus rises into consciousness above 50% fracture
    if (this.tinnitus) {
      if (fracture > 0.5) {
        if (!this.tinnitus.playing()) this.tinnitus.play();
        const tVol = (fracture - 0.5) * 0.4;
        this.tinnitus.volume(tVol);
      } else {
        this.tinnitus.volume(0);
        if (this.tinnitus.playing()) this.tinnitus.stop();
      }
    }
  }

  // Play a scene transition sound by type
  playTransition(type: TransitionType = "campfire"): void {
    if (!this.initialized) this.init();
    switch (type) {
      case "campfire": this.transitionCampfire?.play(); break;
      case "safe":     this.transitionSafe?.play();     break;
      case "void":     this.transitionVoid?.play();     break;
    }
  }

  // Legacy single-transition entry point (maps to campfire)
  playTransitionLegacy(): void {
    this.playTransition("campfire");
  }

  // Play a character's voice grunt (call at start of each dialogue line)
  playGrunt(characterKey: CharacterKey): void {
    if (!this.initialized) this.init();
    const grunt = this.grunts.get(characterKey);
    if (grunt) {
      // Stop any currently playing grunt from this character, then play fresh
      grunt.stop();
      grunt.play();
    }
  }

  playHeartbeat(): void {
    if (!this.initialized) this.init();
    if (this.heartbeat && !this.heartbeat.playing()) {
      this.heartbeat.play();
      this.heartbeat.fade(0, 0.22, 500);
    }
  }

  stopHeartbeat(): void {
    if (this.heartbeat && this.heartbeat.playing()) {
      this.heartbeat.fade(this.heartbeat.volume(), 0, 500);
      setTimeout(() => this.heartbeat?.stop(), 500);
    }
  }

  stopAll(): void {
    this.ambientLoops.forEach((h) => { h.stop(); });
    this.tinnitus?.stop();
    this.heartbeat?.stop();
    this.currentAmbient = null;
  }
}

export const audioManager = new AudioManager();

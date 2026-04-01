import { Howl, Howler } from "howler";

export type AmbientKey = "forest" | "cliff" | "meadow" | "lake" | "silence";

export class AudioManager {
  private ambientLoops: Map<string, Howl> = new Map();
  private tinnitus: Howl | null = null;
  private heartbeat: Howl | null = null;
  private transition: Howl | null = null;
  private currentAmbient: string | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Ambient loops
    const ambients: Record<string, string> = {
      forest: "assets/audio/forest-ambient.wav",
      cliff: "assets/audio/cliff-wind.wav",
      meadow: "assets/audio/meadow-birds.wav",
      lake: "assets/audio/lake-water.wav",
    };

    for (const [key, src] of Object.entries(ambients)) {
      this.ambientLoops.set(
        key,
        new Howl({
          src: [src],
          loop: true,
          volume: 0,
          preload: true,
        }),
      );
    }

    // Effects
    this.tinnitus = new Howl({
      src: ["assets/audio/tinnitus.wav"],
      loop: true,
      volume: 0,
      preload: true,
    });

    this.heartbeat = new Howl({
      src: ["assets/audio/heartbeat.wav"],
      loop: true,
      volume: 0,
      preload: true,
    });

    this.transition = new Howl({
      src: ["assets/audio/transition.wav"],
      volume: 0.3,
      preload: true,
    });
  }

  // Switch ambient based on scene
  setAmbient(key: AmbientKey): void {
    if (!this.initialized) this.init();

    // Fade out current
    if (this.currentAmbient && this.ambientLoops.has(this.currentAmbient)) {
      const current = this.ambientLoops.get(this.currentAmbient)!;
      current.fade(current.volume(), 0, 1000);
      setTimeout(() => current.stop(), 1000);
    }

    if (key === "silence") {
      this.currentAmbient = null;
      return;
    }

    // Fade in new
    const next = this.ambientLoops.get(key);
    if (next) {
      next.play();
      next.fade(0, 0.3, 1500);
      this.currentAmbient = key;
    }
  }

  // Update based on fracture level (call every choice)
  updateFracture(fracture: number): void {
    if (!this.initialized) return;

    // Ambient volume decreases with fracture
    if (this.currentAmbient) {
      const ambient = this.ambientLoops.get(this.currentAmbient);
      if (ambient) {
        const vol = 0.3 * (1 - fracture * 0.8); // 0.3 -> 0.06
        ambient.volume(vol);
      }
    }

    // Tinnitus increases with fracture (starts at 0.5)
    if (this.tinnitus) {
      if (fracture > 0.5) {
        if (!this.tinnitus.playing()) this.tinnitus.play();
        const tVol = (fracture - 0.5) * 0.4; // 0 -> 0.2
        this.tinnitus.volume(tVol);
      } else {
        this.tinnitus.volume(0);
        if (this.tinnitus.playing()) this.tinnitus.stop();
      }
    }
  }

  playTransition(): void {
    if (this.transition) this.transition.play();
  }

  playHeartbeat(): void {
    if (this.heartbeat && !this.heartbeat.playing()) {
      this.heartbeat.play();
      this.heartbeat.fade(0, 0.2, 500);
    }
  }

  stopHeartbeat(): void {
    if (this.heartbeat && this.heartbeat.playing()) {
      this.heartbeat.fade(this.heartbeat.volume(), 0, 500);
      setTimeout(() => this.heartbeat?.stop(), 500);
    }
  }

  stopAll(): void {
    this.ambientLoops.forEach((h) => h.stop());
    this.tinnitus?.stop();
    this.heartbeat?.stop();
    this.currentAmbient = null;
  }
}

export const audioManager = new AudioManager();

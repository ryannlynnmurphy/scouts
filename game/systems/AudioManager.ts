import { Howl } from "howler";

export type AmbientKey = "forest" | "cliff" | "meadow" | "lake" | "silence";

export class AudioManager {
  private ambientLoops: Map<string, Howl> = new Map();
  private transition: Howl | null = null;
  private currentAmbient: string | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const ambients: Record<string, string> = {
      forest: "assets/audio/forest-ambient.wav",
      cliff: "assets/audio/cliff-wind.wav",
      meadow: "assets/audio/meadow-birds.wav",
      lake: "assets/audio/lake-water.wav",
    };

    for (const [key, src] of Object.entries(ambients)) {
      this.ambientLoops.set(
        key,
        new Howl({ src: [src], loop: true, volume: 0, preload: true })
      );
    }

    this.transition = new Howl({
      src: ["assets/audio/transition.wav"],
      volume: 0.3,
      preload: true,
    });
  }

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

  playTransition(): void {
    if (this.transition) this.transition.play();
  }

  stopAll(): void {
    this.ambientLoops.forEach((h) => h.stop());
    this.currentAmbient = null;
  }
}

export const audioManager = new AudioManager();

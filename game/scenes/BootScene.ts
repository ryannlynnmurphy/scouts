import Phaser from "phaser";
import { audioManager } from "../systems/AudioManager";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    const centerX = 480;
    const centerY = 270;
    this.add.text(centerX, centerY, "SCOUTS", {
      fontFamily: "Georgia, serif",
      fontSize: "32px",
      color: "#c9a96e",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(centerX, centerY + 40, "Loading...", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#f8f0e3",
    }).setOrigin(0.5).setAlpha(0.5);

    // Character portraits
    const chars: Record<string, string[]> = {
      simon: ["neutral", "scared", "defiant", "hurt", "tender", "shattered"],
      sam: ["neutral", "shy", "warm", "conflicted", "brave"],
      brent: ["neutral", "angry", "mocking", "unhinged", "broken"],
      josh: ["neutral", "eager", "angry", "scared"],
      noah: ["neutral", "smug", "nervous", "defiant"],
      lucas: ["neutral", "earnest", "uncomfortable", "brave"],
    };
    for (const [name, expressions] of Object.entries(chars)) {
      for (const expr of expressions) {
        this.load.image(`${name}-${expr}`, `assets/sprites/characters/${name}-${expr}.png`);
      }
    }

    // Character world sprites (48x64 RPG standing sprites)
    const charNames = ["simon", "sam", "brent", "josh", "noah", "lucas"];
    for (const name of charNames) {
      this.load.image(`${name}-sprite`, `assets/sprites/characters/${name}-sprite.png`);
    }

    // Inventory icons
    const items = ["neckerchief", "marshmallow", "squirrelBlood", "flower", "samsKiss", "brentsBlood"];
    for (const item of items) {
      this.load.image(`item-${item}`, `assets/sprites/items/${item}.png`);
    }

    // Backgrounds
    const bgs = ["campfire", "cliff", "meadow", "lake", "void"];
    for (const bg of bgs) {
      this.load.image(`bg-${bg}`, `assets/sprites/backgrounds/${bg}.png`);
    }
  }

  create() {
    // Initialize audio on first user interaction (browser autoplay policy).
    // Howler.js will handle subsequent playback automatically once unlocked.
    this.input.once("pointerdown", () => {
      audioManager.init();
    });
    this.scene.start("CampfireScene");
  }
}

import Phaser from "phaser";

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
    this.scene.start("CampfireScene");
  }
}

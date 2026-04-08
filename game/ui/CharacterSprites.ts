import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

const GROUP_POSITIONS: { x: number; y: number }[] = [
  { x: 120, y: 280 },
  { x: 280, y: 290 },
  { x: 440, y: 280 },
  { x: 600, y: 290 },
  { x: 720, y: 280 },
  { x: 840, y: 290 },
];

const DUO_POSITIONS: { x: number; y: number }[] = [
  { x: 360, y: 280 },
  { x: 600, y: 280 },
];

const SOLO_POSITION = { x: GAME_WIDTH / 2, y: 280 };

export class CharacterSprites {
  private scene: Phaser.Scene;
  private sprites: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private labels: Map<string, Phaser.GameObjects.Text> = new Map();
  private breathingTweens: Phaser.Tweens.Tween[] = [];
  private currentSpeaker: string | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupForScene(characterKeys: string[]): void {
    this.clearAll();

    const positions =
      characterKeys.length === 1
        ? [SOLO_POSITION]
        : characterKeys.length === 2
        ? DUO_POSITIONS
        : GROUP_POSITIONS;

    characterKeys.forEach((key, i) => {
      const pos = positions[i % positions.length];
      const char = CHARACTERS[key];
      if (!char) return;

      const color = Phaser.Display.Color.HexStringToColor(char.color).color;
      const sprite = this.scene.add.rectangle(pos.x, pos.y, 48, 80, color, 0.9);
      sprite.setDepth(10);

      const label = this.scene.add.text(pos.x, pos.y - 52, char.name, {
        fontFamily: "Lora, serif",
        fontSize: "12px",
        color: char.color,
        align: "center",
      });
      label.setOrigin(0.5);
      label.setDepth(11);

      this.sprites.set(key, sprite);
      this.labels.set(key, label);

      const tween = this.scene.tweens.add({
        targets: [sprite, label],
        y: "-=3",
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Math.random() * 1000,
      });
      this.breathingTweens.push(tween);
    });
  }

  setSpeaker(charKey: string | null): void {
    this.currentSpeaker = charKey;
    this.sprites.forEach((sprite, key) => {
      const label = this.labels.get(key);
      if (key === charKey) {
        sprite.setAlpha(1);
        if (label) label.setAlpha(1);
        this.scene.tweens.add({
          targets: [sprite, label].filter(Boolean),
          y: "-=6",
          duration: 150,
          yoyo: true,
          ease: "Quad.easeOut",
        });
      } else {
        sprite.setAlpha(charKey ? 0.4 : 0.9);
        if (label) label.setAlpha(charKey ? 0.4 : 0.9);
      }
    });
  }

  private clearAll(): void {
    this.breathingTweens.forEach((t) => t.destroy());
    this.breathingTweens = [];
    this.sprites.forEach((s) => s.destroy());
    this.sprites.clear();
    this.labels.forEach((l) => l.destroy());
    this.labels.clear();
  }

  destroy(): void {
    this.clearAll();
  }
}

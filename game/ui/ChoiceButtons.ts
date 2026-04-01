import Phaser from "phaser";
import { Choice } from "../data/types";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

const BUTTON_WIDTH = GAME_WIDTH - 40;
const BUTTON_HEIGHT = 40;
const BUTTON_GAP = 8;
const BUTTON_X = 20;
const TIMER_BAR_HEIGHT = 4;

export class ChoiceButtons {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private timerBar: Phaser.GameObjects.Graphics | null = null;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private buttons: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(110);
    this.container.setVisible(false);
  }

  showChoices(
    choices: Choice[],
    timerSeconds: number | undefined,
    fractureLevel: number,
    onSelect: (choice: Choice) => void
  ): void {
    this.clear();
    this.container.setVisible(true);

    const startY = GAME_HEIGHT - 180 - choices.length * (BUTTON_HEIGHT + BUTTON_GAP);

    choices.forEach((choice, i) => {
      const y = startY + i * (BUTTON_HEIGHT + BUTTON_GAP);
      const isLocked = choice.locked && fractureLevel >= choice.locked.minFracture;

      const btn = this.scene.add.container(BUTTON_X, y);

      // Button background
      const bg = this.scene.add.graphics();
      bg.lineStyle(1, isLocked ? 0x333333 : 0x555555);
      bg.fillStyle(isLocked ? 0x111111 : 0x1a1a1a, 0.9);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
      bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
      btn.add(bg);

      // Button text
      const displayText = isLocked
        ? choice.locked?.lockedText || choice.text
        : choice.text;
      const textObj = this.scene.add.text(16, BUTTON_HEIGHT / 2, displayText, {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: isLocked ? "#444444" : "#f8f0e3",
        fontStyle: isLocked ? "italic" : "normal",
      }).setOrigin(0, 0.5);

      if (isLocked) {
        // Strikethrough line
        const lineY = BUTTON_HEIGHT / 2;
        const line = this.scene.add.graphics();
        line.lineStyle(1, 0x444444);
        line.lineBetween(16, lineY, 16 + textObj.width, lineY);
        btn.add(line);
      }

      btn.add(textObj);

      if (!isLocked) {
        // Hover effect
        const hitArea = new Phaser.Geom.Rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT);
        bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        bg.on("pointerover", () => {
          bg.clear();
          bg.lineStyle(2, 0xc9a96e);
          bg.fillStyle(0x2a2a2a, 0.9);
          bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
          bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
        });

        bg.on("pointerout", () => {
          bg.clear();
          bg.lineStyle(1, 0x555555);
          bg.fillStyle(0x1a1a1a, 0.9);
          bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
          bg.strokeRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 6);
        });

        bg.on("pointerdown", () => {
          this.clear();
          onSelect(choice);
        });
      }

      this.container.add(btn);
      this.buttons.push(btn);
    });

    // Timer bar
    if (timerSeconds) {
      this.showTimer(timerSeconds, choices, onSelect);
    }
  }

  private showTimer(
    seconds: number,
    choices: Choice[],
    onSelect: (choice: Choice) => void
  ): void {
    const barY = GAME_HEIGHT - 185 - choices.length * (BUTTON_HEIGHT + BUTTON_GAP);
    this.timerBar = this.scene.add.graphics().setDepth(111);
    const totalWidth = BUTTON_WIDTH;
    const duration = seconds * 1000;
    const startTime = this.scene.time.now;

    this.timerEvent = this.scene.time.addEvent({
      delay: 16, // ~60fps
      loop: true,
      callback: () => {
        if (!this.timerBar) return;
        const elapsed = this.scene.time.now - startTime;
        const progress = 1 - elapsed / duration;

        if (progress <= 0) {
          // Time's up -- find deflect/timeout option or last option
          const timeoutChoice =
            choices.find((c) => c.type === "timeout") ||
            choices.find((c) => c.type === "deflect") ||
            choices[choices.length - 1];
          this.clear();
          onSelect(timeoutChoice);
          return;
        }

        this.timerBar.clear();
        // Gold to red gradient based on progress
        const r = Math.floor(Phaser.Math.Linear(0xff, 0xc9, progress));
        const g = Math.floor(Phaser.Math.Linear(0x22, 0xa9, progress));
        const b = Math.floor(Phaser.Math.Linear(0x22, 0x6e, progress));
        const color = (r << 16) | (g << 8) | b;

        this.timerBar.fillStyle(color);
        this.timerBar.fillRect(
          BUTTON_X,
          barY,
          totalWidth * progress,
          TIMER_BAR_HEIGHT
        );
      },
    });
  }

  clear(): void {
    this.buttons.forEach((b) => b.destroy());
    this.buttons = [];
    if (this.timerBar) {
      this.timerBar.destroy();
      this.timerBar = null;
    }
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }
    this.container.setVisible(false);
  }

  destroy(): void {
    this.clear();
    this.container.destroy();
  }
}

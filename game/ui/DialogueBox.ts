import Phaser from "phaser";
import { CHARACTERS, STAGE_DIRECTION_COLOR, STAGE_DIRECTION_ALPHA } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

const BOX_HEIGHT = 160;
const PADDING = 20;
const TYPEWRITER_SPEED = 30;

export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private typing: boolean = false;
  private typewriterTimer: Phaser.Time.TimerEvent | null = null;
  private fullText: string = "";
  private displayedChars: number = 0;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const y = GAME_HEIGHT - BOX_HEIGHT;

    this.background = scene.add.rectangle(
      GAME_WIDTH / 2, y + BOX_HEIGHT / 2,
      GAME_WIDTH, BOX_HEIGHT,
      0x000000, 0.75
    );

    this.nameText = scene.add.text(PADDING, y + 12, "", {
      fontFamily: "Playfair Display, serif",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold",
    });

    this.bodyText = scene.add.text(PADDING, y + 42, "", {
      fontFamily: "Lora, serif",
      fontSize: "16px",
      color: "#f8f0e3",
      wordWrap: { width: GAME_WIDTH - PADDING * 2, useAdvancedWrap: true },
      lineSpacing: 6,
    });

    this.container = scene.add.container(0, 0, [
      this.background,
      this.nameText,
      this.bodyText,
    ]);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);
  }

  showLine(speaker: string | null, text: string, onComplete: () => void): void {
    this.container.setVisible(true);
    this.onComplete = onComplete;
    this.fullText = text;
    this.displayedChars = 0;
    this.typing = true;

    if (speaker) {
      const char = CHARACTERS[speaker.toLowerCase()];
      this.nameText.setText(char?.name || speaker.toUpperCase());
      this.nameText.setColor(char?.color || "#ffffff");
      this.nameText.setAlpha(1);
      this.bodyText.setColor("#f8f0e3");
      this.bodyText.setAlpha(1);
      this.bodyText.setFontStyle("normal");
    } else {
      this.nameText.setText("");
      this.bodyText.setColor(STAGE_DIRECTION_COLOR);
      this.bodyText.setAlpha(STAGE_DIRECTION_ALPHA);
      this.bodyText.setFontStyle("italic");
    }

    this.bodyText.setText("");
    if (this.typewriterTimer) this.typewriterTimer.destroy();

    this.typewriterTimer = this.scene.time.addEvent({
      delay: TYPEWRITER_SPEED,
      repeat: text.length - 1,
      callback: () => {
        this.displayedChars++;
        this.bodyText.setText(this.fullText.substring(0, this.displayedChars));
        if (this.displayedChars >= this.fullText.length) {
          this.typing = false;
          if (this.onComplete) this.onComplete();
        }
      },
    });
  }

  skipTypewriter(): void {
    if (!this.typing) return;
    if (this.typewriterTimer) this.typewriterTimer.destroy();
    this.bodyText.setText(this.fullText);
    this.displayedChars = this.fullText.length;
    this.typing = false;
    if (this.onComplete) this.onComplete();
  }

  isTyping(): boolean {
    return this.typing;
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    if (this.typewriterTimer) this.typewriterTimer.destroy();
    this.container.destroy();
  }
}

import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

const BOX_HEIGHT = 130;
const BOX_PADDING = 12;
const BOX_Y = GAME_HEIGHT - BOX_HEIGHT;
const PORTRAIT_SIZE = 64;
const TEXT_SPEED = 30; // ms per character

export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private speakerText: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private portraitRect: Phaser.GameObjects.Graphics;
  private portraitSprite: Phaser.GameObjects.Image | null = null;
  private isTyping: boolean = false;
  private fullText: string = "";
  private currentCharIndex: number = 0;
  private typeTimer: Phaser.Time.TimerEvent | null = null;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, BOX_Y).setDepth(100);

    // Semi-transparent black box
    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.85);
    this.background.fillRoundedRect(0, 0, GAME_WIDTH, BOX_HEIGHT, 8);
    this.container.add(this.background);

    // Portrait placeholder (colored rectangle)
    this.portraitRect = scene.add.graphics();
    this.portraitRect.setPosition(BOX_PADDING, BOX_PADDING);
    this.container.add(this.portraitRect);

    // Speaker name
    this.speakerText = scene.add.text(
      BOX_PADDING + PORTRAIT_SIZE + BOX_PADDING,
      BOX_PADDING,
      "",
      {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    );
    this.container.add(this.speakerText);

    // Dialogue text
    this.dialogueText = scene.add.text(
      BOX_PADDING + PORTRAIT_SIZE + BOX_PADDING,
      BOX_PADDING + 24,
      "",
      {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: "#f8f0e3",
        wordWrap: { width: GAME_WIDTH - PORTRAIT_SIZE - BOX_PADDING * 4 },
        lineSpacing: 4,
      }
    );
    this.container.add(this.dialogueText);

    // Click to skip typewriter
    scene.input.on("pointerdown", () => {
      if (this.isTyping) {
        this.skipTypewriter();
      }
    });

    this.hide();
  }

  show(): void {
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }

  showLine(
    speaker: string | null,
    text: string,
    onComplete: () => void
  ): void {
    this.show();
    this.onComplete = onComplete;

    if (speaker) {
      const char = CHARACTERS[speaker.toLowerCase()];
      const color = char ? char.color : "#f8f0e3";
      const name = char ? char.name : speaker;

      this.speakerText.setText(name);
      this.speakerText.setColor(color);

      // Show portrait sprite or fallback to colored rectangle
      this.portraitRect.clear();
      if (this.portraitSprite) {
        this.portraitSprite.destroy();
        this.portraitSprite = null;
      }
      const portraitKey = `${speaker.toLowerCase()}-neutral`;
      if (this.scene.textures.exists(portraitKey)) {
        this.portraitSprite = this.scene.add.image(
          BOX_PADDING + PORTRAIT_SIZE / 2,
          BOX_PADDING + PORTRAIT_SIZE / 2,
          portraitKey
        ).setDisplaySize(PORTRAIT_SIZE, PORTRAIT_SIZE);
        this.container.add(this.portraitSprite);
      } else {
        this.portraitRect.fillStyle(
          Phaser.Display.Color.HexStringToColor(color).color,
          0.8
        );
        this.portraitRect.fillRoundedRect(0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE, 6);
      }
    } else {
      // Stage direction
      this.speakerText.setText("");
      this.portraitRect.clear();
      this.dialogueText.setColor("#f8f0e3");
      this.dialogueText.setAlpha(0.5);
      this.dialogueText.setFontStyle("italic");
    }

    this.startTypewriter(text);
  }

  private startTypewriter(text: string): void {
    this.fullText = text;
    this.currentCharIndex = 0;
    this.dialogueText.setText("");
    this.dialogueText.setAlpha(1);
    this.dialogueText.setFontStyle("normal");
    this.isTyping = true;

    this.typeTimer = this.scene.time.addEvent({
      delay: TEXT_SPEED,
      callback: () => {
        this.currentCharIndex++;
        this.dialogueText.setText(this.fullText.substring(0, this.currentCharIndex));
        if (this.currentCharIndex >= this.fullText.length) {
          this.finishTypewriter();
        }
      },
      repeat: this.fullText.length - 1,
    });
  }

  private skipTypewriter(): void {
    if (this.typeTimer) {
      this.typeTimer.destroy();
      this.typeTimer = null;
    }
    this.dialogueText.setText(this.fullText);
    this.finishTypewriter();
  }

  private finishTypewriter(): void {
    this.isTyping = false;
    // Wait for next click to advance
    this.scene.input.once("pointerdown", () => {
      if (this.onComplete) this.onComplete();
    });
  }

  destroy(): void {
    this.container.destroy();
  }
}

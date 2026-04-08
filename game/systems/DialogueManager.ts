import Phaser from "phaser";
import { CinematicLine, CinematicScene } from "../data/types";
import { DialogueBox } from "../ui/DialogueBox";
import { LightingDirector } from "./LightingDirector";

export class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox: DialogueBox;
  private lighting: LightingDirector;
  private lines: CinematicLine[] = [];
  private currentIndex: number = 0;
  private onSceneComplete: (() => void) | null = null;
  private waitingForClick: boolean = false;
  private autoAdvanceTimer: Phaser.Time.TimerEvent | null = null;

  public onSpeakerChange: ((charKey: string | null) => void) | null = null;
  public onStageDirection: ((dir: CinematicLine["direction"]) => void) | null = null;

  constructor(scene: Phaser.Scene, lighting: LightingDirector) {
    this.scene = scene;
    this.dialogueBox = new DialogueBox(scene);
    this.lighting = lighting;
  }

  loadScene(script: CinematicScene): void {
    this.lines = script.lines;
    this.currentIndex = 0;

    if (script.initialLighting) {
      this.lighting.applyCue(script.initialLighting);
    }
  }

  start(onComplete: () => void): void {
    this.onSceneComplete = onComplete;
    this.showLine();
  }

  advance(): void {
    if (!this.waitingForClick) {
      if (this.dialogueBox.isTyping()) {
        this.dialogueBox.skipTypewriter();
        return;
      }
      return;
    }

    this.waitingForClick = false;
    this.currentIndex++;
    this.showLine();
  }

  private showLine(): void {
    if (this.currentIndex >= this.lines.length) {
      this.dialogueBox.hide();
      if (this.onSceneComplete) this.onSceneComplete();
      return;
    }

    const line = this.lines[this.currentIndex];

    if (line.lighting) {
      this.lighting.applyCue(line.lighting);
    }

    if (line.direction && this.onStageDirection) {
      this.onStageDirection(line.direction);
    }

    if (this.onSpeakerChange) {
      this.onSpeakerChange(line.speaker ? line.speaker.toLowerCase() : null);
    }

    const showAfterPause = () => {
      this.dialogueBox.showLine(line.speaker, line.text, () => {
        if (line.autoAdvance !== undefined) {
          this.autoAdvanceTimer = this.scene.time.delayedCall(
            line.autoAdvance,
            () => {
              this.currentIndex++;
              this.showLine();
            }
          );
        } else {
          this.waitingForClick = true;
        }
      });
    };

    if (line.pause && line.pause > 0) {
      this.scene.time.delayedCall(line.pause, showAfterPause);
    } else {
      showAfterPause();
    }
  }

  isWaitingForClick(): boolean {
    return this.waitingForClick;
  }

  getDialogueBox(): DialogueBox {
    return this.dialogueBox;
  }

  destroy(): void {
    if (this.autoAdvanceTimer) this.autoAdvanceTimer.destroy();
    this.dialogueBox.destroy();
  }
}

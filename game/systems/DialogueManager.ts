import Phaser from "phaser";
import { Beat, Choice, SceneScript, SceneKey } from "../data/types";
import { DialogueBox } from "../ui/DialogueBox";
import { ChoiceButtons } from "../ui/ChoiceButtons";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";

export class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox: DialogueBox;
  private choiceButtons: ChoiceButtons;
  private fracture: FractureManager;
  private inventory: InventoryManager;
  private tracker: ChoiceTracker;
  private beats: Map<string, Beat> = new Map();
  private currentBeat: Beat | null = null;
  private currentLineIndex: number = 0;
  private onSceneChange: ((sceneKey: SceneKey) => void) | null = null;
  private onScriptComplete: (() => void) | null = null;

  constructor(
    scene: Phaser.Scene,
    fracture: FractureManager,
    inventory: InventoryManager,
    tracker: ChoiceTracker
  ) {
    this.scene = scene;
    this.fracture = fracture;
    this.inventory = inventory;
    this.tracker = tracker;
    this.dialogueBox = new DialogueBox(scene);
    this.choiceButtons = new ChoiceButtons(scene);
  }

  loadScript(script: SceneScript): void {
    this.beats.clear();
    for (const beat of script.beats) {
      this.beats.set(beat.id, beat);
    }
  }

  startBeat(
    beatId: string,
    onSceneChange: (sceneKey: SceneKey) => void,
    onScriptComplete: () => void
  ): void {
    this.onSceneChange = onSceneChange;
    this.onScriptComplete = onScriptComplete;

    const beat = this.beats.get(beatId);
    if (!beat) {
      console.error(`Beat not found: ${beatId}`);
      onScriptComplete();
      return;
    }

    this.currentBeat = beat;
    this.currentLineIndex = 0;

    // Handle onEnter effects
    if (beat.onEnter) {
      if (beat.onEnter.addItem) {
        this.inventory.addItem(beat.onEnter.addItem);
      }
      if (beat.onEnter.removeItem) {
        this.inventory.removeItem(beat.onEnter.removeItem);
      }
      if (beat.onEnter.fractureChange) {
        this.fracture.changeFracture(beat.onEnter.fractureChange);
      }
    }

    this.advanceLine();
  }

  private advanceLine(): void {
    if (!this.currentBeat) return;

    if (this.currentLineIndex >= this.currentBeat.lines.length) {
      // All lines shown -- show choices or auto-advance
      if (this.currentBeat.choices && this.currentBeat.choices.length > 0) {
        this.showChoices(this.currentBeat.choices, this.currentBeat.timer);
      } else if (this.currentBeat.nextBeat) {
        this.goToBeat(this.currentBeat.nextBeat);
      } else {
        // Script complete
        this.dialogueBox.hide();
        if (this.onScriptComplete) this.onScriptComplete();
      }
      return;
    }

    const line = this.currentBeat.lines[this.currentLineIndex];
    this.currentLineIndex++;

    const delay = line.delay || 0;

    if (delay > 0) {
      this.scene.time.delayedCall(delay, () => {
        this.dialogueBox.showLine(line.speaker, line.text, () => {
          this.advanceLine();
        });
      });
    } else {
      this.dialogueBox.showLine(line.speaker, line.text, () => {
        this.advanceLine();
      });
    }
  }

  private showChoices(choices: Choice[], timerSeconds?: number): void {
    this.choiceButtons.showChoices(
      choices,
      timerSeconds,
      this.fracture.fracture,
      (selected) => {
        // Record the choice
        this.tracker.record(
          selected.id,
          this.currentBeat?.id || "",
          selected.type,
          selected.text
        );

        // Apply fracture
        this.fracture.applyChoice(selected.type, selected.context);

        // Go to next beat
        this.goToBeat(selected.nextBeat);
      }
    );
  }

  private goToBeat(beatId: string): void {
    const beat = this.beats.get(beatId);
    if (!beat) {
      // Check if it's a scene change directive
      if (beatId.startsWith("scene:")) {
        const sceneKey = beatId.replace("scene:", "") as SceneKey;
        this.dialogueBox.hide();
        if (this.onSceneChange) this.onSceneChange(sceneKey);
        return;
      }
      if (beatId === "end") {
        this.dialogueBox.hide();
        if (this.onScriptComplete) this.onScriptComplete();
        return;
      }
      console.error(`Beat not found: ${beatId}`);
      return;
    }

    // Check if beat requires a different scene
    if (
      this.currentBeat &&
      beat.location !== this.currentBeat.location
    ) {
      this.dialogueBox.hide();
      if (this.onSceneChange) this.onSceneChange(beat.location);
      return;
    }

    this.currentBeat = beat;
    this.currentLineIndex = 0;

    if (beat.onEnter) {
      if (beat.onEnter.addItem) this.inventory.addItem(beat.onEnter.addItem);
      if (beat.onEnter.removeItem) this.inventory.removeItem(beat.onEnter.removeItem);
      if (beat.onEnter.fractureChange) this.fracture.changeFracture(beat.onEnter.fractureChange);
    }

    this.advanceLine();
  }

  getDialogueBox(): DialogueBox {
    return this.dialogueBox;
  }

  destroy(): void {
    this.dialogueBox.destroy();
    this.choiceButtons.destroy();
  }
}

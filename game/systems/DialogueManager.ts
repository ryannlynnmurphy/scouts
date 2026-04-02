import Phaser from "phaser";
import { Beat, Choice, SceneScript, SceneKey } from "../data/types";
import { DialogueBox } from "../ui/DialogueBox";
import { ChoiceButtons } from "../ui/ChoiceButtons";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";
import { SuspicionManager } from "./SuspicionManager";

export class DialogueManager {
  private scene: Phaser.Scene;
  private dialogueBox: DialogueBox;
  private choiceButtons: ChoiceButtons;
  private fracture: FractureManager;
  private inventory: InventoryManager;
  private tracker: ChoiceTracker;
  private suspicion: SuspicionManager;
  private beats: Map<string, Beat> = new Map();
  private currentBeat: Beat | null = null;
  private currentLineIndex: number = 0;
  private onSceneChange: ((sceneKey: SceneKey) => void) | null = null;
  private onScriptComplete: (() => void) | null = null;
  /** Optional callback to notify when the speaker changes (for sprite highlighting) */
  public onSpeakerChange: ((charKey: string | null) => void) | null = null;
  /** Tracks the current script id for ad-lib gating (set by loadScript) */
  private currentScriptId: string = "";

  constructor(
    scene: Phaser.Scene,
    fracture: FractureManager,
    inventory: InventoryManager,
    tracker: ChoiceTracker,
    suspicion: SuspicionManager
  ) {
    this.scene = scene;
    this.fracture = fracture;
    this.inventory = inventory;
    this.tracker = tracker;
    this.suspicion = suspicion;
    this.dialogueBox = new DialogueBox(scene);
    this.choiceButtons = new ChoiceButtons(scene);
  }

  loadScript(script: SceneScript): void {
    this.beats.clear();
    this.currentScriptId = script.id;
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
      if (beat.onEnter.suspicionChange) {
        this.suspicion.changeSuspicion(beat.onEnter.suspicionChange);
      }
    }

    // Inject a Brent ad-lib before lines, only in CampfireScene scripts
    // (not in Gay Shit acts or monologues)
    const adLibContext = beat.id;
    if (this.shouldInjectAdLib()) {
      const adLib = this.suspicion.getBrentAdLib(adLibContext);
      if (adLib) {
        this.dialogueBox.showLine("brent", adLib, () => {
          this.advanceLine();
        });
        return;
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

    // Notify speaker change for sprite highlighting
    if (this.onSpeakerChange) {
      this.onSpeakerChange(line.speaker ? line.speaker.toLowerCase() : null);
    }

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
    // Filter out choices that don't match current suspicion level
    const suspicionValue = this.suspicion.suspicion;
    const filtered = choices.filter((c) => {
      if (c.minSuspicion !== undefined && suspicionValue < c.minSuspicion) return false;
      if (c.maxSuspicion !== undefined && suspicionValue >= c.maxSuspicion) return false;
      return true;
    });

    // Fall back to all choices if filtering removed everything
    const visible = filtered.length > 0 ? filtered : choices;

    this.choiceButtons.showChoices(
      visible,
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

        // Apply suspicion delta if present
        if (selected.suspicionDelta !== undefined) {
          this.suspicion.changeSuspicion(selected.suspicionDelta);
        }

        // Go to next beat
        this.goToBeat(selected.nextBeat);
      }
    );
  }

  /**
   * Returns true if Brent ad-libs should be considered for injection.
   * Only fires during CampfireScene scripts -- not Gay Shit acts or monologues.
   */
  private shouldInjectAdLib(): boolean {
    const id = this.currentScriptId;
    if (!id) return false;
    // Gay Shit and monologue scripts are excluded
    if (id.startsWith("gay-shit")) return false;
    if (id.startsWith("monologue")) return false;
    if (id === "ending") return false;
    return true;
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
      if (beat.onEnter.suspicionChange) this.suspicion.changeSuspicion(beat.onEnter.suspicionChange);
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

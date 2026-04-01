import Phaser from "phaser";
import { SCENE_ORDER, SceneEntry } from "../data/scene-order";
import { DialogueManager } from "./DialogueManager";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";
import { InventoryBar } from "../ui/InventoryBar";
import { TransitionOverlay } from "../ui/TransitionOverlay";
import { CharacterSprites } from "../ui/CharacterSprites";
import { SceneKey } from "../data/types";

/**
 * SceneDirector lives on the active Phaser scene and drives the entire play.
 * It loads scene scripts, manages transitions, and moves through SCENE_ORDER.
 */
// Map scriptId -> characters present in that scene entry
const SCENE_CHARACTERS: Record<string, string[]> = {
  // Campfire scenes: full group
  "scene1-oath":        ["brent", "simon", "sam", "josh", "noah", "lucas"],
  "scene1-sacrifice":   ["brent", "simon", "sam", "josh", "noah", "lucas"],
  "scene1-kiss-test":   ["brent", "simon", "sam", "josh", "noah", "lucas"],
  "scene1-pickup-lines":["brent", "simon", "sam", "josh", "noah", "lucas"],
  "scene1-resistance":  ["brent", "simon", "sam", "josh", "noah", "lucas"],
  "gay-shit-anthem":    ["brent", "simon", "sam", "josh", "noah", "lucas"],
  "ceremony":           ["brent", "simon", "sam", "josh", "noah", "lucas"],
  // Gay-shit acts: two characters
  "gay-shit-act1":      ["simon", "sam"],
  "gay-shit-act2":      ["simon", "sam"],
  "gay-shit-act3":      ["simon", "sam"],
  // Monologues: single character
  "monologue-noah":     ["noah"],
  "monologue-simon":    ["simon"],
  "monologue-lucas":    ["lucas"],
  "monologue-josh":     ["josh"],
  "monologue-simon-sam":["simon", "sam"],
  "monologue-sam":      ["sam"],
  "monologue-brent":    ["brent"],
  // Ending — no character sprites (cinematic feel)
  "ending":             [],
};

export class SceneDirector {
  private currentIndex: number = 0;
  private dialogueManager: DialogueManager | null = null;
  private inventoryBar: InventoryBar | null = null;
  private transition: TransitionOverlay | null = null;
  private characterSprites: CharacterSprites | null = null;

  // Shared state across all scenes
  public fracture: FractureManager;
  public inventory: InventoryManager;
  public tracker: ChoiceTracker;

  constructor() {
    this.fracture = new FractureManager(null as unknown as Phaser.Scene);
    this.inventory = new InventoryManager();
    this.tracker = new ChoiceTracker();
  }

  /** Called when a Phaser scene's create() fires */
  attachToScene(scene: Phaser.Scene): void {
    // Update fracture's scene reference
    this.fracture = new FractureManager(scene);
    // Restore fracture level
    this.fracture.changeFracture(0); // triggers visual update

    this.dialogueManager = new DialogueManager(
      scene,
      this.fracture,
      this.inventory,
      this.tracker
    );
    // Wire speaker-change callback so sprites light up with each line
    this.dialogueManager.onSpeakerChange = (charKey) => {
      this.characterSprites?.setSpeaker(charKey);
    };
    this.inventoryBar = new InventoryBar(scene, this.inventory, this.fracture);
    this.transition = new TransitionOverlay(scene);

    // Set up character sprites for this scene
    this.characterSprites?.destroy();
    this.characterSprites = new CharacterSprites(scene);
    const entry = SCENE_ORDER[this.currentIndex];
    if (entry) {
      const chars = SCENE_CHARACTERS[entry.scriptId] ?? [];
      this.characterSprites.setupForScene(chars);
    }

    // Attach fracture effects to camera
    this.fracture.attachToCamera(scene.cameras.main);
  }

  /** Update the highlighted speaker sprite. Call null to reset all to full brightness. */
  setSpeaker(charKey: string | null): void {
    this.characterSprites?.setSpeaker(charKey);
  }

  /** Start the play from the beginning or continue from current index */
  async startCurrentScene(scene: Phaser.Scene): Promise<void> {
    if (!this.dialogueManager || !this.transition) return;

    const entry = SCENE_ORDER[this.currentIndex];
    if (!entry) {
      console.log("Play complete!");
      return;
    }

    // Apply Gay Shit healing
    if (entry.isGayShit && entry.gayShitAct) {
      this.fracture.applyGayShitHealing(entry.gayShitAct);
    }

    // Update character sprites for this specific script entry
    if (this.characterSprites) {
      const chars = SCENE_CHARACTERS[entry.scriptId] ?? [];
      this.characterSprites.setupForScene(chars);
    }

    // Load the script for this scene entry
    const scriptModule = await this.loadScriptModule(entry.scriptId);
    if (!scriptModule) {
      console.error(`Script not found: ${entry.scriptId}`);
      return;
    }

    this.dialogueManager.loadScript(scriptModule);

    // Fade in
    await this.transition.fadeIn(800);

    // Update inventory display
    this.inventoryBar?.update();

    // Start the dialogue
    this.dialogueManager.startBeat(
      entry.startBeat,
      // Scene change handler
      (sceneKey: SceneKey) => {
        this.transitionToScene(scene, sceneKey);
      },
      // Script complete handler
      () => {
        this.advanceToNextScene(scene);
      }
    );
  }

  private async advanceToNextScene(currentScene: Phaser.Scene): Promise<void> {
    this.currentIndex++;
    if (this.currentIndex >= SCENE_ORDER.length) {
      console.log("Play complete!");
      return;
    }

    const next = SCENE_ORDER[this.currentIndex];
    const currentKey = currentScene.scene.key;

    if (next.location !== currentKey) {
      await this.transitionToScene(currentScene, next.location);
    } else {
      await this.startCurrentScene(currentScene);
    }
  }

  private async transitionToScene(
    currentScene: Phaser.Scene,
    targetSceneKey: SceneKey
  ): Promise<void> {
    if (this.transition) {
      await this.transition.fadeOut(800);
    }

    // Store state before switching
    const fractureState = this.fracture.toJSON();
    const inventoryState = this.inventory.toJSON();

    // Switch Phaser scene
    currentScene.scene.start(targetSceneKey, {
      director: this,
      fractureState,
      inventoryState,
    });
  }

  private async loadScriptModule(scriptId: string): Promise<any> {
    // Dynamic import of scene script files
    try {
      const module = await import(`../data/scenes/${scriptId}`);
      return module.default || module.SCRIPT;
    } catch (e) {
      console.error(`Failed to load script: ${scriptId}`, e);
      return null;
    }
  }
}

// Singleton -- shared across all Phaser scenes
export const sceneDirector = new SceneDirector();

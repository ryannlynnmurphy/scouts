import Phaser from "phaser";
import { SCENE_ORDER, SceneEntry } from "../data/scene-order";
import { DialogueManager } from "./DialogueManager";
import { FractureManager } from "./FractureManager";
import { InventoryManager } from "./InventoryManager";
import { ChoiceTracker } from "./ChoiceTracker";
import { InventoryBar } from "../ui/InventoryBar";
import { TransitionOverlay } from "../ui/TransitionOverlay";
import { SceneKey } from "../data/types";

/**
 * SceneDirector lives on the active Phaser scene and drives the entire play.
 * It loads scene scripts, manages transitions, and moves through SCENE_ORDER.
 */
export class SceneDirector {
  private currentIndex: number = 0;
  private dialogueManager: DialogueManager | null = null;
  private inventoryBar: InventoryBar | null = null;
  private transition: TransitionOverlay | null = null;

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
    this.inventoryBar = new InventoryBar(scene, this.inventory, this.fracture);
    this.transition = new TransitionOverlay(scene);

    // Attach fracture effects to camera
    this.fracture.attachToCamera(scene.cameras.main);
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

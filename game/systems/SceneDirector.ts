import Phaser from "phaser";
import { SCENE_ORDER } from "../data/scene-order";
import { DialogueManager } from "./DialogueManager";
import { LightingDirector } from "./LightingDirector";
import { TransitionOverlay } from "../ui/TransitionOverlay";
import { CharacterSprites } from "../ui/CharacterSprites";
import { SceneKey, CinematicScene } from "../data/types";
import { audioManager } from "./AudioManager";

const AMBIENT_MAP: Record<SceneKey, "forest" | "cliff" | "meadow" | "lake" | "silence"> = {
  CampfireScene: "forest",
  CliffScene: "cliff",
  MeadowScene: "meadow",
  LakeScene: "lake",
  VoidScene: "silence",
};

export class SceneDirector {
  private currentIndex: number = 0;
  private dialogueManager: DialogueManager | null = null;
  private lighting: LightingDirector | null = null;
  private transition: TransitionOverlay | null = null;
  private characterSprites: CharacterSprites | null = null;

  attachToScene(scene: Phaser.Scene): void {
    this.lighting = new LightingDirector(scene);
    this.dialogueManager = new DialogueManager(scene, this.lighting);
    this.transition = new TransitionOverlay(scene);

    this.characterSprites?.destroy();
    this.characterSprites = new CharacterSprites(scene);

    this.dialogueManager.onSpeakerChange = (charKey) => {
      this.characterSprites?.setSpeaker(charKey);
    };

    this.dialogueManager.onStageDirection = (dir) => {
      if (!dir) return;
      if (dir.effect === "shake") {
        scene.cameras.main.shake(300, 0.01);
      }
      if (dir.effect === "flash") {
        scene.cameras.main.flash(200, 255, 255, 255);
      }
    };

    scene.input.on("pointerdown", () => {
      this.dialogueManager?.advance();
    });
  }

  async startCurrentScene(scene: Phaser.Scene): Promise<void> {
    if (!this.dialogueManager || !this.transition) return;

    const entry = SCENE_ORDER[this.currentIndex];
    if (!entry) {
      console.log("Play complete.");
      return;
    }

    const script: CinematicScene | null = await this.loadScript(entry.sceneId);
    if (!script) {
      console.error(`Script not found: ${entry.sceneId}`);
      return;
    }

    if (this.characterSprites) {
      this.characterSprites.setupForScene(script.characters);
    }

    const ambient = script.ambientKey || AMBIENT_MAP[entry.location];
    audioManager.setAmbient(ambient);

    this.dialogueManager.loadScene(script);
    await this.transition.fadeIn(800);

    this.dialogueManager.start(() => {
      this.advanceToNext(scene);
    });
  }

  private async advanceToNext(currentScene: Phaser.Scene): Promise<void> {
    this.currentIndex++;
    if (this.currentIndex >= SCENE_ORDER.length) {
      console.log("Play complete.");
      return;
    }

    const next = SCENE_ORDER[this.currentIndex];
    const currentKey = currentScene.scene.key;

    if (next.location !== currentKey) {
      await this.transitionToScene(currentScene, next.location);
    } else {
      if (this.transition) {
        await this.transition.fadeOut(800);
        await new Promise((r) => setTimeout(r, 400));
        await this.transition.fadeIn(800);
      }
      await this.startCurrentScene(currentScene);
    }
  }

  private async transitionToScene(
    currentScene: Phaser.Scene,
    targetKey: SceneKey
  ): Promise<void> {
    if (this.transition) {
      await this.transition.fadeOut(800);
    }
    audioManager.playTransition();
    currentScene.scene.start(targetKey, { director: this });
  }

  private async loadScript(sceneId: string): Promise<CinematicScene | null> {
    try {
      const module = await import(`../data/scenes/${sceneId}`);
      return module.default || module.SCRIPT;
    } catch (e) {
      console.error(`Failed to load: ${sceneId}`, e);
      return null;
    }
  }

  destroy(): void {
    this.dialogueManager?.destroy();
    this.lighting?.destroy();
    this.transition?.destroy();
    this.characterSprites?.destroy();
  }
}

export const sceneDirector = new SceneDirector();

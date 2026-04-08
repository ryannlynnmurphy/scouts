import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CliffScene extends Phaser.Scene {
  constructor() {
    super("CliffScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1a1a2a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

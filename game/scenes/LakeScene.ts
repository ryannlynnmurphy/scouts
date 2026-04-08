import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super("LakeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#0a1a2a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

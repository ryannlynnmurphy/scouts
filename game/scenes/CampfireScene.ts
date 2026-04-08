import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class CampfireScene extends Phaser.Scene {
  constructor() {
    super("CampfireScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#0d1a0d");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

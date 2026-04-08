import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super("VoidScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#000000");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

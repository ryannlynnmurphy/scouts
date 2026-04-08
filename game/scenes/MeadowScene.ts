import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class MeadowScene extends Phaser.Scene {
  constructor() {
    super("MeadowScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1a2a1a");
    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

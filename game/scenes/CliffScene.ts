import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";
import { audioManager } from "../systems/AudioManager";

export class CliffScene extends Phaser.Scene {
  constructor() {
    super({ key: "CliffScene" });
  }

  init(data: any) {
    if (data.fractureState) {
      sceneDirector.fracture.fromJSON(data.fractureState);
    }
    if (data.inventoryState) {
      sceneDirector.inventory.fromJSON(data.inventoryState);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2a");
    if (this.textures.exists("bg-cliff")) {
      this.add.image(480, 270, "bg-cliff").setDisplaySize(960, 540);
    }

    sceneDirector.attachToScene(this);
    audioManager.setAmbient("cliff");
    sceneDirector.startCurrentScene(this);
  }
}

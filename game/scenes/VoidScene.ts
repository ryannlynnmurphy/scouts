import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";
import { audioManager } from "../systems/AudioManager";

export class VoidScene extends Phaser.Scene {
  constructor() {
    super({ key: "VoidScene" });
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
    this.cameras.main.setBackgroundColor("#000000");
    if (this.textures.exists("bg-void")) {
      this.add.image(480, 270, "bg-void").setDisplaySize(960, 540);
    }

    sceneDirector.attachToScene(this);
    audioManager.setAmbient("silence");
    sceneDirector.startCurrentScene(this);
  }
}

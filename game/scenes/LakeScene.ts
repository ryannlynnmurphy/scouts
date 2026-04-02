import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";
import { audioManager } from "../systems/AudioManager";

export class LakeScene extends Phaser.Scene {
  constructor() {
    super({ key: "LakeScene" });
  }

  init(data: any) {
    if (data.fractureState) {
      sceneDirector.fracture.fromJSON(data.fractureState);
    }
    if (data.inventoryState) {
      sceneDirector.inventory.fromJSON(data.inventoryState);
    }
    if (data.suspicionState) {
      sceneDirector.suspicion.fromJSON(data.suspicionState);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor("#0a1a2a");
    if (this.textures.exists("bg-lake")) {
      this.add.image(480, 270, "bg-lake").setDisplaySize(960, 540);
    }

    sceneDirector.attachToScene(this);
    audioManager.setAmbient("lake");
    sceneDirector.startCurrentScene(this);
  }
}

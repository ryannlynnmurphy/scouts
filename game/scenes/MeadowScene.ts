import Phaser from "phaser";
import { sceneDirector } from "../systems/SceneDirector";

export class MeadowScene extends Phaser.Scene {
  constructor() {
    super({ key: "MeadowScene" });
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
    this.cameras.main.setBackgroundColor("#1a2a1a");
    if (this.textures.exists("bg-meadow")) {
      this.add.image(480, 270, "bg-meadow").setDisplaySize(960, 540);
    }

    sceneDirector.attachToScene(this);
    sceneDirector.startCurrentScene(this);
  }
}

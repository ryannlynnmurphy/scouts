import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CampfireScene } from "./scenes/CampfireScene";
import { CliffScene } from "./scenes/CliffScene";
import { MeadowScene } from "./scenes/MeadowScene";
import { LakeScene } from "./scenes/LakeScene";
import { VoidScene } from "./scenes/VoidScene";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene],
  audio: {
    disableWebAudio: true,
  },
};

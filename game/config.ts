import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CampfireScene } from "./scenes/CampfireScene";
import { CliffScene } from "./scenes/CliffScene";
import { MeadowScene } from "./scenes/MeadowScene";
import { LakeScene } from "./scenes/LakeScene";
import { VoidScene } from "./scenes/VoidScene";

import { GAME_WIDTH, GAME_HEIGHT } from "./constants";
export { GAME_WIDTH, GAME_HEIGHT };

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: "#1a1714",
    scene: [BootScene, CampfireScene, CliffScene, MeadowScene, LakeScene, VoidScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: true,
      antialias: false,
    },
    audio: {
      noAudio: true, // Plan D will add Howler.js audio separately
    },
  };
}

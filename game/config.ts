import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CampfireScene } from "./scenes/CampfireScene";
import { CliffScene } from "./scenes/CliffScene";
import { MeadowScene } from "./scenes/MeadowScene";
import { LakeScene } from "./scenes/LakeScene";
import { VoidScene } from "./scenes/VoidScene";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

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
  };
}

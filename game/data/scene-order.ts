import { SceneKey } from "./types";

export interface SceneEntry {
  sceneId: string;
  location: SceneKey;
}

export const SCENE_ORDER: SceneEntry[] = [
  { sceneId: "prelude", location: "VoidScene" },
  { sceneId: "scene1-oath", location: "CampfireScene" },
  { sceneId: "different-noah", location: "VoidScene" },
  { sceneId: "scene1-manhood", location: "CampfireScene" },
  { sceneId: "different-quinn", location: "VoidScene" },
  { sceneId: "scene1-sacrifice", location: "CampfireScene" },
  { sceneId: "different-josh", location: "VoidScene" },
  { sceneId: "scene1-kiss-test", location: "CampfireScene" },
  { sceneId: "different-lucas", location: "VoidScene" },
  { sceneId: "scene1-pickup-lines", location: "CampfireScene" },
  { sceneId: "different-matt", location: "VoidScene" },
  { sceneId: "gay-shit-anthem", location: "CampfireScene" },
  { sceneId: "gay-shit-act1", location: "CliffScene" },
  { sceneId: "gay-shit-act2", location: "MeadowScene" },
  { sceneId: "gay-shit-act3", location: "LakeScene" },
  { sceneId: "ceremony", location: "CampfireScene" },
  { sceneId: "different-brent", location: "VoidScene" },
  { sceneId: "ending", location: "VoidScene" },
];

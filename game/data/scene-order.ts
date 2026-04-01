import { SceneKey } from "./types";

export interface SceneEntry {
  scriptId: string;
  location: SceneKey;
  startBeat: string;
  isGayShit?: boolean;
  gayShitAct?: 1 | 2 | 3;
}

export const SCENE_ORDER: SceneEntry[] = [
  { scriptId: "scene1-oath", location: "CampfireScene", startBeat: "oath-start" },
  { scriptId: "monologue-noah", location: "VoidScene", startBeat: "noah-start" },
  { scriptId: "monologue-simon", location: "VoidScene", startBeat: "simon-mono-start" },
  { scriptId: "scene1-sacrifice", location: "CampfireScene", startBeat: "sacrifice-start" },
  { scriptId: "monologue-lucas", location: "VoidScene", startBeat: "lucas-start" },
  { scriptId: "scene1-kiss-test", location: "CampfireScene", startBeat: "kiss-test-start" },
  { scriptId: "monologue-josh", location: "VoidScene", startBeat: "josh-start" },
  { scriptId: "scene1-pickup-lines", location: "CampfireScene", startBeat: "pickup-start" },
  { scriptId: "scene1-resistance", location: "CampfireScene", startBeat: "resistance-start" },
  { scriptId: "monologue-simon-sam", location: "VoidScene", startBeat: "simon-sam-start" },
  { scriptId: "gay-shit-anthem", location: "CampfireScene", startBeat: "anthem-start" },
  { scriptId: "gay-shit-act1", location: "CliffScene", startBeat: "act1-start", isGayShit: true, gayShitAct: 1 },
  { scriptId: "gay-shit-act2", location: "MeadowScene", startBeat: "act2-start", isGayShit: true, gayShitAct: 2 },
  { scriptId: "gay-shit-act3", location: "LakeScene", startBeat: "act3-start", isGayShit: true, gayShitAct: 3 },
  { scriptId: "monologue-sam", location: "VoidScene", startBeat: "sam-mono-start" },
  { scriptId: "ceremony", location: "CampfireScene", startBeat: "ceremony-start" },
  { scriptId: "monologue-brent", location: "VoidScene", startBeat: "brent-mono-start" },
  { scriptId: "ending", location: "VoidScene", startBeat: "ending-start" },
];

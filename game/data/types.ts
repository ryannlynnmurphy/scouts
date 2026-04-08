export type SceneKey =
  | "CampfireScene"
  | "CliffScene"
  | "MeadowScene"
  | "LakeScene"
  | "VoidScene";

export type CharacterKey =
  | "quinn"
  | "matt"
  | "brent"
  | "josh"
  | "noah"
  | "lucas";

export interface LightingCue {
  tint: string;
  intensity: number;
  transition: number;
}

export interface StageDirection {
  enter?: string[];
  exit?: string[];
  position?: Record<string, { x: number; y: number }>;
  effect?: "shake" | "flash" | "blood" | "fadeCharacter";
}

export interface CinematicLine {
  speaker: string | null;
  text: string;
  autoAdvance?: number;
  pause?: number;
  lighting?: LightingCue;
  direction?: StageDirection;
  overlap?: boolean;
  expression?: string;
}

export interface CinematicScene {
  id: string;
  title: string;
  location: SceneKey;
  characters: string[];
  lines: CinematicLine[];
  ambientKey?: "forest" | "cliff" | "meadow" | "lake" | "silence";
  initialLighting?: LightingCue;
}

export interface Character {
  key: CharacterKey;
  name: string;
  age: string;
  color: string;
  expressions: string[];
}

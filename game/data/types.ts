export type ChoiceType = "authentic" | "performed" | "deflect" | "timeout";

export type FractureContext = "safe" | "dangerous" | "forced";

export interface DialogueLine {
  speaker: string | null; // null = stage direction
  text: string;
  expression?: string;
  delay?: number; // ms pause before this line
}

export interface Choice {
  id: string;
  text: string;
  type: ChoiceType;
  fractureDelta: number;
  suspicionDelta?: number; // how much this choice shifts suspicion (0.0 to 1.0 scale)
  minSuspicion?: number; // only show this choice when suspicion >= this value
  maxSuspicion?: number; // only show this choice when suspicion <= this value
  context: FractureContext;
  nextBeat: string; // which beat to jump to after this choice
  locked?: {
    minFracture: number; // lock this choice when fracture exceeds this
    lockedText?: string; // text to show when locked (e.g., strikethrough)
  };
}

export interface Beat {
  id: string;
  location: SceneKey;
  lines: DialogueLine[];
  choices?: Choice[];
  timer?: number; // seconds, undefined = no timer
  onEnter?: {
    addItem?: string;
    removeItem?: string;
    fractureChange?: number;
    suspicionChange?: number; // direct suspicion shift on beat entry
    expression?: Record<string, string>; // character -> expression
  };
  nextBeat?: string; // auto-advance to this beat (if no choices)
}

export interface SceneScript {
  id: string;
  title: string;
  beats: Beat[];
}

export type SceneKey =
  | "CampfireScene"
  | "CliffScene"
  | "MeadowScene"
  | "LakeScene"
  | "VoidScene";

export type CharacterKey =
  | "simon"
  | "sam"
  | "brent"
  | "josh"
  | "noah"
  | "lucas";

export interface Character {
  key: CharacterKey;
  name: string;
  age: string;
  color: string;
  expressions: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  iconKey: string;
  tooltips: {
    low: string;    // fracture 0-0.5
    high: string;   // fracture 0.5+
  };
  neverDegrades?: boolean; // true for the flower
}

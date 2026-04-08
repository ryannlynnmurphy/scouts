import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "ending",
  title: "End",
  location: "VoidScene",
  characters: [],
  ambientKey: "silence",
  initialLighting: { tint: "#000000", intensity: 0, transition: 0 },
  lines: [
    { speaker: null, text: "END PLAY.", pause: 2000 },
    { speaker: null, text: "SCOUTS by Ryann Lynn Murphy", pause: 3000 },
  ],
};

export default SCRIPT;

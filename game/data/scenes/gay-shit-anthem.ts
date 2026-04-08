import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "gay-shit-anthem",
  title: "The Gay Shit: National Anthem",
  location: "CampfireScene",
  characters: ["quinn", "matt", "brent", "josh", "lucas", "noah"],
  ambientKey: "forest",
  initialLighting: { tint: "#ff44ff", intensity: 0.3, transition: 2000 },
  lines: [
    // anthem-start
    { speaker: null, text: "The National Anthem." },
    { speaker: null, text: "(The National Anthem but all the words are \"gay.\" This should be a full rendition. Harmonies, soloists, lights, organs. Pull out all the stops.)" },
    // anthem-verse1
    { speaker: null, text: "(GAY MADNESS. THIS IS JOY.)" },
    { speaker: null, text: "ALL SCOUTS: Gay, gay, gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay'd", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay?", autoAdvance: 600 },
    // anthem-verse2
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay'd", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay gay?", autoAdvance: 600 },
    // anthem-verse3
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay, gay gay gay gay gay gay gay gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay gay", autoAdvance: 600 },
    { speaker: null, text: "ALL SCOUTS: Gay gay gay gay gay gay?", autoAdvance: 600 },
    // anthem-end
    { speaker: null, text: "(In the heat of the madness, eventually we find QUINN and MATT suspended in time and space as if they are on a mountain top overlooking a cliff.)" },
    { speaker: null, text: "(As we enter this new play, it should feel like when you turned your living room into a theater when you were younger, and made your parents watch a show.)" },
    { speaker: "brent", text: "(is this Brent?) The Gay Shit: A Like Story in Three Acts." },
  ],
};

export default SCRIPT;

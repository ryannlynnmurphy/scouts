import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "gay-shit-anthem",
  title: "The National Anthem",
  beats: [
    {
      id: "anthem-start",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "The National Anthem." },
        { speaker: null, text: "(The National Anthem but all the words are \"gay.\" This should be a full rendition. Harmonies, soloists, lights, organs. Pull out all the stops.)" },
      ],
      nextBeat: "anthem-verse1",
    },
    {
      id: "anthem-verse1",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "(GAY MADNESS. THIS IS JOY.)" },
        { speaker: "ALL SCOUTS", text: "Gay, gay, gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay'd" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay?" },
      ],
      nextBeat: "anthem-verse2",
    },
    {
      id: "anthem-verse2",
      location: "CampfireScene",
      lines: [
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay'd" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay gay?" },
      ],
      nextBeat: "anthem-verse3",
    },
    {
      id: "anthem-verse3",
      location: "CampfireScene",
      lines: [
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay, gay gay gay gay gay gay gay gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay gay" },
        { speaker: "ALL SCOUTS", text: "Gay gay gay gay gay gay?" },
      ],
      nextBeat: "anthem-end",
    },
    {
      id: "anthem-end",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "(In the heat of the madness, eventually we find SIMON and SAM suspended in time and space as if they are on a mountain top overlooking a cliff.)" },
        { speaker: null, text: "(As we enter this new play, it should feel like when you turned your living room into a theater when you were younger, and made your parents watch a show.)" },
        { speaker: "brent", text: "(is this Brent?) The Gay Shit: A Like Story in Three Acts." },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;

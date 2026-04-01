import { Character } from "./types";

export const CHARACTERS: Record<string, Character> = {
  simon: {
    key: "simon",
    name: "SIMON",
    age: "12",
    color: "#d4a0d0",
    expressions: ["neutral", "scared", "defiant", "hurt", "tender", "shattered"],
  },
  sam: {
    key: "sam",
    name: "SAM",
    age: "12",
    color: "#7eb8c9",
    expressions: ["neutral", "shy", "warm", "conflicted", "brave"],
  },
  brent: {
    key: "brent",
    name: "BRENT",
    age: "16",
    color: "#ff4444",
    expressions: ["neutral", "angry", "mocking", "unhinged", "broken"],
  },
  josh: {
    key: "josh",
    name: "JOSH",
    age: "11",
    color: "#8a9a5a",
    expressions: ["neutral", "eager", "angry", "scared"],
  },
  noah: {
    key: "noah",
    name: "NOAH",
    age: "12",
    color: "#d4a44a",
    expressions: ["neutral", "smug", "nervous", "defiant"],
  },
  lucas: {
    key: "lucas",
    name: "LUCAS",
    age: "12",
    color: "#5a9a8a",
    expressions: ["neutral", "earnest", "uncomfortable", "brave"],
  },
};

export const STAGE_DIRECTION_COLOR = "#f8f0e3";
export const STAGE_DIRECTION_ALPHA = 0.5;

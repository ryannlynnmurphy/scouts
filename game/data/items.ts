import { InventoryItem } from "./types";

export const ITEMS: Record<string, InventoryItem> = {
  neckerchief: {
    id: "neckerchief",
    name: "Scout Neckerchief",
    iconKey: "item-neckerchief",
    tooltips: {
      low: "I don't even know the outdoor code.",
      high: "I don't deserve to wear this.",
    },
  },
  marshmallow: {
    id: "marshmallow",
    name: "Marshmallow",
    iconKey: "item-marshmallow",
    tooltips: {
      low: "At least someone's having a good time.",
      high: "This was supposed to be fun.",
    },
  },
  squirrelBlood: {
    id: "squirrelBlood",
    name: "Squirrel Blood",
    iconKey: "item-blood-hands",
    tooltips: {
      low: "I can still feel it.",
      high: "I'm no different from them.",
    },
  },
  flower: {
    id: "flower",
    name: "Flower",
    iconKey: "item-flower",
    neverDegrades: true,
    tooltips: {
      low: "Sam picked this for me.",
      high: "Sam picked this for me.",
    },
  },
  samsKiss: {
    id: "samsKiss",
    name: "Sam's Kiss",
    iconKey: "item-kiss",
    tooltips: {
      low: "It was just a joke... right?",
      high: "The only real thing that happened tonight.",
    },
  },
  brentsBlood: {
    id: "brentsBlood",
    name: "Brent's Blood",
    iconKey: "item-blood-knuckles",
    tooltips: {
      low: "What did I do?",
      high: "What did I become?",
    },
  },
};

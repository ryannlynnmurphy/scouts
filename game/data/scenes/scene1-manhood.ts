import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "scene1-manhood",
  title: "Scene One: Man-Scout Camp",
  location: "CampfireScene",
  characters: ["brent", "lucas", "noah", "josh", "quinn", "matt"],
  ambientKey: "forest",
  initialLighting: { tint: "#334422", intensity: 0.15, transition: 1000 },
  lines: [
    { speaker: null, text: "(Back to normal.)" },
    { speaker: null, text: "(Boy Scout Camp. Stars, crickets.)" },
    {
      speaker: "brent",
      text: "SO, BOYS now that we've gotten the formalities out of the way... you're probably wondering why I've gathered you here today.",
    },
    {
      speaker: "josh",
      text: "Ummm... Brent? How long is this gonna take? It's pretty late, and I have rifle in the morning--",
    },
    {
      speaker: "brent",
      text: "SHUT UP. You don't need to go rifle in the morning. In fact, boys, you only need to learn one thing.",
    },
    { speaker: "lucas", text: "What's going on?" },
    { speaker: "noah", text: "I just want to go to bed." },
    {
      speaker: "josh",
      text: "Why the fuck did you drag us to the middle of the woods?",
    },
    {
      speaker: "brent",
      text: "I gathered you here tonight to show you something that actually matters.",
    },
    { speaker: "josh", text: "What actually matters?" },
    {
      speaker: "brent",
      text: "I'm gonna show you the GLORIES of manhood. Being a man.",
    },
    { speaker: "josh", text: "Um..." },
    { speaker: "noah", text: "Yes..." },
    { speaker: "lucas", text: "Fun..." },
    {
      speaker: "brent",
      text: "You are no doubt boys right now. Puny, insignificant little beta boys.",
    },
    { speaker: "lucas", text: "Wut." },
    {
      speaker: "brent",
      text: "They call it BOY Scout Camp for a reason, do they not? Tonight, however. Boys tonight you will become men. THIS WILL BECOME MAN-SCOUT CAMP.",
    },
    { speaker: "matt", text: "Nice..." },
    { speaker: "noah", text: "Stellar..." },
    { speaker: "quinn", text: "Cool..." },
    {
      speaker: "brent",
      text: "Are you not excited? Are you not overjoyed?",
    },
    { speaker: "quinn", text: "I mean like no..." },
    { speaker: "brent", text: "Being a man doesn't interest you?" },
    { speaker: "quinn", text: "I guess..." },
    {
      speaker: "brent",
      text: "But you just said that you weren't interested in becoming a man, so I'm confused. IS ANYONE ELSE CONFUSED? Are you confused? Are you confused?",
    },
    {
      speaker: "quinn",
      text: "You told us we were gonna make a campfire and s'mores.",
    },
    { speaker: "brent", text: "We're not making s'mores. Grow up." },
    { speaker: "quinn", text: "What if I don't want to grow up?" },
    {
      speaker: "brent",
      text: "Believe it or not, boys, you're going to do a lot of growing up in your life. You're gonna become a man some day. Why not now?",
    },
    { speaker: "quinn", text: "Today is not that day." },
    { speaker: "brent", text: "Why not?" },
    {
      speaker: "quinn",
      text: "I think I'm gonna cross that bridge when I get there.",
    },
    {
      speaker: "brent",
      text: "Hey, Quinn-dude, hate to break it to you, but that bridge is right before your eyes.",
    },
    { speaker: "quinn", text: "Okay cool. Mhm. Yeah, right." },
    {
      speaker: "brent",
      text: "So, I thought, being one of the slightly more experienced members of the troop, I would provide you with some guidance.",
    },
    {
      speaker: "matt",
      text: "(hushed to Quinn) Is he being serious right now?",
    },
    {
      speaker: "quinn",
      text: "(hushed back) Yeah I don't know what he means.",
    },
    { speaker: "matt", text: "What is he going to do to us?" },
    {
      speaker: "quinn",
      text: "What does he mean \"becoming a man?\"",
    },
    { speaker: "matt", text: "I don't know." },
    {
      speaker: "quinn",
      text: "Brent, what do you mean becoming a man?",
    },
    {
      speaker: "brent",
      text: "You'll see. But first boys, should we start with the opening sacrifice?",
    },
  ],
};

export default SCRIPT;

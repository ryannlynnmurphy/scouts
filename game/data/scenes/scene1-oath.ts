import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "scene1-oath",
  title: "Scene One: The Oath",
  location: "CampfireScene",
  characters: ["brent", "lucas", "noah", "josh", "quinn", "matt"],
  ambientKey: "forest",
  initialLighting: { tint: "#334422", intensity: 0.15, transition: 1000 },
  lines: [
    { speaker: null, text: "(This is normal…)" },
    {
      speaker: null,
      text: "(Somewhere in the woods of a boy scout camp. The dead of night. Stars, crickets, and seven 11-13 year-old boys standing in line. Their arms are at ninety degree angles, holding up three fingers.)",
    },
    {
      speaker: null,
      text: "(There's a cooler. There's a bag of marshmallows, a bag of chocolate, and a box of graham crackers.)",
    },
    {
      speaker: null,
      text: "(The eighth boy, the leader of the group, is BRENT, 16. He is pacing back in forth, sizing the rest up. Making a man out of them.)",
    },
    {
      speaker: null,
      text: "(There is way too much energy. This is lighting in a bottle.)",
    },
    {
      speaker: null,
      text: "ALL: A SCOUT IS: TRUSTWORTHY, LOYAL, HELPFUL, FRIENDLY, COURTEOUS, KIND, OBEDIENT, CHEERFUL, THRIFTY, BRAVE, CLEAN, AND REVERENT.",
    },
    { speaker: "brent", text: "NOW THE SCOUT OATH!" },
    {
      speaker: null,
      text: "ALL: ON MY HONOR I WILL DO MY BEST TO DO MY DUTY TO GOD AND MY COUNTRY TO OBEY THE SCOUT LAW; TO HELP OTHER PEOPLE AT ALL TIMES; TO KEEP MYSELF PHYSICALLY STRONG, MENTALLY AWAKE, AND MORALLY STRAIGHT.",
    },
    {
      speaker: null,
      text: "(BRENT walks menacingly towards QUINN, 12.)",
    },
    { speaker: "brent", text: "QUINN, SCOUT MOTTO." },
    { speaker: "quinn", text: "BE PREPARED!" },
    { speaker: "brent", text: "THE SLOGAN?" },
    { speaker: "quinn", text: "UMM…" },
    { speaker: "brent", text: "Umm?" },
    { speaker: "quinn", text: "I don't think I know… sir." },
    { speaker: "brent", text: "Wanna phone a friend…?" },
    { speaker: "quinn", text: "YES SIR. MATT." },
    {
      speaker: null,
      text: "(QUINN steps back. BRENT walks over to MATT. MATT steps forward.)",
    },
    { speaker: "matt", text: "DO A GOOD TURN DAILY, SIR." },
    { speaker: "brent", text: "Outdoor code?" },
    {
      speaker: "matt",
      text: "As an American, I will do my best to be clean in my outdoor manners, be careful with fire, be considerate in the outdoors, and be conservation minded.",
    },
    { speaker: "brent", text: "Wow Matt, I'm impressed. I don't even know the outdoor code.." },
    { speaker: "matt", text: "You should learn it. Our climate is changing." },
    { speaker: "brent", text: "Hmmph…" },
    { speaker: "matt", text: "You should learn the outdoor code. The Earth is dying, sir." },
    { speaker: "brent", text: "(intensely mocking) \"THE EARTH IS DYING, SIR.\"" },
    { speaker: "matt", text: "Excuse me?" },
    {
      speaker: "brent",
      text: "(tearing him a new one) \"tHe EaRth iS dYinG SiR!!!1!1! ThE EArTh Is DyInG!1!1!!! MY NAME'S MATT!!!!!!  I'M A FAGGOT that believes in cLimAte cHAngE. tHe EArtH iS dYiNg, SIRRRRRR!!!1!1!!!1!1!1! \"",
    },
    {
      speaker: "matt",
      text: "Ummmmmmmmmmmmmmmmmmmmmmm. Our climate is changing, I think it's important and very scoutsmenly to be environmentally conscious, sir… Don't hit me.",
    },
    {
      speaker: "brent",
      text: "You know, I thought knowing the outdoor code made you a fag. But now that you're talking about \"climate change,\" I think you're a MEGA FAG.",
    },
    { speaker: "matt", text: "Right." },
    { speaker: null, text: "(MATT steps back in line.)" },
    { speaker: null, text: "(Blackness. Like God is about to punish you.)" },
    {
      speaker: null,
      text: "(But it turns out it's just NOAH. He is illuminated by some light that has the power to make him tell us exactly what's on his mind.)",
    },
    {
      speaker: null,
      text: "(Almost like he's allowed to be vulnerable at this moment for the first time in a long time. Maybe the first time ever.",
    },
    { speaker: null, text: "(And what does he have to say?)" },
  ],
};

export default SCRIPT;

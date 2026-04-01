import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "scene1-oath",
  title: "The Oath",
  beats: [
    {
      id: "oath-start",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "Somewhere in the woods of a boy scout camp. The dead of night. Stars, crickets." },
        { speaker: null, text: "Six boys stand in line. Arms at ninety degree angles, holding up three fingers." },
        { speaker: null, text: "The leader, BRENT, 16, paces back and forth. Sizing them up." },
      ],
      nextBeat: "oath-recite",
      onEnter: { addItem: "neckerchief" },
    },
    {
      id: "oath-recite",
      location: "CampfireScene",
      lines: [
        { speaker: null, text: "ALL: A SCOUT IS: TRUSTWORTHY, LOYAL, HELPFUL, FRIENDLY, COURTEOUS, KIND, OBEDIENT, CHEERFUL, THRIFTY, BRAVE, CLEAN, AND REVERENT." },
        { speaker: "brent", text: "NOW THE SCOUT OATH!" },
        { speaker: null, text: "ALL: ON MY HONOR I WILL DO MY BEST TO DO MY DUTY TO GOD AND MY COUNTRY TO OBEY THE SCOUT LAW; TO HELP OTHER PEOPLE AT ALL TIMES; TO KEEP MYSELF PHYSICALLY STRONG, MENTALLY AWAKE, AND MORALLY STRAIGHT." },
      ],
      nextBeat: "oath-motto",
    },
    {
      id: "oath-motto",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "SIMON, SCOUT MOTTO." },
        { speaker: "simon", text: "BE PREPARED!" },
        { speaker: "brent", text: "THE SLOGAN?" },
      ],
      choices: [
        {
          id: "slogan-dont-know",
          text: "I don't think I know... sir.",
          type: "authentic",
          fractureDelta: 0.02,
          context: "dangerous",
          nextBeat: "slogan-phone-friend",
        },
        {
          id: "slogan-know-it",
          text: "DO A GOOD TURN DAILY, SIR.",
          type: "performed",
          fractureDelta: 0.03,
          context: "dangerous",
          nextBeat: "slogan-impressed",
        },
        {
          id: "slogan-silence",
          text: "...",
          type: "deflect",
          fractureDelta: 0.01,
          context: "dangerous",
          nextBeat: "slogan-phone-friend",
        },
      ],
      timer: 15,
    },
    {
      id: "slogan-phone-friend",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Umm?" },
        { speaker: "brent", text: "Wanna phone a friend...?" },
        { speaker: "simon", text: "YES SIR. SAM." },
        { speaker: null, text: "Simon steps back. Brent walks over to Sam." },
        { speaker: "sam", text: "DO A GOOD TURN DAILY, SIR." },
      ],
      nextBeat: "outdoor-code",
    },
    {
      id: "slogan-impressed",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Wow Simon, I'm impressed. I don't even know the slogan." },
        { speaker: null, text: "Brent walks over to Sam." },
      ],
      nextBeat: "outdoor-code",
    },
    {
      id: "outdoor-code",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "Outdoor code?" },
        { speaker: "sam", text: "As an American, I will do my best to be clean in my outdoor manners, be careful with fire, be considerate in the outdoors, and be conservation minded." },
        { speaker: "brent", text: "Wow Sam, I'm impressed. I don't even know the outdoor code.." },
        { speaker: "sam", text: "You should learn it. Our climate is changing." },
        { speaker: "brent", text: "Hmmph..." },
        { speaker: "sam", text: "You should learn the outdoor code. The Earth is dying, sir." },
      ],
      nextBeat: "brent-mocks-sam",
    },
    {
      id: "brent-mocks-sam",
      location: "CampfireScene",
      lines: [
        { speaker: "brent", text: "\"THE EARTH IS DYING, SIR.\"" },
        { speaker: "sam", text: "Excuse me?" },
        { speaker: "brent", text: "\"tHe EaRth iS dYinG SiR!!!1!1! ThE EArTh Is DyInG!1!1!!! MY NAME'S SAM!!!!!! I'M A FAGGOT that believes in cLimAte cHAngE!!!\"" },
        { speaker: "sam", text: "Ummm. Our climate is changing, I think it's important and very scoutsmenly to be environmentally conscious, sir... Don't hit me." },
        { speaker: "brent", text: "You know, I thought knowing the outdoor code made you a fag. But now that you're talking about \"climate change,\" I think you're a MEGA FAG." },
      ],
      choices: [
        {
          id: "mock-sam-support",
          text: "(whisper to Sam) You were right.",
          type: "authentic",
          fractureDelta: 0.03,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
        {
          id: "mock-sam-laugh",
          text: "(laugh along with Brent)",
          type: "performed",
          fractureDelta: 0.05,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
        {
          id: "mock-sam-quiet",
          text: "(stay quiet, look at the ground)",
          type: "deflect",
          fractureDelta: 0.01,
          context: "dangerous",
          nextBeat: "sam-steps-back",
        },
      ],
      timer: 12,
    },
    {
      id: "sam-steps-back",
      location: "CampfireScene",
      lines: [
        { speaker: "sam", text: "Right." },
        { speaker: null, text: "Sam steps back in line." },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;

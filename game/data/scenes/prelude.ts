import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "prelude",
  title: "The Different Prelude",
  location: "VoidScene",
  characters: ["brent", "lucas", "noah", "josh", "quinn", "matt"],
  ambientKey: "silence",
  initialLighting: { tint: "#000000", intensity: 0, transition: 0 },
  lines: [
    { speaker: null, text: "The stage is dark." },
    { speaker: null, text: "The kind of dark that makes you question reality." },
    { speaker: null, text: "There is seemingly no air. Just negative space." },
    {
      speaker: null,
      text: "It's that void you scream into when you can't stop thinking about something, hoping someone, anyone will respond.",
    },
    { speaker: null, text: "But they never do." },
    {
      speaker: null,
      text: "It's that spot on your ceiling you stare at for God knows how long before you go to bed.",
    },
    {
      speaker: null,
      text: "(Contemplating everything that got you here and everywhere you're going.)",
    },
    { speaker: null, text: "(Different.)" },
    { speaker: null, text: "(It's different.)" },
    { speaker: null, text: "(Then it all becomes overwhelming.)" },
    {
      speaker: null,
      text: "(These next monologues are ALL OVER each other.)",
    },
    {
      speaker: null,
      text: "(Everyone besides Quinn and Matt, please be as fast as possible. Quinn and Matt take your time.)",
    },
    {
      speaker: null,
      text: "(This should be chaotic, messy, angry, irreverent, dissonant, etc. If you think you've gone too far, please go further.)",
    },
    {
      speaker: null,
      text: "(For the beginning part, the audience should feel like they have no idea what is going on, much like adolescence, much like puberty, much like what these boys are going through.)",
    },
    {
      speaker: null,
      text: "(We should hear screams coming from each of the boys as they each fade out. Then Quinn and Matt will be left. Their words should take the longest and finish at the same time.)",
    },

    // BRENT — fast
    {
      speaker: "brent",
      text: "I don't cry. I don't cry. I don't cry. I don't cry. I don't cry.",
      autoAdvance: 800,
    },
    {
      speaker: "brent",
      text: "I DON'T CRY. NOTHING. I FEEL NOTHING. I MEAN SOMETIMES I FEEL NOTHING.",
      autoAdvance: 800,
    },
    {
      speaker: "brent",
      text: "I just feel nothing. I was called down to the school counselor, and she asked if I cry.",
      autoAdvance: 800,
    },
    {
      speaker: "brent",
      text: "I don't cry. Like I said. Crying is for girls and for faggots.",
      autoAdvance: 800,
    },
    {
      speaker: "brent",
      text: "And I am not a girl, and I am not a faggot. She said she thinks I have \"depression.\" Like sadness but forever.",
      autoAdvance: 800,
    },
    {
      speaker: "brent",
      text: "I'm not sad. I swear. LIKE AT ALL. I'M A MAN. A MANLY MAN.",
      autoAdvance: 800,
    },

    // LUCAS — fast
    {
      speaker: "lucas",
      text: "My body is changing. And I'm excited. Not like excited in a weird way. I swear I'm not trying to be weird.",
      autoAdvance: 800,
    },
    {
      speaker: "lucas",
      text: "But I kind of want armpit hair??? I want my voice to be deep like Brent. I want my balls to drop. Bring it on.",
      autoAdvance: 800,
    },
    {
      speaker: "lucas",
      text: "I'm young for my grade. So, I'm kind of behind in… development. And I get really scared because everyone around me is so much bigger than me and I feel so much smaller.",
      autoAdvance: 800,
    },
    {
      speaker: "lucas",
      text: "And I just have to close my mouth. Not talk. Be quiet. Everyone always says that. Everyone always says that I'm quiet.",
      autoAdvance: 800,
    },
    {
      speaker: "lucas",
      text: "They don't say that I'm mysterious. They don't say that I'm weird either. They just say I'm quiet.",
      autoAdvance: 800,
    },
    {
      speaker: "lucas",
      text: "And it's like, well I can't help that I feel like everyone was given some magic pill by some magic fairy that made them grow at ten times speed.",
      autoAdvance: 800,
    },

    // NOAH — fast
    {
      speaker: "noah",
      text: "Then he threw a temper tantrum, and then I threw a temper tantrum.",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "And then he threw his remote at the TV and then I threw my remote at his head.",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "And he started crying. And, because he's seven and he's the baby, and I'm the oldest, my mom said \"That's it! No more XBOX until you learn how to play fair! Why can't you give him a shot?\" WHAT?",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "Why does he always have to get his way? He was the one being a sore loser. So, I called my mom a cunt. Because she was being a cunt.",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "She said, \"Young man, you do not use that word to talk about your mother.\" But, she took away my XBOX.",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "What was I supposed to say? \"Oh yes, this will teach me a lesson on how to give everyone else the upperhand in life. Thanks MOM!\"",
      autoAdvance: 800,
    },
    {
      speaker: "noah",
      text: "No, now I just want HER to give me back MY XBOX and stop being such a fucking CUNT.",
      autoAdvance: 800,
    },

    // JOSH — fast
    {
      speaker: "josh",
      text: "I wanted to be one of those guys in the pizza place that makes the pizza, and they throw it above their head, and they catch it. They're so cool. And I really like pizza, so it just felt perfect.",
      autoAdvance: 800,
    },
    {
      speaker: "josh",
      text: "I brought it home to my dad, and he hated it. He told me right then and there \"SON, YOU'RE GOING TO BE A MARINE,\" and pretty much since then it's been that.",
      autoAdvance: 800,
    },
    {
      speaker: "josh",
      text: "My dad is always saying, \"Do your best in school, sports, and scouts.\" What does that mean? Do your best? Because sometimes I do my best and he's still not satisfied.",
      autoAdvance: 800,
    },
    {
      speaker: "josh",
      text: "And it's like what else do you want me to do? You told me to do my best, and I did my best. Sometimes my best isn't very good. Okay?",
      autoAdvance: 800,
    },
    {
      speaker: "josh",
      text: "I'm okay at school. My dad forces me to be. If I get any grade below a 95 he takes out his belt. His belt. I mean that's like classic—textbook—abuse.",
      autoAdvance: 800,
    },
    {
      speaker: "josh",
      text: "Or discipline. He always says a child needs to be disciplined. But, it's okay. Marines need to be disciplined.",
      autoAdvance: 800,
    },

    // QUINN (SIMON) — slow
    {
      speaker: "quinn",
      text: "Like I have to prove something. To somebody. Like anyone cares who I am.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "I just feel incomplete. Like a piece of me hasn't fallen into place yet. And I know I'm young and I don't have to have all the answers yet. But it really feels like I do.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "Part of me feels like I'm not a boy. Why would I want to be a boy? Like they are so gross and so brutal and so gross and disgusting. I don't want to be associated. Thank you very much.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "I wish I could be a girl. It's not like \"I want to be a girl.\" More like I wish boys could be more like girls.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "What I'm saying is I really like girls. Like I REALLY like girls. I don't think that I'm a boy… maybe I think that maybe I'm not a boy. I don't know.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "I see a girl, I immediately fall in love with her. No matter who it is. No matter how they look. It's not like a love love. Like I'm not attracted to them. Maybe I am. I don't know. That's confusing.",
      autoAdvance: 1500,
    },
    {
      speaker: "quinn",
      text: "I more so just want to be them. No, I don't think I'm in love with them. I definitely like boys that I know.",
      autoAdvance: 1500,
    },

    // MATT (SAM) — slow
    {
      speaker: "matt",
      text: "I don't sleep well. Going to sleep is challenging and hard and complicated and not something that I feel like I'm ever ready for at all ever. Sleep that is.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "The only thing that makes me forget about everything else is my pillow. Yes I really said it. My pillow.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "Each and every night my pillow turns into a person I hug when I go to sleep. Usually whichever person makes my heart drop at the moment.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "I know it's embarrassing. I know I probably should keep this in. I know this is creepy but maybe the kind of creepy that is kind of sweet.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "This is so weird to come clean about but right now it's Quinn. I think that maybe there might be some part of me that possibly likes guys as well as girls.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "And I ask God to forgive me for who I am every night before bed. Please lord don't let me be a faggot. Please God I don't want to be gay.",
      autoAdvance: 1500,
    },
    {
      speaker: "matt",
      text: "I've been having temptations. Please take them away from me. I have a crush… on a guy. I don't want to like him. I don't want my stomach to turn everytime I see him. I'm not interested in sinning. I just can't help it. I love the way he stares at me and when he says my name.",
      autoAdvance: 1500,
    },

    // Chaos ending
    {
      speaker: null,
      text: "(AS THEY FINISH, THEY ALL FUCKING SCREAM, RUNNING AROUND IN CIRCLES.)",
      autoAdvance: 2000,
    },
    {
      speaker: null,
      text: "(THIS IS CHAOS. THIS IS MADNESS. WHAT THE FUCK IS GOING ON!?!?!?!)",
      autoAdvance: 2000,
    },
    { speaker: null, text: "(A shift. The first of many…)" },
  ],
};

export default SCRIPT;

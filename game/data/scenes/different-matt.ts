import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "different-matt",
  title: "Different: Matt",
  location: "VoidScene",
  characters: ["matt"],
  ambientKey: "silence",
  initialLighting: { tint: "#7eb8c9", intensity: 0.2, transition: 800 },
  lines: [
    { speaker: null, text: "(Blackness. Then... Matt is illuminated.)" },
    // matt-mono-pillow
    { speaker: "matt", text: "I don't sleep well. Going to sleep is challenging and hard and complicated and not something that I feel like I'm ever ready for at all ever... Sleep that is..." },
    { speaker: "matt", text: "The only thing that makes me forget about everything else is my pillow. Yeah, I know right. My pillow. Every night my pillow turns into a person I snuggle when I go to sleep. Usually whichever person makes my heart drop at the moment. And I just pretend that I'm holding them. Or they're holding me. And sometimes I talk to them. And sometimes I kiss them." },
    { speaker: "matt", text: "I know it's embarrassing. I know I probably should keep this in. I know this is creepy, but maybe the kind of creepy that is kind of sweet. Okay. I'm coming clean. And this is so weird. But. Right now. The only person I can picture when I go to bed. Is... Quinn... It's like a ghost creeps into my bed at night, and all I can do is hug it. And just like that it's lights out." },
    // matt-mono-problem
    { speaker: null, text: "(...)" },
    { speaker: "matt", text: "Sometimes in the morning I have a little problem. I have a little problem on my pillow. I wake up and everything's wet. My mom tells me that the devil is possessing me in my sleep. And the people that can't fight him off are sinners. And God hates sinners. But I can't help it. It just happens. I can't make it stop. I want to make it stop. I think God hates me." },
    // matt-mono-crush
    { speaker: null, text: "(...)" },
    { speaker: "matt", text: "I think that maybe there might be some part of me that possibly likes guys as well as girls. And I ask God to forgive me for who I am every night before bed. Please Lord don't let me be gay. Please God I don't want to be a homosexual. I'm a good guy. I've just been having temptations. Indulgences. Bad indulgences. Please take them away from me." },
    { speaker: "matt", text: "I have a crush... on a guy. I don't want to like him. I don't want my stomach to turn everytime I see him. I'm not interested in sinning. I just can't help it. I love the way he stares at me, and when he says my name." },
    // matt-mono-reaction (authentic choice: he likes me back)
    { speaker: null, text: "(The player has been listening. Something about hearing this out loud.)" },
    // matt-mono-end
    { speaker: null, text: "(The light fades on Matt.)" },
    { speaker: null, text: "(Back to our regularly scheduled programming.)" },
  ],
};

export default SCRIPT;

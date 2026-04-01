import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "monologue-lucas",
  title: "Different 3: Spiderman and MJ",
  beats: [
    {
      id: "lucas-start",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Shift.)" },
        { speaker: null, text: "(Blackness. Then… LUCAS is illuminated.)" },
      ],
      nextBeat: "lucas-body-changing",
    },
    {
      id: "lucas-body-changing",
      location: "VoidScene",
      lines: [
        { speaker: "lucas", text: "My body is changing. And I'm excited. Not like excited in a weird way. But I got my first pube! Now I kinda want armpit hair??? I want my voice to be deep like Brent. I want my balls to drop. Bring it on." },
        { speaker: "lucas", text: "I'm young for my grade. I'm like kind of behind in… development. I'm a shrimp. What I'm trying to say is… I've got a tiny dick. My penis is a little bit small. I wasn't blessed with a girthy schlong. I don't know. It's hard to admit. The locker room is hell. School, in general, is hell. Life is hell." },
        { speaker: "lucas", text: "And, I get really scared because everyone around me is so much bigger than me, and I'm so much smaller. And I just have to close my mouth. Not talk. Be quiet. Everyone always says that. Everyone alway says that I'm quiet. They don't say that I'm mysterious. They don't say that I'm weird either. They just say I'm quiet. And, it's like well I can't help it that I've got a tiny dick." },
      ],
      nextBeat: "lucas-girls",
    },
    {
      id: "lucas-girls",
      location: "VoidScene",
      lines: [
        { speaker: "lucas", text: "And what sucks about being quiet is that no one talks to you. And what sucks about no one talking to you is that means girls especially don't talk to you." },
        { speaker: null, text: "(...)" },
        { speaker: "lucas", text: "Girls don't talk to me. They don't. And that sucks because I love girls. Girls are the best. They're just like—ugh—so amazing. I mean some guys don't even think that women deserve rights. But I'm not one of them. I'm like one of the three guys that believe in women rights. Because I'm such a nice guy." },
        { speaker: "lucas", text: "But women don't want nice guys. Women want guys with huge cocks that think they don't deserve rights. And it's like, god, why would you pick him when you could pick me? Pick me, please. I know my schlong is small, but I've got a good heart." },
      ],
      nextBeat: "lucas-serve",
    },
    {
      id: "lucas-serve",
      location: "VoidScene",
      lines: [
        { speaker: "lucas", text: "I just want to love a girl and tell her how perfect she is, while making sure she feels respected, and do that expecting nothing in return. Just be there for her. Serve her. Be her knight in shining armor. And part of me feels like I can't have that ever. Because of my tiny dick." },
        { speaker: "lucas", text: "I know that's a stupid thought for someone like me to have. My therapist said that I'm writing my ending before I've even begun. But it just feels like LOVE is not in the cards for me. And it just feels like I'm an unlovable piece of shit that's destined to be forever alone." },
        { speaker: "lucas", text: "AND IT JUST FEELS LIKE everyone was given some magic pill by some magic fairy that made their dick grow at ten times speed. And the magic fairy skipped my house. And that's why I'm so small. And weak. And unloveable." },
      ],
      nextBeat: "lucas-no-fairy",
    },
    {
      id: "lucas-no-fairy",
      location: "VoidScene",
      lines: [
        { speaker: "lucas", text: "But then I remember there are no magic fairies. Like there's no tooth fairy or no Easter Bunny or no Santa. And it turns out… I've just got a small dick. Like, I know in the long run I won't have to worry about this. It's how you use it. And everybody grows up, that's kind of like the whole thing. I have nothing to worry about. Right? Right?" },
        { speaker: "lucas", text: "UGH! I GO TO THE GYM!! I go to the gym three times a week with my dad. One time we were in the shower, and I saw his dick. It was an accident I swear. BUT… IT WAS THE BIGGEST MEATIEST GIRTHIEST SCHLONG I'VE EVER LAID EYES ON. SO I'M FINE? RIGHT? I'm fine. Right?" },
      ],
      nextBeat: "lucas-pussy",
    },
    {
      id: "lucas-pussy",
      location: "VoidScene",
      lines: [
        { speaker: "lucas", text: "Okay, I'll be honest. There's a lot of women who can do a lot better than me. But, I might not be cool, and I might not have swag. And I might have a tiny penis. But, I'm really nice. I'm a nice guy. One day I will get so much pussy. Because I'm a fucking nice guy. Like I think women should have rights. How many of us are there?" },
        { speaker: "lucas", text: "And like I'm probably gonna have a big dick. Unless I got my mom dicks genes. But I'm probably gonna have a big dick. Yeah, yeah, when I walk into a room people are gonna look at me and be like \"Holy shit that guy literally has the biggest cock I've ever seen.\" Just by looking at me. And I'm gonna be like \"who me?\" and they're gonna be like \"yeah you.\" And it's gonna be perfect." },
        { speaker: "lucas", text: "But until then I'm stuck waiting for my balls to drop." },
      ],
      nextBeat: "lucas-end",
    },
    {
      id: "lucas-end",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Shift.)" },
        { speaker: null, text: "(Back to normal.)" },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;

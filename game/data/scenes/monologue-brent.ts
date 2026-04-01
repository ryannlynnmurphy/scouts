import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "monologue-brent",
  title: "Different 8: The Bad Guy",
  beats: [
    {
      id: "brent-mono-start",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Blackness. Then… BRENT is illuminated.)" },
        { speaker: null, text: "(He's covered in blood.)" },
      ],
      nextBeat: "brent-mono-bad-guy",
    },
    {
      id: "brent-mono-bad-guy",
      location: "VoidScene",
      lines: [
        { speaker: "brent", text: "It's me!!!!! The bad guy!!!!!!! YOU THOUGHT I WAS DEAD??? MWAHAHAHAHAHAHA! I WILL NEVER DIE. I ALWAYS GET THE LAST WORD. HAHA COCKSUCKERS. I CAN STILL TEACH YOU ALL TO BE MEN. BECAUSE EVEN WHEN I DIE I'M STILL HERE." },
        { speaker: "brent", text: "Ready? OKAY. Ever since I was little it's been: Be a man. Be a man. Be a man. Be a man. Be a man. Men are rocks. Men are strong. Men are warriors. Men feel nothing." },
        { speaker: "brent", text: "And I don't cry. I don't cry. I don't cry. WHY THE FUCK WOULD I CRY???????? NOTHING. I FEEL NOTHING. I MEAN SOMETIMES I FEEL NOTHING. I was called down to the school counselor, and she asked if I cry. I don't cry. Obviously, I don't cry. Crying is for girls and for faggots. And I am not a girl, and I am not a faggot. She said she thinks I have \"depression.\" Like sadness but forever. I'm not sad. I swear. LIKE AT ALL. I'M A MAN. A MANLY MAN." },
      ],
      nextBeat: "brent-mono-dad",
    },
    {
      id: "brent-mono-dad",
      location: "VoidScene",
      lines: [
        { speaker: "brent", text: "I actually can remember the last time I cried. I'M NOT GONNA TELL YOU BECAUSE I'M LITERALLY NOT GOING TO TELL YOU. WHY THE FUCK WOULD I TELL YOU ABOUT MY EMOTIONS???? I DON'T HAVE EMOTIONS…" },
        { speaker: "brent", text: "I was five. My dad left us. Me and my mom. Like left us for good… I NEVER TALK ABOUT THIS SHIT. WHY THE FUCK AM I TALKING ABOUT THIS SHIT. WHY CAN'T I STOP TALKING ABOUT THIS SHIT? I HATE MY DAD. UGH! WE NEVER GOT TO PLAY CATCH OR GO TO A FOOTBALL GAME. HE DIDN'T GIVE ME MY FIRST BEER. BECAUSE HE WAS GONE." },
        { speaker: "brent", text: "I all but forgot about him to be honest. But one time we were fighting. ME AND MY MOM. CAUSE I FUCKING HATE MY MOM TOO. AND, I told her I didn't want to play football anymore. And she went fucking insane, crying about how I was a faggot. Crying about how I'm disappointing her. Crying about how I'm going to leave her just like my daddy." },
        { speaker: "brent", text: "AND I DON'T WANT TO END UP LIKE MY DAD. WHAT IF I'M JUST LIKE DAD? WHAT IF I'M JUST LIKE HIM? THAT'S NOT WHO I'M SUPPOSED TO BE." },
      ],
      nextBeat: "brent-mono-flowers",
    },
    {
      id: "brent-mono-flowers",
      location: "VoidScene",
      lines: [
        { speaker: "brent", text: "I've just been filled with all of these different opinions of who I can be or who I'm meant to be. And none of them are who I am. I DON'T THINK I LIKE WHO I AM. I like flowers. I like butterflies. I like mermaids. But I've just got to be this bullshit person." },
        { speaker: "brent", text: "God I wish I could just shed the bullshit and live, but I don't think I have that in me. My personality is built on a pile of fucking bullshit. And I tried to shovel through the bullshit and get to the core, but more and more bullshit just keeps getting piled on. So that's life. It's suffering. It's brutal." },
        { speaker: "brent", text: "But hey what can you do? I know what you can do. You can grab life by the balls and live. I'm trying to live. I'm trying to make it work. I'm trying. To. Grab it by the balls. But those balls are fucking slippery, and I keep losing my grip. It's like life's balls are hanging over a pit of despair, of nothingness." },
      ],
      nextBeat: "brent-mono-dont-cry",
    },
    {
      id: "brent-mono-dont-cry",
      location: "VoidScene",
      lines: [
        { speaker: "brent", text: "I don't cry. I'm sorry. BE A MAN. I'm sorry. I don't cry. I shouldn't be crying. I don't cry. I don't cry. I don't cry. BE A MAN. BE A MAN. BE A MAN. I DON'T CRY. Crying is for girls and for faggots. And I'm not a girl, and I'm not a faggot." },
        { speaker: "brent", text: "GOD I FUCKING HATE MYSELF. GOOD FUCKING GOD I HATE EVERYTHING ABOUT MYSELF… I'M GONNA TELL YOU A SECRET THAT LITERALLY NOBODY KNOWS. GOD WHY THE FUCK AM I DOING THIS? OKAY HERE IT GOES." },
        { speaker: "brent", text: "To be honest, I'm not sure if I even want to be a man. GOD WHAT THE FUCK. I CAN'T SAY THAT OUTLOUD. THAT'S LITERALLY MY WHOLE THING. MY WHOLE THING IS BEING A MAN. BUT LIKE TO BE HONEST I'M NOT SURE IF I EVEN WANT TO BE ANYTHING." },
        { speaker: "brent", text: "But I have to be something, right? I have to be somebody. I hate that I have to be somebody. If I had it my way I wouldn't be anything at all. But, I have to be a man. Because I have to." },
        { speaker: "brent", text: "Do I have to? Do I have to be a man? Do I have to?" },
      ],
      nextBeat: "brent-mono-final-choice",
    },
    {
      id: "brent-mono-final-choice",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(The question hangs in the dark. Simon hears it.)" },
        { speaker: null, text: "(Do I have to be a man?)" },
      ],
      choices: [
        {
          id: "brent-mono-no",
          text: "No.",
          type: "authentic",
          fractureDelta: -0.03,
          context: "safe",
          nextBeat: "brent-mono-end",
        },
        {
          id: "brent-mono-dont-know",
          text: "I don't know.",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "brent-mono-end",
        },
        {
          id: "brent-mono-silence",
          text: "(silence)",
          type: "deflect",
          fractureDelta: 0.00,
          context: "safe",
          nextBeat: "brent-mono-end",
        },
      ],
    },
    {
      id: "brent-mono-end",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(END PLAY.)" },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;

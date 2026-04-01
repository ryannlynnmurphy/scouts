import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "monologue-josh",
  title: "Different 4: Marines and Pizza",
  beats: [
    {
      id: "josh-start",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Shift.)" },
        { speaker: null, text: "(Blackness. Then… JOSH is illuminated.)" },
      ],
      nextBeat: "josh-eagle-scout",
    },
    {
      id: "josh-eagle-scout",
      location: "VoidScene",
      lines: [
        { speaker: "josh", text: "I need to be an eagle scout more than anything. My older brother is an eagle scout. My dad was an eagle scout. My Grandpa was an eagle scout. And so on and so on." },
        { speaker: "josh", text: "It's very important that I follow that path. I mean it's pretty much laid out for me. I was destined to follow in their footsteps. Become an eagle scout, join the military, find my wife, settle down, have kids, and the cycle repeats." },
        { speaker: "josh", text: "One day, I will be a Marine. My brother is a marine. My dad was a marine. My Grandpa was in the army because apparently they didn't have marines back then but according to my dad he was basically a marine. And my great-grandpa was also basically a marine and so on and so on. …They were marines so I have to be a marine… Right?" },
      ],
      nextBeat: "josh-pizza",
    },
    {
      id: "josh-pizza",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(...)" },
        { speaker: "josh", text: "I remember when I was in second grade I had to draw a picture of what I wanted to be when I grew up. I said I wanted to be one of those guys in the pizza place that makes the pizza, and they throw it above their head, and they catch it. They're so cool. And I really like pizza, the cheese, the crust, the tangy tomato sauce, I love tomato sauce, I really like tomatoes, something about them just feels so right to me, so perfect." },
        { speaker: "josh", text: "I brought the picture home to my dad, and he hated it. He told me right then and there \"SON, YOU'RE GOING TO BE A MARINE,\" and pretty much since then it's been that." },
      ],
      nextBeat: "josh-disappoint",
    },
    {
      id: "josh-disappoint",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(...)" },
        { speaker: "josh", text: "But, like I don't know. I don't wanna disappoint my dad, but like WHAT IF I DON'T WANT TO JOIN THE MILITARY, FIND MY WIFE, SETTLE DOWN, AND HAVE KIDS. TO BE HONEST, I DON'T LIKE BEING A BOY SCOUT. BUT MY DAD LIKES THAT I'M A BOY SCOUT." },
        { speaker: "josh", text: "And, Brent likes being a boy-scout. And I like Brent. He's just my guy OKAY!!!!??? Yes, he might be four years older than me or technically four and a quarter. BUT WE'RE REALLY CLOSE." },
      ],
      nextBeat: "josh-belt",
    },
    {
      id: "josh-belt",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(...)" },
        { speaker: "josh", text: "Sometimes I talk about Brent with my dad. And sometimes he takes out his belt. When I talk about Brent. And he, like, sometimes hits me with it. His belt. I mean that's like classic—textbook—abuse. Right? I think that's what it is. Or is it discipline?" },
        { speaker: "josh", text: "He always says a child needs to be disciplined. That his dad disciplined him. And his dad disciplined him. And so on and so on. So it's his duty. So, it's okay. Because I'm gonna be a marine, and marines need to be disciplined." },
      ],
      nextBeat: "josh-end",
    },
    {
      id: "josh-end",
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

import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "monologue-simon-sam",
  title: "Different 5: The Performance",
  beats: [
    {
      id: "simon-sam-start",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(SIMON is illuminated. He's been listening.)" },
        { speaker: "simon", text: "Hey, Sam…" },
        { speaker: "sam", text: "SIMON. HEY! HI. Um… what?" },
        { speaker: "simon", text: "I know I kind of intruded on your private moment." },
        { speaker: "sam", text: "Yeah you kind of did. No, it's fine… Totally cool like whatever. Like I get one moment alone and you're here. And that's fine. But like this is my moment. You know?" },
        { speaker: "simon", text: "I'm sorry. I think it's time." },
        { speaker: "sam", text: "For what?" },
      ],
      nextBeat: "simon-sam-like-guys",
    },
    {
      id: "simon-sam-like-guys",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Something stirs in Simon. He knows what this is.)" },
      ],
      choices: [
        {
          id: "simon-sam-like-guys-acknowledge",
          text: "I like guys. I like guys. I like guys.",
          type: "authentic",
          fractureDelta: -0.02,
          context: "safe",
          nextBeat: "simon-sam-performance",
        },
        {
          id: "simon-sam-like-guys-push-down",
          text: "I AM A GUY. And I'm secure in that.",
          type: "performed",
          fractureDelta: 0.02,
          context: "safe",
          nextBeat: "simon-sam-performance",
        },
        {
          id: "simon-sam-like-guys-confused",
          text: "That doesn't make me different, right?",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "simon-sam-performance",
        },
      ],
    },
    {
      id: "simon-sam-performance",
      location: "VoidScene",
      lines: [
        { speaker: "simon", text: "The gay shit?" },
        { speaker: "sam", text: "No…" },
        { speaker: "simon", text: "Yes…" },
        { speaker: "sam", text: "Okay…" },
        { speaker: "simon", text: "We shouldn't… Let's do it." },
        { speaker: "sam", text: "Okay — okay… The gay shit?" },
        { speaker: "simon", text: "The gay shit." },
        { speaker: null, text: "(A beat. Simon looks at Sam. Sam looks at Simon.)" },
        { speaker: "simon", text: "This is just one big performance, isn't it? All of it. The more you perform, the more you start to believe it." },
      ],
      nextBeat: "simon-sam-meta-choice",
    },
    {
      id: "simon-sam-meta-choice",
      location: "VoidScene",
      lines: [
        { speaker: "sam", text: "What do you mean?" },
      ],
      choices: [
        {
          id: "simon-sam-meta-lean-in",
          text: "\"The more you perform, the more you start to believe it. That's been the whole night. That's the whole point.\"",
          type: "authentic",
          fractureDelta: -0.01,
          context: "safe",
          nextBeat: "simon-sam-can-we",
        },
        {
          id: "simon-sam-meta-let-sam",
          text: "(Let Sam figure it out. Say nothing.)",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "simon-sam-can-we",
        },
        {
          id: "simon-sam-meta-gay-shit",
          text: "\"Can we just do the gay shit already?\"",
          type: "authentic",
          fractureDelta: -0.01,
          context: "safe",
          nextBeat: "simon-sam-can-we",
        },
      ],
    },
    {
      id: "simon-sam-can-we",
      location: "VoidScene",
      lines: [
        { speaker: "sam", text: "Can we please do the gay shit?" },
      ],
      choices: [
        {
          id: "simon-sam-gay-shit-hesitant",
          text: "\"I think--\"",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "simon-sam-they-gay-shit",
        },
        {
          id: "simon-sam-gay-shit-yes",
          text: "\"Yes.\"",
          type: "authentic",
          fractureDelta: -0.02,
          context: "safe",
          nextBeat: "simon-sam-they-gay-shit",
        },
        {
          id: "simon-sam-gay-shit-scared",
          text: "\"I'm scared.\"",
          type: "authentic",
          fractureDelta: -0.01,
          context: "safe",
          nextBeat: "simon-sam-they-gay-shit",
        },
      ],
    },
    {
      id: "simon-sam-they-gay-shit",
      location: "VoidScene",
      lines: [
        { speaker: "both", text: "The gay shit." },
        { speaker: null, text: "(THE GAY SHIT: A Like Story in Three Acts. For Simon.)" },
      ],
      nextBeat: "end",
    },
  ],
};

export default SCRIPT;

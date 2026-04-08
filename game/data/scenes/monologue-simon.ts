import { SceneScript } from "../types";

export const SCRIPT: SceneScript = {
  id: "monologue-simon",
  title: "Different 2: Dolphins and Faggots",
  beats: [
    {
      id: "simon-mono-start",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(Blackness. Then… SIMON is illuminated.)" },
      ],
      nextBeat: "simon-mono-dolphins",
    },
    {
      id: "simon-mono-dolphins",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "So I'm researching dolphins for science class, right? Because dolphins are my favorite animal. Well dolphins and mermaids. And butterflies are a close second. Or maybe would that be third. Whatever so, our teacher told us to research our favorite animal and while I wanted to do mermaids, unfortunately \"they don't actually exist.\" Like, okay??? Whatever…" },
        { speaker: "quinn", text: "So I'm researching dolphins for science class because I really like dolphins. And I think that it's okay for boys to like dolphins and mermaids and butterflies." },
      ],
      nextBeat: "simon-mono-dolphin-choice",
    },
    {
      id: "simon-mono-dolphin-choice",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "Okay? I think it's fine that when I go swimming I like to put my legs together and flip them around like they're a mermaid tail. I think that it's fine for me to do that. Because I like mermaids. Okay? And it's okay for boys to like mermaids. SO WHATEVER RIGHT." },
      ],
      choices: [
        {
          id: "simon-mono-dolphins-own-it",
          text: "I think it's okay. Full stop. I'm not apologizing for this.",
          type: "authentic",
          fractureDelta: -0.02,
          context: "safe",
          nextBeat: "simon-mono-tote-bag",
        },
        {
          id: "simon-mono-dolphins-qualify",
          text: "I mean, whatever. It's fine. It's not like I care that much.",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "simon-mono-tote-bag",
        },
        {
          id: "simon-mono-dolphins-skip",
          text: "(skip ahead -- don't dwell on this)",
          type: "performed",
          fractureDelta: 0.03,
          context: "safe",
          nextBeat: "simon-mono-truck",
        },
      ],
    },
    {
      id: "simon-mono-tote-bag",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "I'm researching dolphins for science class, and I checked out a bunch of books from the library. The librarian asked me, \"would you like a bag?\" I checked out like six books. I couldn't carry them all. Of course, I said yes. I was being practical." },
        { speaker: "quinn", text: "She gave me my books in this little tote bag. I think it's very cool. And, I was carrying the tote to school because I needed my books for science class, and they wouldn't fit in my backpack." },
        { speaker: "quinn", text: "And, I'm on my morning walk to school, and these guys passed me. It was this big red truck. There was a bunch of older boys, and they screamed out the window \"FAGGOT.\"" },
      ],
      nextBeat: "simon-mono-faggot-choice",
    },
    {
      id: "simon-mono-truck",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "And, I'm on my morning walk to school, and these guys passed me. It was this big red truck. There was a bunch of older boys, and they screamed out the window \"FAGGOT.\"" },
      ],
      nextBeat: "simon-mono-faggot-choice",
    },
    {
      id: "simon-mono-faggot-choice",
      location: "VoidScene",
      lines: [
        { speaker: null, text: "(...)" },
      ],
      choices: [
        {
          id: "simon-mono-faggot-am-one",
          text: "And listen, I think I am a faggot. It's true. I think I'm gay.",
          type: "authentic",
          fractureDelta: -0.03,
          context: "safe",
          nextBeat: "simon-mono-strawberry",
        },
        {
          id: "simon-mono-faggot-doesnt-bother",
          text: "They screamed FAGGOT. But whatever. It doesn't bother me.",
          type: "performed",
          fractureDelta: 0.04,
          context: "safe",
          nextBeat: "simon-mono-strawberry",
        },
        {
          id: "simon-mono-faggot-dont-think",
          text: "They screamed FAGGOT. I don't want to think about it.",
          type: "deflect",
          fractureDelta: 0.02,
          context: "safe",
          nextBeat: "simon-mono-hallways",
        },
      ],
    },
    {
      id: "simon-mono-strawberry",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "And listen, I think I am a faggot. It's true. I think I'm gay. And not only am I gay, I'm the kind of gay that people call \"faggot\". I'm a fruit. And not only am I a fruit, I'm a strawberry." },
        { speaker: "quinn", text: "Some gay people are like tomatoes. You don't really think that they're a fruit, and then one day someone is like, \"No you wouldn't think so but really they're a fruit.\" And you're like \"you know what that does makes sense, they do have seeds.\" But no. Me. I'm a strawberry. Everyone knows I'm a fruit. In fact when you think about fruits, I'm probably what comes to mind." },
      ],
      nextBeat: "simon-mono-strawberry-choice",
    },
    {
      id: "simon-mono-strawberry-choice",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "I wish I could just be a tomato, so the guys at school wouldn't pick on me." },
      ],
      choices: [
        {
          id: "simon-mono-strawberry-embrace",
          text: "But I'm a strawberry. And I guess that's just who I am.",
          type: "authentic",
          fractureDelta: -0.03,
          context: "safe",
          nextBeat: "simon-mono-secret",
        },
        {
          id: "simon-mono-strawberry-tomato",
          text: "I wish I was a tomato. I really do.",
          type: "deflect",
          fractureDelta: 0.02,
          context: "safe",
          nextBeat: "simon-mono-secret",
        },
        {
          id: "simon-mono-strawberry-no-fruit",
          text: "I don't want to be any kind of fruit. I don't want any of this.",
          type: "performed",
          fractureDelta: 0.04,
          context: "safe",
          nextBeat: "simon-mono-secret",
        },
      ],
    },
    {
      id: "simon-mono-secret",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "By the way, please don't tell anyone I told you. I'm not ready to tell people yet. No one knows but it feels like everyone does. I don't know how. I mean regular kids don't get called \"fag\" for walking down the street with a bag. Oooo that rhymed, I'm a poet and I didn't even know it... Anyways, so, whatever, right." },
      ],
      nextBeat: "simon-mono-hallways",
    },
    {
      id: "simon-mono-hallways",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "Now, I walk down the hallways and think \"Ooo maybe I should walk different. I'm walking like a fag.\" \"Why are you moving your hips like that, faggot?\" \"Why are you moving your arms like that, faggot.\" \"Hey faggot. No one wants you to act like that. No one wants you to be yourself.\"" },
        { speaker: "quinn", text: "…I wish I could just be myself. You know everyone keeps saying, just be yourself. Be yourself!" },
        { speaker: "quinn", text: "Who is \"yourself?\"" },
      ],
      nextBeat: "simon-mono-yourself-choice",
    },
    {
      id: "simon-mono-yourself-choice",
      location: "VoidScene",
      lines: [
        { speaker: "quinn", text: "I thought I was being myself. Am I not being myself enough for you? I can be more myself. If that's what you want. Do you want that? I don't think people like when I act how I want to act. Or maybe I don't like how I act? How am I supposed to act how I want to act if I don't like how I act?" },
      ],
      choices: [
        {
          id: "simon-mono-yourself-was-being",
          text: "I thought I was being myself. That should be enough.",
          type: "authentic",
          fractureDelta: -0.02,
          context: "safe",
          nextBeat: "simon-mono-end",
        },
        {
          id: "simon-mono-yourself-can-be-more",
          text: "I can be more myself. If that's what you want.",
          type: "performed",
          fractureDelta: 0.03,
          context: "safe",
          nextBeat: "simon-mono-end",
        },
        {
          id: "simon-mono-yourself-different",
          text: "I guess how I act is different from being myself. Who knew?",
          type: "deflect",
          fractureDelta: 0.01,
          context: "safe",
          nextBeat: "simon-mono-end",
        },
      ],
    },
    {
      id: "simon-mono-end",
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

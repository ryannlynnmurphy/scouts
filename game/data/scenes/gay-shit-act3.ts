import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "gay-shit-act3",
  title: "Gay Shit Act Three: The Stars",
  location: "LakeScene",
  characters: ["quinn", "matt"],
  ambientKey: "lake",
  initialLighting: { tint: "#2233aa", intensity: 0.2, transition: 1500 },
  lines: [
    // act3-start
    { speaker: null, text: "(Act Three...)" },
    { speaker: null, text: "(They're on a rock overlooking the lake. Matt and Quinn are looking at the stars.)" },
    { speaker: "matt", text: "..." },
    { speaker: "quinn", text: "..." },
    { speaker: "matt", text: "I like looking at the stars." },
    { speaker: "quinn", text: "Yeah they're beautiful." },
    { speaker: "matt", text: "Yeah." },
    { speaker: "quinn", text: "There's something about the stars that makes me feel free. Like I could look up at them and be lost in them forever." },
    { speaker: null, text: "(Matt looks over at Quinn, really taking him in.)" },
    { speaker: "matt", text: "..." },
    { speaker: "quinn", text: "..." },
    { speaker: "matt", text: "I like looking at the stars with you." },
    { speaker: "quinn", text: "..." },
    { speaker: "matt", text: "Do you wanna play a game?" },
    { speaker: "quinn", text: "Sure." },
    { speaker: "matt", text: "Okay... let's play... sure. Haha. I spy with my little eye. Something... blue." },
    // authentic choice: my eyes
    { speaker: "quinn", text: "Is it my eyes?" },
    // act3-spy-yes
    { speaker: "matt", text: "..." },
    { speaker: "matt", text: "Yeah." },
    { speaker: "quinn", text: "..." },
    // act3-your-turn
    { speaker: "matt", text: "Your turn." },
    { speaker: "quinn", text: "I spy with my little eye... something pink." },
    { speaker: "matt", text: "Oh. Is it? Hmm..." },
    { speaker: "quinn", text: "Come on." },
    { speaker: "matt", text: "What's pink?" },
    // authentic choice: your lips
    { speaker: "quinn", text: "Your lips..." },
    // act3-after-lips
    { speaker: "matt", text: "..." },
    // act3-choice48 (normal path, no exposure)
    // authentic choice: kiss as joke again
    { speaker: "quinn", text: "Do you wanna kiss as a joke again?" },
    // act3-not-a-joke
    { speaker: "matt", text: "It could not be a joke if you don't want it to be a joke." },
    { speaker: "quinn", text: "Yeah I never really thought it was a joke to begin with." },
    { speaker: "matt", text: "But that doesn't make me gay." },
    { speaker: "quinn", text: "Oh heavens no. Me neither." },
    { speaker: "matt", text: "No, because you're like the girl in the relationship, and I'm like the guy in the relationship." },
    // authentic choice: relationship?
    { speaker: "quinn", text: "Relationship?" },
    // act3-girl-elaboration
    { speaker: "matt", text: "Like. Um. No, you're just like a girl. And I'm just like the guy. That's all I'm saying." },
    { speaker: "quinn", text: "You're confusing me." },
    { speaker: "matt", text: "No. Whatever. I'm just saying that you're like a girl. That's all. I don't know you're kinda like a girl. It's not a bad thing." },
    { speaker: "quinn", text: "I know it's not a bad thing. I know. What do you mean I'm like a girl?" },
    { speaker: "matt", text: "Like, I don't know, you always hang out with girls. You walk like a girl. You smell like a girl. You're pretty feminine." },
    { speaker: "quinn", text: "So what?" },
    { speaker: "matt", text: "Last year at lunch you sat at a table with only girls." },
    { speaker: "quinn", text: "Soooooo, that doesn't make me a girl." },
    { speaker: "matt", text: "I'm just saying you act like a girl." },
    { speaker: "quinn", text: "What does that even mean?" },
    { speaker: "matt", text: "No, it's fine. I'm not saying it's a bad thing." },
    { speaker: "quinn", text: "I'm a boy. Boys can't be girls, Matt." },
    { speaker: "matt", text: "(don't you dare take a beat) But you're my girl." },
    { speaker: null, text: "(This washes over Quinn like an amazing dream and terrible nightmare all at once.)" },
    { speaker: "quinn", text: "..." },
    { speaker: "matt", text: "Are you okay?" },
    { speaker: "quinn", text: "I'm okay." },
    { speaker: "matt", text: "You don't look okay." },
    { speaker: "quinn", text: "You're confusing me. I'm confused." },
    { speaker: "matt", text: "What?" },
    { speaker: "quinn", text: "Don't tell me I'm a girl." },
    { speaker: "matt", text: "Why not?" },
    { speaker: "quinn", text: "Because I think that -- um. I don't know. It makes me feel things. Things that I've never felt." },
    { speaker: "matt", text: "Is that bad?" },
    { speaker: "quinn", text: "I don't know if I want to feel things." },
    { speaker: "matt", text: "Why not?" },
    { speaker: "quinn", text: "Because I don't know if I can trust these feelings." },
    { speaker: "matt", text: "Feelings are good. It means you're alive." },
    { speaker: "quinn", text: "It just confuses me, okay?" },
    { speaker: "matt", text: "It's okay to be confused." },
    { speaker: "quinn", text: "Well it's also confusing to be confused." },
    { speaker: "matt", text: "QUINN! What are you confused about?" },
    // authentic choice: begin monologue (follow all "continue" paths)
    { speaker: "quinn", text: "Do you ever feel like you don't know who you are?" },
    // act3-monologue-performing
    { speaker: "quinn", text: "Do you ever feel like you don't know who you are? Like, I feel like I'm constantly... putting on a show. Performing. I like to invent new parts of myself. Like I feel like I can't be who I am. So I just copy the people around me. And usually I slowly realize that I hate that part of myself that I copied because more often than not I invented it because I want people to like me. Like I have to prove something. To somebody. Like anyone cares who I am. I just feel incomplete. Like a piece of me hasn't fallen into place yet." },
    { speaker: "matt", text: "..." },
    // [Continue] -> act3-monologue-not-boy
    { speaker: "quinn", text: "Part of me feels like I'm not a boy. And I don't know why I think this. But like, why would I want to be a boy? Like they are so gross and so brutal and so gross and disgusting. No offense. But, I don't want to be associated. Thank you very much." },
    { speaker: "matt", text: "..." },
    // [Continue] -> act3-monologue-like-girls
    { speaker: "quinn", text: "I wish I could be a girl. It's not like \"I want to be a girl.\" More like I wish boys could be more like girls. Like I'm always told like \"you cry like a girl, you run like a girl, you're acting like a girl right now.\" What if I don't care about being like a girl? What if I'm fine with being a girl because I like girls? What's wrong with girls?" },
    { speaker: "matt", text: "..." },
    // [Continue] -> act3-monologue-maybe-girl
    { speaker: "quinn", text: "... I don't think that I'm a boy... maybe I think that maybe I'm not a boy. Maybe I think I'm a girl. I don't know. I see a girl, and I immediately fall in love with her. No matter who it is. No matter how she looks. It's not like a love love. Like I'm not attracted to them. I just, more so, want to be them. No, I'm not in love with them. I definitely like boys that I know." },
    { speaker: "matt", text: "..." },
    // [Continue] -> "Can I please be your girl?"
    // act3-monologue-your-girl
    { speaker: "quinn", text: "I like you, Matt." },
    { speaker: "matt", text: "I like you too, Quinn." },
    { speaker: null, text: "(They kiss. They laugh.)" },
    // authentic choice: I like you Matt
    // act3-end
    { speaker: null, text: "Back to our regularly scheduled programming." },
    { speaker: null, text: "(The world completely falls away.)" },
    { speaker: null, text: "(There's flickering.)" },
    { speaker: null, text: "(THIS IS NORMAL! THIS IS NORMAL!)" },
    { speaker: null, text: "(Then light.)" },
    { speaker: null, text: "(Stars, crickets, and perhaps a change of tune.)" },
  ],
};

export default SCRIPT;

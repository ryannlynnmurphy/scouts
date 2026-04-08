import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "scene1-pickup-lines",
  title: "Scene One: Pickup Lines",
  location: "CampfireScene",
  characters: ["quinn", "matt", "brent", "josh", "lucas", "noah"],
  ambientKey: "forest",
  initialLighting: { tint: "#334422", intensity: 0.15, transition: 1000 },
  lines: [
    // === PICKUP LINES ===
    { speaker: "lucas", text: "GIRLS!!!!" },
    { speaker: "quinn", text: "Girls?" },
    { speaker: "brent", text: "GIRLS!!!!! Girls are a big part of being a man. It's crucial to know how to treat them. What they are. And what their purpose is. So I brought a little prop..." },
    { speaker: null, text: "(Brent reaches back into the cooler. He has an inflatable sex doll that has yet to be blown up.)" },
    { speaker: "brent", text: "Boys, this is a woman." },
    // pickup-not-a-woman
    { speaker: "lucas", text: "That is not a woman." },
    { speaker: "brent", text: "Might as well be." },
    { speaker: "lucas", text: "How are you going to tell us how to deal with women without any women here?" },
    // pickup-cant-listen (authentic choice: agree with Lucas)
    { speaker: "lucas", text: "You can't listen to a sex doll. They can't talk." },
    { speaker: "josh", text: "And it's better that way." },
    { speaker: "brent", text: "No, Ethan. Precisely, Josh. Wrong, Lucas." },
    { speaker: "lucas", text: "I just think that you should listen to women, and then tell us what they think." },
    { speaker: "brent", text: "LISTEN? TO WOMEN?" },
    { speaker: "lucas", text: "Like, what gives you the authority to do this?" },
    // pickup-serving-women
    { speaker: "brent", text: "I FUCK. I FUCK HARD. I HAVE LIKE SIX BODIES." },
    { speaker: null, text: "(Brent hands the sex doll to Lucas. He blows it up.)" },
    { speaker: "brent", text: "Now I must know what being a man means to you." },
    { speaker: "lucas", text: "Ummmmm..." },
    { speaker: "brent", text: "Um..." },
    { speaker: "lucas", text: "I think it's about serving women." },
    // pickup-lucas-serve
    { speaker: "brent", text: "WHAT?!!?!?!??!?!?!!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!??" },
    { speaker: "lucas", text: "Like we--humans--were put on this planet to make more of us. And my mommy says that only women have the power to make more of us. So since women have the power to make more and more of us then men are really only here to make sure they do. To serve them." },
    { speaker: "brent", text: "That is the biggest load of bullshit I've ever heard." },
    // pickup-lucas-pushback (authentic choice: back Lucas)
    { speaker: "lucas", text: "What woman wouldn't want men to serve them?" },
    { speaker: "brent", text: "Uh... the hot ones." },
    { speaker: "brent", text: "Women, well at least hot women, want to serve MEN with their ass and titties. Remember that boys. They don't want a bitch boy that brings them flowers and writes them poetry." },
    { speaker: null, text: "(Quinn breaks open the bag of marshmallows.)" },
    { speaker: "lucas", text: "WOAH, I think women want men to respect them, and then in return for respecting them, we can get the privilege of wrecking their pussies." },
    // pickup-lucas-respect
    { speaker: "brent", text: "Men are not here to serve women. I truly believe that it's a woman's duty to make sure that men thrive." },
    { speaker: null, text: "(Quinn begins to offer the marshmallows to the boys.)" },
    { speaker: "lucas", text: "Okay and I truly believe that that's your opinion, and I respect your right to have an opinion... even if it's a wrong opinion." },
    { speaker: "brent", text: "Did you just say that my opinion was wrong?" },
    { speaker: "lucas", text: "I don't even know what \"implied\" means." },
    // pickup-lines-go
    { speaker: null, text: "(The sex doll has been blown up. Quinn gets the marshmallows back, eats a handful, and puts them away.)" },
    { speaker: "brent", text: "I'VE WRECKED WAY MORE PUSSY THAN YOU, BITCH. SO I AM MORE OF A MAN. SO LISTEN THE FUCK UP. We're going to do a little bit of practice." },
    { speaker: "brent", text: "PICKUP LINES LET'S GO! JOSH YOU START." },
    { speaker: "josh", text: "HEy sExy mama. Would you like to go on a date?" },
    { speaker: "brent", text: "\"HEy sExy mama. Would you like to go on a date?\"... GAYYYYYY. First rule of dating women: never ask a girl on a date until you have her wrapped around your finger. We're strictly trying to get these women to bed." },
    // pickup-noah-turn
    { speaker: null, text: "(He shoves the sex doll in Noah's face.)" },
    { speaker: "noah", text: "Um... Are you from Tennessee? Because you're the only ten I see." },
    { speaker: "brent", text: "BORING. OVERUSED. LAME. AND GAY. I personally like to go straight in for an ass or titties compliment. Based on what is bigger. Try." },
    { speaker: "noah", text: "Right. Um... Are you from Tennessee? Because you have really big tits." },
    { speaker: "brent", text: "PERFECT. CHARMING. I'D MELT! JOSH TAKE NOTES. LUCAS WHAT DO YOU GOT?" },
    // pickup-lucas-turn
    { speaker: "lucas", text: "Um... I saw you from across the bar and I just wanted to say that you look like you have a million things going on in your mind. I like that. I like it when women have huge minds. I'd love to crack open your skull and explore your mind. And respect you." },
    { speaker: "brent", text: "Okay. Lucas. You're being a certified homo right now. You didn't mention ass or tits. You just talked about her mind. What woman wants you to \"explore her mind?\"" },
    { speaker: "lucas", text: "You've never wanted to explore the mind of a woman?" },
    { speaker: "brent", text: "No. Faggot. Do better. You missed the two bases. Ass and tits." },
    { speaker: "lucas", text: "I don't think we should be reducing women to ass and tits." },
    { speaker: "brent", text: "WHAT ELSE IS THERE? HUH? THERE'S CERTAINLY NOTHING INTERESTING ABOUT THEIR MINDS. SO GO AGAIN. AGAIN." },
    // pickup-lucas-recover
    { speaker: "lucas", text: "Hey. I saw you across the bar. And I just wanted to say. I want to explore... your ass. And your mind. And yeah." },
    { speaker: "brent", text: "You can still recover. DROP THE MIND. LET'S GO." },
    { speaker: null, text: "(using the sex doll as a puppet of a woman) \"Ohh... what else would you like to explore?\"" },
    { speaker: "lucas", text: "I also would like to explore your tits and FUCK YOUR BRAIN." },
    { speaker: "brent", text: "SKULL FUCKING, I LOVE IT. Perfect. Great adjustment." },
    // pickup-quinn-turn
    { speaker: "noah", text: "Hey. I like you. And your ass and titties." },
    { speaker: "brent", text: "Close. Good. Could be better. Men are not vulnerable. We're stoic, straight-faced. No emotions required." },
    { speaker: "brent", text: "QUINN. YOUR TURN." },
    { speaker: null, text: "(Brent shoves the sex doll in Quinn's face.)" },
    // authentic choice: genuine pickup line
    { speaker: "quinn", text: "Hey how are you? I'd like to get to know you better..." },
    // pickup-quinn-bases
    { speaker: "brent", text: "Bases. I don't have all day." },
    // clever deflection
    { speaker: "quinn", text: "I like to squeeze things." },
    // pickup-brent-impressed
    { speaker: "brent", text: "Wow, Quinn I'm impressed. I didn't think the word tits could come out of your mouth without you throwing up." },
    { speaker: "quinn", text: "You'd be surprised." },
    // pickup-josh-reaction
    { speaker: "brent", text: "Okay. And finally Josh. Joshie-poo. Show them how it's done." },
    { speaker: "josh", text: "HEY YOU MOUTH BREATHING SLUT. I LOVE TO STICK MY PENIS IN YOUR PUSSY AND BETWEEN YOUR BOOBS AND IN YOUR GLORIOUS, GLORIOUS BEHIND." },
    { speaker: "brent", text: "WOW." },
    { speaker: "josh", text: "Was I good?" },
    { speaker: "brent", text: "GOOD? YOU WERE PHENOMENAL." },
    // authentic choice: cringe visibly
    // pickup-josh-disgust
    { speaker: null, text: "(Look at Matt. He looks back. A shared look.)" },
    { speaker: "brent", text: "Boys, you should all be looking up to Josh right now. He's starting to get what I mean by being a man." },

    // === RESISTANCE (merged from scene1-resistance.ts) ===
    // resistance-start
    { speaker: "noah", text: "Brent um -- ... I just think that --" },
    { speaker: null, text: "(he makes a decision)" },
    { speaker: "noah", text: "I don't think that's right, Brent." },
    { speaker: "brent", text: "You don't think I'm right?" },
    { speaker: "noah", text: "No. I don't." },
    { speaker: "brent", text: "YOU THINK I'M WRONG. ONE THING YOU MUST LEARN BOYS IS THAT MEN ARE NEVER WRONG." },
    // resistance-noah-fight
    { speaker: "noah", text: "I -- also -- don't -- think -- that's -- true, Brent." },
    { speaker: "brent", text: "Ugh. You guys are impossible. You don't know jack-shit about being a man." },
    { speaker: "noah", text: "AND YOU DO...?" },
    { speaker: "brent", text: "YES. YES. I DO." },
    { speaker: "noah", text: "I DON'T THINK YOU DO." },
    { speaker: "brent", text: "WELL I THINK I DO KNOW WHAT IT MEANS TO BE A MAN SO SUCK ON MY BALLS." },
    // resistance-noah-balls
    { speaker: "noah", text: "WHY DON'T YOU SUCK ON MY BALLS. YOU'VE JUST BEEN SPOUTING FUCKING BULLSHIT ABOUT SUPRESSING YOUR FEELINGS AND BEING A STOIC ASSHOLE PIECE OF SHIT THAT NO WOMAN WOULD EVER WANT TO FUCK." },
    { speaker: "lucas", text: "Yeah." },
    { speaker: "brent", text: "Personally I think that being a stoic asshole piece of shit will get me plenty of pussy. You imbecile." },
    { speaker: "josh", text: "He's doing us a favor. How could you be so ungrateful?" },
    // authentic choice: join resistance
    { speaker: "quinn", text: "There's no one right way to be a man, Brent." },
    // resistance-join-path
    { speaker: "noah", text: "I never asked you for a fucking favor. If I wanted a fucking favor from you, Brent, I would ask you for a fucking favor. But I did not ask, and I want to go to bed." },
    { speaker: "lucas", text: "Gottem." },
    { speaker: "brent", text: "Wow, Noah, if I knew you felt this way I would have never invited you to the woods." },
    { speaker: "noah", text: "You told us we'd be making s'mores and sitting around a campfire. And there have been no s'mores and no campfire. And I'm fucking cold. Come on guys? Do you really want to be here right now?" },
    { speaker: "quinn", text: "I want s'mores." },
    // resistance-no-right-way
    { speaker: "lucas", text: "And I'm tired." },
    { speaker: "noah", text: "Listen this has been great Brent, but I'm not having fun anymore." },
    { speaker: "brent", text: "Wow, Mr. Metaphorical Balls, I thought we had something." },
    { speaker: "noah", text: "There's no one right way to be a man, Brent." },
    { speaker: "brent", text: "EEEEEEANNNNNNNNT. WRONG. That's where you're wrong, Noah. There is a right way. And I will teach you." },
    // resistance-how-would-you
    { speaker: "noah", text: "I don't think you can teach anyone how to be a man." },
    { speaker: "brent", text: "How would you know?" },
    { speaker: "noah", text: "How would YOU know?" },
    { speaker: "brent", text: "Because I fucking know. I fucking know." },
    { speaker: "josh", text: "He fucking knows." },
    { speaker: "brent", text: "You guys are really pressing me on this, Jesus Christ." },
    // resistance-lucas-intervenes
    { speaker: "lucas", text: "Yeah, why shouldn't we?" },
    { speaker: "brent", text: "Hey Lucas. SHUT THE FUCK UP. THIS IS BETWEEN ME AND NOAH. ME AND NOAH." },
    { speaker: "lucas", text: "Brent, what is going on in your head. You can't be well." },
    { speaker: "brent", text: "The fuck did you just say?" },
    { speaker: "lucas", text: "Brent, do you want to talk about something?" },
    { speaker: "noah", text: "You seem to be going through something. Something bad." },
    // resistance-therapist
    { speaker: "matt", text: "Mhm." },
    { speaker: "lucas", text: "I can give you my therapist's number." },
    { speaker: "brent", text: "Real men don't go to therapy." },
    { speaker: "josh", text: "YEAH." },
    { speaker: "brent", text: "They bottle up their feelings and take it out on women." },
    // authentic choice: therapist solidarity
    { speaker: "quinn", text: "I can give you mine too." },
    // resistance-rant
    { speaker: "lucas", text: "But like I'm just saying, do you want to talk about something?" },
    { speaker: "noah", text: "We're just reaching out here, bud." },
    { speaker: "brent", text: "No. I don't want to talk about anything. Oh my god, you guys are the worst. \"Do I want to talk about something?\" Like talking about anything is going to fucking fix my problems. Not that I have problems, I don't have problems." },
    { speaker: "brent", text: "But if I did have problems talking about them would not fix them. If I talked about my problems, my problems that I don't have, it wouldn't fix my problems, I would have just talked about them. And what's the use in talking about my problems if it's not going to fix them?" },
    // resistance-rant-internal
    { speaker: "brent", text: "SO, NO I DON'T HAVE ANY FUCKING PROBLEMS, AND IF YOU ASK ABOUT MY FUCKING PROBLEMS AGAIN I'M GOING GRAB YOU BY THE NECK AND PUT YOUR SPLEEN WHERE YOUR ASS IS." },
    // resistance-clear
    { speaker: "brent", text: "DO I MAKE MYSELF CLEAR?" },
    // resistance-threat (skipping suspicion gate, going to default low-suspicion path)
    { speaker: "brent", text: "Good. Now. Keep it moving." },
  ],
};

export default SCRIPT;

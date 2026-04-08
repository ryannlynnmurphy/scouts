import { CinematicScene } from "../types";

export const SCRIPT: CinematicScene = {
  id: "ceremony",
  title: "The Ceremony",
  location: "CampfireScene",
  characters: ["quinn", "matt", "brent", "josh", "lucas", "noah"],
  ambientKey: "forest",
  initialLighting: { tint: "#334422", intensity: 0.15, transition: 1000 },
  lines: [
    // ceremony-start
    { speaker: "brent", text: "CAN YOU GUYS STOP BEING FAGGOTS? JESUS CHRIST. I AM THE ONLY ONE AT THIS GODDAMN BOY SCOUT CAMP AND POSSIBLY THE WORLD, WHO CAN SHOW YOU WHAT IT MEANS TO BE A MAN. SO IF YOU WOULD ALL JUST LISTEN TO ME, THAT WOULD BE GREAT." },
    { speaker: "lucas", text: "Jesus Christ, chill the fuck out." },
    { speaker: "brent", text: "I AM THE ALPHA. YOU WILL LISTEN." },
    { speaker: "josh", text: "YEAH LISTEN TO HIM." },
    // authentic choice: how many times
    { speaker: "quinn", text: "How many fucking times are you going to say that?" },
    // ceremony-pickup-2
    { speaker: "brent", text: "Matt? Quinn? Pick up lines?" },
    { speaker: null, text: "(Brent shoves the sex doll in Matt's face.)" },
    { speaker: "matt", text: "You're my girl." },
    { speaker: "brent", text: "Aw that's sweet. But remember the bases." },
    { speaker: "matt", text: "You're my girl... and I like your ass." },
    { speaker: "brent", text: "Men don't like things that are nice and cute. We like huge things. NEXT. QUINN WHAT DO YOU GOT FAGGOT?" },
    // ceremony-quinn-pickup-2
    { speaker: "quinn", text: "Um... hey how are you?" },
    { speaker: "brent", text: "Bases." },
    { speaker: "quinn", text: "Bases. Right bases." },
    { speaker: "brent", text: "I don't have all day." },
    // performed choice: scripted line
    { speaker: "quinn", text: "Um... hey how are you? I'd like to get to know you better? And your ass and tits..." },
    // ceremony-brent-impressed-2
    { speaker: "brent", text: "Wow, Quinn I'm impressed. I didn't think the word tits could come out of your mouth without you throwing up." },
    { speaker: "quinn", text: "You'd be surprised." },
    // ceremony-josh-2
    { speaker: "brent", text: "Okay. And finally Josh. Joshie-poo. Show them how it's done." },
    { speaker: "josh", text: "HEY YOU MOUTH BREATHING SLUT. I LOVE TO STICK MY PENIS IN YOUR PUSSY AND BETWEEN YOUR BOOBS AND IN YOUR GLORIOUS, GLORIOUS BEHIND." },
    { speaker: "brent", text: "GOOD? YOU WERE PHENOMENAL. Boys, you should all be looking up to Josh right now." },
    { speaker: "noah", text: "Um, Brent? Why do you care so much about being a man?" },
    { speaker: "quinn", text: "It scares me." },
    // ceremony-why-care
    { speaker: "brent", text: "Why do I care? WHY DO I CARE? Because if I'm not a man then what am I? If I'm not a man I can't live. If I'm not a man I can't face my day." },
    { speaker: "lucas", text: "You should work on that in therapy." },
    { speaker: "brent", text: "THERAPY IS FOR FAGGOT CRY-BABIES WHO LIKE TO taLk AbOuT ThEiR pRobLemS. I'm immune to problems boys. That's what being a man taught me." },
    { speaker: "matt", text: "Well that's bullshit." },
    { speaker: "brent", text: "You're bullshit." },
    // ceremony-brent-rant-2
    { speaker: "matt", text: "What's so great about being a man, Brent? Huh, what makes it so great, tough guy?" },
    { speaker: "brent", text: "Being a man is recognizing that life is brutal. It's one pitfall after another. So you become a big strong man. Be a big strong man. Face challenges head on. Be strong at all times. Recognize that vulnerability is a weakness. Be the alpha. Don't be a victim of your circumstances." },
    { speaker: "brent", text: "REMEMBER TO POSTURE AND YOUR BRAVADO. HAVE SOCIAL DOMINANCE. HAVE SEXUAL PROWESS. PROTECT YOUR HONOR. BE VIOLENT. VIOLENCE IS MANLY. CHASE DANGER. DANGER IS MANLY. DON'T FEEL. TONIGHT YOU WILL BECOME A MAN." },
    // ceremony-lineup
    { speaker: null, text: "BOYS: WHAT? / I DON'T REALLY WANNA DRINK CUM, BRENT. / DO WE HAVE TO DO THIS? / CAN'T I GO TO BED?" },
    { speaker: "brent", text: "NO QUESTIONS. NO FAILURE. NO UNKNOWN. BECAUSE WHERE THERE IS UNKNOWN THERE IS DOUBT, AND YOU SHOULDN'T LET ANYONE DOUBT YOU EVER." },
    { speaker: "matt", text: "He's crazy." },
    { speaker: "quinn", text: "Was he talking about drinking cum?" },
    { speaker: "brent", text: "...SO YOU WILL NOT QUESTION ME. DO NOT QUESTION ME... LINE UP." },
    // ceremony-pushups
    { speaker: null, text: "(The boys jump to the ground doing push ups. They count out loud.)" },
    { speaker: "brent", text: "DO NOT QUESTION ME. Now boys. Tonight I will be leading you in a ceremony created by yours truly. Men now-a-days are marginalized. Men now-a-days are oppressed. Men now-a-days are told to shrink ourselves. They say that our masculinity is toxic. But not me. Not you either." },
    { speaker: "brent", text: "We will be men, goddammit. Men of dignity and strength and virtue. WE WILL BE ALPHAS. WE WILL BE ALPHAS. WE WILL BE ALPHAS. BACK IN LINE!" },
    { speaker: null, text: "(They get back in line.)" },
    // ceremony-chant-1 (performed choice: chant along)
    { speaker: "brent", text: "REPEAT AFTER ME. \"I'M A BIG STRONG ALPHA MALE AND I FEEL AWESOME DAILY.\"" },
    { speaker: null, text: "QUINN: I'M A BIG STRONG ALPHA MALE AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    // ceremony-chant-2
    { speaker: "brent", text: "I CREATE MY OWN DESTINY.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I CREATE MY OWN DESTINY.", autoAdvance: 500 },
    { speaker: "brent", text: "I ALWAYS GET WHAT I WANT.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I ALWAYS GET WHAT I WANT.", autoAdvance: 500 },
    { speaker: "brent", text: "WOMEN COMPETE FOR MY ATTENTION.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: WOMEN COMPETE FOR MY ATTENTION.", autoAdvance: 500 },
    { speaker: "brent", text: "MEN RESPECT AND LOOK UP TO ME.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: MEN RESPECT AND LOOK UP TO ME.", autoAdvance: 500 },
    // ceremony-chant-repeat
    { speaker: "brent", text: "I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: "brent", text: "I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: "brent", text: "I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: "brent", text: "RRRRRRRAAAAAAAHHHHHHHHHHHH!", autoAdvance: 500 },
    { speaker: null, text: "BOYS: RRRRRRRRRRAAAAAAAAAAAAHHHHHHHHHHHHHHHHH!", autoAdvance: 500 },
    // ceremony-circle
    { speaker: "brent", text: "Get in a circle. GO." },
    { speaker: null, text: "(The boys get into a circle and run.)" },
    { speaker: "brent", text: "Tonight, I will turn you into men, boys. KEEP RUNNING. YEAHHHHHH. I will teach you what it means to dominate. What it means to be the alpha." },
    { speaker: "quinn", text: "What if we don't want to be the alpha?" },
    { speaker: "brent", text: "OH shut up Quinn. WHO WOULDN'T wanna be the alpha? You get everything handed to you. You can go through your life with maximum ease. REPEAT AFTER ME:" },
    // ceremony-chant-fast
    { speaker: null, text: "(faster now)" },
    { speaker: "brent", text: "I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: I'M A BIG STRONG ALPHA MALE, AND I FEEL AWESOME DAILY.", autoAdvance: 500 },
    { speaker: "brent", text: "BETAS WISH THAT THEY COULD BE THE ALPHA LIKE ME.", autoAdvance: 500 },
    { speaker: null, text: "BOYS: BETAS WISH THAT THEY COULD BE THE ALPHA LIKE ME.", autoAdvance: 500 },
    { speaker: "brent", text: "NO ONE WILL STOP ME FROM BEING THE ALPHA", autoAdvance: 500 },
    { speaker: null, text: "BOYS: NO ONE WILL STOP ME FROM BEING THE ALPHA", autoAdvance: 500 },
    // ceremony-howl-1 (performed choice: howl along)
    { speaker: "brent", text: "Stop running, fags. Huddle up." },
    { speaker: null, text: "(They huddle up. Back and forth.)" },
    { speaker: "brent", text: "Tonight you will become men. You will realize that life is brutal. IT SUCKS COCK. You'll realize, the only way to SUCK LESS HUGE GIRTHY COCK is to rise to your FULL ALPHA MALE POTENTIAL. Are you ready to be the alpha you've always wanted to be?" },
    { speaker: null, text: "BOYS: YEAH." },
    { speaker: "brent", text: "Howl to the moon. ARW ARW ARWOOOOOOOO!" },
    { speaker: "quinn", text: "ARW ARW ARWOOOOOOOO!" },
    // ceremony-one-thing
    { speaker: "brent", text: "Okay boys, what's one thing you can change about yourself to be the best alpha you can be?" },
    { speaker: "noah", text: "I won't let anyone tell me I'm wrong ever." },
    { speaker: "josh", text: "I'll lower my voice when I talk to people." },
    { speaker: "lucas", text: "I won't be scared again." },
    { speaker: "matt", text: "I'll be proud of everything I do." },
    { speaker: "brent", text: "YES yes. That's it. SAY IT. AGAIN." },
    // authentic choice: braver
    { speaker: "quinn", text: "I'll try to be braver." },
    // ceremony-pledges-repeat
    { speaker: null, text: "(Pretty much over each other.)" },
    { speaker: "noah", text: "I won't let anyone tell me I'm wrong ever." },
    { speaker: "josh", text: "I'll lower my voice when I talk to people." },
    { speaker: "lucas", text: "I won't be scared again." },
    { speaker: "matt", text: "I'll be proud of everything I do." },
    { speaker: "brent", text: "Again." },
    // ceremony-pledges-again
    { speaker: "noah", text: "I won't let anyone tell me I'm wrong ever." },
    { speaker: "josh", text: "I'll lower my voice when I talk to people." },
    { speaker: "lucas", text: "I won't be scared again." },
    { speaker: "matt", text: "I'll be proud of everything I do." },
    { speaker: "brent", text: "Howl to the moon. ARW ARW ARWOOOOOOOO!" },
    { speaker: null, text: "BOYS: ARW ARW ARWOOOOOOOO!" },
    // ceremony-poem-chant
    { speaker: "brent", text: "REPEAT AFTER ME:" },
    { speaker: "brent", text: "I WILL BE AN ALPHA MALE / TILL THE DAY I DIE" },
    { speaker: null, text: "BOYS: I WILL BE AN ALPHA MALE / TILL THE DAY I DIE" },
    { speaker: "brent", text: "I WILL NOT STOP MY ALPHA WAYS / TILL THE WORLD IS MINE" },
    { speaker: null, text: "BOYS: I WILL NOT STOP MY ALPHA WAYS / TILL THE WORLD IS MINE" },
    // ceremony-poem-chant-2
    { speaker: "brent", text: "IF YOU GET IN MY ALPHA WAY / I'M LEAVING YOU BEHIND" },
    { speaker: null, text: "BOYS: IF YOU GET IN MY ALPHA WAY / I'M LEAVING YOU BEHIND" },
    { speaker: "brent", text: "FOR ALPHA MALES LEAD THE PACK / THEY NEVER STOP THAT GRIND." },
    { speaker: null, text: "BOYS: FOR ALPHA MALES LEAD THE PACK / THEY NEVER STOP THAT GRIND." },
    { speaker: "brent", text: "ARW ARW ARWOOOOOOOO!" },
    { speaker: null, text: "BOYS: ARW ARW ARWOOOOOOOO!" },
    // ceremony-fight-start (authentic choice: feel sick watching)
    { speaker: "brent", text: "Aaaaaah. Yes. YES. To conclude our ceremony tonight. We have to make our final display of balls. WE'RE GONNA HIT EACH OTHER!! Who here has the balls to slap me across the face?" },
    { speaker: null, text: "BOYS: SLAP YOU! / BRENT? / WHAT? / WHAT THE FUCK WAS THAT? / IT'S A TRAP." },
    { speaker: "brent", text: "SLAP ME! HIT ME! PUNCH ME IN THE FACE! MEN HARM EACH OTHER! THAT'S WHAT MEN DO!" },
    // ceremony-boys-slap
    { speaker: "josh", text: "I'll slap you, Brent." },
    { speaker: null, text: "(Josh slaps Brent. Brent slaps Josh. Josh slaps Brent.)" },
    { speaker: "brent", text: "YEAH." },
    { speaker: null, text: "(Noah slaps Brent. Brent slaps Noah. Noah slaps Brent.)" },
    { speaker: "brent", text: "YEAH YEAH. MORE VIOLENCE MORE HARM. NEXT." },
    { speaker: null, text: "(Lucas slaps Brent. Brent slaps Lucas. Lucas slaps Brent. Lucas joins Noah and Josh.)" },
    // ceremony-matt-whisper
    { speaker: "brent", text: "I FEEL LIKE A MAN. DO YOU FEEL LIKE A MAN?" },
    { speaker: "matt", text: "(hushed to Quinn) I guess this is what we're doing now." },
    { speaker: null, text: "(Matt slaps Brent. Brent slaps Matt. Matt slaps Brent. Matt joins the others.)" },
    // ceremony-quinn-up -- lighting shift to red during violence
    { speaker: "brent", text: "QUINN YOU'RE UP." },
    // authentic choice: don't want to slap
    { speaker: "quinn", text: "I don't want to slap you." },
    // ceremony-brent-slaps-quinn
    { speaker: "brent", text: "Why not? TOO PUSSY?" },
    { speaker: "quinn", text: "I -- I --" },
    { speaker: "brent", text: "HUH?" },
    { speaker: "quinn", text: "I just --" },
    { speaker: null, text: "(Brent slaps Quinn. The fighting in the background has devolved into chaos. What used to be leisurely slaps are now kicks and punches.)", lighting: { tint: "#aa2222", intensity: 0.4, transition: 3000 } },
    // ceremony-pussy-chant
    { speaker: "brent", text: "PUSSY!!!!!" },
    { speaker: null, text: "(Chanting.)" },
    { speaker: null, text: "BOYS & BRENT: PUSSY. PUSSY. PUSSY. PUSSY. PUSSY. PUSSY. PUSSY. PUSSY --" },
    // authentic choice: Quinn snaps (the path where Quinn beats Brent)
    { speaker: "quinn", text: "YOU KNOW WHAT I AM A PUSSY, BRENT!" },
    // ceremony-quinn-snaps
    { speaker: null, text: "(Quinn slaps Brent. He's knocked out. Quinn proceeds to beat Brent to a bloody pulp.)" },
    { speaker: "quinn", text: "PUSSY ENOUGH TO FUCKING KILL YOU!!!!!!!! WOOOOOOOO!!! WHO'S THE BIG STRONG ALPHA MALE NOW BRENT HUH??" },
    { speaker: "quinn", text: "YOU THINK I'M A PUSSY? OH YOU THINK I'M SOFT? HOW SOFT DOES MY FOOT FEEL AGAINST YOUR FUCKING FACE?" },
    { speaker: "quinn", text: "YOU DIDN'T FUCKING EXPECT THIS HUH? YOU DIDN'T EXPECT THIS MUCH PUSSY SISSY FAGGOT RAGE? WELL GUESS WHAT? I'VE GOT IT AND I'VE GOT IT BAD." },
    // ceremony-aftermath
    { speaker: null, text: "(He's dead. Like beyond dead. Quinn looks around at the boys. Holy fuck.)" },
    { speaker: "quinn", text: "Uh -- uh -- uh. What now?" },
    { speaker: null, text: "BOYS: AAaAAAAAAAAAH!!!!! / WHAT THE FUCK!!!!!!!! / HOW COULD YOU DO THAT?!?!?! / HE'S A BITCH!!!?!! / FAGGGGOT!!!!!!" },
  ],
};

export default SCRIPT;

"use client";

import { useState, useCallback } from "react";
import DialogueBox from "./DialogueBox";
import type { DialogueEntry } from "./DialogueBox";
import ChoiceButtons from "./ChoiceButtons";
import type { Choice } from "./ChoiceButtons";
import { applyFracture, isChoiceLocked } from "@/lib/fracture";
import type { ChoiceType } from "@/lib/fracture";

type Beat =
  | "intro"
  | "choice1"
  | "response1"
  | "escalation"
  | "choice2"
  | "response2"
  | "dominance"
  | "choice3"
  | "response3"
  | "finale"
  | "done";

interface Scene1Props {
  fracture: number;
  onFractureChange: (f: number) => void;
  onComplete: () => void;
}

export default function Scene1({
  fracture,
  onFractureChange,
  onComplete,
}: Scene1Props) {
  const [beat, setBeat] = useState<Beat>("intro");
  const [choice1Response, setChoice1Response] = useState<DialogueEntry[]>([]);
  const [choice2Response, setChoice2Response] = useState<DialogueEntry[]>([]);
  const [choice3Response, setChoice3Response] = useState<DialogueEntry[]>([]);

  const handleChoice1 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let response: DialogueEntry[];

      if (index === 0) {
        // "I don't know it." [AUTHENTIC]
        newFracture = applyFracture(fracture, "AUTHENTIC_DANGEROUS");
        response = [
          {
            character: "BRENT",
            text: "You don't KNOW it? What kind of scout doesn't know the outdoor code?",
          },
        ];
      } else if (index === 1) {
        // "Be careful with fire..." [PERFORMED]
        newFracture = applyFracture(fracture, "PERFORMED");
        response = [
          {
            character: "BRENT",
            text: "Close enough. At least you tried.",
          },
        ];
      } else {
        // "I don't really like being outside..." [AUTHENTIC - vulnerable]
        newFracture = applyFracture(fracture, "AUTHENTIC_DANGEROUS");
        response = [
          {
            character: "BRENT",
            text: "i DoN'T LiKe bEiNg oUtSiDE. I gEt CoLd EaSiLy.",
          },
        ];
      }

      onFractureChange(newFracture);
      setChoice1Response(response);
      setBeat("response1");
    },
    [fracture, onFractureChange]
  );

  const handleChoice2 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let response: DialogueEntry[];

      if (index === 0) {
        // "I think it's about caring..." [AUTHENTIC]
        newFracture = applyFracture(fracture, "AUTHENTIC_DANGEROUS");
        response = [
          {
            character: "BRENT",
            text: "GAYYY. Jesus Christ. Caring? CARING?",
          },
        ];
      } else if (index === 1) {
        // "Being strong..." [PERFORMED]
        newFracture = applyFracture(fracture, "PERFORMED");
        response = [
          {
            character: "BRENT",
            text: "Better. Still sounds like a faggot said it, but better.",
          },
        ];
      } else {
        // "I don't know." [DEFLECT]
        newFracture = applyFracture(fracture, "DEFLECT");
        response = [
          {
            character: "BRENT",
            text: "You don't know what it means to be a man. That's the problem.",
          },
        ];
      }

      onFractureChange(newFracture);
      setChoice2Response(response);
      setBeat("response2");
    },
    [fracture, onFractureChange]
  );

  const handleChoice3 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let response: DialogueEntry[];

      if (index === 0) {
        // "That sounds... wrong." [AUTHENTIC] -- may be locked
        newFracture = applyFracture(fracture, "AUTHENTIC_DANGEROUS");
        response = [
          {
            isStageDirection: true,
            text: "Brent gets in Quinn's face.",
          },
          {
            character: "BRENT",
            text: "WRONG? You think I'M wrong?",
          },
        ];
      } else if (index === 1) {
        // (Nod silently) [PERFORMED]
        newFracture = applyFracture(fracture, "PERFORMED");
        response = [
          {
            character: "BRENT",
            text: "That's what I thought.",
          },
        ];
      } else {
        // Timer ran out [DEFLECT]
        newFracture = applyFracture(fracture, "TIMEOUT");
        response = [
          {
            character: "BRENT",
            text: "Can't even answer. Pathetic.",
          },
        ];
      }

      onFractureChange(newFracture);
      setChoice3Response(response);
      setBeat("response3");
    },
    [fracture, onFractureChange]
  );

  const introDialogue: DialogueEntry[] = [
    {
      isStageDirection: true,
      text: "A clearing in the woods. Five boys sit on logs around a dead campfire. Brent stands over them. The air is cold.",
    },
    {
      character: "BRENT",
      text: "Alright, scouts. Before we begin -- the outdoor code. Who can recite it?",
    },
    {
      isStageDirection: true,
      text: "Silence. Boys shift nervously.",
    },
    {
      character: "BRENT",
      text: "Quinn. Outdoor code. Now.",
    },
  ];

  const escalationDialogue: DialogueEntry[] = [
    {
      character: "BRENT",
      text: "You know what your problem is, Quinn? You're soft. You're a little faggot who's cold all the time.",
    },
    {
      character: "BRENT",
      text: "WANT ONE OF US TO WARM YOU UP?",
    },
    {
      isStageDirection: true,
      text: "The screen flashes. A beat of silence.",
    },
    {
      character: "BRENT",
      text: "Now. What does being a man mean to you?",
    },
  ];

  const dominanceDialogue: DialogueEntry[] = [
    {
      character: "BRENT",
      text: "Being a man means DOMINANCE. It means you take what you want. You don't ask. You don't care. You TAKE.",
    },
  ];

  const finaleDialogue: DialogueEntry[] = [
    {
      character: "BRENT",
      text: "We're gonna make men out of you. All of you. Starting tonight.",
    },
    {
      isStageDirection: true,
      text: "Silence. The fire is dead. The woods are dark.",
    },
  ];

  const choice1Options: Choice[] = [
    { label: '"I don\'t know it."', type: "AUTHENTIC_DANGEROUS" },
    {
      label: '"Be careful with fire... respect wildlife..."',
      type: "PERFORMED",
    },
    {
      label: '"I don\'t really like being outside. I get cold easily."',
      type: "AUTHENTIC_DANGEROUS",
    },
  ];

  const choice2Options: Choice[] = [
    {
      label: '"I think it\'s about caring for other people."',
      type: "AUTHENTIC_DANGEROUS",
    },
    {
      label: '"Being strong. Not showing weakness."',
      type: "PERFORMED",
    },
    { label: '"I don\'t know."', type: "DEFLECT" },
  ];

  const choice3Locked = isChoiceLocked(fracture, 0.5);
  const choice3Options: Choice[] = [
    {
      label: '"That sounds... wrong."',
      type: "AUTHENTIC_DANGEROUS",
      locked: choice3Locked,
    },
    { label: "(Nod silently)", type: "PERFORMED" },
  ];

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "Georgia, serif",
      }}
    >
      {beat === "intro" && (
        <DialogueBox entries={introDialogue} onComplete={() => setBeat("choice1")} />
      )}

      {beat === "choice1" && (
        <div>
          <DialogueBox entries={introDialogue} onComplete={() => {}} />
          <div style={{ marginTop: "32px" }}>
            <ChoiceButtons
              choices={choice1Options}
              onSelect={handleChoice1}
              timerSeconds={15}
              timeoutIndex={0}
            />
          </div>
        </div>
      )}

      {beat === "response1" && (
        <DialogueBox
          entries={choice1Response}
          onComplete={() => setBeat("escalation")}
        />
      )}

      {beat === "escalation" && (
        <DialogueBox
          entries={escalationDialogue}
          onComplete={() => setBeat("choice2")}
        />
      )}

      {beat === "choice2" && (
        <div>
          <ChoiceButtons
            choices={choice2Options}
            onSelect={handleChoice2}
            timerSeconds={12}
            timeoutIndex={2}
          />
        </div>
      )}

      {beat === "response2" && (
        <DialogueBox
          entries={choice2Response}
          onComplete={() => setBeat("dominance")}
        />
      )}

      {beat === "dominance" && (
        <DialogueBox
          entries={dominanceDialogue}
          onComplete={() => setBeat("choice3")}
        />
      )}

      {beat === "choice3" && (
        <div>
          <ChoiceButtons
            choices={choice3Options}
            onSelect={handleChoice3}
            timerSeconds={10}
            timeoutIndex={1}
          />
        </div>
      )}

      {beat === "response3" && (
        <DialogueBox
          entries={choice3Response}
          onComplete={() => setBeat("finale")}
        />
      )}

      {beat === "finale" && (
        <DialogueBox entries={finaleDialogue} onComplete={onComplete} />
      )}
    </div>
  );
}

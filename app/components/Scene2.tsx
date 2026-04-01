"use client";

import { useState, useCallback } from "react";
import DialogueBox from "./DialogueBox";
import type { DialogueEntry } from "./DialogueBox";
import ChoiceButtons from "./ChoiceButtons";
import type { Choice } from "./ChoiceButtons";
import { applyFracture } from "@/lib/fracture";

type Beat =
  | "opening"
  | "choice4"
  | "response4"
  | "like_talking"
  | "choice5"
  | "response5"
  | "kiss"
  | "choice6"
  | "ending"
  | "done";

interface Scene2Props {
  fracture: number;
  onFractureChange: (f: number) => void;
  onComplete: () => void;
}

export default function Scene2({
  fracture,
  onFractureChange,
  onComplete,
}: Scene2Props) {
  const [beat, setBeat] = useState<Beat>("opening");
  const [choice4Response, setChoice4Response] = useState<DialogueEntry[]>([]);
  const [choice5Response, setChoice5Response] = useState<DialogueEntry[]>([]);
  const [endingDialogue, setEndingDialogue] = useState<DialogueEntry[]>([]);

  const handleChoice4 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let response: DialogueEntry[];

      if (index === 0) {
        // "Me too." [AUTHENTIC]
        newFracture = applyFracture(fracture, "AUTHENTIC");
        response = [
          {
            character: "MATT",
            text: "It's nice. Just talking to someone who... gets it.",
          },
          {
            character: "QUINN",
            text: "Gets what?",
          },
          {
            character: "MATT",
            text: "I don't know. Being different, I guess.",
          },
        ];
      } else if (index === 1) {
        // "Do you ever feel like..." [AUTHENTIC - deep]
        newFracture = applyFracture(fracture, "AUTHENTIC");
        response = [
          {
            character: "MATT",
            text: "Sometimes. Like I'm just... doing what everyone expects.",
          },
          {
            character: "QUINN",
            text: "Performing.",
          },
          {
            character: "MATT",
            text: "Yeah. Performing.",
          },
          {
            isStageDirection: true,
            text: "A beat.",
          },
          {
            character: "MATT",
            text: "I don't feel like I'm performing right now.",
          },
        ];
      } else {
        // "We should probably go back." [DEFLECT]
        newFracture = applyFracture(fracture, "DEFLECT");
        response = [
          {
            character: "MATT",
            text: "Yeah. I guess.",
          },
          {
            isStageDirection: true,
            text: "Neither of them moves.",
          },
        ];
      }

      onFractureChange(newFracture);
      setChoice4Response(response);
      setBeat("response4");
    },
    [fracture, onFractureChange]
  );

  const handleChoice5 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let response: DialogueEntry[];

      if (index === 0) {
        // "I like talking to you too." [AUTHENTIC]
        newFracture = applyFracture(fracture, "AUTHENTIC");
        response = [
          {
            isStageDirection: true,
            text: "Matt smiles. A real smile, not a performance.",
          },
        ];
      } else {
        // "Thanks." [DEFLECT]
        newFracture = applyFracture(fracture, "DEFLECT");
        response = [
          {
            isStageDirection: true,
            text: "Matt nods. The silence is comfortable.",
          },
        ];
      }

      onFractureChange(newFracture);
      setChoice5Response(response);
      setBeat("response5");
    },
    [fracture, onFractureChange]
  );

  const handleChoice6 = useCallback(
    (index: number) => {
      let newFracture = fracture;
      let ending: DialogueEntry[];

      if (index === 0) {
        // (Say nothing. Just feel it.) [AUTHENTIC]
        newFracture = applyFracture(fracture, "AUTHENTIC");
        ending = [
          {
            isStageDirection: true,
            text: "The moment holds. Quinn doesn't move. Neither does Matt. The stars are very bright.",
          },
        ];
      } else if (index === 1) {
        // "Why did you do that?" [DEFLECT]
        newFracture = applyFracture(fracture, "DEFLECT");
        ending = [
          {
            character: "MATT",
            text: "I don't know. I just... wanted to.",
          },
        ];
      } else {
        // "I think I have to go." [DEFLECT]
        newFracture = applyFracture(fracture, "DEFLECT");
        ending = [
          {
            character: "MATT",
            text: "Quinn, wait--",
          },
          {
            isStageDirection: true,
            text: "But Quinn is already walking away. Matt sits alone on the cliff.",
          },
        ];
      }

      onFractureChange(newFracture);
      setEndingDialogue(ending);
      setBeat("ending");
    },
    [fracture, onFractureChange]
  );

  const openingDialogue: DialogueEntry[] = [
    {
      isStageDirection: true,
      text: "The cliff overlooks a valley. Stars. Wind. Quiet. The sound of crickets, far away.",
    },
    {
      character: "MATT",
      text: "It's quiet up here.",
    },
    {
      character: "QUINN",
      text: "Yeah.",
    },
    {
      character: "MATT",
      text: "I like it. Being away from...",
    },
    {
      character: "QUINN",
      text: "Brent?",
    },
    {
      isStageDirection: true,
      text: "Matt laughs softly.",
    },
    {
      character: "MATT",
      text: "Everything.",
    },
  ];

  const likeTalkingDialogue: DialogueEntry[] = [
    {
      character: "MATT",
      text: "I like talking to you, Quinn.",
    },
  ];

  const kissDialogue: DialogueEntry[] = [
    {
      isStageDirection: true,
      text: "Matt moves closer. He kisses Quinn on the cheek.",
    },
    {
      isStageDirection: true,
      text: "The world stops for a moment.",
    },
  ];

  const choice4Options: Choice[] = [
    { label: '"Me too."', type: "AUTHENTIC" },
    {
      label: '"Do you ever feel like you don\'t know who you are?"',
      type: "AUTHENTIC",
    },
    { label: '"We should probably go back."', type: "DEFLECT" },
  ];

  const choice5Options: Choice[] = [
    { label: '"I like talking to you too."', type: "AUTHENTIC" },
    { label: '"Thanks."', type: "DEFLECT" },
  ];

  const choice6Options: Choice[] = [
    { label: "(Say nothing. Just feel it.)", type: "AUTHENTIC" },
    { label: '"Why did you do that?"', type: "DEFLECT" },
    { label: '"I think I have to go."', type: "DEFLECT" },
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
      {beat === "opening" && (
        <DialogueBox
          entries={openingDialogue}
          onComplete={() => setBeat("choice4")}
        />
      )}

      {beat === "choice4" && (
        <ChoiceButtons choices={choice4Options} onSelect={handleChoice4} />
      )}

      {beat === "response4" && (
        <DialogueBox
          entries={choice4Response}
          onComplete={() => setBeat("like_talking")}
        />
      )}

      {beat === "like_talking" && (
        <DialogueBox
          entries={likeTalkingDialogue}
          onComplete={() => setBeat("choice5")}
        />
      )}

      {beat === "choice5" && (
        <ChoiceButtons choices={choice5Options} onSelect={handleChoice5} />
      )}

      {beat === "response5" && (
        <DialogueBox
          entries={choice5Response}
          onComplete={() => setBeat("kiss")}
        />
      )}

      {beat === "kiss" && (
        <DialogueBox
          entries={kissDialogue}
          onComplete={() => setBeat("choice6")}
        />
      )}

      {beat === "choice6" && (
        <ChoiceButtons choices={choice6Options} onSelect={handleChoice6} />
      )}

      {beat === "ending" && (
        <DialogueBox entries={endingDialogue} onComplete={onComplete} />
      )}
    </div>
  );
}

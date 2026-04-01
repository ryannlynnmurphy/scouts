import { ChoiceType } from "../data/types";

export interface RecordedChoice {
  choiceId: string;
  beatId: string;
  type: ChoiceType;
  text: string;
  timestamp: number;
}

export class ChoiceTracker {
  private choices: RecordedChoice[] = [];

  record(choiceId: string, beatId: string, type: ChoiceType, text: string): void {
    this.choices.push({
      choiceId,
      beatId,
      type,
      text,
      timestamp: Date.now(),
    });
  }

  getAll(): RecordedChoice[] {
    return [...this.choices];
  }

  wasChosen(choiceId: string): boolean {
    return this.choices.some((c) => c.choiceId === choiceId);
  }

  countByType(type: ChoiceType): number {
    return this.choices.filter((c) => c.type === type).length;
  }

  /** Key choices that affect the ending */
  get simonOpenedUp(): boolean {
    return this.wasChosen("act3-monologue-continue-girl");
  }

  get simonBrokeCycle(): boolean {
    return this.wasChosen("fight-stop-all");
  }

  get simonBeatBrent(): boolean {
    return this.wasChosen("fight-pussy-rage");
  }

  get simonKissedBack(): boolean {
    return (
      this.wasChosen("act1-stay") ||
      this.wasChosen("act1-kiss-back")
    );
  }

  toJSON(): RecordedChoice[] {
    return this.choices;
  }
}

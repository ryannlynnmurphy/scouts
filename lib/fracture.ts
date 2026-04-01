export type ChoiceType = "AUTHENTIC" | "AUTHENTIC_DANGEROUS" | "PERFORMED" | "DEFLECT" | "TIMEOUT";

const FRACTURE_DELTAS: Record<ChoiceType, number> = {
  PERFORMED: 0.05,
  AUTHENTIC_DANGEROUS: 0.03,
  DEFLECT: 0.01,
  TIMEOUT: 0.02,
  AUTHENTIC: -0.02,
};

export function applyFracture(current: number, choiceType: ChoiceType): number {
  const next = current + FRACTURE_DELTAS[choiceType];
  return Math.max(0, Math.min(1, next));
}

export function getFractureCSS(fracture: number): React.CSSProperties {
  return {
    filter: `saturate(${1 - fracture}) contrast(${1 + fracture * 0.3})`,
    transition: "filter 1s ease",
  };
}

export function isChoiceLocked(fracture: number, lockThreshold: number): boolean {
  return fracture > lockThreshold;
}

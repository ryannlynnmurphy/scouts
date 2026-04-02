export class SuspicionManager {
  private _suspicion: number = 0;

  get suspicion(): number { return this._suspicion; }

  get level(): "hidden" | "noticed" | "targeted" | "exposed" {
    if (this._suspicion < 0.3) return "hidden";
    if (this._suspicion < 0.6) return "noticed";
    if (this._suspicion < 0.8) return "targeted";
    return "exposed";
  }

  changeSuspicion(delta: number): void {
    this._suspicion = Math.max(0, Math.min(1, this._suspicion + delta));
  }

  // Returns additional Brent lines to inject based on current suspicion level
  // Called before each beat to see if Brent should ad-lib
  getBrentAdLib(context: string): string | null {
    // Context is the current scene section (e.g., "oath", "sacrifice", "kiss-test", "pickup", "ceremony")
    // Only return an ad-lib occasionally, not every beat
    // Use a simple probability + threshold system

    if (this._suspicion < 0.2) return null;

    // Pool of ad-libs by suspicion tier
    const noticed = [
      "Simon, stop looking at Sam.",
      "Why are you two always whispering?",
      "Anyone else think these two are a little TOO close?",
      "Simon. Eyes on ME. Not on Sam.",
    ];

    const targeted = [
      "SAM. Move away from Simon. NOW.",
      "Simon, I'm gonna put you at the OTHER end of the line.",
      "Something about you two doesn't sit right with me.",
      "I've got my eye on you two.",
    ];

    const exposed = [
      "EVERYONE STOP. I need to address something.",
      "Simon. Sam. Front and center. Separate. NOW.",
      "I SAW what I saw and we're going to deal with it.",
    ];

    let pool: string[];
    if (this._suspicion >= 0.8) pool = exposed;
    else if (this._suspicion >= 0.6) pool = targeted;
    else if (this._suspicion >= 0.3) pool = noticed;
    else pool = noticed;

    // 40% chance of an ad-lib per check (don't spam)
    if (Math.random() > 0.4) return null;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Check if the Gay Shit scenes should be gated
  shouldGateGayShit(): "free" | "risky" | "followed" {
    if (this._suspicion < 0.3) return "free";
    if (this._suspicion < 0.6) return "risky";
    return "followed";
  }

  toJSON(): { suspicion: number } {
    return { suspicion: this._suspicion };
  }

  fromJSON(data: { suspicion: number }): void {
    this._suspicion = data.suspicion;
  }
}

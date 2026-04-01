import { ITEMS } from "../data/items";
import { InventoryItem } from "../data/types";

export type FlowerState = "bud" | "opening" | "bloom";

export class InventoryManager {
  private heldItems: string[] = [];
  private maxSlots = 6;

  /**
   * Tracks how far Simon's connection with Sam has grown.
   * - "bud"     : flower added (Gay Shit Act 2), nothing has opened yet
   * - "opening" : after the Act 2 kiss, something is becoming real
   * - "bloom"   : after Act 3 authentic choice ("Can I please be your girl?")
   * The flower never progresses if the player deflected all Gay Shit choices.
   */
  flowerState: FlowerState = "bud";

  addItem(itemId: string): boolean {
    if (this.heldItems.includes(itemId)) return false;
    if (this.heldItems.length >= this.maxSlots) return false;
    if (!ITEMS[itemId]) return false;
    this.heldItems.push(itemId);
    return true;
  }

  removeItem(itemId: string): boolean {
    const idx = this.heldItems.indexOf(itemId);
    if (idx === -1) return false;
    this.heldItems.splice(idx, 1);
    return true;
  }

  hasItem(itemId: string): boolean {
    return this.heldItems.includes(itemId);
  }

  getItems(): InventoryItem[] {
    return this.heldItems
      .map((id) => ITEMS[id])
      .filter((item): item is InventoryItem => item !== undefined);
  }

  getTooltip(itemId: string, fracture: number): string {
    const item = ITEMS[itemId];
    if (!item) return "";

    // The flower tooltip evolves with its state
    if (itemId === "flower") {
      switch (this.flowerState) {
        case "bud":     return "Something Sam gave me. It hasn't opened yet.";
        case "opening": return "It's starting to bloom.";
        case "bloom":   return "Sam picked this for me.";
      }
    }

    if (item.neverDegrades) return item.tooltips.low;
    return fracture >= 0.5 ? item.tooltips.high : item.tooltips.low;
  }

  toJSON(): { items: string[]; flowerState: FlowerState } {
    return { items: [...this.heldItems], flowerState: this.flowerState };
  }

  fromJSON(data: { items: string[]; flowerState?: FlowerState } | string[]): void {
    // Support both old format (plain string array) and new format with flowerState
    if (Array.isArray(data)) {
      this.heldItems = data.filter((id) => ITEMS[id]);
    } else {
      this.heldItems = data.items.filter((id) => ITEMS[id]);
      this.flowerState = data.flowerState ?? "bud";
    }
  }
}

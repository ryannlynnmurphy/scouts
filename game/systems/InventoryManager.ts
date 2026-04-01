import { ITEMS } from "../data/items";
import { InventoryItem } from "../data/types";

export class InventoryManager {
  private heldItems: string[] = [];
  private maxSlots = 6;

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
    if (item.neverDegrades) return item.tooltips.low;
    return fracture >= 0.5 ? item.tooltips.high : item.tooltips.low;
  }

  toJSON(): string[] {
    return [...this.heldItems];
  }

  fromJSON(data: string[]): void {
    this.heldItems = data.filter((id) => ITEMS[id]);
  }
}

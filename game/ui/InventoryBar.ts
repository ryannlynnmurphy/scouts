import Phaser from "phaser";
import { InventoryManager, FlowerState } from "../systems/InventoryManager";
import { FractureManager } from "../systems/FractureManager";
import { GAME_WIDTH } from "../constants";

const SLOT_SIZE = 32;
const SLOT_GAP = 6;
const SLOT_PADDING = 8;
const BAR_X = GAME_WIDTH - (SLOT_SIZE + SLOT_GAP) * 6 - SLOT_PADDING;
const BAR_Y = 8;

export class InventoryBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private slots: Phaser.GameObjects.Graphics[] = [];
  private itemIcons: Phaser.GameObjects.Graphics[] = [];
  private tooltip: Phaser.GameObjects.Container | null = null;
  private inventory: InventoryManager;
  private fracture: FractureManager;

  constructor(
    scene: Phaser.Scene,
    inventory: InventoryManager,
    fracture: FractureManager
  ) {
    this.scene = scene;
    this.inventory = inventory;
    this.fracture = fracture;
    this.container = scene.add.container(BAR_X, BAR_Y).setDepth(90);

    // Create 6 empty slots
    for (let i = 0; i < 6; i++) {
      const x = i * (SLOT_SIZE + SLOT_GAP);
      const slot = scene.add.graphics();
      slot.fillStyle(0xffffff, 0.05);
      slot.lineStyle(1, 0x333333);
      slot.fillRoundedRect(x, 0, SLOT_SIZE, SLOT_SIZE, 4);
      slot.strokeRoundedRect(x, 0, SLOT_SIZE, SLOT_SIZE, 4);
      this.container.add(slot);
      this.slots.push(slot);
    }
  }

  update(): void {
    // Clear old icons
    this.itemIcons.forEach((icon) => icon.destroy());
    this.itemIcons = [];

    const items = this.inventory.getItems();
    items.forEach((item, i) => {
      const x = i * (SLOT_SIZE + SLOT_GAP);
      const icon = this.scene.add.graphics();

      // Color based on character association and fracture
      const isDegraded =
        !item.neverDegrades && this.fracture.fracture >= 0.5;
      const alpha = isDegraded ? 0.4 : 0.9;

      // Draw flower programmatically based on its growth state
      if (item.id === "flower") {
        this.drawFlower(icon, x, this.inventory.flowerState, alpha);
      } else {
        // Simple colored square as placeholder for pixel art icons
        let color = 0xc9a96e; // default gold
        if (item.id === "squirrelBlood" || item.id === "brentsBlood")
          color = 0xff4444;
        if (item.id === "samsKiss") color = 0x7eb8c9;
        if (item.id === "marshmallow") color = 0xf8f0e3;

        icon.fillStyle(color, alpha);
        icon.fillRoundedRect(x + 4, 4, SLOT_SIZE - 8, SLOT_SIZE - 8, 3);
      }
      this.container.add(icon);
      this.itemIcons.push(icon);

      // Make interactive for tooltip
      const hitArea = new Phaser.Geom.Rectangle(
        x,
        0,
        SLOT_SIZE,
        SLOT_SIZE
      );
      icon.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      icon.on("pointerover", () => {
        this.showTooltip(
          x + SLOT_SIZE / 2,
          SLOT_SIZE + 8,
          item.name,
          this.inventory.getTooltip(item.id, this.fracture.fracture)
        );
      });

      icon.on("pointerout", () => {
        this.hideTooltip();
      });
    });
  }

  /**
   * Draw the flower icon programmatically based on its growth state.
   * The flower is ALWAYS full alpha — it never desaturates with fracture.
   * Drawn within a 32x32 slot starting at (slotX, 0).
   *
   * Bud:     small green stem + tiny pink bud tip (8x8 area)
   * Opening: taller stem, visible petals (16x16 area)
   * Bloom:   full flower, vibrant pink, fills nearly the whole slot (28x28)
   */
  private drawFlower(
    g: Phaser.GameObjects.Graphics,
    slotX: number,
    state: FlowerState,
    _alpha: number  // intentionally ignored — the flower never dims
  ): void {
    // Center of the 32x32 slot
    const cx = slotX + SLOT_SIZE / 2;
    const cy = SLOT_SIZE / 2;

    if (state === "bud") {
      // Stem
      g.fillStyle(0x4caf50, 1);
      g.fillRect(cx - 1, cy + 2, 2, 10);
      // Tiny bud
      g.fillStyle(0xff88aa, 1);
      g.fillRect(cx - 2, cy - 2, 4, 5);
      // Bud tip highlight
      g.fillStyle(0xffb3cc, 1);
      g.fillRect(cx - 1, cy - 2, 2, 2);

    } else if (state === "opening") {
      // Taller stem
      g.fillStyle(0x4caf50, 1);
      g.fillRect(cx - 1, cy + 2, 2, 12);
      // Left leaf
      g.fillRect(cx - 4, cy + 5, 4, 2);
      // Right leaf
      g.fillRect(cx + 1, cy + 7, 4, 2);
      // Petals — 4 petals around center
      g.fillStyle(0xff88aa, 1);
      g.fillRect(cx - 5, cy - 3, 4, 6);   // left petal
      g.fillRect(cx + 1, cy - 3, 4, 6);   // right petal
      g.fillRect(cx - 2, cy - 7, 4, 5);   // top petal
      g.fillRect(cx - 2, cy + 2, 4, 5);   // bottom petal
      // Center
      g.fillStyle(0xffee58, 1);
      g.fillRect(cx - 2, cy - 2, 4, 4);

    } else {
      // bloom — full, vibrant, fills the slot
      // Stem
      g.fillStyle(0x388e3c, 1);
      g.fillRect(cx - 1, cy + 4, 2, 12);
      // Leaves
      g.fillStyle(0x4caf50, 1);
      g.fillRect(cx - 6, cy + 6, 6, 2);
      g.fillRect(cx + 1, cy + 8, 6, 2);
      // Outer petals (8 petals for a full bloom)
      g.fillStyle(0xff4081, 1);
      const r = 7; // petal distance from center
      const petalW = 4;
      const petalH = 6;
      // Cardinal petals
      g.fillRect(cx - petalW / 2, cy - r - petalH / 2, petalW, petalH); // top
      g.fillRect(cx - petalW / 2, cy + r - petalH / 2, petalW, petalH); // bottom
      g.fillRect(cx - r - petalH / 2, cy - petalW / 2, petalH, petalW); // left
      g.fillRect(cx + r - petalH / 2, cy - petalW / 2, petalH, petalW); // right
      // Diagonal petals
      g.fillStyle(0xff80ab, 1);
      const d = 5;
      g.fillRect(cx - d - 2, cy - d - 2, 4, 4); // top-left
      g.fillRect(cx + d - 2, cy - d - 2, 4, 4); // top-right
      g.fillRect(cx - d - 2, cy + d - 2, 4, 4); // bottom-left
      g.fillRect(cx + d - 2, cy + d - 2, 4, 4); // bottom-right
      // Inner petals (slightly lighter)
      g.fillStyle(0xff6dab, 1);
      g.fillRect(cx - 3, cy - r + 2, 6, 5);    // top inner
      g.fillRect(cx - 3, cy + r - 7, 6, 5);    // bottom inner
      g.fillRect(cx - r + 2, cy - 3, 5, 6);    // left inner
      g.fillRect(cx + r - 7, cy - 3, 5, 6);    // right inner
      // Center (bright yellow)
      g.fillStyle(0xffee58, 1);
      g.fillCircle(cx, cy, 4);
      // Center highlight
      g.fillStyle(0xfff9c4, 1);
      g.fillCircle(cx - 1, cy - 1, 2);
    }
  }

  private showTooltip(
    x: number,
    y: number,
    name: string,
    description: string
  ): void {
    this.hideTooltip();
    this.tooltip = this.scene.add.container(x, y).setDepth(200);

    const bg = this.scene.add.graphics();
    const text = this.scene.add.text(8, 8, `${name}\n${description}`, {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#f8f0e3",
      wordWrap: { width: 180 },
      lineSpacing: 2,
    });

    const width = Math.max(text.width + 16, 100);
    const height = text.height + 16;
    bg.fillStyle(0x000000, 0.9);
    bg.lineStyle(1, 0x333333);
    bg.fillRoundedRect(0, 0, width, height, 4);
    bg.strokeRoundedRect(0, 0, width, height, 4);

    this.tooltip.add(bg);
    this.tooltip.add(text);
    this.container.add(this.tooltip);
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  destroy(): void {
    this.container.destroy();
  }
}

import Phaser from "phaser";
import { InventoryManager } from "../systems/InventoryManager";
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

      // Simple colored square as placeholder for pixel art icons
      let color = 0xc9a96e; // default gold
      if (item.id === "squirrelBlood" || item.id === "brentsBlood")
        color = 0xff4444;
      if (item.id === "flower") color = 0xff88aa;
      if (item.id === "samsKiss") color = 0x7eb8c9;
      if (item.id === "marshmallow") color = 0xf8f0e3;

      icon.fillStyle(color, alpha);
      icon.fillRoundedRect(x + 4, 4, SLOT_SIZE - 8, SLOT_SIZE - 8, 3);
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

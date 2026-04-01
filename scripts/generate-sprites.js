/**
 * SCOUTS Character World Sprite Generator
 * Generates 48x64 RPG-style standing sprites for each character.
 * Each character gets 2 frames: idle-A (weight left) and idle-B (weight right / slight sway).
 * No anti-aliasing. Pixel-perfect.
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// ─── Utilities ───────────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function savePng(canvas, filePath) {
  ensureDir(path.dirname(filePath));
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buf);
  console.log(`  Saved: ${filePath} (${buf.length} bytes)`);
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function px(ctx, x, y, color) {
  rect(ctx, x, y, 1, 1, color);
}

// ─── Character Definitions ───────────────────────────────────────────────────
// Height is the total sprite height used (sprite canvas is always 48x64).
// Body starts from top = 64 - height, so shorter characters have more blank space at top.

const CHARACTERS = {
  simon: {
    height: 56,
    build: 'slim',
    accentColor: '#d4a0d0',   // lavender
    hairColor: '#8b6040',
    skinBase: '#f0d0b0',
    skinShadow: '#d0b090',
    glasses: false,
    buzzcut: false,
    messyHair: false,
  },
  sam: {
    height: 60,
    build: 'average',
    accentColor: '#7eb8c9',   // blue
    hairColor: '#2a2020',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    glasses: false,
    buzzcut: false,
    messyHair: false,
  },
  brent: {
    height: 64,
    build: 'wide',
    accentColor: '#ff4444',   // red
    hairColor: '#4a3828',
    skinBase: '#dab890',
    skinShadow: '#ba9870',
    glasses: false,
    buzzcut: true,
    messyHair: false,
  },
  josh: {
    height: 58,
    build: 'stocky',
    accentColor: '#8a9a5a',   // olive
    hairColor: '#5a4030',
    skinBase: '#e0c098',
    skinShadow: '#c0a078',
    glasses: false,
    buzzcut: false,
    messyHair: false,
  },
  noah: {
    height: 58,
    build: 'average',
    accentColor: '#d4a44a',   // amber
    hairColor: '#3a2820',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    glasses: true,
    buzzcut: false,
    messyHair: false,
  },
  lucas: {
    height: 56,
    build: 'thin',
    accentColor: '#5a9a8a',   // teal
    hairColor: '#6a4a30',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    glasses: false,
    buzzcut: false,
    messyHair: true,
  },
};

// ─── Scout Uniform Colors ─────────────────────────────────────────────────────
const SHIRT   = '#6b7a4a';
const SHIRT_D = '#556639';
const SHIRT_H = '#7c8b5a';
const PANTS   = '#4a3828';
const PANTS_D = '#382818';
const BOOTS   = '#2a1e14';
const BOOT_H  = '#3a2e24';

// ─── Sprite Renderer ──────────────────────────────────────────────────────────

/**
 * Draw a single sprite frame onto ctx.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} char  character definition
 * @param {number} frame 0 = idle-A, 1 = idle-B (slight weight shift)
 */
function drawSprite(ctx, char, frame) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;

  const W = 48;
  const H = 64;
  const top = H - char.height; // vertical offset so shorter chars sit on the same baseline

  // Build widths
  const bodyW = char.build === 'wide' ? 20 : char.build === 'stocky' ? 18 : char.build === 'thin' ? 13 : 16;
  const legW  = char.build === 'wide' ? 9  : char.build === 'stocky' ? 8  : char.build === 'thin' ? 5  : 6;
  const bodyX = Math.floor((W - bodyW) / 2);

  // ── Heights (relative to char.height) ────────────────────────────────────
  const headH   = 14;                   // head height
  const neckH   = 2;
  const shirtH  = Math.floor(char.height * 0.35);
  const pantsH  = Math.floor(char.height * 0.30);
  const bootH   = char.height - headH - neckH - shirtH - pantsH;
  const headW   = char.build === 'wide' ? 16 : char.build === 'stocky' ? 14 : 12;

  // ── Y positions ──────────────────────────────────────────────────────────
  const headY  = top;
  const neckY  = headY + headH;
  const shirtY = neckY + neckH;
  const pantsY = shirtY + shirtH;
  const bootY  = pantsY + pantsH;

  // Frame shift: idle-B shifts weight slightly (body 1px, one leg offset)
  const bodyShift = frame === 1 ? 1 : 0;

  // ── Head ─────────────────────────────────────────────────────────────────
  const headX = Math.floor((W - headW) / 2);
  rect(ctx, headX, headY, headW, headH, char.skinBase);
  // shadow on right side
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, char.skinShadow);

  // ── Face details ─────────────────────────────────────────────────────────
  const faceY = headY + 4;
  // Eyes (2x2 each)
  rect(ctx, headX + 2, faceY, 2, 2, '#1a1010');
  rect(ctx, headX + headW - 4, faceY, 2, 2, '#1a1010');
  // Eye whites / highlight
  px(ctx, headX + 2, faceY, '#fffaf0');
  px(ctx, headX + headW - 4, faceY, '#fffaf0');
  px(ctx, headX + 3, faceY, '#1a1010');
  px(ctx, headX + headW - 3, faceY, '#1a1010');

  // Glasses (Noah)
  if (char.glasses) {
    // Two tiny rectangles around eyes
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.strokeRect(headX + 1.5, faceY - 0.5, 4, 3);
    ctx.strokeRect(headX + headW - 5.5, faceY - 0.5, 4, 3);
    // bridge
    px(ctx, headX + 5, faceY + 1, '#888888');
  }

  // Mouth (small line)
  const mouthY = headY + headH - 4;
  const mouthX = headX + Math.floor(headW / 2) - 2;
  rect(ctx, mouthX, mouthY, 4, 1, '#8b5a5a');

  // Blush (Simon only — slight femme softness)
  if (char.accentColor === '#d4a0d0') {
    px(ctx, headX + 2, mouthY - 1, '#e8a0b0');
    px(ctx, headX + headW - 3, mouthY - 1, '#e8a0b0');
  }

  // ── Hair ─────────────────────────────────────────────────────────────────
  const hairH = 5;
  if (char.buzzcut) {
    // Very short, close to head top — just a thin strip
    rect(ctx, headX, headY, headW, 3, char.hairColor);
    // sides
    rect(ctx, headX, headY, 2, headH - 2, char.hairColor);
    rect(ctx, headX + headW - 2, headY, 2, headH - 2, char.hairColor);
  } else if (char.messyHair) {
    // Messy spiky top
    rect(ctx, headX, headY, headW, hairH, char.hairColor);
    // spikes
    px(ctx, headX + 2, headY - 2, char.hairColor);
    px(ctx, headX + 5, headY - 3, char.hairColor);
    px(ctx, headX + 8, headY - 2, char.hairColor);
    px(ctx, headX + headW - 2, headY - 1, char.hairColor);
    // sides hang down
    rect(ctx, headX, headY, 2, headH - 3, char.hairColor);
    rect(ctx, headX + headW - 2, headY, 2, headH - 4, char.hairColor);
  } else {
    // Standard hair: top cap + sides
    rect(ctx, headX, headY, headW, hairH, char.hairColor);
    rect(ctx, headX, headY, 2, headH - 2, char.hairColor);
    rect(ctx, headX + headW - 2, headY, 2, headH - 2, char.hairColor);
  }

  // ── Neck ─────────────────────────────────────────────────────────────────
  const neckW = 6;
  const neckX = Math.floor((W - neckW) / 2);
  rect(ctx, neckX, neckY, neckW, neckH, char.skinBase);

  // ── Scout Shirt ──────────────────────────────────────────────────────────
  const bx = bodyX + bodyShift;
  rect(ctx, bx, shirtY, bodyW, shirtH, SHIRT);
  // Shadow on right side
  rect(ctx, bx + bodyW - 3, shirtY, 3, shirtH, SHIRT_D);
  // Highlight on left shoulder
  rect(ctx, bx, shirtY, 2, shirtH - 2, SHIRT_H);
  // Collar notch (V shape at top center)
  const collarX = Math.floor(bx + bodyW / 2) - 2;
  rect(ctx, collarX, shirtY, 4, 3, char.skinBase);

  // Neckerchief / accent scarf at collar
  rect(ctx, collarX - 1, shirtY, 6, 5, char.accentColor);
  // Darken neckerchief tip (triangle shape approximation)
  px(ctx, collarX + 2, shirtY + 5, char.accentColor);
  px(ctx, collarX + 3, shirtY + 5, char.accentColor);
  px(ctx, collarX + 2, shirtY + 6, char.accentColor);

  // Merit badge dot on left chest
  px(ctx, bx + 4, shirtY + 4, '#d4c44a');
  px(ctx, bx + 4, shirtY + 5, '#a09030');

  // ── Pants ────────────────────────────────────────────────────────────────
  rect(ctx, bx, pantsY, bodyW, pantsH, PANTS);
  rect(ctx, bx + bodyW - 3, pantsY, 3, pantsH, PANTS_D);
  // Center seam
  const seam = Math.floor(bx + bodyW / 2);
  rect(ctx, seam, pantsY, 1, pantsH, PANTS_D);

  // ── Boots ────────────────────────────────────────────────────────────────
  const legGap = char.build === 'wide' ? 2 : 1;
  const leftLegX  = bx;
  const rightLegX = bx + bodyW - legW;

  // Frame-dependent foot shifts
  const leftFootY  = bootY + (frame === 1 ? 0 : 0);
  const rightFootY = bootY + (frame === 1 ? 1 : 0); // idle-B: right foot slightly down

  rect(ctx, leftLegX,  leftFootY,  legW, bootH, BOOTS);
  rect(ctx, rightLegX, rightFootY, legW, bootH, BOOTS);
  // Boot highlight (toe)
  px(ctx, leftLegX + 1,  leftFootY  + bootH - 2, BOOT_H);
  px(ctx, rightLegX + 1, rightFootY + bootH - 2, BOOT_H);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const OUT_DIR = path.join(__dirname, '../public/assets/sprites/characters');

function generateAllSprites() {
  console.log('Generating character world sprites (48x64)...\n');

  for (const [name, char] of Object.entries(CHARACTERS)) {
    // Frame 0: idle-A (standing still)
    const canvasA = createCanvas(48, 64);
    const ctxA = canvasA.getContext('2d');
    ctxA.imageSmoothingEnabled = false;
    drawSprite(ctxA, char, 0);
    savePng(canvasA, path.join(OUT_DIR, `${name}-sprite.png`));

    // Frame 1: idle-B (slight shift) — stored as separate file for future spritesheet use
    const canvasB = createCanvas(48, 64);
    const ctxB = canvasB.getContext('2d');
    ctxB.imageSmoothingEnabled = false;
    drawSprite(ctxB, char, 1);
    savePng(canvasB, path.join(OUT_DIR, `${name}-sprite-b.png`));

    console.log(`  Done: ${name}\n`);
  }

  console.log('All sprites generated.');
}

generateAllSprites();

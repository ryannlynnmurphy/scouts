/**
 * SCOUTS Comprehensive Asset Generator
 * Production-accurate sprites, portraits, backgrounds, props, and items
 * Based on the 2026-04-01 Visual Design Deep Dive
 *
 * Generates:
 *   A. Character world sprites (48x64) with costume variants
 *   B. Character portraits (128x128) with expressions
 *   C. Backgrounds (960x540)
 *   D. Props (various sizes)
 *   E. Inventory icons (32x32)
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

/** Fill a circle (for portraits/backgrounds) */
function fillCircle(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Draw an ellipse */
function fillEllipse(ctx, cx, cy, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Lerp between two hex colors */
function lerpColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t), g = Math.round(g1 + (g2 - g1) * t), b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

let fileCount = 0;

// ─── Output Directories ─────────────────────────────────────────────────────

const BASE = path.join(__dirname, '..');
const CHAR_DIR = path.join(BASE, 'public/assets/sprites/characters');
const BG_DIR   = path.join(BASE, 'public/assets/sprites/backgrounds');
const ITEM_DIR = path.join(BASE, 'public/assets/sprites/items');
const PROP_DIR = path.join(BASE, 'public/assets/sprites/props');

// ─── Scout Uniform Colors ────────────────────────────────────────────────────

const SHIRT     = '#c2a872'; // tan/khaki BSA shirt
const SHIRT_D   = '#a89060'; // shadow
const SHIRT_H   = '#d4ba84'; // highlight
const NECKERCHIEF_RED = '#a03030'; // maroon-red
const PANTS_KHAKI = '#b0986a';
const PANTS_KHAKI_D = '#988060';
const PANTS_DARK = '#4a5040'; // dark olive
const PANTS_DARK_D = '#3a4030';
const BOOTS_BROWN = '#5a3a20';
const BOOTS_BROWN_H = '#6a4a30';
const BOOTS_DARK = '#2a1e14';
const BOOTS_DARK_H = '#3a2e24';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION A: CHARACTER WORLD SPRITES (48x64)
// ═══════════════════════════════════════════════════════════════════════════════

function drawSimonSprite(ctx, frame, variant) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#f0d0b0';
  const skinShadow = '#d0b090';
  const hairColor = '#8b6040';
  const hairHi = '#a07858';

  // -- HAIR (curly, widest, falls past ears) --
  // Hair crown (wider than head)
  const headX = 16, headY = 12, headW = 14, headH = 14;
  // Curly volume: 2-3px wider on each side
  rect(ctx, headX - 3, headY - 2, headW + 6, 7, hairColor);
  // Curly bumps on top
  px(ctx, headX - 2, headY - 3, hairColor);
  px(ctx, headX + 1, headY - 3, hairColor);
  px(ctx, headX + 4, headY - 4, hairColor);
  px(ctx, headX + 7, headY - 3, hairColor);
  px(ctx, headX + 10, headY - 3, hairColor);
  px(ctx, headX + headW, headY - 2, hairColor);
  // Sides fall past ears
  rect(ctx, headX - 3, headY, 3, headH - 2, hairColor);
  rect(ctx, headX + headW, headY, 3, headH - 2, hairColor);
  // Curly texture on sides
  px(ctx, headX - 4, headY + 3, hairColor);
  px(ctx, headX - 4, headY + 6, hairColor);
  px(ctx, headX + headW + 3, headY + 4, hairColor);
  px(ctx, headX + headW + 3, headY + 7, hairColor);
  // Highlights
  px(ctx, headX + 2, headY - 2, hairHi);
  px(ctx, headX + 6, headY - 3, hairHi);

  // -- HEAD --
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // Eyes
  rect(ctx, headX + 3, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + 3, headY + 5, '#fffaf0');
  rect(ctx, headX + headW - 5, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + headW - 5, headY + 5, '#fffaf0');

  // Blush (femme softness)
  px(ctx, headX + 2, headY + 8, '#e8a0b0');
  px(ctx, headX + headW - 3, headY + 8, '#e8a0b0');

  // Mouth
  rect(ctx, headX + 5, headY + 10, 4, 1, '#c07070');

  // -- NECK --
  rect(ctx, 21, 26, 6, 2, skinBase);

  const bodyW = 14;  // smallest/12px shoulders + shirt oversize
  const bodyX = 17 + shift;

  if (variant === 'pink') {
    // Pink striped shirt, no uniform
    const shirtY = 28, shirtH = 14;
    // Base pink
    rect(ctx, bodyX, shirtY, bodyW, shirtH, '#ff8888');
    // Horizontal stripes (darker pink)
    for (let sy = shirtY + 1; sy < shirtY + shirtH; sy += 3) {
      rect(ctx, bodyX, sy, bodyW, 1, '#e06080');
    }
    // Sleeves slightly long
    rect(ctx, bodyX - 2, shirtY, 2, 8, '#ff8888');
    rect(ctx, bodyX + bodyW, shirtY, 2, 8, '#ff8888');
    // Arms
    rect(ctx, bodyX - 2, shirtY + 8, 2, 4, skinBase);
    rect(ctx, bodyX + bodyW, shirtY + 8, 2, 4, skinBase);
  } else {
    // Scout uniform - UNTUCKED, open collar
    const shirtY = 28, shirtH = 16; // longer because untucked
    rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
    rect(ctx, bodyX + bodyW - 2, shirtY, 2, shirtH, SHIRT_D);
    rect(ctx, bodyX, shirtY, 2, shirtH - 2, SHIRT_H);
    // Open collar showing PINK undershirt
    rect(ctx, bodyX + 5, shirtY, 4, 3, '#ff8888');
    // Loose neckerchief, off-center
    rect(ctx, bodyX + 3, shirtY, 5, 4, '#c2a060');
    px(ctx, bodyX + 4, shirtY + 4, '#c2a060');
    px(ctx, bodyX + 5, shirtY + 5, '#c2a060');
    // NO merit badges
    // Sleeves slightly long
    rect(ctx, bodyX - 2, shirtY, 2, 10, SHIRT);
    rect(ctx, bodyX + bodyW, shirtY, 2, 10, SHIRT);
    // Arms (skin below sleeves)
    rect(ctx, bodyX - 2, shirtY + 10, 2, 3, skinBase);
    rect(ctx, bodyX + bodyW, shirtY + 10, 2, 3, skinBase);
    // Untucked bottom edge (uneven)
    px(ctx, bodyX + 1, shirtY + shirtH, SHIRT);
    px(ctx, bodyX + 3, shirtY + shirtH, SHIRT);
    px(ctx, bodyX + bodyW - 2, shirtY + shirtH, SHIRT);
  }

  // -- SHORTS (past knee, longer than others) --
  const pantsY = variant === 'pink' ? 42 : 44;
  const pantsH = 10;
  rect(ctx, bodyX, pantsY, bodyW, pantsH, PANTS_KHAKI);
  rect(ctx, bodyX + bodyW - 2, pantsY, 2, pantsH, PANTS_KHAKI_D);
  rect(ctx, bodyX + 6, pantsY, 1, pantsH, PANTS_KHAKI_D); // center seam

  // -- LAVENDER SNEAKERS --
  const bootY = pantsY + pantsH;
  const bootH = 64 - bootY;
  rect(ctx, bodyX, bootY, 6, bootH, '#d4a0d0');
  rect(ctx, bodyX + bodyW - 6, bootY, 6, bootH, '#d4a0d0');
  // Sole
  rect(ctx, bodyX, bootY + bootH - 1, 7, 1, '#b080b0');
  rect(ctx, bodyX + bodyW - 7, bootY + bootH - 1, 7, 1, '#b080b0');

  // -- TOTE BAG STRAP (1px line over shoulder) --
  for (let ty = 26; ty < 42; ty++) {
    px(ctx, bodyX + bodyW + 1, ty, '#8a7050');
  }

  // Weight on one hip (posture)
  if (frame === 1) {
    // Slight lean - already handled by bodyX shift
  }
}

function drawSamSprite(ctx, frame, variant) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#c8a070';
  const skinShadow = '#a88050';
  const hairColor = '#1a1414';

  // -- HEAD --
  const headX = 16, headY = 8, headW = 14, headH = 14;
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // -- HAIR (short, dark, neat, clean line) --
  rect(ctx, headX, headY - 1, headW, 4, hairColor);
  rect(ctx, headX, headY, 2, 6, hairColor);
  rect(ctx, headX + headW - 2, headY, 2, 6, hairColor);

  // Eyes
  rect(ctx, headX + 3, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + 3, headY + 5, '#fffaf0');
  rect(ctx, headX + headW - 5, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + headW - 5, headY + 5, '#fffaf0');

  // Mouth (neutral/composed)
  rect(ctx, headX + 5, headY + 10, 4, 1, '#8b5a5a');

  // Gold cross necklace at neckline
  rect(ctx, 23, 22, 1, 3, '#c9a96e');
  px(ctx, 22, 23, '#c9a96e');
  px(ctx, 24, 23, '#c9a96e');

  // -- NECK --
  rect(ctx, 21, 22, 6, 2, skinBase);

  const bodyW = 16;
  const bodyX = 16 + shift;

  if (variant === 'relaxed') {
    // Unbuttoned collar, softer
    const shirtY = 24, shirtH = 14;
    rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
    rect(ctx, bodyX + bodyW - 2, shirtY, 2, shirtH, SHIRT_D);
    rect(ctx, bodyX, shirtY, 2, shirtH, SHIRT_H);
    // Open collar (wider)
    rect(ctx, bodyX + 5, shirtY, 6, 4, skinBase);
    // Neckerchief looser
    rect(ctx, bodyX + 4, shirtY + 1, 4, 3, NECKERCHIEF_RED);
    // Sleeves
    rect(ctx, bodyX - 2, shirtY, 2, 8, SHIRT);
    rect(ctx, bodyX + bodyW, shirtY, 2, 8, SHIRT);
    rect(ctx, bodyX - 2, shirtY + 8, 2, 4, skinBase);
    rect(ctx, bodyX + bodyW, shirtY + 8, 2, 4, skinBase);
    // Tucked
    rect(ctx, bodyX, shirtY + shirtH, bodyW, 1, PANTS_DARK);
  } else {
    // Properly buttoned and tucked scout shirt
    const shirtY = 24, shirtH = 14;
    rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
    rect(ctx, bodyX + bodyW - 2, shirtY, 2, shirtH, SHIRT_D);
    rect(ctx, bodyX, shirtY, 2, shirtH, SHIRT_H);
    // Proper collar
    rect(ctx, bodyX + 6, shirtY, 4, 2, skinBase);
    // Buttons down center
    for (let by = shirtY + 3; by < shirtY + shirtH; by += 3) {
      px(ctx, bodyX + 7, by, '#a09070');
    }
    // Properly tied neckerchief with slide clasp
    rect(ctx, bodyX + 4, shirtY, 8, 5, NECKERCHIEF_RED);
    px(ctx, bodyX + 7, shirtY + 2, '#c9a96e'); // gold slide clasp
    px(ctx, bodyX + 8, shirtY + 2, '#c9a96e');
    px(ctx, bodyX + 7, shirtY + 5, NECKERCHIEF_RED); // tip
    px(ctx, bodyX + 8, shirtY + 5, NECKERCHIEF_RED);
    // Merit badges (2-3 on left pocket)
    px(ctx, bodyX + 3, shirtY + 5, '#c9a96e');
    px(ctx, bodyX + 4, shirtY + 5, '#7eb8c9');
    px(ctx, bodyX + 3, shirtY + 6, '#8a9a5a');
    // Sleeves
    rect(ctx, bodyX - 2, shirtY, 2, 8, SHIRT);
    rect(ctx, bodyX + bodyW, shirtY, 2, 8, SHIRT);
    rect(ctx, bodyX - 2, shirtY + 8, 2, 4, skinBase);
    rect(ctx, bodyX + bodyW, shirtY + 8, 2, 4, skinBase);
    // Tucked belt line
    rect(ctx, bodyX, shirtY + shirtH, bodyW, 1, '#5a4a2a');
  }

  // -- SHORTS (dark olive, above knee) --
  const pantsY = 39;
  rect(ctx, bodyX, pantsY, bodyW, 10, PANTS_DARK);
  rect(ctx, bodyX + bodyW - 2, pantsY, 2, 10, PANTS_DARK_D);
  rect(ctx, bodyX + 7, pantsY, 1, 10, PANTS_DARK_D);

  // -- BROWN BOOTS --
  const bootY = 49;
  rect(ctx, bodyX, bootY, 7, 64 - bootY, BOOTS_BROWN);
  rect(ctx, bodyX + bodyW - 7, bootY, 7, 64 - bootY, BOOTS_BROWN);
  rect(ctx, bodyX, 63, 8, 1, BOOTS_BROWN_H);
  rect(ctx, bodyX + bodyW - 8, 63, 8, 1, BOOTS_BROWN_H);
}

function drawBrentSprite(ctx, frame, variant) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#dab890';
  const skinShadow = '#ba9870';
  const hairColor = '#3a2818';

  // -- HEAD (uses full 64px height) --
  const headX = 13, headY = 2, headW = 18, headH = 14;
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // Thick neck
  rect(ctx, 19, 16, 8, 3, skinBase);

  // -- HAIR (buzzcut, barely 2px) --
  rect(ctx, headX, headY, headW, 2, hairColor);
  rect(ctx, headX, headY, 2, 5, hairColor);
  rect(ctx, headX + headW - 2, headY, 2, 5, hairColor);

  // Eyes
  rect(ctx, headX + 4, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + 4, headY + 5, '#fffaf0');
  rect(ctx, headX + headW - 6, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + headW - 6, headY + 5, '#fffaf0');

  // GLASSES (2x4px rectangle across eyes -- the humanizing detail)
  if (variant !== 'tank') {
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1;
    ctx.strokeRect(headX + 3.5, headY + 4.5, 5, 3);
    ctx.strokeRect(headX + headW - 8.5, headY + 4.5, 5, 3);
    // Bridge
    rect(ctx, headX + 8, headY + 5, headW - 16, 1, '#555555');
  }

  // Mouth (hard line)
  rect(ctx, headX + 7, headY + 10, 5, 1, '#7a4a4a');

  const bodyW = 22; // BIGGEST
  const bodyX = 13 + shift;

  if (variant === 'tank') {
    // White tank top, blood-spattered, no glasses
    const shirtY = 19, shirtH = 16;
    rect(ctx, bodyX, shirtY, bodyW, shirtH, '#f0f0f0');
    rect(ctx, bodyX + bodyW - 3, shirtY, 3, shirtH, '#d8d8d8');
    // Tank top straps
    rect(ctx, bodyX + 3, shirtY, 3, shirtH, '#e8e8e8');
    rect(ctx, bodyX + bodyW - 6, shirtY, 3, shirtH, '#e8e8e8');
    // Blood spatters
    px(ctx, bodyX + 5, shirtY + 3, '#cc2020');
    px(ctx, bodyX + 6, shirtY + 4, '#cc2020');
    px(ctx, bodyX + 8, shirtY + 2, '#aa1818');
    px(ctx, bodyX + 10, shirtY + 6, '#cc2020');
    px(ctx, bodyX + 12, shirtY + 5, '#cc2020');
    px(ctx, bodyX + 7, shirtY + 8, '#aa1818');
    px(ctx, bodyX + 14, shirtY + 7, '#cc2020');
    px(ctx, bodyX + 4, shirtY + 10, '#cc2020');
    px(ctx, bodyX + 16, shirtY + 9, '#aa1818');
    px(ctx, bodyX + 9, shirtY + 11, '#cc2020');
    // Arms (bare, showing forearms)
    rect(ctx, bodyX - 3, shirtY + 2, 3, 12, skinBase);
    rect(ctx, bodyX + bodyW, shirtY + 2, 3, 12, skinBase);
    // Blood on hands
    rect(ctx, bodyX - 3, shirtY + 12, 3, 3, '#cc2020');
    rect(ctx, bodyX + bodyW, shirtY + 12, 3, 3, '#cc2020');
  } else {
    // Full scout uniform, tucked TIGHT, sleeves rolled
    const shirtY = 19, shirtH = 16;
    rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
    rect(ctx, bodyX + bodyW - 3, shirtY, 3, shirtH, SHIRT_D);
    rect(ctx, bodyX, shirtY, 2, shirtH, SHIRT_H);
    // Collar
    rect(ctx, bodyX + 8, shirtY, 6, 2, skinBase);
    // RED neckerchief prominently displayed with polished slide
    rect(ctx, bodyX + 6, shirtY, 10, 6, '#cc3030');
    px(ctx, bodyX + 10, shirtY + 3, '#c9a96e'); // polished slide
    px(ctx, bodyX + 11, shirtY + 3, '#c9a96e');
    px(ctx, bodyX + 10, shirtY + 6, '#cc3030'); // tip
    px(ctx, bodyX + 11, shirtY + 6, '#cc3030');
    // Buttons
    for (let by = shirtY + 4; by < shirtY + shirtH; by += 3) {
      px(ctx, bodyX + 10, by, '#a09070');
    }
    // MOST merit badges/patches
    px(ctx, bodyX + 3, shirtY + 4, '#c9a96e');
    px(ctx, bodyX + 4, shirtY + 4, '#ff4444');
    px(ctx, bodyX + 5, shirtY + 4, '#7eb8c9');
    px(ctx, bodyX + 3, shirtY + 5, '#8a9a5a');
    px(ctx, bodyX + 4, shirtY + 5, '#d4a44a');
    px(ctx, bodyX + 5, shirtY + 5, '#c9a96e');
    px(ctx, bodyX + 3, shirtY + 6, '#7eb8c9');
    px(ctx, bodyX + 4, shirtY + 6, '#ff4444');
    // Troop number suggestion on sleeve
    px(ctx, bodyX + bodyW - 4, shirtY + 3, '#a09070');
    px(ctx, bodyX + bodyW - 3, shirtY + 3, '#a09070');
    // Rolled sleeves showing forearms
    rect(ctx, bodyX - 3, shirtY, 3, 6, SHIRT);
    rect(ctx, bodyX + bodyW, shirtY, 3, 6, SHIRT);
    rect(ctx, bodyX - 3, shirtY + 6, 3, 8, skinBase); // forearms visible
    rect(ctx, bodyX + bodyW, shirtY + 6, 3, 8, skinBase);
    // Belt (tucked tight)
    rect(ctx, bodyX, shirtY + shirtH, bodyW, 1, '#3a2a1a');
  }

  // -- FULL-LENGTH PANTS (only character in pants) --
  const pantsY = variant === 'tank' ? 35 : 36;
  const pantsH = variant === 'tank' ? 20 : 19;
  rect(ctx, bodyX, pantsY, bodyW, pantsH, '#4a4030');
  rect(ctx, bodyX + bodyW - 3, pantsY, 3, pantsH, '#3a3020');
  rect(ctx, bodyX + 10, pantsY, 1, pantsH, '#3a3020'); // seam

  // -- HEAVY DARK BOOTS (wide) --
  const bootY = pantsY + pantsH;
  const bootH = 64 - bootY;
  rect(ctx, bodyX - 1, bootY, 11, bootH, BOOTS_DARK);
  rect(ctx, bodyX + bodyW - 10, bootY, 11, bootH, BOOTS_DARK);
  rect(ctx, bodyX - 1, 63, 12, 1, BOOTS_DARK_H);
  rect(ctx, bodyX + bodyW - 11, 63, 12, 1, BOOTS_DARK_H);
}

function drawJoshSprite(ctx, frame) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#e0c098';
  const skinShadow = '#c0a078';
  const hairColor = '#5a4030';

  // -- HEAD --
  const headX = 15, headY = 8, headW = 16, headH = 14;
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // -- HAIR (short, parted to one side) --
  rect(ctx, headX, headY - 1, headW, 4, hairColor);
  // Part to left side
  rect(ctx, headX, headY, 3, 6, hairColor);
  rect(ctx, headX + headW - 2, headY, 2, 5, hairColor);
  // Part line
  px(ctx, headX + 5, headY, skinBase);

  // Eyes
  rect(ctx, headX + 3, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + 3, headY + 5, '#fffaf0');
  rect(ctx, headX + headW - 5, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + headW - 5, headY + 5, '#fffaf0');

  // Mouth
  rect(ctx, headX + 6, headY + 10, 4, 1, '#8b5a5a');

  // Neck
  rect(ctx, 20, 22, 7, 2, skinBase);

  const bodyW = 20; // STOCKY
  const bodyX = 14 + shift;

  // Scout shirt PERFECT regulation, tucked, crisp
  const shirtY = 24, shirtH = 14;
  rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
  rect(ctx, bodyX + bodyW - 3, shirtY, 3, shirtH, SHIRT_D);
  rect(ctx, bodyX, shirtY, 2, shirtH, SHIRT_H);
  // Collar
  rect(ctx, bodyX + 7, shirtY, 6, 2, skinBase);
  // Regulation neckerchief
  rect(ctx, bodyX + 6, shirtY, 8, 5, NECKERCHIEF_RED);
  px(ctx, bodyX + 9, shirtY + 5, NECKERCHIEF_RED);
  px(ctx, bodyX + 10, shirtY + 5, NECKERCHIEF_RED);
  // Buttons
  for (let by = shirtY + 3; by < shirtY + shirtH; by += 3) {
    px(ctx, bodyX + 9, by, '#a09070');
  }
  // Several merit badges
  px(ctx, bodyX + 3, shirtY + 4, '#c9a96e');
  px(ctx, bodyX + 4, shirtY + 4, '#8a9a5a');
  px(ctx, bodyX + 3, shirtY + 5, '#7eb8c9');
  px(ctx, bodyX + 4, shirtY + 5, '#c9a96e');
  // Sleeves (arms slightly bigger)
  rect(ctx, bodyX - 3, shirtY, 3, 8, SHIRT);
  rect(ctx, bodyX + bodyW, shirtY, 3, 8, SHIRT);
  rect(ctx, bodyX - 3, shirtY + 8, 3, 5, skinBase);
  rect(ctx, bodyX + bodyW, shirtY + 8, 3, 5, skinBase);
  // Tight belt
  rect(ctx, bodyX, shirtY + shirtH, bodyW, 2, '#5a4a2a');
  px(ctx, bodyX + 9, shirtY + shirtH, '#c9a96e'); // belt buckle

  // -- KHAKI SHORTS (regulation) --
  const pantsY = 40;
  rect(ctx, bodyX, pantsY, bodyW, 10, PANTS_KHAKI);
  rect(ctx, bodyX + bodyW - 2, pantsY, 2, 10, PANTS_KHAKI_D);
  rect(ctx, bodyX + 9, pantsY, 1, 10, PANTS_KHAKI_D);

  // -- MILITARY BOOTS (laced tight) --
  const bootY = 50;
  rect(ctx, bodyX, bootY, 9, 64 - bootY, BOOTS_DARK);
  rect(ctx, bodyX + bodyW - 9, bootY, 9, 64 - bootY, BOOTS_DARK);
  // Lacing detail
  for (let ly = bootY + 1; ly < 63; ly += 2) {
    px(ctx, bodyX + 4, ly, '#4a3a2a');
    px(ctx, bodyX + bodyW - 5, ly, '#4a3a2a');
  }
  rect(ctx, bodyX, 63, 10, 1, BOOTS_DARK_H);
  rect(ctx, bodyX + bodyW - 10, 63, 10, 1, BOOTS_DARK_H);
}

function drawNoahSprite(ctx, frame) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#e8c8a0';
  const skinShadow = '#c8a878';
  const hairColor = '#2a2018';

  // -- HEAD --
  const headX = 16, headY = 8, headW = 14, headH = 14;
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // -- HAIR (dark, messy, falls across forehead, medium length, emo-adjacent) --
  rect(ctx, headX - 1, headY - 1, headW + 2, 5, hairColor);
  // Falls across forehead
  rect(ctx, headX - 1, headY, 4, 7, hairColor);
  rect(ctx, headX + headW - 2, headY, 3, 6, hairColor);
  // Messy fringe
  px(ctx, headX + 3, headY + 2, hairColor);
  px(ctx, headX + 5, headY + 3, hairColor);

  // Eyes
  rect(ctx, headX + 3, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + 3, headY + 5, '#fffaf0');
  rect(ctx, headX + headW - 5, headY + 5, 2, 2, '#1a1010');
  px(ctx, headX + headW - 5, headY + 5, '#fffaf0');

  // GLASSES (smaller, rounder than Brent's -- smart-kid glasses)
  ctx.strokeStyle = '#777777';
  ctx.lineWidth = 1;
  ctx.strokeRect(headX + 2.5, headY + 4.5, 4, 3);
  ctx.strokeRect(headX + headW - 6.5, headY + 4.5, 4, 3);
  px(ctx, headX + 6, headY + 5, '#777777'); // bridge

  // Mouth (slight smirk)
  rect(ctx, headX + 5, headY + 10, 4, 1, '#8b5a5a');
  px(ctx, headX + 9, headY + 9, '#8b5a5a');

  // Neck
  rect(ctx, 21, 22, 6, 2, skinBase);

  const bodyW = 16;
  const bodyX = 16 + shift;

  // Scout shirt UNBUTTONED over dark t-shirt (worn as jacket)
  const shirtY = 24, shirtH = 14;
  // Dark t-shirt underneath
  rect(ctx, bodyX + 2, shirtY, bodyW - 4, shirtH, '#2a2a2a');
  // Open scout shirt as jacket
  rect(ctx, bodyX, shirtY, 4, shirtH, SHIRT);
  rect(ctx, bodyX + bodyW - 4, shirtY, 4, shirtH, SHIRT);
  rect(ctx, bodyX, shirtY, bodyW, 2, SHIRT); // shoulders
  // Sleeves
  rect(ctx, bodyX - 2, shirtY, 2, 10, SHIRT);
  rect(ctx, bodyX + bodyW, shirtY, 2, 10, SHIRT);
  rect(ctx, bodyX - 2, shirtY + 10, 2, 3, skinBase);
  rect(ctx, bodyX + bodyW, shirtY + 10, 2, 3, skinBase);

  // Neckerchief tied around WRIST instead of neck
  rect(ctx, bodyX - 3, shirtY + 10, 4, 2, '#d4a44a');

  // -- DARK NON-REGULATION SHORTS --
  const pantsY = 38;
  rect(ctx, bodyX, pantsY, bodyW, 11, '#2a2a2a');
  rect(ctx, bodyX + bodyW - 2, pantsY, 2, 11, '#1a1a1a');
  rect(ctx, bodyX + 7, pantsY, 1, 11, '#1a1a1a');

  // Crossed arms suggestion (slouched posture)
  // Arms overlap torso slightly
  rect(ctx, bodyX + 2, shirtY + 8, bodyW - 4, 2, skinBase);

  // -- DARK SNEAKERS --
  const bootY = 49;
  rect(ctx, bodyX, bootY, 7, 64 - bootY, '#2a2a2a');
  rect(ctx, bodyX + bodyW - 7, bootY, 7, 64 - bootY, '#2a2a2a');
  rect(ctx, bodyX, 63, 8, 1, '#3a3a3a');
  rect(ctx, bodyX + bodyW - 8, 63, 8, 1, '#3a3a3a');
}

function drawLucasSprite(ctx, frame) {
  ctx.clearRect(0, 0, 48, 64);
  ctx.imageSmoothingEnabled = false;
  const shift = frame === 1 ? 1 : 0;

  const skinBase = '#e8c8a0';
  const skinShadow = '#c8a878';
  const hairColor = '#6a4a30';
  const hairHi = '#8a6a50';

  // -- HEAD (smallest character, 56px) --
  const headX = 17, headY = 12, headW = 12, headH = 13;
  rect(ctx, headX, headY, headW, headH, skinBase);
  rect(ctx, headX + headW - 2, headY + 2, 2, headH - 2, skinShadow);

  // -- HAIR (messy, sticking up, cowlick, 3-4px going different directions) --
  rect(ctx, headX - 1, headY - 1, headW + 2, 4, hairColor);
  // Cowlick and spikes
  px(ctx, headX + 1, headY - 3, hairColor);
  px(ctx, headX + 2, headY - 4, hairColor);
  px(ctx, headX + 5, headY - 3, hairColor);
  px(ctx, headX + 6, headY - 2, hairHi);
  px(ctx, headX + 8, headY - 3, hairColor);
  px(ctx, headX + 9, headY - 4, hairColor);
  px(ctx, headX + headW, headY - 2, hairColor);
  px(ctx, headX + headW + 1, headY - 1, hairColor);
  // Sides
  rect(ctx, headX - 1, headY, 2, 5, hairColor);
  rect(ctx, headX + headW - 1, headY, 2, 5, hairColor);

  // Eyes (head slightly tilted)
  rect(ctx, headX + 2, headY + 4, 2, 2, '#1a1010');
  px(ctx, headX + 2, headY + 4, '#fffaf0');
  rect(ctx, headX + headW - 4, headY + 5, 2, 2, '#1a1010'); // slightly offset = tilt
  px(ctx, headX + headW - 4, headY + 5, '#fffaf0');

  // Mouth
  rect(ctx, headX + 4, headY + 9, 3, 1, '#8b5a5a');

  // Neck
  rect(ctx, 21, 25, 5, 2, skinBase);

  const bodyW = 13; // THINNEST
  const bodyX = 17 + shift;

  // Scout shirt wrinkled, button in wrong hole (crooked)
  const shirtY = 27, shirtH = 13;
  rect(ctx, bodyX, shirtY, bodyW, shirtH, SHIRT);
  rect(ctx, bodyX + bodyW - 2, shirtY, 2, shirtH, SHIRT_D);
  // Crooked - one side hangs lower
  px(ctx, bodyX, shirtY + shirtH, SHIRT);
  px(ctx, bodyX + 1, shirtY + shirtH, SHIRT);
  // Collar
  rect(ctx, bodyX + 4, shirtY, 4, 2, skinBase);
  // Neckerchief tied in a BOW (not a knot)
  rect(ctx, bodyX + 3, shirtY, 6, 3, '#c2a060');
  px(ctx, bodyX + 2, shirtY + 1, '#c2a060'); // bow left wing
  px(ctx, bodyX + 9, shirtY + 1, '#c2a060'); // bow right wing
  px(ctx, bodyX + 1, shirtY + 1, '#c2a060');
  px(ctx, bodyX + 10, shirtY + 1, '#c2a060');
  // Wrong button alignment (crooked) -- buttons offset
  px(ctx, bodyX + 5, shirtY + 4, '#a09070');
  px(ctx, bodyX + 6, shirtY + 7, '#a09070');
  px(ctx, bodyX + 5, shirtY + 10, '#a09070');
  // Sleeves
  rect(ctx, bodyX - 2, shirtY, 2, 8, SHIRT);
  rect(ctx, bodyX + bodyW, shirtY, 2, 8, SHIRT);
  rect(ctx, bodyX - 2, shirtY + 8, 2, 3, skinBase);
  rect(ctx, bodyX + bodyW, shirtY + 8, 2, 3, skinBase);

  // Something small in hand (a stick)
  rect(ctx, bodyX + bodyW + 1, shirtY + 9, 1, 5, '#6a5030');

  // -- LONG CARGO SHORTS with BULGING pockets --
  const pantsY = 40;
  rect(ctx, bodyX - 1, pantsY, bodyW + 2, 12, PANTS_KHAKI); // wider from pockets
  rect(ctx, bodyX + bodyW - 1, pantsY, 2, 12, PANTS_KHAKI_D);
  rect(ctx, bodyX + 5, pantsY, 1, 12, PANTS_KHAKI_D);
  // Pocket bulges
  rect(ctx, bodyX - 2, pantsY + 2, 2, 5, PANTS_KHAKI);
  rect(ctx, bodyX + bodyW + 1, pantsY + 2, 2, 5, PANTS_KHAKI);

  // -- RED SNEAKERS (Spider-Man colors) --
  const bootY = 52;
  rect(ctx, bodyX, bootY, 6, 64 - bootY, '#ff3333');
  rect(ctx, bodyX + bodyW - 6, bootY, 6, 64 - bootY, '#ff3333');
  // White sole
  rect(ctx, bodyX, 63, 7, 1, '#e8e8e8');
  rect(ctx, bodyX + bodyW - 7, 63, 7, 1, '#e8e8e8');
  // Blue accents (Spider-Man)
  px(ctx, bodyX + 2, bootY + 1, '#3333cc');
  px(ctx, bodyX + bodyW - 3, bootY + 1, '#3333cc');
}

function generateAllWorldSprites() {
  console.log('\n=== A. CHARACTER WORLD SPRITES (48x64) ===\n');

  const sprites = [
    { name: 'simon', draw: drawSimonSprite, variants: [null, 'pink'] },
    { name: 'sam', draw: drawSamSprite, variants: [null, 'relaxed'] },
    { name: 'brent', draw: drawBrentSprite, variants: [null, 'tank'] },
    { name: 'josh', draw: drawJoshSprite, variants: [null] },
    { name: 'noah', draw: drawNoahSprite, variants: [null] },
    { name: 'lucas', draw: drawLucasSprite, variants: [null] },
  ];

  for (const { name, draw, variants } of sprites) {
    for (const variant of variants) {
      for (let frame = 0; frame < 2; frame++) {
        const canvas = createCanvas(48, 64);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        draw(ctx, frame, variant);

        let fname;
        if (variant && frame === 0) fname = `${name}-${variant}-sprite.png`;
        else if (variant && frame === 1) fname = `${name}-${variant}-sprite-b.png`;
        else if (frame === 0) fname = `${name}-sprite.png`;
        else fname = `${name}-sprite-b.png`;

        savePng(canvas, path.join(CHAR_DIR, fname));
        fileCount++;
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION B: CHARACTER PORTRAITS (128x128)
// ═══════════════════════════════════════════════════════════════════════════════

function drawPortraitBase(ctx, char, expression) {
  ctx.clearRect(0, 0, 128, 128);
  ctx.imageSmoothingEnabled = false;

  // Background - character's accent color, muted
  rect(ctx, 0, 0, 128, 128, '#1a1a2a');
  // Subtle color wash
  ctx.globalAlpha = 0.15;
  rect(ctx, 0, 0, 128, 128, char.color);
  ctx.globalAlpha = 1.0;

  // Vignette corners
  ctx.globalAlpha = 0.3;
  rect(ctx, 0, 0, 20, 20, '#000000');
  rect(ctx, 108, 0, 20, 20, '#000000');
  rect(ctx, 0, 108, 20, 20, '#000000');
  rect(ctx, 108, 108, 20, 20, '#000000');
  ctx.globalAlpha = 1.0;
}

function drawSimonPortrait(ctx, expression, variant) {
  const char = { color: '#d4a0d0', hairColor: '#8b6040', hairHi: '#a07858',
    skinBase: '#f0d0b0', skinShadow: '#d0b090' };
  drawPortraitBase(ctx, char, expression);

  // Head/face (large, centered)
  const hx = 30, hy = 28, hw = 68, hh = 72;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 8, hy + 8, 8, hh - 8, char.skinShadow);

  // Curly hair (widest, volumized)
  rect(ctx, hx - 12, hy - 10, hw + 24, 28, char.hairColor);
  // Curly bumps
  for (let i = 0; i < 8; i++) {
    const cx = hx - 10 + i * 12;
    rect(ctx, cx, hy - 14 - (i % 2) * 4, 8, 6, char.hairColor);
  }
  // Sides fall past ears
  rect(ctx, hx - 12, hy, 12, hh - 10, char.hairColor);
  rect(ctx, hx + hw, hy, 12, hh - 10, char.hairColor);
  // Curly texture on sides
  for (let i = 0; i < 4; i++) {
    px(ctx, hx - 14, hy + 10 + i * 14, char.hairColor);
    px(ctx, hx + hw + 12, hy + 12 + i * 14, char.hairColor);
  }
  // Highlights
  rect(ctx, hx + 10, hy - 8, 6, 3, char.hairHi);
  rect(ctx, hx + 30, hy - 10, 6, 3, char.hairHi);

  // Eyes
  const eyeY = hy + 28;
  // Left eye
  rect(ctx, hx + 12, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + 16, eyeY + 2, 8, 7, '#5a4030');
  rect(ctx, hx + 18, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + 19, eyeY + 3, '#ffffff'); // highlight
  // Right eye
  rect(ctx, hx + hw - 26, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + hw - 24, eyeY + 2, 8, 7, '#5a4030');
  rect(ctx, hx + hw - 22, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + hw - 21, eyeY + 3, '#ffffff');

  // Blush
  rect(ctx, hx + 8, eyeY + 14, 10, 4, '#e8a0b0');
  rect(ctx, hx + hw - 18, eyeY + 14, 10, 4, '#e8a0b0');

  // Nose
  rect(ctx, hx + 30, eyeY + 10, 6, 8, char.skinShadow);

  // Expression-specific mouth
  const mouthY = eyeY + 26;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 24, mouthY, 20, 3, '#c07070');
      break;
    case 'scared':
      // Open mouth, round
      rect(ctx, hx + 26, mouthY - 2, 16, 10, '#8a3030');
      rect(ctx, hx + 28, mouthY, 12, 6, '#5a2020');
      // Eyes wider
      rect(ctx, hx + 12, eyeY - 2, 14, 2, '#ffffff');
      rect(ctx, hx + hw - 26, eyeY - 2, 14, 2, '#ffffff');
      break;
    case 'defiant':
      // Set jaw, slight frown
      rect(ctx, hx + 24, mouthY, 20, 4, '#a05050');
      rect(ctx, hx + 22, mouthY + 4, 2, 2, '#a05050'); // corners down
      rect(ctx, hx + 44, mouthY + 4, 2, 2, '#a05050');
      // Furrowed brows
      rect(ctx, hx + 10, eyeY - 4, 16, 2, char.hairColor);
      rect(ctx, hx + hw - 26, eyeY - 4, 16, 2, char.hairColor);
      break;
    case 'hurt':
      // Downturned, trembling
      rect(ctx, hx + 24, mouthY, 20, 2, '#c07070');
      rect(ctx, hx + 22, mouthY + 2, 2, 2, '#c07070');
      rect(ctx, hx + 44, mouthY + 2, 2, 2, '#c07070');
      // Eyebrows up
      rect(ctx, hx + 12, eyeY - 6, 12, 2, char.hairColor);
      rect(ctx, hx + hw - 24, eyeY - 6, 12, 2, char.hairColor);
      break;
    case 'tender':
      // Soft smile
      rect(ctx, hx + 26, mouthY, 16, 3, '#c07070');
      rect(ctx, hx + 28, mouthY + 3, 12, 2, '#c07070');
      // Softer eyes (lids lowered)
      rect(ctx, hx + 12, eyeY, 14, 3, char.skinBase);
      rect(ctx, hx + hw - 26, eyeY, 14, 3, char.skinBase);
      break;
    case 'shattered':
      // Mouth open, crying
      rect(ctx, hx + 24, mouthY - 2, 20, 12, '#8a3030');
      rect(ctx, hx + 26, mouthY, 16, 8, '#5a2020');
      // Tears
      rect(ctx, hx + 10, eyeY + 10, 3, 16, '#7eb8c9');
      rect(ctx, hx + hw - 14, eyeY + 10, 3, 16, '#7eb8c9');
      break;
  }

  // Collar / costume
  const collarY = hy + hh - 4;
  if (variant === 'pink') {
    // Pink striped shirt
    rect(ctx, 10, collarY, 108, 128 - collarY, '#ff8888');
    for (let sy = collarY + 4; sy < 128; sy += 6) {
      rect(ctx, 10, sy, 108, 2, '#e06080');
    }
  } else {
    // Scout shirt with open collar, pink undershirt visible
    rect(ctx, 10, collarY, 108, 128 - collarY, SHIRT);
    rect(ctx, 42, collarY, 44, 10, '#ff8888'); // pink undershirt at collar
    // Loose neckerchief
    rect(ctx, 36, collarY + 2, 30, 12, '#c2a060');
    rect(ctx, 46, collarY + 14, 10, 8, '#c2a060'); // hanging down
    // Tote bag strap
    rect(ctx, 90, collarY - 10, 4, 128 - collarY + 10, '#8a7050');
  }
}

function drawSamPortrait(ctx, expression) {
  const char = { color: '#7eb8c9', hairColor: '#1a1414', hairHi: '#2a2424',
    skinBase: '#c8a070', skinShadow: '#a88050' };
  drawPortraitBase(ctx, char, expression);

  const hx = 30, hy = 30, hw = 68, hh = 70;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 8, hy + 8, 8, hh - 8, char.skinShadow);

  // Hair (short, dark, neat, clean line)
  rect(ctx, hx - 2, hy - 6, hw + 4, 18, char.hairColor);
  rect(ctx, hx - 2, hy, 4, 16, char.hairColor);
  rect(ctx, hx + hw - 2, hy, 4, 16, char.hairColor);

  // Eyes
  const eyeY = hy + 26;
  rect(ctx, hx + 12, eyeY, 14, 10, '#f0e8d8');
  rect(ctx, hx + 16, eyeY + 2, 8, 7, '#3a2818');
  rect(ctx, hx + 18, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + 19, eyeY + 3, '#ffffff');
  rect(ctx, hx + hw - 26, eyeY, 14, 10, '#f0e8d8');
  rect(ctx, hx + hw - 24, eyeY + 2, 8, 7, '#3a2818');
  rect(ctx, hx + hw - 22, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + hw - 21, eyeY + 3, '#ffffff');

  // Nose
  rect(ctx, hx + 30, eyeY + 10, 6, 8, char.skinShadow);

  const mouthY = eyeY + 26;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 26, mouthY, 16, 3, '#8b5a5a');
      break;
    case 'shy':
      rect(ctx, hx + 28, mouthY, 12, 2, '#8b5a5a');
      // Slight blush
      rect(ctx, hx + 10, eyeY + 14, 8, 4, '#c08070');
      rect(ctx, hx + hw - 18, eyeY + 14, 8, 4, '#c08070');
      // Eyes looking away (pupils shifted)
      break;
    case 'warm':
      // Warm smile
      rect(ctx, hx + 24, mouthY, 20, 3, '#a06060');
      rect(ctx, hx + 26, mouthY + 3, 16, 3, '#a06060');
      break;
    case 'conflicted':
      // Slight frown, eyebrows pinched
      rect(ctx, hx + 26, mouthY, 16, 2, '#8b5a5a');
      rect(ctx, hx + 24, mouthY + 2, 2, 2, '#8b5a5a');
      rect(ctx, hx + 14, eyeY - 4, 10, 2, char.hairColor);
      rect(ctx, hx + hw - 24, eyeY - 4, 10, 2, char.hairColor);
      break;
    case 'brave':
      // Set jaw, determined
      rect(ctx, hx + 24, mouthY, 20, 4, '#8b5a5a');
      rect(ctx, hx + 12, eyeY - 3, 14, 2, char.hairColor);
      rect(ctx, hx + hw - 26, eyeY - 3, 14, 2, char.hairColor);
      break;
  }

  // Collar - properly buttoned scout shirt
  const collarY = hy + hh - 4;
  rect(ctx, 10, collarY, 108, 128 - collarY, SHIRT);
  // Proper neckerchief with slide
  rect(ctx, 38, collarY, 52, 14, NECKERCHIEF_RED);
  rect(ctx, 58, collarY + 6, 12, 4, '#c9a96e'); // gold slide clasp
  rect(ctx, 60, collarY + 14, 8, 10, NECKERCHIEF_RED);
  // Gold cross necklace
  rect(ctx, 62, collarY - 4, 2, 6, '#c9a96e');
  rect(ctx, 60, collarY - 1, 6, 2, '#c9a96e');
  // Buttons
  for (let by = collarY + 8; by < 128; by += 8) {
    rect(ctx, 63, by, 2, 2, '#a09070');
  }
}

function drawBrentPortrait(ctx, expression) {
  const char = { color: '#ff4444', hairColor: '#3a2818', hairHi: '#4a3828',
    skinBase: '#dab890', skinShadow: '#ba9870' };
  drawPortraitBase(ctx, char, expression);

  const hx = 24, hy = 24, hw = 80, hh = 76;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 10, hy + 8, 10, hh - 8, char.skinShadow);

  // Buzzcut
  rect(ctx, hx - 2, hy - 4, hw + 4, 10, char.hairColor);
  rect(ctx, hx - 2, hy, 4, 10, char.hairColor);
  rect(ctx, hx + hw - 2, hy, 4, 10, char.hairColor);

  // Thick neck
  rect(ctx, 42, hy + hh - 4, 44, 10, char.skinBase);

  // Eyes
  const eyeY = hy + 24;
  rect(ctx, hx + 14, eyeY, 16, 10, '#ffffff');
  rect(ctx, hx + 18, eyeY + 2, 10, 7, '#4a3020');
  rect(ctx, hx + 20, eyeY + 3, 6, 5, '#1a1010');
  px(ctx, hx + 21, eyeY + 3, '#ffffff');
  rect(ctx, hx + hw - 30, eyeY, 16, 10, '#ffffff');
  rect(ctx, hx + hw - 28, eyeY + 2, 10, 7, '#4a3020');
  rect(ctx, hx + hw - 26, eyeY + 3, 6, 5, '#1a1010');
  px(ctx, hx + hw - 25, eyeY + 3, '#ffffff');

  // GLASSES (the humanizing detail) -- not on broken
  if (expression !== 'broken') {
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.strokeRect(hx + 12, eyeY - 2, 20, 14);
    ctx.strokeRect(hx + hw - 32, eyeY - 2, 20, 14);
    // Bridge
    rect(ctx, hx + 32, eyeY + 3, hw - 64, 2, '#444444');
    // Stems
    rect(ctx, hx + 8, eyeY + 2, 4, 2, '#444444');
    rect(ctx, hx + hw - 12, eyeY + 2, 4, 2, '#444444');
  }

  // Nose
  rect(ctx, hx + 34, eyeY + 10, 8, 10, char.skinShadow);

  const mouthY = eyeY + 28;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 28, mouthY, 24, 3, '#7a4a4a');
      break;
    case 'angry':
      // Bared teeth
      rect(ctx, hx + 24, mouthY - 2, 30, 10, '#5a2020');
      rect(ctx, hx + 26, mouthY, 26, 4, '#f0e0d0'); // teeth
      // Furrowed brows
      rect(ctx, hx + 12, eyeY - 6, 18, 3, char.hairColor);
      rect(ctx, hx + hw - 30, eyeY - 6, 18, 3, char.hairColor);
      break;
    case 'mocking':
      // Smirk
      rect(ctx, hx + 26, mouthY, 24, 4, '#7a4a4a');
      rect(ctx, hx + 50, mouthY - 2, 4, 4, '#7a4a4a'); // raised corner
      // One eyebrow up
      rect(ctx, hx + hw - 30, eyeY - 6, 16, 2, char.hairColor);
      break;
    case 'unhinged':
      // Wide open, teeth showing, eyes wide
      rect(ctx, hx + 22, mouthY - 4, 34, 16, '#5a2020');
      rect(ctx, hx + 24, mouthY - 2, 30, 4, '#f0e0d0');
      rect(ctx, hx + 24, mouthY + 6, 30, 4, '#f0e0d0');
      rect(ctx, hx + 14, eyeY - 3, 16, 2, '#ffffff');
      rect(ctx, hx + hw - 30, eyeY - 3, 16, 2, '#ffffff');
      break;
    case 'broken':
      // No glasses, blood on face, mouth open
      rect(ctx, hx + 26, mouthY - 2, 28, 12, '#5a2020');
      // Blood
      rect(ctx, hx + 10, eyeY + 6, 6, 20, '#cc2020');
      rect(ctx, hx + 36, hy + 10, 4, 14, '#cc2020');
      rect(ctx, hx + hw - 20, eyeY + 10, 4, 16, '#cc2020');
      // Tears?
      rect(ctx, hx + 14, eyeY + 10, 3, 12, '#7eb8c9');
      break;
  }

  // Collar
  const collarY = hy + hh - 2;
  if (expression === 'broken') {
    // White tank top with blood
    rect(ctx, 6, collarY, 116, 128 - collarY, '#f0f0f0');
    rect(ctx, 20, collarY, 8, 128 - collarY, '#e0e0e0');
    rect(ctx, 100, collarY, 8, 128 - collarY, '#e0e0e0');
    // Blood spatters
    for (let i = 0; i < 8; i++) {
      const bx = 20 + Math.floor(Math.random() * 88);
      const by = collarY + Math.floor(Math.random() * (128 - collarY));
      rect(ctx, bx, by, 4 + (i % 3) * 2, 3 + (i % 2) * 2, i % 2 === 0 ? '#cc2020' : '#aa1818');
    }
  } else {
    // Full scout uniform
    rect(ctx, 6, collarY, 116, 128 - collarY, SHIRT);
    // RED neckerchief
    rect(ctx, 34, collarY, 60, 16, '#cc3030');
    rect(ctx, 56, collarY + 8, 16, 6, '#c9a96e'); // polished slide
    rect(ctx, 58, collarY + 16, 12, 12, '#cc3030');
    // Merit badges
    for (let i = 0; i < 6; i++) {
      const bx = 14 + (i % 3) * 8;
      const by = collarY + 8 + Math.floor(i / 3) * 8;
      rect(ctx, bx, by, 6, 6, ['#c9a96e', '#ff4444', '#7eb8c9', '#8a9a5a', '#d4a44a', '#ff4444'][i]);
    }
  }
}

function drawJoshPortrait(ctx, expression) {
  const char = { color: '#8a9a5a', hairColor: '#5a4030', hairHi: '#6a5040',
    skinBase: '#e0c098', skinShadow: '#c0a078' };
  drawPortraitBase(ctx, char, expression);

  const hx = 26, hy = 26, hw = 76, hh = 74;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 8, hy + 8, 8, hh - 8, char.skinShadow);

  // Hair (short, parted)
  rect(ctx, hx - 2, hy - 4, hw + 4, 14, char.hairColor);
  px(ctx, hx + 16, hy, char.skinBase); // part line
  px(ctx, hx + 16, hy + 2, char.skinBase);
  rect(ctx, hx - 2, hy, 4, 12, char.hairColor);
  rect(ctx, hx + hw - 2, hy, 4, 10, char.hairColor);

  // Eyes
  const eyeY = hy + 26;
  rect(ctx, hx + 14, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + 17, eyeY + 2, 8, 7, '#4a3020');
  rect(ctx, hx + 19, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + 20, eyeY + 3, '#ffffff');
  rect(ctx, hx + hw - 28, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + hw - 25, eyeY + 2, 8, 7, '#4a3020');
  rect(ctx, hx + hw - 23, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + hw - 22, eyeY + 3, '#ffffff');

  // Nose
  rect(ctx, hx + 33, eyeY + 10, 6, 8, char.skinShadow);

  const mouthY = eyeY + 26;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 28, mouthY, 18, 3, '#8b5a5a');
      break;
    case 'eager':
      rect(ctx, hx + 26, mouthY, 22, 6, '#a06060');
      rect(ctx, hx + 28, mouthY + 2, 18, 3, '#f0e0d0'); // teeth showing in grin
      break;
    case 'angry':
      rect(ctx, hx + 26, mouthY, 22, 4, '#7a3030');
      rect(ctx, hx + 14, eyeY - 5, 14, 3, char.hairColor);
      rect(ctx, hx + hw - 28, eyeY - 5, 14, 3, char.hairColor);
      break;
    case 'scared':
      rect(ctx, hx + 28, mouthY - 2, 18, 10, '#8a3030');
      rect(ctx, hx + 30, mouthY, 14, 6, '#5a2020');
      rect(ctx, hx + 14, eyeY - 3, 14, 2, '#ffffff');
      rect(ctx, hx + hw - 28, eyeY - 3, 14, 2, '#ffffff');
      break;
  }

  // Collar - perfect regulation
  const collarY = hy + hh - 4;
  rect(ctx, 8, collarY, 112, 128 - collarY, SHIRT);
  rect(ctx, 40, collarY, 48, 14, NECKERCHIEF_RED);
  rect(ctx, 56, collarY + 14, 14, 10, NECKERCHIEF_RED);
  // Merit badges
  px(ctx, 18, collarY + 10, '#c9a96e');
  px(ctx, 22, collarY + 10, '#8a9a5a');
  px(ctx, 18, collarY + 14, '#7eb8c9');
  // Belt visible
  rect(ctx, 8, collarY + 24, 112, 4, '#5a4a2a');
  rect(ctx, 56, collarY + 24, 8, 4, '#c9a96e'); // buckle
}

function drawNoahPortrait(ctx, expression) {
  const char = { color: '#d4a44a', hairColor: '#2a2018', hairHi: '#3a3028',
    skinBase: '#e8c8a0', skinShadow: '#c8a878' };
  drawPortraitBase(ctx, char, expression);

  const hx = 30, hy = 28, hw = 68, hh = 72;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 8, hy + 8, 8, hh - 8, char.skinShadow);

  // Hair (dark, messy, falls across forehead)
  rect(ctx, hx - 4, hy - 6, hw + 8, 18, char.hairColor);
  rect(ctx, hx - 4, hy, 8, 20, char.hairColor);
  rect(ctx, hx + hw - 4, hy, 8, 16, char.hairColor);
  // Fringe across forehead
  rect(ctx, hx + 4, hy + 4, 16, 10, char.hairColor);
  rect(ctx, hx + 8, hy + 10, 10, 6, char.hairColor);

  // Eyes
  const eyeY = hy + 26;
  rect(ctx, hx + 14, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + 17, eyeY + 2, 8, 7, '#3a2818');
  rect(ctx, hx + 19, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + 20, eyeY + 3, '#ffffff');
  rect(ctx, hx + hw - 28, eyeY, 14, 10, '#ffffff');
  rect(ctx, hx + hw - 25, eyeY + 2, 8, 7, '#3a2818');
  rect(ctx, hx + hw - 23, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + hw - 22, eyeY + 3, '#ffffff');

  // GLASSES (smaller, rounder than Brent's)
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 2;
  // Round-ish frames
  ctx.beginPath();
  ctx.roundRect(hx + 11, eyeY - 2, 18, 14, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(hx + hw - 29, eyeY - 2, 18, 14, 4);
  ctx.stroke();
  rect(ctx, hx + 29, eyeY + 3, hw - 58, 2, '#666666'); // bridge

  // Nose
  rect(ctx, hx + 30, eyeY + 10, 6, 8, char.skinShadow);

  const mouthY = eyeY + 26;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 26, mouthY, 16, 3, '#8b5a5a');
      break;
    case 'smug':
      rect(ctx, hx + 26, mouthY, 18, 3, '#8b5a5a');
      rect(ctx, hx + 44, mouthY - 2, 4, 3, '#8b5a5a'); // smirk corner
      // One eyebrow raised
      rect(ctx, hx + hw - 28, eyeY - 7, 14, 2, char.hairColor);
      break;
    case 'nervous':
      rect(ctx, hx + 28, mouthY, 14, 2, '#8b5a5a');
      // Slight sweat drop
      rect(ctx, hx + hw - 10, hy + 20, 3, 5, '#7eb8c9');
      break;
    case 'defiant':
      rect(ctx, hx + 24, mouthY, 20, 4, '#7a4a4a');
      rect(ctx, hx + 12, eyeY - 5, 16, 3, char.hairColor);
      rect(ctx, hx + hw - 28, eyeY - 5, 16, 3, char.hairColor);
      break;
  }

  // Collar - unbuttoned over dark t-shirt
  const collarY = hy + hh - 4;
  rect(ctx, 10, collarY, 108, 128 - collarY, '#2a2a2a'); // dark t-shirt
  // Open scout shirt as jacket
  rect(ctx, 10, collarY, 20, 128 - collarY, SHIRT);
  rect(ctx, 98, collarY, 20, 128 - collarY, SHIRT);
  rect(ctx, 10, collarY, 108, 4, SHIRT); // shoulders
}

function drawLucasPortrait(ctx, expression) {
  const char = { color: '#5a9a8a', hairColor: '#6a4a30', hairHi: '#8a6a50',
    skinBase: '#e8c8a0', skinShadow: '#c8a878' };
  drawPortraitBase(ctx, char, expression);

  const hx = 34, hy = 32, hw = 60, hh = 66;
  rect(ctx, hx, hy, hw, hh, char.skinBase);
  rect(ctx, hx + hw - 6, hy + 6, 6, hh - 6, char.skinShadow);

  // Hair (messy, sticking up, cowlick)
  rect(ctx, hx - 4, hy - 6, hw + 8, 16, char.hairColor);
  // Spikes/cowlick going different directions
  rect(ctx, hx + 4, hy - 14, 6, 10, char.hairColor);
  rect(ctx, hx + 14, hy - 18, 6, 14, char.hairColor);
  rect(ctx, hx + 26, hy - 12, 6, 8, char.hairColor);
  rect(ctx, hx + 38, hy - 16, 6, 12, char.hairColor);
  rect(ctx, hx + hw - 4, hy - 10, 6, 8, char.hairColor);
  // Highlights
  px(ctx, hx + 16, hy - 16, char.hairHi);
  px(ctx, hx + 40, hy - 14, char.hairHi);
  // Sides
  rect(ctx, hx - 4, hy, 6, 14, char.hairColor);
  rect(ctx, hx + hw - 2, hy, 6, 12, char.hairColor);

  // Eyes (slightly tilted head)
  const eyeY = hy + 22;
  rect(ctx, hx + 10, eyeY, 12, 10, '#ffffff');
  rect(ctx, hx + 13, eyeY + 2, 7, 7, '#5a7040');
  rect(ctx, hx + 15, eyeY + 3, 4, 5, '#1a1010');
  px(ctx, hx + 16, eyeY + 3, '#ffffff');
  rect(ctx, hx + hw - 22, eyeY + 1, 12, 10, '#ffffff'); // offset for tilt
  rect(ctx, hx + hw - 19, eyeY + 3, 7, 7, '#5a7040');
  rect(ctx, hx + hw - 17, eyeY + 4, 4, 5, '#1a1010');
  px(ctx, hx + hw - 16, eyeY + 4, '#ffffff');

  // Nose
  rect(ctx, hx + 26, eyeY + 10, 5, 7, char.skinShadow);

  const mouthY = eyeY + 24;
  switch (expression) {
    case 'neutral':
      rect(ctx, hx + 22, mouthY, 14, 2, '#8b5a5a');
      break;
    case 'earnest':
      // Wide open smile
      rect(ctx, hx + 20, mouthY, 18, 6, '#a06060');
      rect(ctx, hx + 22, mouthY + 2, 14, 3, '#f0e0d0');
      // Big eyes
      rect(ctx, hx + 10, eyeY - 2, 12, 2, '#ffffff');
      rect(ctx, hx + hw - 22, eyeY - 1, 12, 2, '#ffffff');
      break;
    case 'uncomfortable':
      // Grimace
      rect(ctx, hx + 20, mouthY, 18, 4, '#8b5a5a');
      // Teeth showing as line
      rect(ctx, hx + 22, mouthY + 1, 14, 2, '#f0e0d0');
      break;
    case 'brave':
      rect(ctx, hx + 22, mouthY, 14, 4, '#8b5a5a');
      rect(ctx, hx + 10, eyeY - 4, 12, 2, char.hairColor);
      rect(ctx, hx + hw - 22, eyeY - 4, 12, 2, char.hairColor);
      break;
  }

  // Collar - wrinkled scout shirt, slightly crooked
  const collarY = hy + hh - 4;
  rect(ctx, 14, collarY, 100, 128 - collarY, SHIRT);
  // Crooked collar (one side higher)
  rect(ctx, 14, collarY - 2, 30, 4, SHIRT);
  rect(ctx, 84, collarY + 2, 30, 4, SHIRT);
  // Bow neckerchief
  rect(ctx, 44, collarY, 40, 8, '#c2a060');
  // Bow wings
  rect(ctx, 38, collarY + 2, 8, 4, '#c2a060');
  rect(ctx, 82, collarY + 2, 8, 4, '#c2a060');
  rect(ctx, 58, collarY + 8, 12, 8, '#c2a060');
}

function generateAllPortraits() {
  console.log('\n=== B. CHARACTER PORTRAITS (128x128) ===\n');

  const portraitDefs = [
    { name: 'simon', draw: drawSimonPortrait,
      expressions: ['neutral', 'scared', 'defiant', 'hurt', 'tender', 'shattered'],
      variants: [null, 'pink'] },
    { name: 'sam', draw: drawSamPortrait,
      expressions: ['neutral', 'shy', 'warm', 'conflicted', 'brave'] },
    { name: 'brent', draw: drawBrentPortrait,
      expressions: ['neutral', 'angry', 'mocking', 'unhinged', 'broken'] },
    { name: 'josh', draw: drawJoshPortrait,
      expressions: ['neutral', 'eager', 'angry', 'scared'] },
    { name: 'noah', draw: drawNoahPortrait,
      expressions: ['neutral', 'smug', 'nervous', 'defiant'] },
    { name: 'lucas', draw: drawLucasPortrait,
      expressions: ['neutral', 'earnest', 'uncomfortable', 'brave'] },
  ];

  for (const def of portraitDefs) {
    for (const expr of def.expressions) {
      const canvas = createCanvas(128, 128);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      def.draw(ctx, expr);
      savePng(canvas, path.join(CHAR_DIR, `${def.name}-${expr}.png`));
      fileCount++;
    }
    // Variant portraits (Simon pink)
    if (def.variants) {
      for (const v of def.variants) {
        if (!v) continue;
        for (const expr of def.expressions) {
          const canvas = createCanvas(128, 128);
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          def.draw(ctx, expr, v);
          savePng(canvas, path.join(CHAR_DIR, `${def.name}-${v}-${expr}.png`));
          fileCount++;
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION C: BACKGROUNDS (960x540)
// ═══════════════════════════════════════════════════════════════════════════════

function drawCampfireBackground(ctx) {
  const W = 960, H = 540;
  ctx.imageSmoothingEnabled = false;

  // Dark sky through canopy gaps
  rect(ctx, 0, 0, W, H, '#0a0a14');

  // Ground (dirt/leaves)
  rect(ctx, 0, 380, W, 160, '#3a2e1e');
  // Ground texture
  for (let i = 0; i < 200; i++) {
    const gx = Math.floor(Math.random() * W);
    const gy = 380 + Math.floor(Math.random() * 160);
    const gc = Math.random() > 0.5 ? '#4a3e2e' : '#2e2218';
    rect(ctx, gx, gy, 3 + Math.floor(Math.random() * 5), 2, gc);
  }
  // Scattered leaves
  for (let i = 0; i < 60; i++) {
    const lx = Math.floor(Math.random() * W);
    const ly = 385 + Math.floor(Math.random() * 150);
    rect(ctx, lx, ly, 3, 2, ['#5a4a20', '#4a6030', '#6a5028', '#3a4020'][i % 4]);
  }

  // Trees on edges (dark trunks)
  for (let i = 0; i < 3; i++) {
    const tx = 20 + i * 40;
    rect(ctx, tx, 100, 30, 300, '#1a1008');
    rect(ctx, tx + 4, 100, 22, 300, '#2a1a0e');
  }
  for (let i = 0; i < 3; i++) {
    const tx = W - 120 + i * 40;
    rect(ctx, tx, 80, 30, 320, '#1a1008');
    rect(ctx, tx + 4, 80, 22, 320, '#2a1a0e');
  }

  // Canopy (dark, blocking most sky)
  rect(ctx, 0, 0, W, 120, '#0e0e08');
  // Canopy hanging down sides
  rect(ctx, 0, 0, 160, 280, '#0e0e08');
  rect(ctx, W - 160, 0, 160, 260, '#0e0e08');
  // Canopy irregularity
  for (let i = 0; i < 40; i++) {
    const cx = 160 + Math.floor(Math.random() * (W - 320));
    const cy = 100 + Math.floor(Math.random() * 40);
    rect(ctx, cx, cy, 20 + Math.floor(Math.random() * 30), 10 + Math.floor(Math.random() * 20), '#0e0e08');
  }

  // Stars visible through gaps (small, cold, far away)
  for (let i = 0; i < 25; i++) {
    const sx = 180 + Math.floor(Math.random() * (W - 360));
    const sy = 10 + Math.floor(Math.random() * 90);
    px(ctx, sx, sy, '#aaaacc');
    if (Math.random() > 0.7) px(ctx, sx + 1, sy, '#8888aa');
  }

  // ── BRANCH ARCH (ribcage/cage structure) ──
  const archCX = W / 2, archBase = 380, archTop = 100, archW = 200;
  // Main arch branches
  for (let i = -5; i <= 5; i++) {
    const angle = (i / 5) * 0.8;
    const x1 = archCX + Math.sin(angle) * archW * 0.3;
    const x2 = archCX + Math.sin(angle) * archW;
    ctx.strokeStyle = '#3a2a14';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, archBase);
    ctx.quadraticCurveTo(archCX + i * 30, archTop + 40, x2 * 0.7 + archCX * 0.3, archTop);
    ctx.stroke();
  }
  // Cross branches
  for (let y = archTop + 30; y < archBase; y += 50) {
    ctx.strokeStyle = '#2a1a0a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const spread = ((y - archTop) / (archBase - archTop)) * archW * 0.8;
    ctx.moveTo(archCX - spread, y);
    ctx.lineTo(archCX + spread, y + 10);
    ctx.stroke();
  }

  // ── ROPE hanging from arch ──
  ctx.strokeStyle = '#6a5a3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(archCX + 60, archTop + 60);
  ctx.quadraticCurveTo(archCX + 65, archTop + 100, archCX + 55, archTop + 140);
  ctx.stroke();

  // ── TIRE with yellow-green ribbons (center ground) ──
  const tireX = W / 2 - 30, tireY = 400;
  // Tire outer
  fillEllipse(ctx, tireX + 30, tireY + 12, 30, 12, '#2a2a2a');
  fillEllipse(ctx, tireX + 30, tireY + 12, 22, 8, '#1a1a1a');
  // Yellow-green ribbons inside (the fake campfire)
  for (let r = 0; r < 8; r++) {
    const rx = tireX + 14 + Math.floor(Math.random() * 28);
    const ry = tireY + 4 + Math.floor(Math.random() * 12);
    const rh = 6 + Math.floor(Math.random() * 10);
    rect(ctx, rx, ry, 2, rh, Math.random() > 0.5 ? '#c8cc40' : '#88aa30');
  }

  // ── WHITE COOLER (stage right, near Brent's position) ──
  const coolerX = W - 260, coolerY = 400;
  rect(ctx, coolerX, coolerY, 40, 28, '#e8e8e8');
  rect(ctx, coolerX, coolerY, 40, 8, '#5588bb'); // blue lid
  rect(ctx, coolerX + 2, coolerY + 2, 36, 4, '#6698cc');
  // Handle
  rect(ctx, coolerX + 14, coolerY - 4, 12, 4, '#cccccc');

  // ── WOODEN CRATES scattered ──
  const cratePositions = [[220, 420], [350, 430], [650, 415], [780, 425]];
  for (const [cx, cy] of cratePositions) {
    rect(ctx, cx, cy, 24, 18, '#6a5030');
    rect(ctx, cx + 2, cy + 2, 20, 14, '#7a6040');
    rect(ctx, cx, cy + 8, 24, 2, '#5a4020'); // plank line
  }

  // Cold blue-ish neutral lighting overlay
  ctx.globalAlpha = 0.12;
  rect(ctx, 0, 0, W, H, '#4466aa');
  ctx.globalAlpha = 1.0;
}

function drawCliffBackground(ctx) {
  const W = 960, H = 540;
  ctx.imageSmoothingEnabled = false;

  // OPEN SKY (purple-blue tint)
  // Gradient from deep blue at top to purple-blue at horizon
  for (let y = 0; y < 360; y++) {
    const t = y / 360;
    rect(ctx, 0, y, W, 1, lerpColor('#0a0a30', '#2a1a40', t));
  }

  // Abundant bright warm stars (closer, golden-white)
  for (let i = 0; i < 150; i++) {
    const sx = Math.floor(Math.random() * W);
    const sy = Math.floor(Math.random() * 340);
    const brightness = Math.random();
    if (brightness > 0.7) {
      // Large bright star
      px(ctx, sx, sy, '#ffe8a0');
      px(ctx, sx + 1, sy, '#ffd080');
      px(ctx, sx, sy + 1, '#ffd080');
      px(ctx, sx + 1, sy + 1, '#ffe8a0');
    } else if (brightness > 0.3) {
      px(ctx, sx, sy, '#ffe0a0');
      px(ctx, sx + 1, sy, '#eec880');
    } else {
      px(ctx, sx, sy, '#ccb880');
    }
  }

  // Valley below with tiny warm lights (distant town)
  rect(ctx, 0, 360, W, 40, '#1a1020');
  // Distant terrain
  for (let x = 0; x < W; x += 2) {
    const hillH = 10 + Math.sin(x * 0.02) * 8 + Math.sin(x * 0.007) * 15;
    rect(ctx, x, 360 - hillH, 2, hillH, '#1a1020');
  }
  // Town lights
  for (let i = 0; i < 30; i++) {
    const lx = 100 + Math.floor(Math.random() * (W - 200));
    const ly = 365 + Math.floor(Math.random() * 25);
    px(ctx, lx, ly, Math.random() > 0.5 ? '#ffcc60' : '#ff9940');
  }

  // Rock ledge in foreground (flat, wide)
  rect(ctx, 0, 400, W, 140, '#3a3040');
  // Rock texture
  for (let i = 0; i < 100; i++) {
    const rx = Math.floor(Math.random() * W);
    const ry = 400 + Math.floor(Math.random() * 140);
    rect(ctx, rx, ry, 4 + Math.floor(Math.random() * 8), 2 + Math.floor(Math.random() * 4), Math.random() > 0.5 ? '#4a4050' : '#2a2830');
  }
  // Rock edge
  rect(ctx, 0, 398, W, 4, '#4a4050');
  // Uneven edge
  for (let x = 0; x < W; x += 10) {
    const edgeH = Math.floor(Math.random() * 6);
    rect(ctx, x, 394 + edgeH, 10, 4, '#4a4050');
  }

  // NO trees, no arch, no cooler -- Brent's symbols are GONE

  // Purple-blue tint wash
  ctx.globalAlpha = 0.15;
  rect(ctx, 0, 0, W, H, '#6644aa');
  ctx.globalAlpha = 1.0;
}

function drawMeadowBackground(ctx) {
  const W = 960, H = 540;
  ctx.imageSmoothingEnabled = false;

  // Golden-hour warm lighting (orange/gold sky)
  // Low horizon: sky > ground
  for (let y = 0; y < 400; y++) {
    const t = y / 400;
    rect(ctx, 0, y, W, 1, lerpColor('#ff8830', '#ffc060', t));
  }

  // Sun glow near horizon
  fillCircle(ctx, W / 2, 380, 80, '#ffe090');
  ctx.globalAlpha = 0.5;
  fillCircle(ctx, W / 2, 380, 120, '#ffcc60');
  ctx.globalAlpha = 1.0;

  // Soft rolling terrain (grass)
  for (let y = 380; y < H; y++) {
    const t = (y - 380) / (H - 380);
    rect(ctx, 0, y, W, 1, lerpColor('#5a8a30', '#3a6a20', t));
  }
  // Rolling hills
  for (let x = 0; x < W; x += 2) {
    const hillH = Math.sin(x * 0.01) * 15 + Math.sin(x * 0.005) * 10;
    rect(ctx, x, 375 + hillH, 2, 10, lerpColor('#6a9a40', '#4a7a28', (x / W)));
  }

  // Grass texture
  for (let i = 0; i < 150; i++) {
    const gx = Math.floor(Math.random() * W);
    const gy = 385 + Math.floor(Math.random() * (H - 385));
    rect(ctx, gx, gy, 1, 3 + Math.floor(Math.random() * 4), Math.random() > 0.5 ? '#6aaa40' : '#4a8a28');
  }

  // Wildflowers scattered (pink, blue, yellow)
  const flowerColors = ['#ff88aa', '#88aaff', '#ffee66', '#ff7799', '#7799ff', '#ffdd44'];
  for (let i = 0; i < 80; i++) {
    const fx = Math.floor(Math.random() * W);
    const fy = 390 + Math.floor(Math.random() * (H - 400));
    const fc = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    // Stem
    rect(ctx, fx, fy, 1, 4, '#3a6a20');
    // Petals
    px(ctx, fx - 1, fy - 1, fc);
    px(ctx, fx + 1, fy - 1, fc);
    px(ctx, fx, fy - 2, fc);
    px(ctx, fx, fy - 1, '#ffee88'); // center
  }

  // Small butterfly (4x4px)
  const bx = 600, by = 300;
  px(ctx, bx, by, '#d4a0d0');
  px(ctx, bx + 1, by, '#1a1010');
  px(ctx, bx + 2, by, '#d4a0d0');
  px(ctx, bx, by + 1, '#e8b0e0');
  px(ctx, bx + 1, by + 1, '#1a1010');
  px(ctx, bx + 2, by + 1, '#e8b0e0');

  // Warm golden overlay
  ctx.globalAlpha = 0.1;
  rect(ctx, 0, 0, W, H, '#aa8844');
  ctx.globalAlpha = 1.0;
}

function drawLakeBackground(ctx) {
  const W = 960, H = 540;
  ctx.imageSmoothingEnabled = false;

  // Deep blue-black sky
  for (let y = 0; y < 270; y++) {
    const t = y / 270;
    rect(ctx, 0, y, W, 1, lerpColor('#040818', '#0a1028', t));
  }

  // Moon
  fillCircle(ctx, 700, 60, 20, '#e8e0d0');
  fillCircle(ctx, 703, 58, 18, '#f0e8d8');

  // Stars in sky
  for (let i = 0; i < 80; i++) {
    const sx = Math.floor(Math.random() * W);
    const sy = Math.floor(Math.random() * 260);
    px(ctx, sx, sy, Math.random() > 0.5 ? '#ccccdd' : '#aaaacc');
  }

  // Water (still, reflecting)
  for (let y = 270; y < 480; y++) {
    const t = (y - 270) / 210;
    rect(ctx, 0, y, W, 1, lerpColor('#0a1028', '#060814', t));
  }

  // Star reflections in water (doubled, slightly distorted)
  for (let i = 0; i < 60; i++) {
    const sx = Math.floor(Math.random() * W);
    const sy = 280 + Math.floor(Math.random() * 180);
    ctx.globalAlpha = 0.5;
    px(ctx, sx, sy, '#8888aa');
    ctx.globalAlpha = 1.0;
  }

  // Moon reflection in water
  ctx.globalAlpha = 0.4;
  for (let y = 280; y < 400; y++) {
    const wobble = Math.sin(y * 0.3) * 2;
    const reflW = 30 - (y - 280) * 0.15;
    if (reflW > 0) {
      rect(ctx, 700 - reflW / 2 + wobble, y, reflW, 1, '#c0b8a8');
    }
  }
  ctx.globalAlpha = 1.0;

  // Flat rock lower-center
  const rockX = W / 2 - 50, rockY = 470;
  rect(ctx, rockX, rockY, 100, 20, '#2a2830');
  rect(ctx, rockX + 4, rockY + 2, 92, 16, '#3a3840');
  rect(ctx, rockX + 10, rockY, 80, 4, '#4a4850');

  // Dark trees at very edges
  rect(ctx, 0, 100, 40, 380, '#060810');
  rect(ctx, 10, 80, 20, 400, '#0a0c18');
  rect(ctx, W - 40, 90, 40, 390, '#060810');
  rect(ctx, W - 30, 70, 20, 410, '#0a0c18');

  // Shore/ground at bottom
  rect(ctx, 0, 480, W, 60, '#1a1820');
  for (let i = 0; i < 40; i++) {
    const gx = Math.floor(Math.random() * W);
    const gy = 480 + Math.floor(Math.random() * 60);
    rect(ctx, gx, gy, 4, 2, Math.random() > 0.5 ? '#2a2830' : '#121420');
  }

  // Deep blue overlay
  ctx.globalAlpha = 0.15;
  rect(ctx, 0, 0, W, H, '#2244aa');
  ctx.globalAlpha = 1.0;
}

function drawVoidBackground(ctx) {
  const W = 960, H = 540;
  ctx.imageSmoothingEnabled = false;

  // Pure black
  rect(ctx, 0, 0, W, H, '#000000');

  // Single warm amber/gold spotlight circle in center
  const cx = W / 2, cy = H / 2 + 40;
  const spotR = 80; // small - character barely fits

  // Gradient spotlight
  for (let r = spotR; r > 0; r--) {
    const t = r / spotR;
    const alpha = (1 - t) * 0.5;
    ctx.globalAlpha = alpha;
    fillCircle(ctx, cx, cy, r, '#aa8844');
  }
  ctx.globalAlpha = 1.0;

  // Brighter center
  fillCircle(ctx, cx, cy, 30, 'rgba(170, 136, 68, 0.3)');
  fillCircle(ctx, cx, cy, 15, 'rgba(200, 170, 100, 0.2)');

  // Ground shadow suggestion within the light
  ctx.globalAlpha = 0.15;
  fillEllipse(ctx, cx, cy + 50, 60, 15, '#000000');
  ctx.globalAlpha = 1.0;

  // Very subtle edge gradient (slightly lighter than pure black near spotlight)
  for (let r = spotR + 60; r > spotR; r--) {
    const t = (r - spotR) / 60;
    ctx.globalAlpha = (1 - t) * 0.05;
    fillCircle(ctx, cx, cy, r, '#aa8844');
  }
  ctx.globalAlpha = 1.0;
}

function generateAllBackgrounds() {
  console.log('\n=== C. BACKGROUNDS (960x540) ===\n');

  const bgs = [
    ['campfire.png', drawCampfireBackground],
    ['cliff.png', drawCliffBackground],
    ['meadow.png', drawMeadowBackground],
    ['lake.png', drawLakeBackground],
    ['void.png', drawVoidBackground],
  ];

  for (const [name, draw] of bgs) {
    const canvas = createCanvas(960, 540);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    savePng(canvas, path.join(BG_DIR, name));
    fileCount++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION D: PROPS
// ═══════════════════════════════════════════════════════════════════════════════

function generateProps() {
  console.log('\n=== D. PROPS ===\n');

  // Cooler (24x20)
  {
    const c = createCanvas(24, 20);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 6, 24, 14, '#e8e8e8'); // white body
    rect(ctx, 0, 0, 24, 8, '#5588bb'); // blue lid
    rect(ctx, 2, 2, 20, 4, '#6698cc'); // lid highlight
    rect(ctx, 8, 0, 8, 3, '#cccccc'); // handle
    rect(ctx, 1, 8, 22, 1, '#cccccc'); // lid seam
    savePng(c, path.join(PROP_DIR, 'cooler.png'));
    fileCount++;
  }

  // Tire campfire (32x20)
  {
    const c = createCanvas(32, 20);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Tire outer
    fillEllipse(ctx, 16, 12, 15, 8, '#2a2a2a');
    fillEllipse(ctx, 16, 12, 10, 5, '#1a1a1a');
    // Yellow-green ribbons
    for (let i = 0; i < 6; i++) {
      const rx = 8 + Math.floor(Math.random() * 14);
      const ry = 6 + Math.floor(Math.random() * 8);
      rect(ctx, rx, ry, 2, 5 + Math.floor(Math.random() * 5), i % 2 === 0 ? '#c8cc40' : '#88aa30');
    }
    savePng(c, path.join(PROP_DIR, 'tire-campfire.png'));
    fileCount++;
  }

  // Squirrel cage (16x16)
  {
    const c = createCanvas(16, 16);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Cage frame
    rect(ctx, 0, 0, 16, 1, '#888888');
    rect(ctx, 0, 15, 16, 1, '#888888');
    rect(ctx, 0, 0, 1, 16, '#888888');
    rect(ctx, 15, 0, 1, 16, '#888888');
    // Bars
    for (let x = 3; x < 16; x += 3) {
      rect(ctx, x, 1, 1, 14, '#aaaaaa');
    }
    // Brown shapes inside (squirrels)
    rect(ctx, 4, 8, 3, 4, '#6a4a20');
    rect(ctx, 5, 6, 2, 2, '#6a4a20'); // head
    rect(ctx, 9, 9, 3, 3, '#7a5a30');
    rect(ctx, 10, 7, 2, 2, '#7a5a30');
    savePng(c, path.join(PROP_DIR, 'squirrel-cage.png'));
    fileCount++;
  }

  // Sex doll deflated (12x8)
  {
    const c = createCanvas(12, 8);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Skin-colored lump
    fillEllipse(ctx, 6, 5, 5, 3, '#e8c8a0');
    rect(ctx, 2, 4, 8, 3, '#dab890');
    // Wrinkle lines
    px(ctx, 4, 5, '#c8a870');
    px(ctx, 7, 4, '#c8a870');
    savePng(c, path.join(PROP_DIR, 'sex-doll-deflated.png'));
    fileCount++;
  }

  // Sex doll inflated (20x24)
  {
    const c = createCanvas(20, 24);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Cartoonish inflatable body
    fillEllipse(ctx, 10, 14, 8, 10, '#e8c8a0');
    // Head
    fillCircle(ctx, 10, 4, 4, '#e8c8a0');
    // Eyes (dots)
    px(ctx, 8, 3, '#1a1010');
    px(ctx, 12, 3, '#1a1010');
    // O mouth
    rect(ctx, 9, 5, 2, 2, '#cc4444');
    // Arms
    rect(ctx, 1, 10, 4, 2, '#e8c8a0');
    rect(ctx, 15, 10, 4, 2, '#e8c8a0');
    // Hair suggestion
    rect(ctx, 7, 0, 6, 2, '#c8a040');
    savePng(c, path.join(PROP_DIR, 'sex-doll-inflated.png'));
    fileCount++;
  }

  // Marshmallow bag (12x12)
  {
    const c = createCanvas(12, 12);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 1, 2, 10, 9, '#f0f0f0');
    rect(ctx, 2, 3, 8, 7, '#e8e8e8');
    // Bag top (twisted)
    rect(ctx, 4, 0, 4, 3, '#f0f0f0');
    // Label
    rect(ctx, 3, 5, 6, 3, '#ff8888');
    savePng(c, path.join(PROP_DIR, 'marshmallow-bag.png'));
    fileCount++;
  }

  // Crate (16x12)
  {
    const c = createCanvas(16, 12);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 16, 12, '#6a5030');
    rect(ctx, 1, 1, 14, 10, '#7a6040');
    rect(ctx, 0, 5, 16, 2, '#5a4020'); // plank line
    rect(ctx, 7, 0, 2, 12, '#5a4020'); // vertical plank
    savePng(c, path.join(PROP_DIR, 'crate.png'));
    fileCount++;
  }

  // Flowers (8x8 each)
  const flowerDefs = [
    ['flower-pink.png', '#ff88aa', '#ff6688'],
    ['flower-blue.png', '#88aaff', '#6688ff'],
    ['flower-yellow.png', '#ffee66', '#ffcc44'],
  ];
  for (const [fname, c1, c2] of flowerDefs) {
    const c = createCanvas(8, 8);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Stem
    rect(ctx, 3, 4, 1, 4, '#3a6a20');
    // Leaf
    px(ctx, 2, 5, '#4a8a30');
    px(ctx, 4, 6, '#4a8a30');
    // Petals
    px(ctx, 3, 1, c1);
    px(ctx, 2, 2, c1);
    px(ctx, 4, 2, c1);
    px(ctx, 3, 3, c2);
    px(ctx, 1, 2, c2);
    px(ctx, 5, 2, c2);
    // Center
    px(ctx, 3, 2, '#ffee88');
    savePng(c, path.join(PROP_DIR, fname));
    fileCount++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION E: INVENTORY ICONS (32x32)
// ═══════════════════════════════════════════════════════════════════════════════

function generateInventoryIcons() {
  console.log('\n=== E. INVENTORY ICONS (32x32) ===\n');

  // Neckerchief
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Gold/khaki triangle
    ctx.fillStyle = '#c2a060';
    ctx.beginPath();
    ctx.moveTo(4, 8);
    ctx.lineTo(28, 8);
    ctx.lineTo(16, 28);
    ctx.closePath();
    ctx.fill();
    // Fold shadow
    ctx.fillStyle = '#a08040';
    ctx.beginPath();
    ctx.moveTo(16, 12);
    ctx.lineTo(26, 8);
    ctx.lineTo(16, 28);
    ctx.closePath();
    ctx.fill();
    // Slide clasp detail
    rect(ctx, 13, 10, 6, 4, '#c9a96e');
    rect(ctx, 14, 11, 4, 2, '#daba80');
    savePng(c, path.join(ITEM_DIR, 'neckerchief.png'));
    fileCount++;
  }

  // Marshmallow
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Stick
    rect(ctx, 14, 16, 3, 14, '#6a4a20');
    rect(ctx, 15, 18, 1, 12, '#7a5a30');
    // Marshmallow (white cylinder)
    rect(ctx, 10, 6, 12, 12, '#f0f0f0');
    rect(ctx, 11, 7, 10, 10, '#ffffff');
    // Slightly melted top
    rect(ctx, 9, 5, 14, 3, '#f0e8d0');
    px(ctx, 8, 7, '#f0e8d0');
    px(ctx, 23, 8, '#e8dcc0');
    // Toasted spots
    px(ctx, 12, 10, '#d8c8a0');
    px(ctx, 18, 12, '#d8c8a0');
    savePng(c, path.join(ITEM_DIR, 'marshmallow.png'));
    fileCount++;
  }

  // Squirrel blood (open hand with red smear)
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Open hand (skin tone)
    rect(ctx, 8, 10, 16, 16, '#e8c8a0');
    rect(ctx, 10, 8, 12, 4, '#e8c8a0'); // palm top
    // Fingers
    rect(ctx, 8, 6, 3, 6, '#e8c8a0');
    rect(ctx, 12, 4, 3, 8, '#e8c8a0');
    rect(ctx, 16, 4, 3, 8, '#e8c8a0');
    rect(ctx, 20, 6, 3, 6, '#e8c8a0');
    // Thumb
    rect(ctx, 6, 14, 4, 3, '#e8c8a0');
    // Red smear
    rect(ctx, 10, 12, 10, 8, '#cc2020');
    ctx.globalAlpha = 0.6;
    rect(ctx, 9, 14, 12, 6, '#aa1818');
    ctx.globalAlpha = 1.0;
    px(ctx, 12, 10, '#cc2020');
    px(ctx, 16, 11, '#aa1818');
    savePng(c, path.join(ITEM_DIR, 'squirrelBlood.png'));
    fileCount++;
  }

  // Flower (pink wildflower with green stem)
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Stem
    rect(ctx, 15, 16, 2, 14, '#3a7a30');
    // Leaf
    rect(ctx, 12, 20, 4, 2, '#4a8a40');
    rect(ctx, 18, 22, 4, 2, '#4a8a40');
    // Petals (pink wildflower)
    fillCircle(ctx, 16, 10, 6, '#ff88aa');
    fillCircle(ctx, 12, 8, 4, '#ff7799');
    fillCircle(ctx, 20, 8, 4, '#ff7799');
    fillCircle(ctx, 12, 13, 4, '#ff6688');
    fillCircle(ctx, 20, 13, 4, '#ff6688');
    // Center
    fillCircle(ctx, 16, 10, 2, '#ffee88');
    savePng(c, path.join(ITEM_DIR, 'flower.png'));
    fileCount++;
  }

  // Sam's kiss (lip mark in Sam's blue)
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Lip print in Sam's blue
    const lipColor = '#7eb8c9';
    // Upper lip
    ctx.fillStyle = lipColor;
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.quadraticCurveTo(12, 8, 16, 12);
    ctx.quadraticCurveTo(20, 8, 24, 16);
    ctx.closePath();
    ctx.fill();
    // Lower lip
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.quadraticCurveTo(16, 26, 24, 16);
    ctx.closePath();
    ctx.fill();
    // Lip line
    rect(ctx, 10, 15, 12, 1, '#5a98a9');
    savePng(c, path.join(ITEM_DIR, 'samsKiss.png'));
    fileCount++;
  }

  // Brent's blood (fist with red on knuckles)
  {
    const c = createCanvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    rect(ctx, 0, 0, 32, 32, '#1a1a2a');
    // Fist (skin tone)
    rect(ctx, 8, 8, 16, 18, '#dab890');
    // Knuckle ridge
    rect(ctx, 8, 6, 16, 4, '#dab890');
    // Finger folds
    rect(ctx, 8, 12, 16, 1, '#c8a870');
    rect(ctx, 8, 16, 16, 1, '#c8a870');
    rect(ctx, 8, 20, 16, 1, '#c8a870');
    // Thumb wrapped
    rect(ctx, 6, 18, 4, 6, '#dab890');
    rect(ctx, 6, 18, 4, 1, '#c8a870');
    // Blood on knuckles
    rect(ctx, 8, 5, 16, 5, '#cc2020');
    rect(ctx, 10, 4, 12, 3, '#aa1818');
    // Dripping
    px(ctx, 10, 10, '#cc2020');
    px(ctx, 14, 11, '#aa1818');
    px(ctx, 20, 10, '#cc2020');
    savePng(c, path.join(ITEM_DIR, 'brentsBlood.png'));
    fileCount++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

console.log('SCOUTS Comprehensive Asset Generator');
console.log('====================================\n');

generateAllWorldSprites();
generateAllPortraits();
generateAllBackgrounds();
generateProps();
generateInventoryIcons();

console.log(`\n====================================`);
console.log(`Total files generated: ${fileCount}`);
console.log('Done.');

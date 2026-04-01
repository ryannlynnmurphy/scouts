/**
 * SCOUTS Pixel Art Asset Generator
 * Generates character portraits (128x128), inventory icons (32x32), and backgrounds (960x540)
 * Uses node-canvas for programmatic pixel art rendering.
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

/** Draw a filled rectangle (pixel-perfect). */
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/** Draw a single pixel. */
function px(ctx, x, y, color) {
  rect(ctx, x, y, 1, 1, color);
}

// ─── Color Palettes ──────────────────────────────────────────────────────────

const SKIN = {
  base: '#e8c8a0',
  shadow: '#c8a878',
  highlight: '#f0d8b8',
  blush: '#e0a0a0',
};

const UNIFORM = {
  shirt: '#6b7a4a',      // olive/khaki scout shirt
  shirtShadow: '#556639',
  collar: '#8a9a5a',
  neckerchief: '#c9a96e', // gold/khaki
  neckerchiefShadow: '#a88a50',
};

const CHARACTERS = {
  simon: {
    color: '#d4a0d0',
    hair: '#8b6040',
    hairHighlight: '#a07858',
    neckerchief: '#d4a0d0', // lavender neckerchief accent
    skinBase: '#f0d0b0',
    skinShadow: '#d0b090',
    expressions: ['neutral', 'scared', 'defiant', 'hurt', 'tender', 'shattered'],
  },
  sam: {
    color: '#7eb8c9',
    hair: '#2a2020',
    hairHighlight: '#3a3030',
    neckerchief: '#7eb8c9',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    expressions: ['neutral', 'shy', 'warm', 'conflicted', 'brave'],
  },
  brent: {
    color: '#ff4444',
    hair: '#4a3828',
    hairHighlight: '#5a4838',
    neckerchief: '#ff4444',
    skinBase: '#dab890',
    skinShadow: '#ba9870',
    expressions: ['neutral', 'angry', 'mocking', 'unhinged', 'broken'],
  },
  josh: {
    color: '#8a9a5a',
    hair: '#5a4030',
    hairHighlight: '#6a5040',
    neckerchief: '#8a9a5a',
    skinBase: '#e0c098',
    skinShadow: '#c0a078',
    expressions: ['neutral', 'eager', 'angry', 'scared'],
  },
  noah: {
    color: '#d4a44a',
    hair: '#3a2820',
    hairHighlight: '#4a3830',
    neckerchief: '#d4a44a',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    expressions: ['neutral', 'smug', 'nervous', 'defiant'],
  },
  lucas: {
    color: '#5a9a8a',
    hair: '#6a4a30',
    hairHighlight: '#7a5a40',
    neckerchief: '#5a9a8a',
    skinBase: '#e8c8a0',
    skinShadow: '#c8a878',
    expressions: ['neutral', 'earnest', 'uncomfortable', 'brave'],
  },
};

// ─── Expression Parameters ───────────────────────────────────────────────────

/**
 * Returns drawing parameters for facial features based on expression.
 * eyeW/eyeH: eye size, browOffset: brow y shift (neg = raised), mouthCurve: 1=smile, -1=frown, 0=flat
 * mouthOpen: how open the mouth is (0=closed), blush: show blush pixels, tear: show tear
 */
function getExpressionParams(expression) {
  const base = {
    eyeW: 4, eyeH: 4, browOffset: 0, browFurrow: false,
    mouthCurve: 0, mouthOpen: 0, mouthWidth: 8,
    blush: false, tear: false, eyeWide: false, eyeNarrow: false,
    eyeAsymmetric: false, browRaise: false, smirk: false,
    hollow: false, droopy: false,
  };

  switch (expression) {
    case 'neutral':
      return base;
    case 'scared':
      return { ...base, eyeWide: true, eyeH: 5, mouthOpen: 2, browOffset: -2, browRaise: true };
    case 'defiant':
      return { ...base, browFurrow: true, browOffset: 1, mouthCurve: 0, eyeNarrow: true, mouthWidth: 6 };
    case 'hurt':
      return { ...base, droopy: true, mouthCurve: -1, tear: true, browOffset: -1, browRaise: true };
    case 'tender':
      return { ...base, mouthCurve: 1, blush: true, eyeH: 3 };
    case 'shattered':
      return { ...base, droopy: true, hollow: true, mouthCurve: -1, mouthOpen: 1, tear: true, browOffset: -1 };
    case 'shy':
      return { ...base, blush: true, eyeH: 3, mouthCurve: 0.5, browOffset: -1 };
    case 'warm':
      return { ...base, mouthCurve: 1, blush: true, eyeH: 3 };
    case 'conflicted':
      return { ...base, browFurrow: true, mouthCurve: -0.5, eyeH: 3 };
    case 'brave':
      return { ...base, mouthCurve: 0.5, eyeH: 4, browOffset: -1, mouthWidth: 6 };
    case 'angry':
      return { ...base, browFurrow: true, browOffset: 2, eyeNarrow: true, mouthCurve: -1, mouthWidth: 6 };
    case 'mocking':
      return { ...base, smirk: true, browOffset: -1, eyeNarrow: true };
    case 'unhinged':
      return { ...base, eyeWide: true, eyeH: 6, mouthOpen: 3, mouthWidth: 10, eyeAsymmetric: true, browOffset: -2 };
    case 'broken':
      return { ...base, droopy: true, hollow: true, mouthCurve: -1, browOffset: 0 };
    case 'eager':
      return { ...base, mouthCurve: 1, eyeH: 5, eyeWide: true, browOffset: -2, browRaise: true };
    case 'smug':
      return { ...base, smirk: true, eyeNarrow: true, browOffset: -1 };
    case 'nervous':
      return { ...base, eyeH: 5, mouthCurve: -0.5, mouthWidth: 6, browOffset: -1, browRaise: true };
    case 'earnest':
      return { ...base, mouthCurve: 0.5, eyeH: 5, browOffset: -1, browRaise: true };
    case 'uncomfortable':
      return { ...base, mouthCurve: -0.5, eyeNarrow: true, browFurrow: true, mouthWidth: 6 };
    default:
      return base;
  }
}

// ─── Portrait Drawing ────────────────────────────────────────────────────────

/**
 * Each character has different head/face proportions.
 * Returns shape params: faceW, faceH, faceY (top of face), jawTaper, shoulderW, hairStyle, neckW
 */
function getCharacterShape(name) {
  switch (name) {
    case 'simon':
      // Rounder face, smaller build, longer wavy hair
      return { faceW: 40, faceH: 42, faceY: 24, jawTaper: 4, shoulderW: 50, neckW: 12, hairStyle: 'wavy' };
    case 'sam':
      // Clean oval face, neat dark hair
      return { faceW: 38, faceH: 44, faceY: 22, jawTaper: 6, shoulderW: 52, neckW: 14, hairStyle: 'neat' };
    case 'brent':
      // Square jaw, wider face/shoulders, buzzcut
      return { faceW: 48, faceH: 44, faceY: 20, jawTaper: 2, shoulderW: 68, neckW: 18, hairStyle: 'buzzcut' };
    case 'josh':
      // Round face, stocky
      return { faceW: 44, faceH: 40, faceY: 24, jawTaper: 2, shoulderW: 58, neckW: 16, hairStyle: 'short' };
    case 'noah':
      // Narrower face, smart look
      return { faceW: 36, faceH: 46, faceY: 20, jawTaper: 6, shoulderW: 48, neckW: 12, hairStyle: 'side' };
    case 'lucas':
      // Thinner face, messy hair
      return { faceW: 36, faceH: 44, faceY: 22, jawTaper: 5, shoulderW: 50, neckW: 13, hairStyle: 'messy' };
    default:
      return { faceW: 40, faceH: 42, faceY: 24, jawTaper: 4, shoulderW: 52, neckW: 14, hairStyle: 'neat' };
  }
}

function drawPortrait(characterName, expression) {
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const char = CHARACTERS[characterName];
  const shape = getCharacterShape(characterName);
  const expr = getExpressionParams(expression);

  const cx = 64; // center x
  const { faceW, faceH, faceY, jawTaper, shoulderW, neckW, hairStyle } = shape;

  // Background -- dark, slightly tinted with character color
  rect(ctx, 0, 0, 128, 128, '#1a1a2a');
  // Subtle character-color vignette at edges
  ctx.fillStyle = char.color + '18';
  ctx.fillRect(0, 0, 128, 128);

  // ── Shoulders / Uniform ──
  const shoulderY = faceY + faceH + 8;
  // Shoulders (extend to bottom)
  rect(ctx, cx - shoulderW / 2, shoulderY, shoulderW, 128 - shoulderY, UNIFORM.shirt);
  // Shoulder shadow on sides
  rect(ctx, cx - shoulderW / 2, shoulderY, 4, 128 - shoulderY, UNIFORM.shirtShadow);
  rect(ctx, cx + shoulderW / 2 - 4, shoulderY, 4, 128 - shoulderY, UNIFORM.shirtShadow);

  // Collar lines
  rect(ctx, cx - 12, shoulderY, 24, 3, UNIFORM.collar);

  // Neckerchief (triangle)
  const nkColor = char.neckerchief;
  const nkY = shoulderY + 2;
  for (let i = 0; i < 12; i++) {
    rect(ctx, cx - 12 + i, nkY + i, 24 - i * 2, 2, nkColor);
  }
  // Neckerchief shadow
  for (let i = 0; i < 6; i++) {
    rect(ctx, cx + 1, nkY + i * 2, 12 - i * 2, 1, char.neckerchief + 'a0');
  }

  // ── Neck ──
  rect(ctx, cx - neckW / 2, faceY + faceH - 2, neckW, 12, char.skinBase);
  rect(ctx, cx - neckW / 2, faceY + faceH - 2, 2, 12, char.skinShadow);

  // ── Face (head shape) ──
  // Main face rectangle
  rect(ctx, cx - faceW / 2, faceY, faceW, faceH, char.skinBase);
  // Jaw taper (cut corners at bottom)
  for (let i = 0; i < jawTaper; i++) {
    // Left jaw cut
    rect(ctx, cx - faceW / 2 + i, faceY + faceH - jawTaper + i, 1, 1, '#1a1a2a');
    // Right jaw cut
    rect(ctx, cx + faceW / 2 - 1 - i, faceY + faceH - jawTaper + i, 1, 1, '#1a1a2a');
  }
  // Face shadow (left edge)
  rect(ctx, cx - faceW / 2, faceY + 4, 2, faceH - 8, char.skinShadow);
  // Face highlight (right-center)
  rect(ctx, cx + 2, faceY + 6, 6, 8, char.skinBase);

  // ── Ears ──
  rect(ctx, cx - faceW / 2 - 3, faceY + faceH / 2 - 4, 4, 8, char.skinBase);
  rect(ctx, cx + faceW / 2 - 1, faceY + faceH / 2 - 4, 4, 8, char.skinBase);
  rect(ctx, cx - faceW / 2 - 3, faceY + faceH / 2 - 4, 1, 8, char.skinShadow);

  // ── Hair ──
  drawHair(ctx, cx, faceY, faceW, faceH, char.hair, char.hairHighlight, hairStyle);

  // ── Eyes ──
  const eyeY = faceY + Math.floor(faceH * 0.38);
  const eyeSpacing = Math.floor(faceW * 0.22);
  const leftEyeX = cx - eyeSpacing - 2;
  const rightEyeX = cx + eyeSpacing - 2;

  let eyeW = expr.eyeW;
  let eyeH = expr.eyeH;
  let leftEyeH = eyeH;
  let rightEyeH = eyeH;

  if (expr.eyeNarrow) {
    leftEyeH = Math.max(2, eyeH - 1);
    rightEyeH = Math.max(2, eyeH - 1);
  }
  if (expr.eyeAsymmetric) {
    leftEyeH = eyeH + 1;
    rightEyeH = eyeH - 1;
  }

  // Eye whites
  rect(ctx, leftEyeX, eyeY, eyeW + 2, leftEyeH + 1, '#f0f0f0');
  rect(ctx, rightEyeX, eyeY, eyeW + 2, rightEyeH + 1, '#f0f0f0');

  // Pupils
  const pupilColor = expr.hollow ? '#444455' : '#1a1a2a';
  const pupilSize = expr.hollow ? 2 : 3;
  if (expr.droopy) {
    rect(ctx, leftEyeX + 1, eyeY + 1, pupilSize, pupilSize, pupilColor);
    rect(ctx, rightEyeX + 1, eyeY + 1, pupilSize, pupilSize, pupilColor);
  } else {
    rect(ctx, leftEyeX + 1, eyeY, pupilSize, pupilSize, pupilColor);
    rect(ctx, rightEyeX + 1, eyeY, pupilSize, pupilSize, pupilColor);
  }

  // Eye highlight (small white pixel in pupil)
  if (!expr.hollow) {
    px(ctx, leftEyeX + 2, eyeY, '#ffffff');
    px(ctx, rightEyeX + 2, eyeY, '#ffffff');
  }

  // ── Eyebrows ──
  const browY = eyeY - 4 + expr.browOffset;
  const browColor = char.hair;
  if (expr.browFurrow) {
    // Angry brows: angled inward
    for (let i = 0; i < 6; i++) {
      px(ctx, leftEyeX + i, browY + (i < 3 ? 1 : 0), browColor);
      px(ctx, rightEyeX + 5 - i, browY + (i < 3 ? 1 : 0), browColor);
    }
  } else if (expr.browRaise) {
    // Raised brows: arched up
    rect(ctx, leftEyeX, browY - 1, 6, 1, browColor);
    rect(ctx, rightEyeX, browY - 1, 6, 1, browColor);
    px(ctx, leftEyeX + 2, browY - 2, browColor);
    px(ctx, leftEyeX + 3, browY - 2, browColor);
    px(ctx, rightEyeX + 2, browY - 2, browColor);
    px(ctx, rightEyeX + 3, browY - 2, browColor);
  } else if (expr.smirk) {
    // One brow raised, one normal
    rect(ctx, leftEyeX, browY, 6, 1, browColor);
    rect(ctx, rightEyeX, browY - 2, 6, 1, browColor);
    px(ctx, rightEyeX + 2, browY - 3, browColor);
  } else {
    // Normal brows
    rect(ctx, leftEyeX, browY, 6, 1, browColor);
    rect(ctx, rightEyeX, browY, 6, 1, browColor);
  }

  // ── Nose ──
  const noseY = eyeY + eyeH + 4;
  rect(ctx, cx - 1, noseY, 2, 3, char.skinShadow);
  px(ctx, cx - 2, noseY + 3, char.skinShadow);
  px(ctx, cx + 1, noseY + 3, char.skinShadow);

  // ── Mouth ──
  const mouthY = noseY + 7;
  const mouthW = expr.mouthWidth;
  const mouthX = cx - mouthW / 2;

  if (expr.smirk) {
    // Asymmetric smirk
    rect(ctx, mouthX, mouthY, mouthW, 1, '#8a4040');
    px(ctx, mouthX + mouthW - 1, mouthY - 1, '#8a4040');
    px(ctx, mouthX + mouthW - 2, mouthY - 1, '#8a4040');
  } else if (expr.mouthOpen > 0) {
    // Open mouth
    rect(ctx, mouthX, mouthY, mouthW, 1, '#8a4040');
    rect(ctx, mouthX + 1, mouthY + 1, mouthW - 2, expr.mouthOpen, '#4a1a1a');
    rect(ctx, mouthX, mouthY + 1 + expr.mouthOpen, mouthW, 1, '#8a4040');
  } else if (expr.mouthCurve > 0) {
    // Smile
    rect(ctx, mouthX, mouthY, mouthW, 1, '#8a4040');
    px(ctx, mouthX, mouthY - 1, '#8a4040');
    px(ctx, mouthX + mouthW - 1, mouthY - 1, '#8a4040');
  } else if (expr.mouthCurve < 0) {
    // Frown
    rect(ctx, mouthX, mouthY, mouthW, 1, '#8a4040');
    px(ctx, mouthX, mouthY + 1, '#8a4040');
    px(ctx, mouthX + mouthW - 1, mouthY + 1, '#8a4040');
  } else {
    // Flat/neutral
    rect(ctx, mouthX, mouthY, mouthW, 1, '#8a4040');
  }

  // ── Blush ──
  if (expr.blush) {
    rect(ctx, leftEyeX - 2, eyeY + eyeH + 1, 4, 2, '#e0a0a0');
    rect(ctx, rightEyeX + 2, eyeY + eyeH + 1, 4, 2, '#e0a0a0');
  }

  // ── Tear ──
  if (expr.tear) {
    const tearX = rightEyeX + eyeW + 1;
    px(ctx, tearX, eyeY + rightEyeH, '#88bbee');
    px(ctx, tearX, eyeY + rightEyeH + 1, '#88bbee');
    px(ctx, tearX, eyeY + rightEyeH + 2, '#aaddff');
  }

  // ── Glasses (Noah only) ──
  if (characterName === 'noah') {
    const glassY = eyeY - 1;
    // Left lens frame
    rect(ctx, leftEyeX - 2, glassY - 1, eyeW + 6, 1, '#3a3a4a');
    rect(ctx, leftEyeX - 2, glassY + leftEyeH + 2, eyeW + 6, 1, '#3a3a4a');
    rect(ctx, leftEyeX - 2, glassY - 1, 1, leftEyeH + 4, '#3a3a4a');
    rect(ctx, leftEyeX + eyeW + 3, glassY - 1, 1, leftEyeH + 4, '#3a3a4a');
    // Right lens frame
    rect(ctx, rightEyeX - 2, glassY - 1, eyeW + 6, 1, '#3a3a4a');
    rect(ctx, rightEyeX - 2, glassY + rightEyeH + 2, eyeW + 6, 1, '#3a3a4a');
    rect(ctx, rightEyeX - 2, glassY - 1, 1, rightEyeH + 4, '#3a3a4a');
    rect(ctx, rightEyeX + eyeW + 3, glassY - 1, 1, rightEyeH + 4, '#3a3a4a');
    // Bridge
    rect(ctx, leftEyeX + eyeW + 3, glassY + 1, rightEyeX - leftEyeX - eyeW - 3, 1, '#3a3a4a');
    // Temple arms
    rect(ctx, leftEyeX - 3, glassY + 1, 1, 1, '#3a3a4a');
    rect(ctx, rightEyeX + eyeW + 4, glassY + 1, 1, 1, '#3a3a4a');
  }

  // ── Border accent (character color, subtle) ──
  rect(ctx, 0, 0, 128, 1, char.color + '60');
  rect(ctx, 0, 127, 128, 1, char.color + '60');
  rect(ctx, 0, 0, 1, 128, char.color + '60');
  rect(ctx, 127, 0, 1, 128, char.color + '60');

  return canvas;
}

function drawHair(ctx, cx, faceY, faceW, faceH, hairColor, highlightColor, style) {
  const hairTop = faceY - 8;

  switch (style) {
    case 'wavy': {
      // Simon: longer wavy hair covering forehead, falls past ears
      rect(ctx, cx - faceW / 2 - 2, hairTop, faceW + 4, 14, hairColor);
      // Wavy strands on sides
      rect(ctx, cx - faceW / 2 - 4, hairTop + 6, 6, 28, hairColor);
      rect(ctx, cx + faceW / 2 - 2, hairTop + 6, 6, 28, hairColor);
      // Wavy texture
      for (let i = 0; i < 5; i++) {
        px(ctx, cx - faceW / 2 - 4 + (i % 2), hairTop + 12 + i * 4, highlightColor);
        px(ctx, cx + faceW / 2 + 1 - (i % 2), hairTop + 12 + i * 4, highlightColor);
      }
      // Top highlight
      rect(ctx, cx - 6, hairTop, 12, 2, highlightColor);
      // Bangs
      rect(ctx, cx - faceW / 2 + 2, faceY, faceW / 2 - 2, 6, hairColor);
      // Wavy bangs edge
      for (let i = 0; i < 8; i++) {
        px(ctx, cx - faceW / 2 + 4 + i * 2, faceY + 5 + (i % 2), hairColor);
      }
      break;
    }
    case 'neat': {
      // Sam: clean short-to-medium dark hair, side-parted
      rect(ctx, cx - faceW / 2 - 1, hairTop, faceW + 2, 12, hairColor);
      // Slight volume on top
      rect(ctx, cx - faceW / 2, hairTop - 2, faceW, 4, hairColor);
      // Side hair (short)
      rect(ctx, cx - faceW / 2 - 2, hairTop + 4, 4, 16, hairColor);
      rect(ctx, cx + faceW / 2 - 2, hairTop + 4, 4, 16, hairColor);
      // Part line
      rect(ctx, cx - 4, hairTop, 1, 6, highlightColor);
      // Top highlight
      rect(ctx, cx - 8, hairTop - 1, 10, 1, highlightColor);
      break;
    }
    case 'buzzcut': {
      // Brent: very short buzzcut, shows head shape
      rect(ctx, cx - faceW / 2, hairTop + 2, faceW, 8, hairColor);
      // Top of head (rounded)
      rect(ctx, cx - faceW / 2 + 4, hairTop, faceW - 8, 4, hairColor);
      // Buzzcut texture (stipple)
      for (let y = hairTop; y < hairTop + 10; y += 2) {
        for (let x = cx - faceW / 2 + 2; x < cx + faceW / 2 - 2; x += 3) {
          px(ctx, x, y, highlightColor);
        }
      }
      break;
    }
    case 'short': {
      // Josh: short standard kid haircut
      rect(ctx, cx - faceW / 2, hairTop + 2, faceW, 10, hairColor);
      rect(ctx, cx - faceW / 2 + 2, hairTop, faceW - 4, 4, hairColor);
      // Sides
      rect(ctx, cx - faceW / 2 - 1, hairTop + 4, 3, 12, hairColor);
      rect(ctx, cx + faceW / 2 - 2, hairTop + 4, 3, 12, hairColor);
      // Small highlight
      rect(ctx, cx - 4, hairTop + 1, 8, 1, highlightColor);
      break;
    }
    case 'side': {
      // Noah: neat side-swept, slightly longer on top
      rect(ctx, cx - faceW / 2 - 1, hairTop, faceW + 2, 12, hairColor);
      rect(ctx, cx - faceW / 2 + 2, hairTop - 3, faceW - 4, 5, hairColor);
      // Swept to one side
      rect(ctx, cx + faceW / 2 - 4, hairTop + 2, 8, 14, hairColor);
      // Side hair
      rect(ctx, cx - faceW / 2 - 2, hairTop + 4, 3, 14, hairColor);
      // Highlight showing sweep direction
      for (let i = 0; i < 6; i++) {
        px(ctx, cx - 6 + i * 2, hairTop - 2 + i, highlightColor);
      }
      break;
    }
    case 'messy': {
      // Lucas: messy, sticking up, character
      rect(ctx, cx - faceW / 2, hairTop + 2, faceW, 10, hairColor);
      rect(ctx, cx - faceW / 2 + 2, hairTop, faceW - 4, 4, hairColor);
      // Messy spikes
      rect(ctx, cx - 10, hairTop - 4, 3, 6, hairColor);
      rect(ctx, cx - 2, hairTop - 5, 4, 7, hairColor);
      rect(ctx, cx + 8, hairTop - 3, 3, 5, hairColor);
      rect(ctx, cx + 4, hairTop - 2, 2, 4, hairColor);
      rect(ctx, cx - 6, hairTop - 2, 2, 4, hairColor);
      // Sides (messy)
      rect(ctx, cx - faceW / 2 - 3, hairTop + 4, 5, 18, hairColor);
      rect(ctx, cx + faceW / 2 - 2, hairTop + 4, 5, 18, hairColor);
      // Stray strands
      px(ctx, cx - faceW / 2 - 4, hairTop + 10, hairColor);
      px(ctx, cx + faceW / 2 + 2, hairTop + 12, hairColor);
      // Highlights on spikes
      px(ctx, cx - 1, hairTop - 4, highlightColor);
      px(ctx, cx + 8, hairTop - 2, highlightColor);
      break;
    }
  }
}

// ─── Inventory Icons ─────────────────────────────────────────────────────────

function drawInventoryIcon(itemId) {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Transparent background
  ctx.clearRect(0, 0, 32, 32);

  switch (itemId) {
    case 'neckerchief': {
      // Folded triangle of khaki fabric
      const color = '#c9a96e';
      const shadow = '#a88a50';
      const highlight = '#dbb880';
      // Main triangle shape
      for (let row = 0; row < 14; row++) {
        const w = 24 - row;
        const x = 4 + Math.floor(row / 2);
        rect(ctx, x, 8 + row, w, 1, color);
      }
      // Shadow fold line
      for (let i = 0; i < 10; i++) {
        px(ctx, 8 + i, 12 + i, shadow);
      }
      // Highlight on top edge
      rect(ctx, 4, 8, 24, 1, highlight);
      // Knot at top
      rect(ctx, 14, 6, 4, 3, color);
      rect(ctx, 15, 5, 2, 1, shadow);
      break;
    }
    case 'marshmallow': {
      // Puffy white cylinder on a brown stick
      const white = '#f8f0e3';
      const shadow = '#d8d0c0';
      const stick = '#8b6040';
      // Stick
      rect(ctx, 15, 16, 2, 14, stick);
      rect(ctx, 15, 28, 2, 2, '#6b4020');
      // Marshmallow body
      rect(ctx, 10, 6, 12, 12, white);
      rect(ctx, 12, 4, 8, 2, white);
      rect(ctx, 12, 18, 8, 1, white);
      // Shadow
      rect(ctx, 10, 12, 12, 2, shadow);
      rect(ctx, 10, 6, 2, 12, shadow);
      // Light toast marks
      px(ctx, 14, 8, '#e8d8b0');
      px(ctx, 18, 10, '#e8d8b0');
      px(ctx, 12, 14, '#e8d8b0');
      break;
    }
    case 'squirrelBlood': {
      // Open hand with red smear
      const skin = '#e8c8a0';
      const skinSh = '#c8a878';
      const red = '#cc2222';
      const darkRed = '#881111';
      // Palm
      rect(ctx, 8, 12, 16, 14, skin);
      rect(ctx, 8, 12, 2, 14, skinSh);
      // Fingers (spread)
      rect(ctx, 8, 6, 3, 8, skin);
      rect(ctx, 12, 4, 3, 10, skin);
      rect(ctx, 16, 4, 3, 10, skin);
      rect(ctx, 20, 6, 3, 8, skin);
      // Thumb
      rect(ctx, 5, 14, 4, 3, skin);
      rect(ctx, 5, 14, 1, 3, skinSh);
      // Blood smear across palm
      rect(ctx, 10, 16, 12, 3, red);
      rect(ctx, 12, 14, 8, 2, red);
      rect(ctx, 14, 19, 6, 2, darkRed);
      // Drip
      px(ctx, 16, 21, red);
      px(ctx, 16, 22, darkRed);
      break;
    }
    case 'flower': {
      // Simple daisy/wildflower
      const petalPink = '#ff88aa';
      const petalLight = '#ffaacc';
      const center = '#ffdd44';
      const stem = '#4a8a3a';
      const leaf = '#5aa04a';
      // Stem
      rect(ctx, 15, 14, 2, 14, stem);
      // Leaves
      rect(ctx, 10, 20, 6, 2, leaf);
      rect(ctx, 17, 22, 6, 2, leaf);
      px(ctx, 10, 19, leaf);
      px(ctx, 22, 21, leaf);
      // Petals (cross pattern)
      rect(ctx, 14, 4, 4, 4, petalPink);   // top
      rect(ctx, 14, 14, 4, 4, petalPink);  // bottom
      rect(ctx, 8, 8, 4, 4, petalPink);    // left
      rect(ctx, 20, 8, 4, 4, petalPink);   // right
      rect(ctx, 9, 5, 4, 3, petalLight);   // top-left
      rect(ctx, 19, 5, 4, 3, petalLight);  // top-right
      rect(ctx, 9, 14, 4, 3, petalPink);   // bottom-left
      rect(ctx, 19, 14, 4, 3, petalPink);  // bottom-right
      // Center
      rect(ctx, 13, 8, 6, 6, center);
      rect(ctx, 14, 7, 4, 1, center);
      px(ctx, 14, 9, '#eebb22');
      px(ctx, 17, 11, '#eebb22');
      break;
    }
    case 'samsKiss': {
      // Lip mark / kiss mark in Sam's blue
      const color = '#7eb8c9';
      const highlight = '#a0d8e8';
      const shadow = '#5a98a9';
      // Upper lip (M shape)
      rect(ctx, 8, 12, 6, 3, color);
      rect(ctx, 18, 12, 6, 3, color);
      rect(ctx, 14, 14, 4, 2, color);
      rect(ctx, 10, 10, 4, 3, color);
      rect(ctx, 18, 10, 4, 3, color);
      px(ctx, 15, 12, shadow); // dip
      px(ctx, 16, 12, shadow);
      // Lower lip (rounded)
      rect(ctx, 10, 16, 12, 4, color);
      rect(ctx, 12, 20, 8, 2, color);
      rect(ctx, 14, 22, 4, 1, shadow);
      // Highlight
      rect(ctx, 12, 17, 4, 1, highlight);
      rect(ctx, 11, 11, 2, 1, highlight);
      rect(ctx, 19, 11, 2, 1, highlight);
      break;
    }
    case 'brentsBlood': {
      // Fist with red on knuckles
      const skin = '#dab890';
      const skinSh = '#ba9870';
      const red = '#cc2222';
      const darkRed = '#881111';
      // Fist shape (compact)
      rect(ctx, 8, 8, 18, 16, skin);
      rect(ctx, 8, 8, 2, 16, skinSh);
      // Finger lines
      rect(ctx, 8, 12, 18, 1, skinSh);
      rect(ctx, 8, 16, 18, 1, skinSh);
      rect(ctx, 8, 20, 18, 1, skinSh);
      // Thumb
      rect(ctx, 6, 18, 4, 8, skin);
      rect(ctx, 6, 18, 1, 8, skinSh);
      // Knuckle bumps
      rect(ctx, 24, 9, 3, 4, skin);
      rect(ctx, 24, 14, 3, 3, skin);
      rect(ctx, 24, 18, 3, 3, skin);
      // Blood on knuckles
      rect(ctx, 24, 9, 3, 3, red);
      rect(ctx, 24, 13, 3, 2, red);
      rect(ctx, 25, 17, 2, 2, darkRed);
      // Blood drip
      px(ctx, 26, 12, darkRed);
      px(ctx, 25, 15, red);
      rect(ctx, 22, 10, 3, 2, red);
      break;
    }
  }

  return canvas;
}

// ─── Background Scenes ───────────────────────────────────────────────────────

function drawBackground(sceneId) {
  const canvas = createCanvas(960, 540);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  switch (sceneId) {
    case 'campfire':
      drawCampfire(ctx);
      break;
    case 'cliff':
      drawCliff(ctx);
      break;
    case 'meadow':
      drawMeadow(ctx);
      break;
    case 'lake':
      drawLake(ctx);
      break;
    case 'void':
      drawVoid(ctx);
      break;
  }

  return canvas;
}

function drawStars(ctx, w, h, count, yMin = 0, yMax) {
  yMax = yMax || Math.floor(h * 0.6);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w);
    const y = yMin + Math.floor(Math.random() * (yMax - yMin));
    const brightness = 180 + Math.floor(Math.random() * 75);
    const hex = brightness.toString(16);
    const size = Math.random() > 0.85 ? 2 : 1;
    rect(ctx, x, y, size, size, `#${hex}${hex}${hex}`);
    // Occasional warm-tinted star
    if (Math.random() > 0.9) {
      px(ctx, x, y, `#${hex}${Math.floor(brightness * 0.9).toString(16)}${Math.floor(brightness * 0.7).toString(16)}`);
    }
  }
}

function drawCampfire(ctx) {
  // Dark forest clearing at night, no actual campfire (Brent lied)
  // Sky through canopy
  rect(ctx, 0, 0, 960, 540, '#0a0f0a');

  // Ground
  const groundY = 380;
  rect(ctx, 0, groundY, 960, 160, '#1a1008');
  // Ground texture (dirt/leaves)
  for (let i = 0; i < 400; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = groundY + Math.floor(Math.random() * 160);
    const colors = ['#2a1a0a', '#1e150a', '#22180c', '#2e1e10', '#1a2a0a'];
    px(ctx, x, y, colors[Math.floor(Math.random() * colors.length)]);
  }
  // Leaf clumps
  for (let i = 0; i < 60; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = groundY + Math.floor(Math.random() * 160);
    rect(ctx, x, y, 3, 2, '#1a2a0a');
  }

  // Trees (dark silhouettes on edges)
  const treeColors = ['#0d1a0d', '#0a150a', '#081008'];
  // Left trees
  for (let t = 0; t < 4; t++) {
    const tx = t * 60 - 20 + Math.floor(Math.random() * 30);
    const tw = 30 + Math.floor(Math.random() * 20);
    const th = 300 + Math.floor(Math.random() * 100);
    rect(ctx, tx + tw / 2 - 8, groundY - th, 16, th + 20, treeColors[t % 3]);
    // Canopy
    for (let c = 0; c < 5; c++) {
      const cw = tw + 40 - c * 10;
      const cy = groundY - th + c * 30;
      rect(ctx, tx + tw / 2 - cw / 2, cy, cw, 40, treeColors[(t + c) % 3]);
    }
  }
  // Right trees
  for (let t = 0; t < 4; t++) {
    const tx = 740 + t * 60 + Math.floor(Math.random() * 30);
    const tw = 30 + Math.floor(Math.random() * 20);
    const th = 300 + Math.floor(Math.random() * 100);
    rect(ctx, tx + tw / 2 - 8, groundY - th, 16, th + 20, treeColors[t % 3]);
    for (let c = 0; c < 5; c++) {
      const cw = tw + 40 - c * 10;
      const cy = groundY - th + c * 30;
      rect(ctx, tx + tw / 2 - cw / 2, cy, cw, 40, treeColors[(t + c) % 3]);
    }
  }

  // Canopy overhead (partial coverage leaving gaps for stars)
  for (let i = 0; i < 80; i++) {
    const x = 200 + Math.floor(Math.random() * 560);
    const y = Math.floor(Math.random() * 60);
    const w = 40 + Math.floor(Math.random() * 80);
    rect(ctx, x, y, w, 20 + Math.floor(Math.random() * 30), '#0d1a0d');
  }

  // Stars visible through canopy gaps
  drawStars(ctx, 960, 540, 120, 0, 100);

  // Fireflies (green-yellow glowing dots scattered in clearing)
  for (let i = 0; i < 25; i++) {
    const x = 200 + Math.floor(Math.random() * 560);
    const y = 100 + Math.floor(Math.random() * 280);
    px(ctx, x, y, '#ccee44');
    px(ctx, x + 1, y, '#aacc2280');
    px(ctx, x, y + 1, '#aacc2260');
  }

  // Cold blue-ish ambient light in clearing center (no fire)
  for (let r = 0; r < 80; r++) {
    const alpha = Math.max(0, 8 - Math.floor(r / 10));
    ctx.fillStyle = `rgba(60, 80, 100, ${alpha / 255})`;
    ctx.fillRect(480 - r * 2, groundY - 40 - r, r * 4, 2);
  }

  // Cooler on the left side
  rect(ctx, 180, groundY - 24, 28, 24, '#3a4a5a');
  rect(ctx, 178, groundY - 26, 32, 3, '#4a5a6a');
  rect(ctx, 182, groundY - 20, 20, 2, '#5a6a7a');
}

function drawCliff(ctx) {
  // Mountain overlook at night, open sky, valley below
  // Sky gradient (deep blue to slightly lighter at horizon)
  for (let y = 0; y < 360; y++) {
    const r = 10 + Math.floor(y * 5 / 360);
    const g = 10 + Math.floor(y * 12 / 360);
    const b = 42 + Math.floor(y * 30 / 360);
    rect(ctx, 0, y, 960, 1, `rgb(${r},${g},${b})`);
  }

  // Stars (lots, open sky)
  drawStars(ctx, 960, 540, 300, 0, 300);

  // Moon (upper right)
  const moonX = 740;
  const moonY = 60;
  const moonR = 24;
  for (let dy = -moonR; dy <= moonR; dy++) {
    for (let dx = -moonR; dx <= moonR; dx++) {
      if (dx * dx + dy * dy <= moonR * moonR) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        const bright = Math.floor(200 - dist * 3);
        const warmth = Math.floor(180 - dist * 2);
        px(ctx, moonX + dx, moonY + dy, `rgb(${bright + 20},${warmth + 30},${warmth - 20})`);
      }
    }
  }
  // Moon glow
  for (let r = moonR; r < moonR + 40; r++) {
    const alpha = Math.max(0, 30 - (r - moonR));
    ctx.fillStyle = `rgba(200, 180, 140, ${alpha / 255})`;
    ctx.beginPath();
    ctx.arc(moonX, moonY, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Distant mountains (valley)
  for (let layer = 0; layer < 3; layer++) {
    const baseY = 300 - layer * 30;
    const color = `rgb(${15 + layer * 8}, ${20 + layer * 10}, ${35 + layer * 12})`;
    for (let x = 0; x < 960; x++) {
      const mountainH = Math.sin(x * 0.005 + layer * 2) * 40 + Math.sin(x * 0.013 + layer) * 25 + 20;
      rect(ctx, x, baseY - mountainH, 1, mountainH + 80, color);
    }
  }

  // Valley floor with tiny lights (settlement)
  rect(ctx, 0, 360, 960, 20, '#0a0f1a');
  for (let i = 0; i < 30; i++) {
    const x = 100 + Math.floor(Math.random() * 760);
    const y = 355 + Math.floor(Math.random() * 20);
    const colors = ['#ffcc66', '#ff9944', '#ffeeaa'];
    px(ctx, x, y, colors[Math.floor(Math.random() * colors.length)]);
  }

  // Foreground rock edge
  rect(ctx, 0, 400, 960, 140, '#1a1510');
  // Rock texture
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = 400 + Math.floor(Math.random() * 140);
    rect(ctx, x, y, 2 + Math.floor(Math.random() * 4), 1, '#24201a');
  }
  // Rock edge (jagged top)
  for (let x = 0; x < 960; x += 2) {
    const edgeH = Math.sin(x * 0.03) * 8 + Math.sin(x * 0.08) * 4;
    rect(ctx, x, 395 + edgeH, 2, 8, '#1a1510');
  }
  // Edge highlight (warm golden moonlight)
  for (let x = 0; x < 960; x += 2) {
    const edgeH = Math.sin(x * 0.03) * 8 + Math.sin(x * 0.08) * 4;
    px(ctx, x, 394 + edgeH, '#c9a96e40');
    px(ctx, x + 1, 394 + edgeH, '#c9a96e30');
  }
}

function drawMeadow(ctx) {
  // Open field with wildflowers, golden hour lighting
  // Sky (warm golden)
  for (let y = 0; y < 280; y++) {
    const t = y / 280;
    const r = Math.floor(80 + t * 100);
    const g = Math.floor(60 + t * 80);
    const b = Math.floor(100 - t * 40);
    rect(ctx, 0, y, 960, 1, `rgb(${r},${g},${b})`);
  }

  // Warm sun glow near horizon
  for (let r = 0; r < 120; r++) {
    const alpha = Math.max(0, 40 - Math.floor(r / 3));
    ctx.fillStyle = `rgba(255, 200, 100, ${alpha / 255})`;
    ctx.fillRect(480 - r * 3, 260 - r, r * 6, r * 2);
  }

  // Gentle rolling hills
  for (let layer = 0; layer < 3; layer++) {
    const baseY = 300 - layer * 20;
    const green = `rgb(${30 + layer * 15}, ${60 + layer * 20}, ${25 + layer * 10})`;
    for (let x = 0; x < 960; x++) {
      const hillH = Math.sin(x * 0.004 + layer * 1.5) * 30 + Math.sin(x * 0.01 + layer * 3) * 15;
      rect(ctx, x, baseY - hillH, 1, 300, green);
    }
  }

  // Main meadow ground
  rect(ctx, 0, 310, 960, 230, '#2a4a2a');

  // Grass texture
  for (let i = 0; i < 600; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = 300 + Math.floor(Math.random() * 240);
    const h = 2 + Math.floor(Math.random() * 6);
    const greens = ['#3a5a3a', '#2a5a2a', '#4a6a3a', '#3a6a2a'];
    rect(ctx, x, y - h, 1, h, greens[Math.floor(Math.random() * greens.length)]);
  }

  // Wildflowers scattered across field
  const flowerColors = ['#ff88aa', '#ffaacc', '#88aaff', '#aaccff', '#ffdd66', '#ffeeaa', '#ff6688', '#8888ff'];
  for (let i = 0; i < 150; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = 310 + Math.floor(Math.random() * 200);
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    // Small flower (2-3 px)
    px(ctx, x, y, color);
    px(ctx, x + 1, y, color);
    px(ctx, x, y - 1, color);
    // Stem
    rect(ctx, x, y + 1, 1, 3, '#3a6a2a');
  }

  // Golden hour light overlay
  ctx.fillStyle = 'rgba(200, 160, 60, 0.04)';
  ctx.fillRect(0, 0, 960, 540);
}

function drawLake(ctx) {
  // Flat rock foreground, still lake reflecting stars, dark trees, moon
  // Sky
  for (let y = 0; y < 200; y++) {
    const t = y / 200;
    const r = Math.floor(10 + t * 5);
    const g = Math.floor(20 + t * 10);
    const b = Math.floor(42 + t * 20);
    rect(ctx, 0, y, 960, 1, `rgb(${r},${g},${b})`);
  }

  // Stars
  drawStars(ctx, 960, 540, 200, 0, 200);

  // Moon (smaller, reflected)
  const moonX = 600;
  const moonY = 50;
  for (let dy = -12; dy <= 12; dy++) {
    for (let dx = -12; dx <= 12; dx++) {
      if (dx * dx + dy * dy <= 144) {
        px(ctx, moonX + dx, moonY + dy, '#ddd8cc');
      }
    }
  }

  // Tree line (dark silhouettes)
  for (let x = 0; x < 960; x++) {
    const treeH = 80 + Math.sin(x * 0.02) * 30 + Math.sin(x * 0.05) * 20;
    // Pointed tree tops
    const spike = (x % 20 < 10) ? (x % 20) * 3 : (20 - x % 20) * 3;
    rect(ctx, x, 200 - treeH - spike, 1, treeH + spike, '#0a1a0a');
  }
  // Tree line base
  rect(ctx, 0, 200, 960, 10, '#0a1a0a');

  // Lake surface
  const lakeY = 210;
  const lakeH = 200;
  for (let y = lakeY; y < lakeY + lakeH; y++) {
    const t = (y - lakeY) / lakeH;
    const r = Math.floor(10 + t * 5);
    const g = Math.floor(20 + t * 8);
    const b = Math.floor(38 + t * 15);
    rect(ctx, 0, y, 960, 1, `rgb(${r},${g},${b})`);
  }

  // Moon reflection in water
  for (let y = 0; y < 40; y++) {
    const wobble = Math.sin(y * 0.5) * 3;
    const alpha = Math.max(0, 80 - y * 2);
    rect(ctx, moonX - 6 + wobble, lakeY + 10 + y * 2, 12, 2, `rgba(200, 200, 190, ${alpha / 255})`);
  }

  // Star reflections in water (scattered, faint)
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = lakeY + 20 + Math.floor(Math.random() * (lakeH - 40));
    px(ctx, x, y, `rgba(180, 190, 200, 0.3)`);
  }

  // Water ripple lines
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * 900);
    const y = lakeY + 20 + Math.floor(Math.random() * (lakeH - 30));
    rect(ctx, x, y, 10 + Math.floor(Math.random() * 30), 1, '#8899aa18');
  }

  // Foreground: flat rock
  const rockY = 410;
  rect(ctx, 0, rockY, 960, 130, '#2a2520');
  // Rock surface texture
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * 960);
    const y = rockY + Math.floor(Math.random() * 130);
    rect(ctx, x, y, 3 + Math.floor(Math.random() * 6), 1, '#342e28');
  }
  // Rock edge
  for (let x = 0; x < 960; x++) {
    const edge = Math.sin(x * 0.02) * 3;
    rect(ctx, x, rockY - 2 + edge, 1, 4, '#2a2520');
    px(ctx, x, rockY - 3 + edge, '#3a3530');
  }
}

function drawVoid(ctx) {
  // Pure black with warm spotlight in center
  rect(ctx, 0, 0, 960, 540, '#000000');

  // Warm spotlight gradient (circular)
  const spotX = 480;
  const spotY = 320; // slightly below center (where character stands)
  const maxR = 200;
  for (let r = maxR; r > 0; r--) {
    const t = 1 - r / maxR;
    const alpha = Math.floor(t * t * 40); // quadratic falloff
    const warmth = Math.floor(t * 30);
    ctx.fillStyle = `rgba(${200 + warmth}, ${180 + warmth}, ${140 + warmth}, ${alpha / 255})`;
    ctx.beginPath();
    ctx.arc(spotX, spotY, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground plane hint (subtle)
  for (let x = 0; x < 960; x++) {
    const dist = Math.abs(x - spotX);
    if (dist < 180) {
      const alpha = Math.floor((1 - dist / 180) * 15);
      rect(ctx, x, spotY + 40, 1, 1, `rgba(160, 140, 100, ${alpha / 255})`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const baseDir = path.resolve(__dirname, '..', 'public', 'assets', 'sprites');
  const charDir = path.join(baseDir, 'characters');
  const itemDir = path.join(baseDir, 'items');
  const bgDir = path.join(baseDir, 'backgrounds');

  ensureDir(charDir);
  ensureDir(itemDir);
  ensureDir(bgDir);

  let totalFiles = 0;
  let totalBytes = 0;

  // Use fixed seed for reproducible star placement
  // (Math.random is fine since stars are decorative)

  // Generate character portraits
  console.log('\n=== Character Portraits ===');
  for (const [name, char] of Object.entries(CHARACTERS)) {
    console.log(`\n  ${name.toUpperCase()}:`);
    for (const expression of char.expressions) {
      const canvas = drawPortrait(name, expression);
      const filePath = path.join(charDir, `${name}-${expression}.png`);
      savePng(canvas, filePath);
      totalFiles++;
      totalBytes += fs.statSync(filePath).size;
    }
  }

  // Generate inventory icons
  console.log('\n=== Inventory Icons ===');
  const items = ['neckerchief', 'marshmallow', 'squirrelBlood', 'flower', 'samsKiss', 'brentsBlood'];
  for (const itemId of items) {
    const canvas = drawInventoryIcon(itemId);
    const filePath = path.join(itemDir, `${itemId}.png`);
    savePng(canvas, filePath);
    totalFiles++;
    totalBytes += fs.statSync(filePath).size;
  }

  // Generate backgrounds
  console.log('\n=== Background Scenes ===');
  const scenes = ['campfire', 'cliff', 'meadow', 'lake', 'void'];
  for (const sceneId of scenes) {
    const canvas = drawBackground(sceneId);
    const filePath = path.join(bgDir, `${sceneId}.png`);
    savePng(canvas, filePath);
    totalFiles++;
    totalBytes += fs.statSync(filePath).size;
  }

  console.log(`\n=== DONE ===`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Total size: ${(totalBytes / 1024).toFixed(1)} KB`);
}

main();

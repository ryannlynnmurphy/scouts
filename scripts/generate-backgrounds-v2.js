/**
 * SCOUTS Background Generator v2
 * Atmospheric, detailed pixel-art backgrounds at 960x540
 * Based on: 2026-04-01-scouts-visual-design-deep-dive.md
 *           2026-04-01-scouts-frontend-system-vision.md
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../public/assets/sprites/backgrounds');
const W = 960;
const H = 540;

function newCanvas() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function save(canvas, name) {
  const buf = canvas.toBuffer('image/png', { compressionLevel: 9, filters: canvas.PNG_ALL_FILTERS });
  const dest = path.join(OUT, name);
  fs.writeFileSync(dest, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ${name}  ${kb} KB`);
}

// Seeded random for reproducible noise
function makeRng(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// ─────────────────────────────────────────────
// 1. campfire.png — The Cage
// ─────────────────────────────────────────────
function generateCampfire() {
  console.log('Generating campfire.png...');
  const { canvas, ctx } = newCanvas();
  const rng = makeRng(42);

  // === SKY — deep cold night, slight blue-green tint ===
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  skyGrad.addColorStop(0, '#070e0c');
  skyGrad.addColorStop(0.5, '#0a1510');
  skyGrad.addColorStop(1, '#0d1a0d');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // === GROUND — textured dirt with 4 shades dithered (ImageData for compression) ===
  const groundColors = [
    [0x1a, 0x12, 0x08],
    [0x15, 0x1a, 0x0a],
    [0x1a, 0x16, 0x0e],
    [0x0d, 0x12, 0x08],
  ];
  const groundY = Math.floor(H * 0.58);
  // Ground base — solid gradient fill (compresses better than noise)
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
  groundGrad.addColorStop(0, '#141a0a');
  groundGrad.addColorStop(0.4, '#161408');
  groundGrad.addColorStop(1, '#0d1208');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, H - groundY);
  // Texture: scattered block-noise patches (4x2 blocks for PNG compression)
  const groundH = H - groundY;
  const blockRng = makeRng(42);
  for (let i = 0; i < 2200; i++) {
    const bx = Math.floor(blockRng() * (W / 4)) * 4;
    const by = groundY + Math.floor(blockRng() * (groundH / 2)) * 2;
    const nv = blockRng();
    const col = groundColors[nv < 0.25 ? 0 : nv < 0.5 ? 1 : nv < 0.75 ? 2 : 3];
    ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
    ctx.fillRect(bx, by, 4, 2);
  }

  // Ground/sky blend row — soft edge
  ctx.fillStyle = 'rgba(13,26,13,0.7)';
  ctx.fillRect(0, groundY - 2, W, 4);

  // === TALL TREE TRUNKS — 6 trunks, 3 each side ===
  function drawTrunk(cx, widthPx, baseY) {
    const topY = -20; // extends past frame top
    // Main trunk body
    const tg = ctx.createLinearGradient(cx - widthPx / 2, 0, cx + widthPx / 2, 0);
    tg.addColorStop(0, '#0e0e06');
    tg.addColorStop(0.25, '#1a1a0a');
    tg.addColorStop(0.5, '#222214');
    tg.addColorStop(0.75, '#1a1a0a');
    tg.addColorStop(1, '#0e0e06');
    ctx.fillStyle = tg;
    ctx.fillRect(Math.round(cx - widthPx / 2), topY, widthPx, baseY - topY);

    // Bark texture — vertical darker streaks
    const streak1 = makeRng(cx | 0);
    for (let y = topY; y < baseY; y += 3) {
      const noise = streak1();
      if (noise < 0.25) {
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(Math.round(cx - widthPx / 2 + noise * widthPx), y, 1, 2 + Math.floor(streak1() * 4));
      }
    }
    // Root flare at ground — rect-based
    ctx.fillStyle = '#111108';
    const flareW = Math.round(widthPx * 1.5);
    ctx.fillRect(Math.round(cx - flareW / 2), baseY - 3, flareW, 6);
  }

  // Left trunks: x=60, 150, 240 — varying widths
  drawTrunk(55, 38, groundY + 8);
  drawTrunk(155, 30, groundY + 6);
  drawTrunk(248, 24, groundY + 4);

  // Right trunks: x=700, 800, 905
  drawTrunk(710, 28, groundY + 4);
  drawTrunk(808, 32, groundY + 6);
  drawTrunk(908, 40, groundY + 8);

  // === BRANCH ARCH — upstage center, like a ribcage ===
  const archCenterX = 480;
  const archBaseY = groundY - 5;
  const archPeakY = 60;
  const archSpanX = 260;

  // Pixel-art line drawer (Bresenham) — no anti-aliasing, compresses well
  function pixelLine(x1, y1, x2, y2, w, color) {
    ctx.fillStyle = color;
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    let err = dx - dy, cx = Math.round(x1), cy = Math.round(y1);
    const ex = Math.round(x2), ey = Math.round(y2);
    while (true) {
      ctx.fillRect(cx - Math.floor(w/2), cy - Math.floor(w/4), w, Math.max(1, Math.floor(w/2)));
      if (cx === ex && cy === ey) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; cx += sx; }
      if (e2 < dx) { err += dx; cy += sy; }
    }
  }

  // Arch parabola — approximate arch shape with stepped pixel segments
  function drawArchArm(fromX, fromY, toX, toY, peakX, peakY, w, color) {
    const steps = 20;
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps, t1 = (i + 1) / steps;
      // Quadratic bezier at t: P = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
      const bx0 = (1-t0)*(1-t0)*fromX + 2*(1-t0)*t0*peakX + t0*t0*toX;
      const by0 = (1-t0)*(1-t0)*fromY + 2*(1-t0)*t0*peakY + t0*t0*toY;
      const bx1 = (1-t1)*(1-t1)*fromX + 2*(1-t1)*t1*peakX + t1*t1*toX;
      const by1 = (1-t1)*(1-t1)*fromY + 2*(1-t1)*t1*peakY + t1*t1*toY;
      pixelLine(Math.round(bx0), Math.round(by0), Math.round(bx1), Math.round(by1), w, color);
    }
  }

  const branchColor = '#16150a';
  const branchColor2 = '#1e1c0e';

  // Primary arch uprights
  drawArchArm(archCenterX - archSpanX, archBaseY, archCenterX - 15, archPeakY,
    archCenterX - archSpanX + 20, archPeakY + 30, 7, branchColor);
  drawArchArm(archCenterX + archSpanX, archBaseY, archCenterX + 15, archPeakY,
    archCenterX + archSpanX - 20, archPeakY + 30, 7, branchColor);

  // Secondary arch ribs — diagonal crossing
  pixelLine(archCenterX - archSpanX + 10, archBaseY - 40, archCenterX + 20, archPeakY + 15, 4, branchColor2);
  pixelLine(archCenterX + archSpanX - 10, archBaseY - 40, archCenterX - 20, archPeakY + 15, 4, branchColor2);
  pixelLine(archCenterX - archSpanX + 30, archBaseY - 80, archCenterX + 10, archPeakY + 40, 3, branchColor);
  pixelLine(archCenterX + archSpanX - 30, archBaseY - 80, archCenterX - 10, archPeakY + 40, 3, branchColor);

  // Horizontal crossing branches
  pixelLine(archCenterX - 200, archBaseY - 120, archCenterX + 200, archBaseY - 130, 3, branchColor2);
  pixelLine(archCenterX - 160, archBaseY - 170, archCenterX + 170, archBaseY - 160, 2, branchColor);
  pixelLine(archCenterX - 130, archBaseY - 210, archCenterX + 130, archBaseY - 200, 2, branchColor);

  // Smaller dead twigs hanging from arch
  const twigRng = makeRng(77);
  for (let i = 0; i < 10; i++) {
    const tx = archCenterX - 180 + Math.floor(twigRng() * 360);
    const ty = archPeakY + 10 + Math.floor(twigRng() * 80);
    const tlen = 12 + Math.floor(twigRng() * 20);
    const tang = (twigRng() - 0.5) * 1.0;
    pixelLine(tx, ty, tx + Math.round(Math.sin(tang) * tlen), ty + Math.round(Math.cos(tang) * tlen * 0.5), 1, branchColor);
  }

  // === CANOPY MASS — rect-based dark masses (pixel art, no anti-aliasing) ===
  function drawCanopyRect(cx, cy, rx, ry, color) {
    ctx.fillStyle = color;
    // Draw as stacked horizontal rects approximating an ellipse
    for (let dy = -ry; dy <= ry; dy += 2) {
      const t = dy / ry;
      const rowRx = Math.round(rx * Math.sqrt(Math.max(0, 1 - t * t)));
      if (rowRx > 0) ctx.fillRect(cx - rowRx, cy + dy, rowRx * 2, 2);
    }
  }

  // Left canopy
  drawCanopyRect(100, 80, 130, 90, '#060f06');
  drawCanopyRect(60, 120, 90, 70, '#080f06');
  drawCanopyRect(180, 60, 110, 75, '#050d05');
  drawCanopyRect(250, 100, 80, 60, '#07100a');

  // Right canopy
  drawCanopyRect(860, 80, 130, 90, '#060f06');
  drawCanopyRect(900, 120, 90, 70, '#080f06');
  drawCanopyRect(780, 60, 110, 75, '#050d05');
  drawCanopyRect(710, 100, 80, 60, '#07100a');

  // Some sparse canopy over the arch area (thick, few gaps)
  drawCanopyRect(390, 30, 100, 40, '#060e06');
  drawCanopyRect(570, 30, 100, 40, '#060e06');
  drawCanopyRect(480, 20, 80, 30, '#070f07');

  // === STARS — sparse, cold, through canopy gaps ===
  const starRng = makeRng(13);
  const starCount = 38;
  const gapZones = [
    // x range, y range where canopy has gaps
    { x1: 320, x2: 640, y1: 10, y2: 120 },
    { x1: 420, x2: 540, y1: 70, y2: 200 },
    { x1: 200, x2: 320, y1: 20, y2: 100 },
    { x1: 640, x2: 760, y1: 20, y2: 100 },
  ];
  for (let i = 0; i < starCount; i++) {
    const zone = gapZones[Math.floor(starRng() * gapZones.length)];
    const sx = zone.x1 + starRng() * (zone.x2 - zone.x1);
    const sy = zone.y1 + starRng() * (zone.y2 - zone.y1);
    const brightness = 0.4 + starRng() * 0.5;
    const size = starRng() < 0.7 ? 1 : 2;
    // Cold blue-white stars
    ctx.fillStyle = `rgba(${Math.floor(200 + brightness * 55)},${Math.floor(210 + brightness * 45)},${Math.floor(220 + brightness * 35)},${brightness})`;
    ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
  }

  // === PROPS ===

  // Wooden logs/stumps
  // Stump left of center
  function drawStump(x, y, w, h) {
    ctx.fillStyle = '#2a1e12';
    ctx.fillRect(x, y, w, h);
    // Top ring
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(x + 2, y, w - 4, 4);
    // Grain lines
    ctx.fillStyle = '#221508';
    ctx.fillRect(x + Math.floor(w * 0.3), y + 2, 1, h - 4);
    ctx.fillRect(x + Math.floor(w * 0.6), y + 2, 1, h - 4);
  }

  function drawLog(x, y, len, h) {
    ctx.fillStyle = '#231a0e';
    ctx.fillRect(x, y, len, h);
    ctx.fillStyle = '#2e2214';
    ctx.fillRect(x + 2, y, len - 4, Math.floor(h / 2));
    // End caps
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(x, y, 6, h);
    ctx.fillRect(x + len - 6, y, 6, h);
    // Bark texture
    const bRng = makeRng(x);
    for (let i = 0; i < Math.floor(len / 10); i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x + Math.floor(bRng() * len), y + Math.floor(bRng() * h), 1, 1 + Math.floor(bRng() * 3));
    }
  }

  drawStump(330, groundY - 22, 36, 22);
  drawLog(540, groundY - 14, 100, 14);
  drawLog(160, groundY - 12, 75, 12);

  // Wooden crates near edges
  function drawCrate(x, y, w, h) {
    ctx.fillStyle = '#3a2e1a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#2a2010';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    // Cross brace
    ctx.beginPath();
    ctx.moveTo(x, y + Math.floor(h / 2));
    ctx.lineTo(x + w, y + Math.floor(h / 2));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + Math.floor(w / 2), y);
    ctx.lineTo(x + Math.floor(w / 2), y + h);
    ctx.stroke();
  }

  drawCrate(70, groundY - 28, 32, 28);
  drawCrate(840, groundY - 24, 28, 24);
  drawCrate(855, groundY - 44, 22, 20);

  // === TIRE / FAKE CAMPFIRE — center ground ===
  const tireX = 480;
  const tireY = groundY + 12;
  // Tire outer
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.ellipse(tireX, tireY, 32, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tire inner
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(tireX, tireY, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ribbons inside tire — yellow-green fake campfire
  const ribbonColors = ['#8a8a2a', '#6a7a2a', '#9a9a3a', '#7a8a1a'];
  const rRng = makeRng(55);
  for (let i = 0; i < 14; i++) {
    const angle = rRng() * Math.PI * 2;
    const rx = tireX + Math.cos(angle) * (rRng() * 18);
    const ry = tireY + Math.sin(angle) * (rRng() * 10);
    const rw = 2 + Math.floor(rRng() * 4);
    const rh = 4 + Math.floor(rRng() * 8);
    ctx.fillStyle = ribbonColors[Math.floor(rRng() * ribbonColors.length)];
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(rRng() * Math.PI);
    ctx.fillRect(-Math.floor(rw / 2), -Math.floor(rh / 2), rw, rh);
    ctx.restore();
  }

  // === WHITE COOLER — stage right ===
  const coolerX = 680;
  const coolerY = groundY - 28;
  // Body
  ctx.fillStyle = '#d0d0d0';
  ctx.fillRect(coolerX, coolerY, 44, 22);
  // Lid (blue)
  ctx.fillStyle = '#4488aa';
  ctx.fillRect(coolerX - 1, coolerY - 5, 46, 7);
  // Handle on lid
  ctx.fillStyle = '#336688';
  ctx.fillRect(coolerX + 16, coolerY - 8, 14, 4);
  // Cooler shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(coolerX + 2, coolerY + 20, 44, 4);

  // === ROPES — hanging from arch ===
  function drawRope(x, yTop, yBot) {
    ctx.strokeStyle = '#4a3a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    // Slight sway
    ctx.quadraticCurveTo(x + 3, (yTop + yBot) / 2, x + 1, yBot);
    ctx.stroke();
    // Rope texture — small knots every ~20px
    for (let y = yTop + 15; y < yBot; y += 22) {
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(x - 1, y, 3, 2);
    }
  }

  drawRope(452, archPeakY + 20, archPeakY + 120);
  drawRope(508, archPeakY + 15, archPeakY + 100);

  // === FIREFLIES — warm yellow-green, scattered in midground ===
  const ffPositions = [
    { x: 310, y: groundY - 60 },
    { x: 420, y: groundY - 90 },
    { x: 590, y: groundY - 70 },
    { x: 650, y: groundY - 50 },
    { x: 255, y: groundY - 40 },
    { x: 720, y: groundY - 80 },
  ];

  for (const ff of ffPositions) {
    // Glow halo — stepped rings, no gradient (compresses well)
    ctx.fillStyle = 'rgba(170,190,45,0.08)';
    ctx.fillRect(ff.x - 6, ff.y - 6, 12, 12);
    ctx.fillStyle = 'rgba(170,190,45,0.16)';
    ctx.fillRect(ff.x - 4, ff.y - 4, 8, 8);
    ctx.fillStyle = 'rgba(170,190,45,0.28)';
    ctx.fillRect(ff.x - 2, ff.y - 2, 4, 4);
    // Core dot
    ctx.fillStyle = '#aaba3a';
    ctx.fillRect(ff.x, ff.y, 2, 2);
    ctx.fillStyle = '#d0cc60';
    ctx.fillRect(ff.x, ff.y, 1, 1);
  }

  // === COLD MOONLIGHT VIGNETTE — step-based for compression ===
  // Left/right edges dark
  ctx.fillStyle = 'rgba(0,4,2,0.55)';
  ctx.fillRect(0, 0, 80, H);
  ctx.fillRect(W - 80, 0, 80, H);
  ctx.fillStyle = 'rgba(0,4,2,0.35)';
  ctx.fillRect(80, 0, 80, H);
  ctx.fillRect(W - 160, 0, 80, H);
  ctx.fillStyle = 'rgba(0,4,2,0.15)';
  ctx.fillRect(160, 0, 80, H);
  ctx.fillRect(W - 240, 0, 80, H);
  // Top/bottom edges dark
  ctx.fillStyle = 'rgba(0,4,2,0.45)';
  ctx.fillRect(0, 0, W, 60);
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = 'rgba(0,4,2,0.25)';
  ctx.fillRect(0, 60, W, 40);
  ctx.fillRect(0, H - 100, W, 40);

  // Cool blue-green tint overlay — moonlight
  ctx.fillStyle = 'rgba(10,30,18,0.18)';
  ctx.fillRect(0, 0, W, H);

  save(canvas, 'campfire.png');
}

// ─────────────────────────────────────────────
// 2. cliff.png — The Release
// ─────────────────────────────────────────────
function generateCliff() {
  console.log('Generating cliff.png...');
  const { canvas, ctx } = newCanvas();
  const rng = makeRng(99);

  // === SKY — vast, purple-blue, most of the frame ===
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, '#0c0c20');
  skyGrad.addColorStop(0.3, '#111128');
  skyGrad.addColorStop(0.6, '#161830');
  skyGrad.addColorStop(0.8, '#1c1c35');
  skyGrad.addColorStop(1, '#22203a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // === MILKY WAY BAND — faint lighter diagonal streak ===
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.3);
  const mwGrad = ctx.createLinearGradient(-W, -30, W, 30);
  mwGrad.addColorStop(0, 'rgba(180,170,220,0)');
  mwGrad.addColorStop(0.3, 'rgba(180,170,220,0.04)');
  mwGrad.addColorStop(0.5, 'rgba(200,190,230,0.07)');
  mwGrad.addColorStop(0.7, 'rgba(180,170,220,0.04)');
  mwGrad.addColorStop(1, 'rgba(180,170,220,0)');
  ctx.fillStyle = mwGrad;
  ctx.fillRect(-W, -60, W * 2, 120);
  ctx.restore();

  // === ABUNDANT STARS — warm-tinted, many sizes ===
  const horizonY = Math.floor(H * 0.68); // low horizon
  const starCount = 280;
  for (let i = 0; i < starCount; i++) {
    const sx = rng() * W;
    const sy = rng() * (horizonY - 20);
    const brightness = 0.5 + rng() * 0.5;
    const warmth = rng() * 0.3; // slight gold tint
    const size = rng() < 0.65 ? 1 : rng() < 0.85 ? 2 : 3;
    const r = Math.floor(200 + warmth * 55 + brightness * 30);
    const g = Math.floor(195 + warmth * 20 + brightness * 20);
    const b = Math.floor(220 - warmth * 40 + brightness * 20);
    ctx.fillStyle = `rgba(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)},${brightness})`;
    ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
    // Slight sparkle cross on brighter stars
    if (size === 3) {
      ctx.fillStyle = `rgba(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)},${brightness * 0.5})`;
      ctx.fillRect(Math.round(sx) - 1, Math.round(sy) + 1, size + 2, 1);
      ctx.fillRect(Math.round(sx) + 1, Math.round(sy) - 1, 1, size + 2);
    }
  }

  // Constellation hint — a loose dipper shape upper right
  const cStars = [
    { x: 700, y: 60 }, { x: 725, y: 70 }, { x: 752, y: 65 }, { x: 778, y: 80 },
    { x: 800, y: 55 }, { x: 815, y: 40 }, { x: 790, y: 35 },
  ];
  // Connect with very faint lines
  ctx.strokeStyle = 'rgba(200,190,230,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  cStars.forEach((s, i) => { i === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y); });
  ctx.stroke();
  for (const s of cStars) {
    ctx.fillStyle = 'rgba(240,230,255,0.9)';
    ctx.fillRect(s.x - 1, s.y - 1, 3, 3);
  }

  // === VALLEY BELOW — dark mid-ground with tiny warm lights ===
  const valleyGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + 60);
  valleyGrad.addColorStop(0, '#0e0e18');
  valleyGrad.addColorStop(1, '#0a0a12');
  ctx.fillStyle = valleyGrad;
  ctx.fillRect(0, horizonY, W, 60);

  // Distant town lights — tiny warm dots
  const lightRng = makeRng(11);
  for (let i = 0; i < 28; i++) {
    const lx = lightRng() * W;
    const ly = horizonY + 5 + lightRng() * 40;
    const warm = lightRng();
    ctx.fillStyle = warm > 0.6
      ? `rgba(255,170,60,${0.4 + lightRng() * 0.4})`
      : `rgba(255,200,100,${0.3 + lightRng() * 0.4})`;
    ctx.fillRect(Math.round(lx), Math.round(ly), 1, 1);
    if (lightRng() > 0.5) {
      ctx.fillStyle = 'rgba(255,160,40,0.15)';
      ctx.fillRect(Math.round(lx) - 1, Math.round(ly), 3, 1);
    }
  }

  // === ROCK LEDGE — foreground, warm amber stone ===
  const ledgeY = horizonY + 55;
  // Main ledge body
  const ledgeGrad = ctx.createLinearGradient(0, ledgeY, 0, H);
  ledgeGrad.addColorStop(0, '#8a7a5a');
  ledgeGrad.addColorStop(0.2, '#7a6a4a');
  ledgeGrad.addColorStop(1, '#5a4a30');
  ctx.fillStyle = ledgeGrad;
  ctx.fillRect(0, ledgeY, W, H - ledgeY);

  // Stone texture — sparse scattered highlights/shadows
  const stoneRng = makeRng(33);
  const ledgeH = H - ledgeY;
  for (let i = 0; i < 1400; i++) {
    const tx = Math.floor(stoneRng() * W);
    const ty = ledgeY + Math.floor(stoneRng() * ledgeH);
    if (stoneRng() < 0.5) {
      ctx.fillStyle = 'rgba(160,140,100,0.25)';
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
    }
    ctx.fillRect(tx, ty, 2, 1);
  }

  // Ledge edge highlight — top lip of rock
  ctx.fillStyle = '#9a8a6a';
  ctx.fillRect(0, ledgeY, W, 3);
  ctx.fillStyle = '#aa9a7a';
  ctx.fillRect(0, ledgeY, W, 1);

  // Ledge crack lines
  ctx.strokeStyle = '#5a4a30';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, ledgeY + 5);
  ctx.lineTo(350, ledgeY + 20);
  ctx.lineTo(500, ledgeY + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(600, ledgeY + 8);
  ctx.lineTo(750, ledgeY + 25);
  ctx.stroke();

  // === WIND-BENT GRASS — cliff edge ===
  const grassX = [120, 280, 540, 720];
  for (const gx of grassX) {
    const gy = ledgeY + 1;
    ctx.strokeStyle = '#4a6a3a';
    ctx.lineWidth = 1;
    // 3-5 blades per tuft, bent left (wind from right)
    for (let blade = 0; blade < 4; blade++) {
      const bx = gx + (blade - 2) * 4;
      ctx.beginPath();
      ctx.moveTo(bx, gy);
      ctx.quadraticCurveTo(bx - 10, gy - 8, bx - 18, gy - 14 - blade * 2);
      ctx.stroke();
    }
    // Slightly brighter tip
    ctx.fillStyle = '#5a7a4a';
    ctx.fillRect(gx - 18, gy - 14, 2, 1);
  }

  // === PURPLE-BLUE TINT OVERLAY ===
  ctx.fillStyle = 'rgba(30,25,60,0.22)';
  ctx.fillRect(0, 0, W, H);

  // Soft vignette — edges slightly darker
  // Step vignette — left/right/top/bottom darkening
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, 80, H); ctx.fillRect(W-80, 0, 80, H);
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ctx.fillRect(80, 0, 80, H); ctx.fillRect(W-160, 0, 80, H);
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.fillRect(160, 0, 80, H); ctx.fillRect(W-240, 0, 80, H);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fillRect(0, 0, W, 50);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 50, W, 40);

  save(canvas, 'cliff.png');
}

// ─────────────────────────────────────────────
// 3. meadow.png — The Colors
// ─────────────────────────────────────────────
function generateMeadow() {
  console.log('Generating meadow.png...');
  const { canvas, ctx } = newCanvas();
  const rng = makeRng(7);

  const horizonY = Math.floor(H * 0.40); // low horizon — 60% sky

  // === SKY — golden hour gradient ===
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#2a2a4a');
  skyGrad.addColorStop(0.35, '#3a3060');
  skyGrad.addColorStop(0.65, '#7a5540');
  skyGrad.addColorStop(0.85, '#aa7733');
  skyGrad.addColorStop(1, '#cc8844');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, horizonY);

  // Horizon glow bloom
  const hGlow = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 20);
  hGlow.addColorStop(0, 'rgba(220,150,60,0)');
  hGlow.addColorStop(0.5, 'rgba(220,150,60,0.3)');
  hGlow.addColorStop(1, 'rgba(220,150,60,0)');
  ctx.fillStyle = hGlow;
  ctx.fillRect(0, horizonY - 40, W, 60);

  // Horizon cloud bands — flat horizontal rects for compression efficiency
  ctx.fillStyle = 'rgba(220,170,90,0.14)';
  ctx.fillRect(80, horizonY - 28, 200, 8);
  ctx.fillRect(80, horizonY - 22, 200, 4);
  ctx.fillStyle = 'rgba(220,170,90,0.10)';
  ctx.fillRect(500, horizonY - 24, 260, 6);
  ctx.fillRect(750, horizonY - 26, 180, 5);

  // === ROLLING GREEN TERRAIN ===
  const greens = ['#2a5a2a', '#3a6a3a', '#4a7a4a'];

  // Far background hills — wavy horizon
  const hillGrad = ctx.createLinearGradient(0, horizonY - 5, 0, horizonY + 30);
  hillGrad.addColorStop(0, '#2a5a2a');
  hillGrad.addColorStop(1, '#1e441e');
  ctx.fillStyle = hillGrad;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let x = 0; x <= W; x += 20) {
    const wave = Math.sin(x * 0.012) * 12 + Math.cos(x * 0.007) * 8;
    if (x === 0) ctx.moveTo(x, horizonY + wave);
    else ctx.lineTo(x, horizonY + wave);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Mid terrain
  const midGrad = ctx.createLinearGradient(0, horizonY + 20, 0, H);
  midGrad.addColorStop(0, '#3a6a3a');
  midGrad.addColorStop(0.4, '#2e5a2e');
  midGrad.addColorStop(1, '#224422');
  ctx.fillStyle = midGrad;
  ctx.beginPath();
  ctx.moveTo(0, horizonY + 20);
  for (let x = 0; x <= W; x += 15) {
    const wave = Math.sin(x * 0.008 + 1) * 8 + Math.cos(x * 0.015) * 5;
    ctx.lineTo(x, horizonY + 35 + wave);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Foreground ground base
  const fgGrad = ctx.createLinearGradient(0, H - 160, 0, H);
  fgGrad.addColorStop(0, '#4a7a4a');
  fgGrad.addColorStop(1, '#3a6a3a');
  ctx.fillStyle = fgGrad;
  ctx.fillRect(0, H - 160, W, 160);

  // === WILDFLOWERS — 3 depth layers ===
  const flowerColors = {
    pink: '#ff88aa',
    blue: '#88aaff',
    yellow: '#ffdd55',
    white: '#f0f0e0',
    lavender: '#cc99ff',
    orange: '#ffaa55',
  };
  const colorKeys = Object.keys(flowerColors);

  function drawFlower(x, y, size, colorKey) {
    const color = flowerColors[colorKey];
    // Stem
    ctx.fillStyle = '#4a8a4a';
    ctx.fillRect(x, y, 1, size + 2);
    // Petals (4 cardinal + center)
    ctx.fillStyle = color;
    ctx.fillRect(x - Math.floor(size / 2), y - Math.floor(size / 2), size, size);
    // Center dot
    ctx.fillStyle = '#ffee88';
    ctx.fillRect(x, y - 1, Math.max(1, Math.floor(size / 3)), Math.max(1, Math.floor(size / 3)));
    // Extra petals for larger flowers
    if (size >= 6) {
      const half = Math.floor(size / 2);
      ctx.fillStyle = color;
      ctx.fillRect(x - half - 1, y, size / 3 | 0, 2);
      ctx.fillRect(x + half + 1, y, size / 3 | 0, 2);
      ctx.fillRect(x, y - half - 1, 2, size / 3 | 0);
    }
  }

  // Background flowers — 2px dots on 4px grid (better compression)
  const bgFlowerRng = makeRng(21);
  for (let i = 0; i < 130; i++) {
    const fx = Math.floor(bgFlowerRng() * (W / 4)) * 4;
    const fy = horizonY + 10 + Math.floor(bgFlowerRng() * (80 / 2)) * 2;
    const ck = colorKeys[Math.floor(bgFlowerRng() * colorKeys.length)];
    ctx.fillStyle = flowerColors[ck];
    ctx.fillRect(fx, fy, 2, 2);
  }

  // Mid-ground flowers — 4px
  const mgFlowerRng = makeRng(37);
  for (let i = 0; i < 60; i++) {
    const fx = Math.floor(mgFlowerRng() * (W / 4)) * 4;
    const fy = horizonY + 60 + Math.floor(mgFlowerRng() * (100 / 2)) * 2;
    const ck = colorKeys[Math.floor(mgFlowerRng() * colorKeys.length)];
    drawFlower(fx, fy, 4, ck);
  }

  // Foreground flowers — 6-8px, more varied
  const fgFlowerRng = makeRng(53);
  for (let i = 0; i < 40; i++) {
    const fx = Math.floor(fgFlowerRng() * (W / 4)) * 4;
    const fy = H - 10 - Math.floor(fgFlowerRng() * (130 / 2)) * 2;
    const size = 6 + Math.floor(fgFlowerRng() * 3);
    const ck = colorKeys[Math.floor(fgFlowerRng() * colorKeys.length)];
    drawFlower(fx, fy, size, ck);
  }

  // === BUTTERFLY — Simon's symbol, mid-ground ===
  const bfX = 420;
  const bfY = horizonY + 100;
  // Wings: two small ellipses, pink/lavender
  ctx.fillStyle = '#dd88cc';
  ctx.beginPath();
  ctx.ellipse(bfX - 4, bfY, 5, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bfX + 4, bfY, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Lower wings
  ctx.fillStyle = '#cc77bb';
  ctx.beginPath();
  ctx.ellipse(bfX - 3, bfY + 3, 3, 2, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bfX + 3, bfY + 3, 3, 2, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = '#442244';
  ctx.fillRect(bfX - 1, bfY - 1, 2, 5);
  // Antennae
  ctx.fillStyle = '#553355';
  ctx.fillRect(bfX - 2, bfY - 3, 1, 3);
  ctx.fillRect(bfX + 1, bfY - 3, 1, 3);

  // === GOLDEN HOUR OVERLAY ===
  ctx.fillStyle = 'rgba(170,130,50,0.1)';
  ctx.fillRect(0, 0, W, H);

  // Step vignette — warm, gentle
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, 70, H); ctx.fillRect(W-70, 0, 70, H);
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.fillRect(70, 0, 70, H); ctx.fillRect(W-140, 0, 70, H);
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.fillRect(140, 0, 60, H); ctx.fillRect(W-200, 0, 60, H);

  save(canvas, 'meadow.png');
}

// ─────────────────────────────────────────────
// 4. lake.png — The Mirror
// ─────────────────────────────────────────────
function generateLake() {
  console.log('Generating lake.png...');
  const { canvas, ctx } = newCanvas();
  const rng = makeRng(31);

  const waterLine = Math.floor(H * 0.5); // mirror exactly at midpoint

  // === SKY — deep blue, almost black ===
  const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLine);
  skyGrad.addColorStop(0, '#030310');
  skyGrad.addColorStop(0.4, '#060618');
  skyGrad.addColorStop(0.8, '#0a0a20');
  skyGrad.addColorStop(1, '#0a1020');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, waterLine);

  // === MOON — upper portion ===
  const moonX = 480;
  const moonY = 80;
  const moonR = 9;
  // Moon glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 35);
  moonGlow.addColorStop(0, 'rgba(200,220,240,0.15)');
  moonGlow.addColorStop(1, 'rgba(200,220,240,0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(moonX - 35, moonY - 35, 70, 70);
  // Moon disk
  ctx.fillStyle = '#ccddee';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  // Moon surface — subtle darker patches
  ctx.fillStyle = 'rgba(160,180,200,0.4)';
  ctx.beginPath();
  ctx.arc(moonX - 3, moonY + 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(moonX + 4, moonY - 1, 2, 0, Math.PI * 2);
  ctx.fill();

  // === STARS — sky half ===
  const starCount = 160;
  const starData = [];
  for (let i = 0; i < starCount; i++) {
    const sx = rng() * W;
    const sy = rng() * (waterLine - 20);
    const brightness = 0.5 + rng() * 0.5;
    const size = rng() < 0.7 ? 1 : 2;
    starData.push({ sx, sy, brightness, size });
    const r = Math.floor(180 + brightness * 40);
    const g = Math.floor(190 + brightness * 30);
    const b = Math.floor(220 + brightness * 30);
    ctx.fillStyle = `rgba(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)},${brightness})`;
    ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
  }

  // === WATER — bottom half, reflected starfield ===
  const waterGrad = ctx.createLinearGradient(0, waterLine, 0, H);
  waterGrad.addColorStop(0, '#0a0a1a');
  waterGrad.addColorStop(0.5, '#080814');
  waterGrad.addColorStop(1, '#060610');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterLine, W, H - waterLine);

  // Reflect stars — mirrored, slightly darker, 1-2px offset
  for (const star of starData) {
    const ry = waterLine + (waterLine - star.sy) + 1; // reflected Y
    if (ry > H) continue;
    // Slightly distorted — offset x by ±1
    const offset = (rng() - 0.5) * 2;
    const alpha = star.brightness * 0.6;
    const r = Math.floor(140 + star.brightness * 40);
    const g = Math.floor(150 + star.brightness * 30);
    const b = Math.floor(200 + star.brightness * 30);
    ctx.fillStyle = `rgba(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)},${alpha})`;
    ctx.fillRect(Math.round(star.sx + offset), Math.round(ry), star.size, star.size);
  }

  // Moon reflection — elongated wobble in water
  const mRy = waterLine + (waterLine - moonY);
  for (let dy = -18; dy <= 18; dy++) {
    const wobble = Math.sin(dy * 0.4) * 3;
    const alpha = 0.5 - Math.abs(dy) * 0.022;
    if (alpha <= 0) continue;
    ctx.fillStyle = `rgba(180,200,220,${alpha})`;
    ctx.fillRect(Math.round(moonX - 4 + wobble), Math.round(mRy + dy), 8, 1);
  }

  // Gentle ripple lines on water surface
  const rippleRng = makeRng(66);
  for (let i = 0; i < 18; i++) {
    const ry = waterLine + 10 + rippleRng() * (H - waterLine - 20);
    const alpha = 0.04 + rippleRng() * 0.06;
    const lineW = 40 + rippleRng() * 120;
    const lx = rippleRng() * (W - lineW);
    ctx.fillStyle = `rgba(100,120,180,${alpha})`;
    ctx.fillRect(Math.round(lx), Math.round(ry), Math.round(lineW), 1);
  }

  // === FLAT ROCK — lower foreground ===
  const rockY = Math.floor(H * 0.76);
  const rockGrad = ctx.createLinearGradient(0, rockY, 0, H);
  rockGrad.addColorStop(0, '#7a7a6a');
  rockGrad.addColorStop(0.3, '#6a6a5a');
  rockGrad.addColorStop(1, '#4a4a3a');
  ctx.fillStyle = rockGrad;
  ctx.fillRect(0, rockY, W, H - rockY);

  // Rock texture — sparse scattered pixels
  const rockRng = makeRng(88);
  const rockH = H - rockY;
  // Draw only a limited number of texture pixels rather than scanning every pixel
  for (let i = 0; i < 1200; i++) {
    const tx = Math.floor(rockRng() * W);
    const ty = rockY + Math.floor(rockRng() * rockH);
    if (rockRng() < 0.5) {
      ctx.fillStyle = 'rgba(120,120,100,0.3)';
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
    }
    ctx.fillRect(tx, ty, 1, 1);
  }

  // Rock edge — top lip highlight
  ctx.fillStyle = '#8a8a7a';
  ctx.fillRect(0, rockY, W, 2);
  ctx.fillStyle = '#9a9a8a';
  ctx.fillRect(0, rockY, W, 1);

  // Rock cracks
  ctx.strokeStyle = '#4a4a3a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, rockY + 8);
  ctx.lineTo(300, rockY + 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(650, rockY + 6);
  ctx.lineTo(800, rockY + 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(420, rockY + 12);
  ctx.lineTo(540, rockY + 22);
  ctx.stroke();

  // === DARK TREES — thin, edges only ===
  function drawThinTree(cx, groundY, h, w) {
    ctx.fillStyle = '#060810';
    ctx.fillRect(cx - Math.floor(w / 2), groundY - h, w, h);
    // Sparse canopy blob
    ctx.fillStyle = '#050709';
    ctx.beginPath();
    ctx.ellipse(cx, groundY - h, w * 2.5, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Left edge
  drawThinTree(30, waterLine, 160, 8);
  drawThinTree(80, waterLine, 130, 6);
  // Right edge
  drawThinTree(W - 30, waterLine, 160, 8);
  drawThinTree(W - 80, waterLine, 130, 6);

  // Green dots at water's edge — frogs
  const frogRng = makeRng(44);
  for (let i = 0; i < 6; i++) {
    const fx = 100 + frogRng() * (W - 200);
    const fy = waterLine + 2 + frogRng() * 8;
    ctx.fillStyle = '#2a5a2a';
    ctx.fillRect(Math.round(fx), Math.round(fy), 2, 2);
  }

  // Water/rock seam — very subtle
  ctx.fillStyle = 'rgba(10,20,40,0.6)';
  ctx.fillRect(0, rockY - 3, W, 3);

  // === DEEP BLUE TINT ===
  ctx.fillStyle = 'rgba(10,15,50,0.2)';
  ctx.fillRect(0, 0, W, H);

  // Step vignette — deep, intimate
  ctx.fillStyle = 'rgba(0,0,0,0.50)';
  ctx.fillRect(0, 0, 90, H); ctx.fillRect(W-90, 0, 90, H);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fillRect(90, 0, 80, H); ctx.fillRect(W-170, 0, 80, H);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(170, 0, 80, H); ctx.fillRect(W-250, 0, 80, H);
  ctx.fillStyle = 'rgba(0,0,0,0.40)';
  ctx.fillRect(0, 0, W, 50); ctx.fillRect(0, H-50, W, 50);
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ctx.fillRect(0, 50, W, 40); ctx.fillRect(0, H-90, W, 40);

  save(canvas, 'lake.png');
}

// ─────────────────────────────────────────────
// 5. void.png — The Spotlight
// ─────────────────────────────────────────────
function generateVoid() {
  console.log('Generating void.png...');
  const { canvas, ctx } = newCanvas();

  // === RENDER SPOTLIGHT via ImageData with quantized color steps ===
  // Quantizing the gradient to discrete steps makes PNG compress efficiently
  const spotX = 480;
  const spotY = 340; // below vertical center — where a person stands
  const spotR = 185; // outer radius

  // Build the image pixel-by-pixel with quantized brightness levels
  const imgData = ctx.createImageData(W, H);
  const d = imgData.data;

  // Spotlight color at full brightness: rgb(201,169,110)
  // Subtle red mix in center for Brent variant: +15r at dist=0
  const STEPS = 24; // quantize to 24 steps for good compression

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - spotX;
      const dy = y - spotY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t = Math.min(1, dist / spotR); // 0=center, 1=edge

      let r = 0, g = 0, b = 0;
      if (t < 1) {
        // Spotlight falloff curve — exponential feel
        const bright = Math.pow(1 - t, 2.2);
        // Quantize brightness to STEPS levels
        const qBright = Math.round(bright * STEPS) / STEPS;
        // Base color: warm amber/gold
        r = Math.round(qBright * 201);
        g = Math.round(qBright * 155);
        b = Math.round(qBright * 85);
        // Shadow at bottom-center (figure's shadow)
        if (dy > 0 && dy < 70 && Math.abs(dx) < 28) {
          const shadowT = Math.max(0, 1 - dist / 50);
          r = Math.round(r * (1 - shadowT * 0.3));
          g = Math.round(g * (1 - shadowT * 0.3));
          b = Math.round(b * (1 - shadowT * 0.3));
        }
        // Subtle red hint at center (Brent variant warmth)
        if (t < 0.3) {
          r = Math.min(255, r + Math.round((1 - t / 0.3) * 12));
        }
      }
      // Floor lines — horizontal rows of slightly lighter ground in lit area
      if (dist < spotR * 0.8 && y >= spotY - 20 && ((y - spotY) % 4 === 0)) {
        r = Math.min(255, r + 8);
        g = Math.min(255, g + 5);
        b = Math.min(255, b + 2);
      }

      const i = (y * W + x) * 4;
      d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Beam rays — very faint, drawn on top (minimal effect on file size)
  ctx.save();
  ctx.globalAlpha = 0.025;
  const rayOriginX = spotX;
  const rayOriginY = -40;
  for (const angle of [-0.15, -0.06, 0, 0.06, 0.15]) {
    const endX = rayOriginX + Math.sin(angle) * 650;
    const endY = rayOriginY + 650;
    ctx.strokeStyle = '#c9a96e';
    ctx.lineWidth = 18 + Math.abs(angle) * 25;
    ctx.beginPath();
    ctx.moveTo(rayOriginX, rayOriginY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  ctx.restore();

  save(canvas, 'void.png');
}

// ─────────────────────────────────────────────
// Run all generators
// ─────────────────────────────────────────────
console.log('SCOUTS Background Generator v2');
console.log('Output:', OUT);
console.log('');

try {
  generateCampfire();
  generateCliff();
  generateMeadow();
  generateLake();
  generateVoid();
  console.log('\nAll backgrounds generated successfully.');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}

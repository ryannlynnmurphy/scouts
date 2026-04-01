/**
 * generate-audio.js
 * Generates WAV audio files for SCOUTS using Web Audio API synthesis via raw PCM buffers.
 * No external audio assets required.
 *
 * Usage: node scripts/generate-audio.js
 */

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 22050;
const OUT_DIR = path.resolve(__dirname, "../public/assets/audio");

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// WAV encoding -- raw 16-bit PCM, no external deps
// ---------------------------------------------------------------------------

/**
 * Write a mono 16-bit PCM WAV file from a Float32Array of samples in [-1, 1].
 * @param {string} filePath
 * @param {Float32Array} samples
 * @param {number} sampleRate
 */
function writeWav(filePath, samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataByteLength = numSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataByteLength);
  let offset = 0;

  // RIFF header
  buffer.write("RIFF", offset); offset += 4;
  buffer.writeUInt32LE(36 + dataByteLength, offset); offset += 4;
  buffer.write("WAVE", offset); offset += 4;

  // fmt chunk
  buffer.write("fmt ", offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;          // chunk size
  buffer.writeUInt16LE(1, offset); offset += 2;           // PCM
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data chunk
  buffer.write("data", offset); offset += 4;
  buffer.writeUInt32LE(dataByteLength, offset); offset += 4;

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const int16 = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
    buffer.writeInt16LE(int16, offset);
    offset += 2;
  }

  fs.writeFileSync(filePath, buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`  Wrote ${path.basename(filePath)} (${kb} KB)`);
}

// ---------------------------------------------------------------------------
// Synthesis helpers
// ---------------------------------------------------------------------------

/** Pseudo-random noise generator (LCG) */
function makeNoise(length) {
  const buf = new Float32Array(length);
  let seed = 0x12345678;
  for (let i = 0; i < length; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    buf[i] = ((seed & 0xffffff) / 0x800000) - 1.0;
  }
  return buf;
}

/** One-pole low-pass filter in place. cutoff in Hz. */
function lowPass(buf, cutoff, sr = SAMPLE_RATE) {
  const rc = 1.0 / (2.0 * Math.PI * cutoff);
  const dt = 1.0 / sr;
  const alpha = dt / (rc + dt);
  let y = buf[0];
  for (let i = 0; i < buf.length; i++) {
    y = y + alpha * (buf[i] - y);
    buf[i] = y;
  }
  return buf;
}

/** One-pole high-pass filter in place. */
function highPass(buf, cutoff, sr = SAMPLE_RATE) {
  const rc = 1.0 / (2.0 * Math.PI * cutoff);
  const dt = 1.0 / sr;
  const alpha = rc / (rc + dt);
  let y = 0;
  let prev = buf[0];
  for (let i = 0; i < buf.length; i++) {
    const cur = buf[i];
    y = alpha * (y + cur - prev);
    prev = cur;
    buf[i] = y;
  }
  return buf;
}

/** Mix two buffers together with given gains. Modifies dest. */
function mix(dest, src, gainDest = 1.0, gainSrc = 1.0) {
  for (let i = 0; i < dest.length; i++) {
    dest[i] = dest[i] * gainDest + (src[i] ?? 0) * gainSrc;
  }
  return dest;
}

/** Normalize buffer to peak amplitude. */
function normalize(buf, peak = 0.7) {
  let max = 0;
  for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i]));
  if (max > 0.00001) {
    const gain = peak / max;
    for (let i = 0; i < buf.length; i++) buf[i] *= gain;
  }
  return buf;
}

/** Apply a short fade-in / fade-out to make loops seamless. */
function applyLoopFades(buf, fadeSamples = Math.floor(SAMPLE_RATE * 0.05)) {
  const n = Math.min(fadeSamples, Math.floor(buf.length / 4));
  for (let i = 0; i < n; i++) {
    const t = i / n;
    buf[i] *= t;
    buf[buf.length - 1 - i] *= t;
  }
  return buf;
}

/** Generate a sine wave at given freq. */
function sineWave(length, freq, sr = SAMPLE_RATE) {
  const buf = new Float32Array(length);
  const step = (2 * Math.PI * freq) / sr;
  for (let i = 0; i < length; i++) {
    buf[i] = Math.sin(step * i);
  }
  return buf;
}

/** Slow LFO modulation of amplitude on src (modulates between 1-depth and 1). */
function amplitudeMod(buf, lfoFreq, depth = 0.5, sr = SAMPLE_RATE) {
  const step = (2 * Math.PI * lfoFreq) / sr;
  for (let i = 0; i < buf.length; i++) {
    const lfo = 1 - depth + depth * ((Math.sin(step * i) + 1) * 0.5);
    buf[i] *= lfo;
  }
  return buf;
}

// ---------------------------------------------------------------------------
// Audio file generators
// ---------------------------------------------------------------------------

function numSamples(seconds) {
  return Math.ceil(seconds * SAMPLE_RATE);
}

/**
 * forest-ambient.wav
 * Dark, tense: low drone + heavy low-pass noise (crickets suggestion) + sub rumble.
 */
function makeForestAmbient() {
  const n = numSamples(10);
  const out = new Float32Array(n);

  // Sub drone at 55 Hz
  const drone = sineWave(n, 55);
  amplitudeMod(drone, 0.05, 0.15); // very slow swell

  // Second harmonic for body
  const drone2 = sineWave(n, 110);
  amplitudeMod(drone2, 0.07, 0.2);

  // Dense noise, heavily band-limited to low-mid range (100-800 Hz) for insect texture
  const noise = makeNoise(n);
  lowPass(noise, 900);
  highPass(noise, 90);

  // Slow amplitude tremor on noise (crickets "wavering")
  amplitudeMod(noise, 3.1, 0.7);

  mix(out, drone, 0, 0.45);
  mix(out, drone2, 1, 0.18);
  mix(out, noise, 1, 0.55);

  normalize(out, 0.65);
  applyLoopFades(out);
  return out;
}

/**
 * cliff-wind.wav
 * Warm, open: filtered white noise with slow amplitude swells.
 */
function makeCliffWind() {
  const n = numSamples(10);

  const noise = makeNoise(n);

  // Band-pass: cut very low (below 200) and very high (above 2000) for "wind" texture
  lowPass(noise, 2200);
  highPass(noise, 180);

  // Slow amplitude swell (wind gusts)
  amplitudeMod(noise, 0.18, 0.65);

  // Secondary slow modulation for depth
  const noise2 = makeNoise(n);
  lowPass(noise2, 600);
  highPass(noise2, 100);
  amplitudeMod(noise2, 0.08, 0.5);

  mix(noise, noise2, 1, 0.3);

  normalize(noise, 0.55);
  applyLoopFades(noise);
  return noise;
}

/**
 * meadow-birds.wav
 * Bright, warm: gentle high oscillations suggesting distant birdsong.
 */
function makeMeadowBirds() {
  const n = numSamples(10);
  const out = new Float32Array(n);

  // Warm base: gentle low-pass noise for "air"
  const air = makeNoise(n);
  lowPass(air, 1200);
  highPass(air, 200);
  amplitudeMod(air, 0.12, 0.3);

  mix(out, air, 0, 0.35);

  // Several "bird" harmonics: chirp suggestions at different freqs
  const birdFreqs = [
    { freq: 2800, lfo: 4.0, depth: 0.85, gain: 0.06 },
    { freq: 3400, lfo: 6.1, depth: 0.9, gain: 0.05 },
    { freq: 2200, lfo: 2.7, depth: 0.8, gain: 0.07 },
    { freq: 4100, lfo: 8.2, depth: 0.92, gain: 0.04 },
  ];

  for (const { freq, lfo, depth, gain } of birdFreqs) {
    const bird = sineWave(n, freq);
    amplitudeMod(bird, lfo, depth);
    // Offset phase for each bird
    mix(out, bird, 1, gain);
  }

  // Low warm drone underneath
  const drone = sineWave(n, 80);
  amplitudeMod(drone, 0.04, 0.1);
  mix(out, drone, 1, 0.12);

  normalize(out, 0.6);
  applyLoopFades(out);
  return out;
}

/**
 * lake-water.wav
 * Still, peaceful: very gentle low rumble + soft high shimmer.
 */
function makeLakeWater() {
  const n = numSamples(10);
  const out = new Float32Array(n);

  // Very low, slow-swell rumble
  const rumble = makeNoise(n);
  lowPass(rumble, 120);
  amplitudeMod(rumble, 0.06, 0.4);

  // Gentle sub tone
  const sub = sineWave(n, 42);
  amplitudeMod(sub, 0.05, 0.2);

  // High shimmer (water surface glint suggestion)
  const shimmer = makeNoise(n);
  highPass(shimmer, 5000);
  lowPass(shimmer, 8000);
  amplitudeMod(shimmer, 0.3, 0.75);

  mix(out, rumble, 0, 0.5);
  mix(out, sub, 1, 0.4);
  mix(out, shimmer, 1, 0.15);

  normalize(out, 0.5);
  applyLoopFades(out);
  return out;
}

/**
 * tinnitus.wav
 * Piercing steady sine around 4800 Hz with very subtle warble. 5 seconds, loopable.
 */
function makeTinnitus() {
  const n = numSamples(5);

  const tone = sineWave(n, 4800);

  // Tiny warble to make it feel "wrong"
  amplitudeMod(tone, 7.3, 0.04);

  // Second harmonic at 9600 slightly present
  const harm = sineWave(n, 9400);
  amplitudeMod(harm, 11, 0.06);
  mix(tone, harm, 1, 0.15);

  normalize(tone, 0.5);
  applyLoopFades(tone, Math.floor(SAMPLE_RATE * 0.02));
  return tone;
}

/**
 * heartbeat.wav
 * Low thump-thump, two beats then silence. ~3 seconds, loopable.
 */
function makeHeartbeat() {
  const n = numSamples(3);
  const out = new Float32Array(n);

  // Each thump: short burst of 60 Hz sine with exponential decay
  function addThump(startSec, gainPeak = 1.0) {
    const start = Math.floor(startSec * SAMPLE_RATE);
    const duration = Math.floor(0.12 * SAMPLE_RATE);
    const step = (2 * Math.PI * 65) / SAMPLE_RATE;
    for (let i = 0; i < duration && start + i < n; i++) {
      const env = Math.exp(-i / (duration * 0.25));
      out[start + i] += Math.sin(step * i) * env * gainPeak;
    }
    // Second higher-freq click component for "lub"
    const click = Math.floor(0.04 * SAMPLE_RATE);
    const step2 = (2 * Math.PI * 140) / SAMPLE_RATE;
    for (let i = 0; i < click && start + i < n; i++) {
      const env = Math.exp(-i / (click * 0.3));
      out[start + i] += Math.sin(step2 * i) * env * gainPeak * 0.4;
    }
  }

  // Lub-dub at ~0.35 and ~0.55s (systole), then silence until 3s
  addThump(0.25, 1.0);
  addThump(0.50, 0.7);

  normalize(out, 0.7);
  applyLoopFades(out, Math.floor(SAMPLE_RATE * 0.03));
  return out;
}

/**
 * transition.wav
 * Quick dark whoosh (0.5 seconds).
 */
function makeTransition() {
  const n = numSamples(0.5);
  const out = new Float32Array(n);

  // Noise sweep: start high-passed tight, filter opens as amplitude drops
  const noise = makeNoise(n);

  // Sweep filter cutoff from ~3000 down to ~200 over the 0.5s
  // Approximate by mixing two noise sources with different filters
  const noiseHigh = new Float32Array(noise);
  lowPass(noiseHigh, 4000);
  highPass(noiseHigh, 1000);

  const noiseLow = new Float32Array(noise);
  lowPass(noiseLow, 500);
  highPass(noiseLow, 80);

  // Blend: start with high, end with low
  for (let i = 0; i < n; i++) {
    const t = i / n; // 0 -> 1
    out[i] = noiseHigh[i] * (1 - t) + noiseLow[i] * t;
  }

  // Amplitude envelope: sharp attack, exponential decay
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.exp(-t * 5.0);
    out[i] *= env;
  }

  // Add a low tone sweep downward
  const toneStart = 180;
  const toneEnd = 55;
  const toneStep = (2 * Math.PI) / SAMPLE_RATE;
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const freq = toneStart + (toneEnd - toneStart) * t;
    phase += toneStep * freq;
    const env = Math.exp(-t * 4.0);
    out[i] += Math.sin(phase) * env * 0.5;
  }

  normalize(out, 0.65);
  // Short fade at end only (it has its own attack)
  for (let i = 0; i < 256 && i < n; i++) {
    out[n - 1 - i] *= i / 256;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Generate all files
// ---------------------------------------------------------------------------

const files = [
  { name: "forest-ambient.wav", fn: makeForestAmbient },
  { name: "cliff-wind.wav",     fn: makeCliffWind     },
  { name: "meadow-birds.wav",   fn: makeMeadowBirds   },
  { name: "lake-water.wav",     fn: makeLakeWater     },
  { name: "tinnitus.wav",       fn: makeTinnitus      },
  { name: "heartbeat.wav",      fn: makeHeartbeat     },
  { name: "transition.wav",     fn: makeTransition    },
];

console.log("Generating audio files...\n");
for (const { name, fn } of files) {
  const samples = fn();
  writeWav(path.join(OUT_DIR, name), samples);
}
console.log("\nDone. All files written to public/assets/audio/");

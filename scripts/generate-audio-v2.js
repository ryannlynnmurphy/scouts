/**
 * generate-audio-v2.js
 * Film-quality layered audio synthesis for SCOUTS.
 * Raw 16-bit PCM WAV -- no external dependencies.
 *
 * Inspired by: Moonlight, Hereditary, Portrait of a Lady on Fire.
 * Every soundscape is a PLACE, not a tone.
 *
 * Usage: node scripts/generate-audio-v2.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SR = 44100; // 44.1kHz -- film quality
const OUT_DIR = path.resolve(__dirname, "../public/assets/audio");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// WAV writer -- raw 16-bit PCM mono, no external deps
// ---------------------------------------------------------------------------

function writeWav(filePath, samples, sampleRate = SR) {
  const numSamples = samples.length;
  const bitsPerSample = 16;
  const byteRate = sampleRate * (bitsPerSample / 8);
  const dataByteLength = numSamples * 2;

  const buf = Buffer.alloc(44 + dataByteLength);
  let o = 0;

  buf.write("RIFF", o); o += 4;
  buf.writeUInt32LE(36 + dataByteLength, o); o += 4;
  buf.write("WAVE", o); o += 4;
  buf.write("fmt ", o); o += 4;
  buf.writeUInt32LE(16, o); o += 4;
  buf.writeUInt16LE(1, o); o += 2;   // PCM
  buf.writeUInt16LE(1, o); o += 2;   // mono
  buf.writeUInt32LE(sampleRate, o); o += 4;
  buf.writeUInt32LE(byteRate, o); o += 4;
  buf.writeUInt16LE(2, o); o += 2;   // blockAlign
  buf.writeUInt16LE(bitsPerSample, o); o += 2;
  buf.write("data", o); o += 4;
  buf.writeUInt32LE(dataByteLength, o); o += 4;

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const v = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
    buf.writeInt16LE(v, o);
    o += 2;
  }

  fs.writeFileSync(filePath, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ${path.basename(filePath).padEnd(34)} ${kb.padStart(7)} KB`);
}

// ---------------------------------------------------------------------------
// Synthesis primitives
// ---------------------------------------------------------------------------

/** Samples for N seconds */
function ns(sec) { return Math.ceil(sec * SR); }

/** LCG pseudo-random noise, deterministic seed for reproducibility */
function makeNoise(length, seed = 0xdeadbeef) {
  const buf = new Float32Array(length);
  let s = seed >>> 0;
  for (let i = 0; i < length; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    buf[i] = ((s & 0xffffff) / 0x800000) - 1.0;
  }
  return buf;
}

/** Sine wave. phase offset in radians. */
function sine(length, freq, phaseOffset = 0) {
  const buf = new Float32Array(length);
  const step = (2 * Math.PI * freq) / SR;
  for (let i = 0; i < length; i++) buf[i] = Math.sin(step * i + phaseOffset);
  return buf;
}

/** One-pole low-pass in-place */
function lp(buf, cutoff) {
  const rc = 1.0 / (2.0 * Math.PI * cutoff);
  const dt = 1.0 / SR;
  const a = dt / (rc + dt);
  let y = buf[0];
  for (let i = 0; i < buf.length; i++) { y += a * (buf[i] - y); buf[i] = y; }
  return buf;
}

/** One-pole high-pass in-place */
function hp(buf, cutoff) {
  const rc = 1.0 / (2.0 * Math.PI * cutoff);
  const dt = 1.0 / SR;
  const a = rc / (rc + dt);
  let y = 0, prev = buf[0];
  for (let i = 0; i < buf.length; i++) {
    const cur = buf[i]; y = a * (y + cur - prev); prev = cur; buf[i] = y;
  }
  return buf;
}

/** Band-pass: lp then hp */
function bp(buf, lo, hi) { lp(buf, hi); hp(buf, lo); return buf; }

/** Mix src into dest (modifies dest). dest[i] += src[i] * gain */
function mixIn(dest, src, gain = 1.0) {
  const len = Math.min(dest.length, src.length);
  for (let i = 0; i < len; i++) dest[i] += src[i] * gain;
  return dest;
}

/** Normalize buffer to peak amplitude */
function norm(buf, peak = 0.7) {
  let max = 0;
  for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i]));
  if (max > 1e-6) { const g = peak / max; for (let i = 0; i < buf.length; i++) buf[i] *= g; }
  return buf;
}

/** Apply crossfade tails for seamless looping (50ms) */
function loopFade(buf, ms = 50) {
  const n = Math.min(Math.floor((ms / 1000) * SR), Math.floor(buf.length / 4));
  for (let i = 0; i < n; i++) {
    const t = i / n;
    buf[i] *= t;
    buf[buf.length - 1 - i] *= t;
  }
  return buf;
}

/** Amplitude modulate in-place. depth in [0,1]. lfoFreq in Hz. */
function ampMod(buf, lfoFreq, depth = 0.5, phaseOff = 0) {
  const step = (2 * Math.PI * lfoFreq) / SR;
  for (let i = 0; i < buf.length; i++) {
    const lfo = 1 - depth + depth * (Math.sin(step * i + phaseOff) * 0.5 + 0.5);
    buf[i] *= lfo;
  }
  return buf;
}

/** Envelope gate: scale region [startSample, endSample] with attack/decay ramps */
function gate(buf, startSmp, endSmp, attackSmp, decaySmp) {
  for (let i = startSmp; i < endSmp && i < buf.length; i++) {
    const relI = i - startSmp;
    const dur = endSmp - startSmp;
    let env = 1;
    if (relI < attackSmp) env = relI / attackSmp;
    else if (relI > dur - decaySmp) env = (endSmp - i) / decaySmp;
    buf[i] *= env;
  }
  return buf;
}

/** Simple reverb via comb: add delayed copy at lower gain */
function addReverb(dest, src, delayMs, gain) {
  const d = Math.floor((delayMs / 1000) * SR);
  for (let i = d; i < dest.length && i - d < src.length; i++) {
    dest[i] += src[i - d] * gain;
  }
  return dest;
}

// ---------------------------------------------------------------------------
// 1. forest-ambient.wav -- 15s, loopable
// ---------------------------------------------------------------------------

function makeForestAmbient() {
  const n = ns(15);
  const out = new Float32Array(n);

  // --- Base layer: deep earth drone 50Hz, very slow amp mod 0.1Hz ---
  const drone = sine(n, 50);
  ampMod(drone, 0.1, 0.3);
  mixIn(out, drone, 0.18);

  // --- Cricket voices: 3 voices at different freqs, offset timing ---
  // Pattern: ~3-4s chirp, ~2s silence, repeating
  // We gate band-passed noise bursts manually.

  const cricketFreqs = [
    { freq: 3200, seed: 0xaabb1122, phaseShift: 0.0 },
    { freq: 3800, seed: 0xccdd3344, phaseShift: 0.7 },
    { freq: 4500, seed: 0xeeff5566, phaseShift: 1.4 },
  ];

  // Chirp on/off windows (in seconds). Staggered so not all start together.
  const chirpWindows = [
    // voice 0: on 0-3.5s, off 3.5-5.5s, on 5.5-9s, off 9-11s, on 11-15s
    [[0, 3.5], [5.5, 9.0], [11.0, 15.0]],
    // voice 1: on 0.4-3.8s, off, on 6.0-9.5s, on 11.5-15s
    [[0.4, 3.8], [6.0, 9.5], [11.5, 15.0]],
    // voice 2: on 0.8-3.2s, off, on 6.5-8.8s, on 12.0-15s
    [[0.8, 3.2], [6.5, 8.8], [12.0, 15.0]],
  ];

  for (let vi = 0; vi < cricketFreqs.length; vi++) {
    const { freq, seed } = cricketFreqs[vi];
    const noise = makeNoise(n, seed);
    // Cricket chirp: narrow band around freq
    bp(noise, freq * 0.85, freq * 1.15);

    // Fast amplitude modulation to simulate chirp pulse
    ampMod(noise, freq * 0.008, 0.9, vi * 0.5);

    // Apply on/off gating
    const windows = chirpWindows[vi];
    const gated = new Float32Array(n); // zeroed
    for (const [wStart, wEnd] of windows) {
      const s = Math.floor(wStart * SR);
      const e = Math.min(Math.floor(wEnd * SR), n);
      const atk = Math.floor(0.05 * SR);
      const dec = Math.floor(0.1 * SR);
      for (let i = s; i < e; i++) {
        const relI = i - s;
        const dur = e - s;
        let env = 1;
        if (relI < atk) env = relI / atk;
        else if (relI > dur - dec) env = (e - i) / dec;
        gated[i] = noise[i] * env;
      }
    }
    mixIn(out, gated, 0.22);
  }

  // --- Wind burst layer: 2-3 gusts ---
  // Gust positions (seconds): 1.5, 7.2, 12.8
  const gustTimes = [1.5, 7.2, 12.8];
  const gustDurations = [1.8, 2.2, 1.5]; // seconds each
  for (let gi = 0; gi < gustTimes.length; gi++) {
    const gNoise = makeNoise(n, 0x11223300 + gi);
    bp(gNoise, 200, 800);
    const gs = Math.floor(gustTimes[gi] * SR);
    const ge = Math.min(gs + Math.floor(gustDurations[gi] * SR), n);
    const atk = Math.floor(0.5 * SR);
    const dec = Math.floor(0.6 * SR);
    const gustBuf = new Float32Array(n);
    for (let i = gs; i < ge; i++) {
      const relI = i - gs;
      const dur = ge - gs;
      let env = 1;
      if (relI < atk) env = relI / atk;
      else if (relI > dur - dec) env = (ge - i) / dec;
      gustBuf[i] = gNoise[i] * env * 0.5;
    }
    mixIn(out, gustBuf, 0.28);
  }

  // --- Owl layer: single hoot at ~10 seconds, 200Hz, 0.3s ---
  const owlStart = Math.floor(10.0 * SR);
  const owlDur = Math.floor(0.3 * SR);
  const owlBuf = new Float32Array(n);
  for (let i = 0; i < owlDur && owlStart + i < n; i++) {
    const t = i / owlDur;
    // Hoot: sine at 200Hz with gentle attack and natural decay
    const env = Math.sin(Math.PI * t); // rises and falls
    owlBuf[owlStart + i] = Math.sin((2 * Math.PI * 200 * i) / SR) * env;
    // Add 5th harmonic for "hoot" character
    owlBuf[owlStart + i] += Math.sin((2 * Math.PI * 300 * i) / SR) * env * 0.3;
  }
  // Reverb: add delayed copy (echo 80ms, gain 0.25 -- far away)
  addReverb(owlBuf, owlBuf, 80, 0.25);
  addReverb(owlBuf, owlBuf, 160, 0.1);
  mixIn(out, owlBuf, 0.12);

  norm(out, 0.68);
  loopFade(out, 50);
  return out;
}

// ---------------------------------------------------------------------------
// 2. cliff-wind.wav -- 15s, loopable
// ---------------------------------------------------------------------------

function makeCliffWind() {
  const n = ns(15);
  const out = new Float32Array(n);

  // --- Constant gentle wind: band-passed noise 100-1500Hz, slow swell 0.15Hz ---
  const wind = makeNoise(n, 0x55aa1234);
  bp(wind, 100, 1500);
  ampMod(wind, 0.15, 0.55);
  mixIn(out, wind, 0.5);

  // --- Second wind layer for texture ---
  const wind2 = makeNoise(n, 0x66bb5678);
  bp(wind2, 300, 900);
  ampMod(wind2, 0.08, 0.4, 1.2);
  mixIn(out, wind2, 0.25);

  // --- High whistle: faint 6000-8000Hz, intermittent ---
  const whistle = makeNoise(n, 0x77cc9abc);
  bp(whistle, 6000, 8000);
  // Gate: appears at 2-4s, 8-10s
  const wBuf = new Float32Array(n);
  const whistleWindows = [[2.0, 4.2], [8.0, 10.5]];
  for (const [ws, we] of whistleWindows) {
    const s = Math.floor(ws * SR);
    const e = Math.min(Math.floor(we * SR), n);
    const atk = Math.floor(0.3 * SR);
    const dec = Math.floor(0.5 * SR);
    for (let i = s; i < e; i++) {
      const relI = i - s;
      const dur = e - s;
      let env = 1;
      if (relI < atk) env = relI / atk;
      else if (relI > dur - dec) env = (e - i) / dec;
      wBuf[i] = whistle[i] * env;
    }
  }
  mixIn(out, wBuf, 0.08);

  // --- Distant valley hum: 80Hz, very faint, warm ---
  const hum = sine(n, 80);
  ampMod(hum, 0.05, 0.15);
  mixIn(out, hum, 0.1);

  norm(out, 0.65);
  loopFade(out, 50);
  return out;
}

// ---------------------------------------------------------------------------
// 3. meadow-birds.wav -- 15s, loopable
// ---------------------------------------------------------------------------

function makeMeadowBirds() {
  const n = ns(15);
  const out = new Float32Array(n);

  // --- Warm air base: soft low-pass noise ---
  const air = makeNoise(n, 0xaabb1234);
  bp(air, 300, 1800);
  ampMod(air, 0.07, 0.25);
  mixIn(out, air, 0.2);

  // --- Bird call phrases: 3-4 tones in sequence, repeated ---
  // Phrase pattern: 1800Hz, 2100Hz, 1950Hz, 2400Hz
  // Duration each note: ~0.15s. Phrase repeated every ~8-9s.
  const birdNotes = [1800, 2100, 1950, 2400];
  const noteDur = Math.floor(0.18 * SR);
  const noteGap = Math.floor(0.06 * SR); // brief gap between notes
  const phrasePeriods = [0.5, 8.5]; // start times in seconds

  for (const phraseStart of phrasePeriods) {
    let cursor = Math.floor(phraseStart * SR);
    for (let ni = 0; ni < birdNotes.length; ni++) {
      const freq = birdNotes[ni];
      for (let i = 0; i < noteDur && cursor + i < n; i++) {
        const t = i / noteDur;
        // Gentle attack, natural exponential decay
        const env = Math.sin(Math.PI * Math.pow(t, 0.4)) * Math.exp(-t * 1.8);
        out[cursor + i] += Math.sin((2 * Math.PI * freq * i) / SR) * env * 0.13;
        // Slight second harmonic for natural bird tone
        out[cursor + i] += Math.sin((2 * Math.PI * freq * 1.5 * i) / SR) * env * 0.04;
      }
      cursor += noteDur + noteGap;
    }
  }

  // --- Bee buzz: continuous 190Hz, slight random wobble ---
  const beeBuf = new Float32Array(n);
  let beePhase = 0;
  const beeSeed = makeNoise(n, 0xbeebee01);
  for (let i = 0; i < n; i++) {
    const freqWobble = 190 + beeSeed[i] * 15; // 175-205Hz random wobble
    beePhase += (2 * Math.PI * freqWobble) / SR;
    beeBuf[i] = Math.sin(beePhase);
  }
  ampMod(beeBuf, 0.3, 0.4, 0.8);
  mixIn(out, beeBuf, 0.06);

  // --- Grass rustle: high-freq noise 4000-8000Hz, very quiet, slow mod ---
  const grass = makeNoise(n, 0xcc112233);
  bp(grass, 4000, 8000);
  ampMod(grass, 0.12, 0.6);
  mixIn(out, grass, 0.05);

  norm(out, 0.62);
  loopFade(out, 50);
  return out;
}

// ---------------------------------------------------------------------------
// 4. lake-water.wav -- 15s, loopable
// ---------------------------------------------------------------------------

function makeLakeWater() {
  const n = ns(15);
  const out = new Float32Array(n);

  // --- Water lapping: low-freq noise pulses, irregular organic timing ---
  // 5 gentle laps at organic intervals
  const lapTimes = [0.8, 2.9, 5.7, 9.1, 12.3]; // seconds
  const lapDurs  = [0.6, 0.5, 0.7, 0.55, 0.65];
  for (let li = 0; li < lapTimes.length; li++) {
    const lNoise = makeNoise(n, 0x1a2b3c00 + li);
    bp(lNoise, 80, 300);
    const ls = Math.floor(lapTimes[li] * SR);
    const le = Math.min(ls + Math.floor(lapDurs[li] * SR), n);
    const atk = Math.floor(0.12 * SR);
    const dec = Math.floor(0.25 * SR);
    for (let i = ls; i < le; i++) {
      const relI = i - ls;
      const dur = le - ls;
      let env = 1;
      if (relI < atk) env = relI / atk;
      else if (relI > dur - dec) env = (le - i) / dec;
      out[i] += lNoise[i] * env * 0.15;
    }
  }

  // --- Frog 1: 400Hz, 0.2s, at second 4 ---
  const f1Start = Math.floor(4.0 * SR);
  const f1Dur = Math.floor(0.2 * SR);
  for (let i = 0; i < f1Dur && f1Start + i < n; i++) {
    const t = i / f1Dur;
    const env = Math.exp(-t * 5) * Math.min(t * 20, 1);
    out[f1Start + i] += Math.sin((2 * Math.PI * 400 * i) / SR) * env * 0.14;
    out[f1Start + i] += Math.sin((2 * Math.PI * 800 * i) / SR) * env * 0.04;
  }

  // --- Frog 2: 500Hz, 0.15s, at second 6 (answer) ---
  const f2Start = Math.floor(6.0 * SR);
  const f2Dur = Math.floor(0.15 * SR);
  for (let i = 0; i < f2Dur && f2Start + i < n; i++) {
    const t = i / f2Dur;
    const env = Math.exp(-t * 6) * Math.min(t * 25, 1);
    out[f2Start + i] += Math.sin((2 * Math.PI * 500 * i) / SR) * env * 0.11;
    out[f2Start + i] += Math.sin((2 * Math.PI * 1000 * i) / SR) * env * 0.03;
  }

  // --- Star shimmer: barely-there 9000Hz tone ---
  const shimmer = sine(n, 9000);
  ampMod(shimmer, 0.2, 0.8);
  mixIn(out, shimmer, 0.02);

  // Quiet near-silence pad (very faint broadband for "not dead silent")
  const pad = makeNoise(n, 0xfadedead);
  lp(pad, 200);
  mixIn(out, pad, 0.03);

  norm(out, 0.42); // deliberately quiet -- the intimacy is in the silence
  loopFade(out, 50);
  return out;
}

// ---------------------------------------------------------------------------
// 5. tinnitus.wav -- 5s, loopable
// ---------------------------------------------------------------------------

function makeTinnitus() {
  const n = ns(5);
  const out = new Float32Array(n);

  // --- Primary tone: 4200Hz with pitch wobble ±30Hz at 5Hz ---
  const primBuf = new Float32Array(n);
  let primPhase = 0;
  for (let i = 0; i < n; i++) {
    const wobble = 30 * Math.sin((2 * Math.PI * 5 * i) / SR);
    const freq = 4200 + wobble;
    primPhase += (2 * Math.PI * freq) / SR;
    primBuf[i] = Math.sin(primPhase);
  }
  // Slow pulse: 0.7Hz amplitude throb
  ampMod(primBuf, 0.7, 0.3);
  mixIn(out, primBuf, 0.7);

  // --- Secondary tone: 6800Hz, detuned by 7Hz to create beating ---
  const secBuf = new Float32Array(n);
  let secPhase = 0;
  for (let i = 0; i < n; i++) {
    const wobble = 12 * Math.sin((2 * Math.PI * 3.3 * i) / SR + 1.1);
    const freq = 6807 + wobble;
    secPhase += (2 * Math.PI * freq) / SR;
    secBuf[i] = Math.sin(secPhase);
  }
  ampMod(secBuf, 0.7, 0.25, 0.5);
  mixIn(out, secBuf, 0.35);

  // --- Noise damage layer: very faint high-freq noise ---
  const dmg = makeNoise(n, 0xdead1234);
  hp(dmg, 5000);
  mixIn(out, dmg, 0.08);

  norm(out, 0.55);
  loopFade(out, 20); // short fade to avoid click, but keep the instability
  return out;
}

// ---------------------------------------------------------------------------
// 6. heartbeat.wav -- 3s, loopable
// ---------------------------------------------------------------------------

function makeHeartbeat() {
  const n = ns(3);
  const out = new Float32Array(n);

  function addThump(startSec, baseFreq, clickFreq, dur, gain) {
    const s = Math.floor(startSec * SR);
    const d = Math.floor(dur * SR);
    for (let i = 0; i < d && s + i < n; i++) {
      // Low thump: fast decay
      const tEnv = Math.exp(-i / (d * 0.3));
      out[s + i] += Math.sin((2 * Math.PI * baseFreq * i) / SR) * tEnv * gain;
      // Click component: even faster decay
      const cDur = Math.floor(0.03 * SR);
      if (i < cDur) {
        const cEnv = Math.exp(-i / (cDur * 0.25));
        out[s + i] += Math.sin((2 * Math.PI * clickFreq * i) / SR) * cEnv * gain * 0.5;
      }
    }
  }

  // Thump 1 ("lub"): 0.0s, 55Hz + 120Hz click, 0.15s
  addThump(0.0, 55, 120, 0.15, 1.0);
  // Thump 2 ("dub"): 0.35s, 65Hz + 140Hz click, 0.12s
  addThump(0.35, 65, 140, 0.12, 0.85);
  // Silence: 0.5s to 3.0s -- the wait. The uncertainty.

  norm(out, 0.72);
  // Only fade at the very tail to avoid click on loop (the silence handles it)
  const fadeN = Math.floor(0.01 * SR);
  for (let i = 0; i < fadeN; i++) {
    out[n - 1 - i] *= i / fadeN;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 7. transition-to-campfire.wav -- 0.8s (one-shot)
// ---------------------------------------------------------------------------

function makeTransitionCampfire() {
  const n = ns(0.8);
  const out = new Float32Array(n);

  // --- Sharp crack: white noise burst, high-pass 2000Hz+, 0.05s ---
  const crackNoise = makeNoise(n, 0xcafebabe);
  hp(crackNoise, 2000);
  const crackDur = Math.floor(0.05 * SR);
  for (let i = 0; i < n; i++) {
    const env = i < crackDur ? Math.exp(-i / (crackDur * 0.2)) : 0;
    out[i] += crackNoise[i] * env * 0.9;
  }

  // --- Low thud: simultaneous 80Hz burst, 0.1s ---
  const thudDur = Math.floor(0.1 * SR);
  for (let i = 0; i < thudDur; i++) {
    const env = Math.exp(-i / (thudDur * 0.3));
    out[i] += Math.sin((2 * Math.PI * 80 * i) / SR) * env * 0.8;
  }

  // --- Reverb tail: echo of crack decaying over 0.5s ---
  const tail = makeNoise(n, 0x12345678);
  bp(tail, 800, 4000);
  // Tail starts after crack, decays
  const tailStart = Math.floor(0.05 * SR);
  const tailEnd = n;
  for (let i = tailStart; i < tailEnd; i++) {
    const t = (i - tailStart) / (tailEnd - tailStart);
    const env = Math.exp(-t * 6);
    out[i] += tail[i] * env * 0.3;
  }

  norm(out, 0.75);
  // Fade tail end
  const fadeN = Math.floor(0.02 * SR);
  for (let i = 0; i < fadeN; i++) out[n - 1 - i] *= i / fadeN;
  return out;
}

// ---------------------------------------------------------------------------
// 8. transition-to-safe.wav -- 1.0s (one-shot)
// ---------------------------------------------------------------------------

function makeTransitionSafe() {
  const n = ns(1.0);
  const out = new Float32Array(n);

  // --- Breath out: shaped noise, 200-2000Hz, 0.8s ---
  const breathNoise = makeNoise(n, 0xb1eab1ea);
  bp(breathNoise, 200, 2000);
  const breathDur = Math.floor(0.8 * SR);
  for (let i = 0; i < n; i++) {
    if (i < breathDur) {
      // Starts medium, decays
      const t = i / breathDur;
      const env = Math.pow(1 - t, 0.6) * 0.9;
      // Slight rush at start
      const rush = i < Math.floor(0.05 * SR) ? i / Math.floor(0.05 * SR) : 1;
      out[i] += breathNoise[i] * env * rush;
    }
  }

  // --- Warm release: A major chord (220 + 330 + 440Hz), fades IN as breath fades OUT ---
  const chordFreqs = [220, 330, 440];
  for (const freq of chordFreqs) {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      // Fades in over full duration, cross-fading with breath
      const env = Math.min(t * 2.5, 1) * 0.15;
      out[i] += Math.sin((2 * Math.PI * freq * i) / SR) * env;
    }
  }

  norm(out, 0.65);
  const fadeN = Math.floor(0.04 * SR);
  for (let i = 0; i < fadeN; i++) out[n - 1 - i] *= i / fadeN;
  return out;
}

// ---------------------------------------------------------------------------
// 9. transition-to-void.wav -- 0.5s (one-shot)
// ---------------------------------------------------------------------------

function makeTransitionVoid() {
  const n = ns(0.5);
  const out = new Float32Array(n);

  // --- Reverse reverb: noise builds to a peak, then CUTS ---
  // Simulate reverse by having amplitude ramp UP to the cut point
  const revNoise = makeNoise(n, 0xab120000);
  bp(revNoise, 300, 5000);

  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Exponential ramp up -- silence at start, sharp peak at end
    const env = Math.pow(t, 2.5) * 0.9;
    out[i] = revNoise[i] * env;
  }

  // The LAST sample is the loudest -- then the WAV ends (abrupt cut to silence)
  // No fade at the end. That IS the effect.

  norm(out, 0.8);
  // Only fade the very start (2ms) to prevent digital click at beginning
  const fadeN = Math.floor(0.002 * SR);
  for (let i = 0; i < fadeN; i++) out[i] *= i / fadeN;
  return out;
}

// ---------------------------------------------------------------------------
// 10. Character voice grunts (6 files, 0.3s each)
// ---------------------------------------------------------------------------

/**
 * Synthesize a voiced consonant + vowel shape.
 * baseFreq: fundamental pitch
 * formants: [F1, F2] vowel formant frequencies
 * character: { attack, decay, vibrato, noiseAmt }
 */
function makeGrunt(baseFreq, opts = {}) {
  const n = ns(0.3);
  const out = new Float32Array(n);
  const {
    attack = 0.015,   // seconds
    decay = 0.18,     // seconds (exponential decay time constant)
    vibrato = 0,      // vibrato depth in Hz
    vibratoRate = 5.5,
    noiseAmt = 0.05,
    harmonics = [1, 0.5, 0.25, 0.12, 0.06], // harmonic series amplitudes
    bright = false,   // emphasize upper harmonics
    noiseAttack = 0, // optional noise burst at start (like a consonant)
    noiseAttackDur = 0.02,
    pitchDrop = 0,    // pitch drop in Hz over duration
    trailoff = 1.0,   // how fast it trails (1.0 = normal)
  } = opts;

  const atkSmp = Math.floor(attack * SR);
  const noiseAtkSmp = Math.floor(noiseAttackDur * SR);

  // Optional noise consonant burst at start
  if (noiseAmt > 0 || noiseAttack > 0) {
    const consonantNoise = makeNoise(n, 0xc0ffee00 + Math.floor(baseFreq));
    hp(consonantNoise, 1500);
    for (let i = 0; i < noiseAtkSmp && i < n; i++) {
      const env = Math.exp(-i / (noiseAtkSmp * 0.3));
      out[i] += consonantNoise[i] * env * noiseAttack;
    }
  }

  // Voiced tone with harmonics
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    // Envelope
    const atkEnv = i < atkSmp ? i / atkSmp : 1;
    const decEnv = Math.exp(-Math.max(0, t - attack) / decay * trailoff);
    const env = atkEnv * decEnv;

    // Vibrato
    const vib = vibrato > 0
      ? vibrato * Math.sin(2 * Math.PI * vibratoRate * t)
      : 0;

    const freq = baseFreq + vib - pitchDrop * (t / 0.3);
    phase += (2 * Math.PI * freq) / SR;

    // Sum harmonics
    let s = 0;
    for (let h = 0; h < harmonics.length; h++) {
      const hAmp = bright ? harmonics[h] * (1 + h * 0.3) : harmonics[h];
      s += Math.sin(phase * (h + 1)) * hAmp;
    }

    // Background noise texture (breathiness)
    out[i] += s * env;
  }

  // Add gentle noise for breathiness
  const breath = makeNoise(n, 0xbbaacc00 + Math.floor(baseFreq));
  bp(breath, baseFreq * 0.8, baseFreq * 4);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const decEnv = Math.exp(-t / decay);
    out[i] += breath[i] * decEnv * noiseAmt;
  }

  norm(out, 0.62);
  // Fade out tail
  const fadeSmp = Math.floor(0.015 * SR);
  for (let i = 0; i < fadeSmp; i++) out[n - 1 - i] *= i / fadeSmp;
  return out;
}

// grunt-simon.wav: Soft "mm" -- 320Hz, gentle, slight vibrato
function makeGruntSimon() {
  return makeGrunt(320, {
    attack: 0.025,
    decay: 0.12,
    vibrato: 4,
    vibratoRate: 5.2,
    noiseAmt: 0.04,
    harmonics: [1, 0.45, 0.2, 0.08, 0.03],
    trailoff: 0.8,
  });
}

// grunt-sam.wav: Warm "hmm" -- 260Hz, clean, measured
function makeGruntSam() {
  return makeGrunt(260, {
    attack: 0.02,
    decay: 0.15,
    vibrato: 2,
    vibratoRate: 4.8,
    noiseAmt: 0.03,
    harmonics: [1, 0.5, 0.28, 0.14, 0.07],
    trailoff: 0.9,
  });
}

// grunt-brent.wav: Sharp "huh" -- 180Hz + noise burst, fast attack, louder
function makeGruntBrent() {
  return makeGrunt(180, {
    attack: 0.006,
    decay: 0.08,
    vibrato: 0,
    noiseAmt: 0.18,
    noiseAttack: 0.4,
    noiseAttackDur: 0.025,
    harmonics: [1, 0.6, 0.35, 0.18, 0.09],
    bright: true,
    pitchDrop: 20,
    trailoff: 1.5,
  });
}

// grunt-josh.wav: Eager "yep" -- 240Hz, staccato, short
function makeGruntJosh() {
  return makeGrunt(240, {
    attack: 0.008,
    decay: 0.06,
    vibrato: 1,
    noiseAmt: 0.08,
    noiseAttack: 0.15,
    noiseAttackDur: 0.015,
    harmonics: [1, 0.55, 0.3, 0.15, 0.07],
    pitchDrop: 10,
    trailoff: 1.8,
  });
}

// grunt-noah.wav: Smart "tch" -- 300Hz with attitude, quick click
function makeGruntNoah() {
  return makeGrunt(300, {
    attack: 0.004,
    decay: 0.07,
    vibrato: 0,
    noiseAmt: 0.12,
    noiseAttack: 0.5,
    noiseAttackDur: 0.018,
    harmonics: [1, 0.4, 0.2, 0.08, 0.03],
    bright: true,
    pitchDrop: 30,
    trailoff: 2.0,
  });
}

// grunt-lucas.wav: Quiet "um" -- 280Hz, soft attack, trails off
function makeGruntLucas() {
  return makeGrunt(280, {
    attack: 0.04,
    decay: 0.2,
    vibrato: 3,
    vibratoRate: 4.5,
    noiseAmt: 0.06,
    harmonics: [1, 0.4, 0.18, 0.07, 0.02],
    pitchDrop: 8,
    trailoff: 0.6, // trails off slowly -- uncertain
  });
}

// ---------------------------------------------------------------------------
// Generate all files
// ---------------------------------------------------------------------------

const files = [
  // Ambients (15s)
  { dir: "ambience", name: "forest-ambient.wav", fn: makeForestAmbient  },
  { dir: "ambience", name: "cliff-wind.wav",     fn: makeCliffWind      },
  { dir: "ambience", name: "meadow-birds.wav",   fn: makeMeadowBirds    },
  { dir: "ambience", name: "lake-water.wav",     fn: makeLakeWater      },
  // FX
  { dir: "sfx",      name: "tinnitus.wav",              fn: makeTinnitus         },
  { dir: "sfx",      name: "heartbeat.wav",             fn: makeHeartbeat        },
  { dir: "sfx",      name: "transition-to-campfire.wav",fn: makeTransitionCampfire },
  { dir: "sfx",      name: "transition-to-safe.wav",    fn: makeTransitionSafe   },
  { dir: "sfx",      name: "transition-to-void.wav",    fn: makeTransitionVoid   },
  // Voice grunts
  { dir: "voice",    name: "grunt-simon.wav",  fn: makeGruntSimon  },
  { dir: "voice",    name: "grunt-sam.wav",    fn: makeGruntSam    },
  { dir: "voice",    name: "grunt-brent.wav",  fn: makeGruntBrent  },
  { dir: "voice",    name: "grunt-josh.wav",   fn: makeGruntJosh   },
  { dir: "voice",    name: "grunt-noah.wav",   fn: makeGruntNoah   },
  { dir: "voice",    name: "grunt-lucas.wav",  fn: makeGruntLucas  },
];

// Also write ambients to root audio dir for backwards compat with existing AudioManager
const rootAmbients = [
  { name: "forest-ambient.wav", fn: makeForestAmbient },
  { name: "cliff-wind.wav",     fn: makeCliffWind     },
  { name: "meadow-birds.wav",   fn: makeMeadowBirds   },
  { name: "lake-water.wav",     fn: makeLakeWater     },
  { name: "tinnitus.wav",       fn: makeTinnitus      },
  { name: "heartbeat.wav",      fn: makeHeartbeat     },
];

console.log("\nGenerating SCOUTS audio v2 -- film-quality layered soundscapes\n");
console.log(`  Sample rate: ${SR}Hz  Bit depth: 16-bit PCM mono\n`);

// Ensure subdirs exist
for (const subdir of ["ambience", "sfx", "voice"]) {
  const d = path.join(OUT_DIR, subdir);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

for (const { dir, name, fn } of files) {
  const samples = fn();
  writeWav(path.join(OUT_DIR, dir, name), samples);
}

console.log("\n  Writing root copies (backwards compat)...\n");
for (const { name, fn } of rootAmbients) {
  const samples = fn();
  writeWav(path.join(OUT_DIR, name), samples);
}

console.log("\nDone. All audio written to public/assets/audio/");

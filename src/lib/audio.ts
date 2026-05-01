import * as Tone from "tone";
import type { Triad } from "./triads";

const OPEN_STRING_MIDI: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  1: 64,
  2: 59,
  3: 55,
  4: 50,
  5: 45,
  6: 40,
};

const SAMPLE_BASE =
  "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-nylon/";

const SAMPLES: Record<string, string> = {
  A2: "A2.mp3",
  A3: "A3.mp3",
  A4: "A4.mp3",
  A5: "A5.mp3",
  B2: "B2.mp3",
  B3: "B3.mp3",
  B4: "B4.mp3",
  "C#3": "Cs3.mp3",
  "C#4": "Cs4.mp3",
  D2: "D2.mp3",
  D3: "D3.mp3",
  D5: "D5.mp3",
  "D#4": "Ds4.mp3",
  E2: "E2.mp3",
  E3: "E3.mp3",
  E4: "E4.mp3",
  "F#2": "Fs2.mp3",
  "F#3": "Fs3.mp3",
  "F#4": "Fs4.mp3",
  "F#5": "Fs5.mp3",
  G3: "G3.mp3",
};

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function midiToNote(midi: number): string {
  const note = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

let sampler: Tone.Sampler | null = null;
let initPromise: Promise<Tone.Sampler> | null = null;
let pendingTimeouts: number[] = [];
let sequenceTimer: number | null = null;
let sequenceToken = 0;

const SEQUENCE_CHORD_INTERVAL_MS = 3000;

function ensureSampler(): Promise<Tone.Sampler> {
  if (sampler) return Promise.resolve(sampler);
  if (initPromise) return initPromise;
  initPromise = new Promise((resolve, reject) => {
    const s = new Tone.Sampler({
      urls: SAMPLES,
      baseUrl: SAMPLE_BASE,
      release: 0.3,
      onload: () => {
        sampler = s;
        resolve(s);
      },
      onerror: (err) => reject(err),
    }).toDestination();
  });
  return initPromise;
}

function stopActivePlayback() {
  pendingTimeouts.forEach((id) => clearTimeout(id));
  pendingTimeouts = [];
  if (sampler) sampler.releaseAll();
}

export type SequenceItem = { triad: Triad; startFret?: number };

export function stopSequence(): void {
  sequenceToken++;
  if (sequenceTimer !== null) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
  stopActivePlayback();
}

export async function playSequence(
  items: SequenceItem[],
  onChordStart?: (index: number) => void
): Promise<void> {
  stopSequence();
  if (items.length === 0) return;
  const myToken = ++sequenceToken;

  const playAt = async (i: number) => {
    if (myToken !== sequenceToken) return;
    onChordStart?.(i);
    const item = items[i];
    await playTriad(
      item.triad,
      item.startFret !== undefined ? { startFret: item.startFret } : undefined
    );
    if (myToken !== sequenceToken) return;
    sequenceTimer = window.setTimeout(() => {
      playAt((i + 1) % items.length);
    }, SEQUENCE_CHORD_INTERVAL_MS);
  };

  await playAt(0);
}

export async function playTriad(
  triad: Triad,
  options?: { startFret?: number }
): Promise<void> {
  try {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }
    stopActivePlayback();
    const s = await ensureSampler();
    const startFret = options?.startFret ?? triad.startFret;
    triad.notes.forEach((note, i) => {
      const fret = startFret + note.fretOffset;
      const midi = OPEN_STRING_MIDI[note.string] + fret;
      const noteStr = midiToNote(midi);
      if (i === 0) {
        s.triggerAttackRelease(noteStr, 1);
      } else {
        const id = window.setTimeout(() => {
          s.triggerAttackRelease(noteStr, 1);
        }, i * 1000);
        pendingTimeouts.push(id);
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Audio playback failed:", err);
  }
}

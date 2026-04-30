export type Quality = "major" | "minor" | "diminished";
export type Inversion = "root" | "first" | "second";
export type StringSet = [1, 2, 3] | [2, 3, 4] | [3, 4, 5] | [4, 5, 6];
export type Interval = 1 | 3 | 5;

export type TriadNote = {
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fretOffset: number;
  interval: Interval;
};

export type Triad = {
  id: string;
  quality: Quality;
  stringSet: StringSet;
  inversion: Inversion;
  startFret: number;
  notes: [TriadNote, TriadNote, TriadNote];
};

const MAJOR: Triad[] = [
  {
    id: "major-123-root",
    quality: "major",
    stringSet: [1, 2, 3],
    inversion: "root",
    startFret: 3,
    notes: [
      { string: 3, fretOffset: 2, interval: 1 },
      { string: 2, fretOffset: 2, interval: 3 },
      { string: 1, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "major-123-first",
    quality: "major",
    stringSet: [1, 2, 3],
    inversion: "first",
    startFret: 8,
    notes: [
      { string: 3, fretOffset: 1, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
      { string: 1, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "major-123-second",
    quality: "major",
    stringSet: [1, 2, 3],
    inversion: "second",
    startFret: 12,
    notes: [
      { string: 3, fretOffset: 0, interval: 5 },
      { string: 2, fretOffset: 1, interval: 1 },
      { string: 1, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "major-234-root",
    quality: "major",
    stringSet: [2, 3, 4],
    inversion: "root",
    startFret: 8,
    notes: [
      { string: 4, fretOffset: 2, interval: 1 },
      { string: 3, fretOffset: 1, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "major-234-first",
    quality: "major",
    stringSet: [2, 3, 4],
    inversion: "first",
    startFret: 12,
    notes: [
      { string: 4, fretOffset: 2, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
      { string: 2, fretOffset: 1, interval: 1 },
    ],
  },
  {
    id: "major-234-second",
    quality: "major",
    stringSet: [2, 3, 4],
    inversion: "second",
    startFret: 5,
    notes: [
      { string: 4, fretOffset: 0, interval: 5 },
      { string: 3, fretOffset: 0, interval: 1 },
      { string: 2, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "major-345-root",
    quality: "major",
    stringSet: [3, 4, 5],
    inversion: "root",
    startFret: 12,
    notes: [
      { string: 5, fretOffset: 3, interval: 1 },
      { string: 4, fretOffset: 2, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "major-345-first",
    quality: "major",
    stringSet: [3, 4, 5],
    inversion: "first",
    startFret: 5,
    notes: [
      { string: 5, fretOffset: 2, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
      { string: 3, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "major-345-second",
    quality: "major",
    stringSet: [3, 4, 5],
    inversion: "second",
    startFret: 9,
    notes: [
      { string: 5, fretOffset: 1, interval: 5 },
      { string: 4, fretOffset: 1, interval: 1 },
      { string: 3, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "major-456-root",
    quality: "major",
    stringSet: [4, 5, 6],
    inversion: "root",
    startFret: 5,
    notes: [
      { string: 6, fretOffset: 3, interval: 1 },
      { string: 5, fretOffset: 2, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "major-456-first",
    quality: "major",
    stringSet: [4, 5, 6],
    inversion: "first",
    startFret: 10,
    notes: [
      { string: 6, fretOffset: 2, interval: 3 },
      { string: 5, fretOffset: 0, interval: 5 },
      { string: 4, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "major-456-second",
    quality: "major",
    stringSet: [4, 5, 6],
    inversion: "second",
    startFret: 2,
    notes: [
      { string: 6, fretOffset: 1, interval: 5 },
      { string: 5, fretOffset: 1, interval: 1 },
      { string: 4, fretOffset: 0, interval: 3 },
    ],
  },
];

const MINOR: Triad[] = [
  {
    id: "minor-123-root",
    quality: "minor",
    stringSet: [1, 2, 3],
    inversion: "root",
    startFret: 3,
    notes: [
      { string: 3, fretOffset: 2, interval: 1 },
      { string: 2, fretOffset: 1, interval: 3 },
      { string: 1, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "minor-123-first",
    quality: "minor",
    stringSet: [1, 2, 3],
    inversion: "first",
    startFret: 8,
    notes: [
      { string: 3, fretOffset: 0, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
      { string: 1, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "minor-123-second",
    quality: "minor",
    stringSet: [1, 2, 3],
    inversion: "second",
    startFret: 11,
    notes: [
      { string: 3, fretOffset: 1, interval: 5 },
      { string: 2, fretOffset: 2, interval: 1 },
      { string: 1, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "minor-234-root",
    quality: "minor",
    stringSet: [2, 3, 4],
    inversion: "root",
    startFret: 8,
    notes: [
      { string: 4, fretOffset: 2, interval: 1 },
      { string: 3, fretOffset: 0, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "minor-234-first",
    quality: "minor",
    stringSet: [2, 3, 4],
    inversion: "first",
    startFret: 12,
    notes: [
      { string: 4, fretOffset: 1, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
      { string: 2, fretOffset: 1, interval: 1 },
    ],
  },
  {
    id: "minor-234-second",
    quality: "minor",
    stringSet: [2, 3, 4],
    inversion: "second",
    startFret: 4,
    notes: [
      { string: 4, fretOffset: 1, interval: 5 },
      { string: 3, fretOffset: 1, interval: 1 },
      { string: 2, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "minor-345-root",
    quality: "minor",
    stringSet: [3, 4, 5],
    inversion: "root",
    startFret: 12,
    notes: [
      { string: 5, fretOffset: 3, interval: 1 },
      { string: 4, fretOffset: 1, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "minor-345-first",
    quality: "minor",
    stringSet: [3, 4, 5],
    inversion: "first",
    startFret: 5,
    notes: [
      { string: 5, fretOffset: 1, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
      { string: 3, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "minor-345-second",
    quality: "minor",
    stringSet: [3, 4, 5],
    inversion: "second",
    startFret: 8,
    notes: [
      { string: 5, fretOffset: 2, interval: 5 },
      { string: 4, fretOffset: 2, interval: 1 },
      { string: 3, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "minor-456-root",
    quality: "minor",
    stringSet: [4, 5, 6],
    inversion: "root",
    startFret: 5,
    notes: [
      { string: 6, fretOffset: 3, interval: 1 },
      { string: 5, fretOffset: 1, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "minor-456-first",
    quality: "minor",
    stringSet: [4, 5, 6],
    inversion: "first",
    startFret: 10,
    notes: [
      { string: 6, fretOffset: 1, interval: 3 },
      { string: 5, fretOffset: 0, interval: 5 },
      { string: 4, fretOffset: 0, interval: 1 },
    ],
  },
  {
    id: "minor-456-second",
    quality: "minor",
    stringSet: [4, 5, 6],
    inversion: "second",
    startFret: 1,
    notes: [
      { string: 6, fretOffset: 2, interval: 5 },
      { string: 5, fretOffset: 2, interval: 1 },
      { string: 4, fretOffset: 0, interval: 3 },
    ],
  },
];

const DIMINISHED: Triad[] = [
  {
    id: "dim-123-root",
    quality: "diminished",
    stringSet: [1, 2, 3],
    inversion: "root",
    startFret: 2,
    notes: [
      { string: 3, fretOffset: 3, interval: 1 },
      { string: 2, fretOffset: 2, interval: 3 },
      { string: 1, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "dim-123-first",
    quality: "diminished",
    stringSet: [1, 2, 3],
    inversion: "first",
    startFret: 7,
    notes: [
      { string: 3, fretOffset: 1, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
      { string: 1, fretOffset: 1, interval: 1 },
    ],
  },
  {
    id: "dim-123-second",
    quality: "diminished",
    stringSet: [1, 2, 3],
    inversion: "second",
    startFret: 11,
    notes: [
      { string: 3, fretOffset: 0, interval: 5 },
      { string: 2, fretOffset: 2, interval: 1 },
      { string: 1, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "dim-234-root",
    quality: "diminished",
    stringSet: [2, 3, 4],
    inversion: "root",
    startFret: 7,
    notes: [
      { string: 4, fretOffset: 3, interval: 1 },
      { string: 3, fretOffset: 1, interval: 3 },
      { string: 2, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "dim-234-first",
    quality: "diminished",
    stringSet: [2, 3, 4],
    inversion: "first",
    startFret: 11,
    notes: [
      { string: 4, fretOffset: 2, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
      { string: 2, fretOffset: 2, interval: 1 },
    ],
  },
  {
    id: "dim-234-second",
    quality: "diminished",
    stringSet: [2, 3, 4],
    inversion: "second",
    startFret: 4,
    notes: [
      { string: 4, fretOffset: 0, interval: 5 },
      { string: 3, fretOffset: 1, interval: 1 },
      { string: 2, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "dim-345-root",
    quality: "diminished",
    stringSet: [3, 4, 5],
    inversion: "root",
    startFret: 11,
    notes: [
      { string: 5, fretOffset: 4, interval: 1 },
      { string: 4, fretOffset: 2, interval: 3 },
      { string: 3, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "dim-345-first",
    quality: "diminished",
    stringSet: [3, 4, 5],
    inversion: "first",
    startFret: 4,
    notes: [
      { string: 5, fretOffset: 2, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
      { string: 3, fretOffset: 1, interval: 1 },
    ],
  },
  {
    id: "dim-345-second",
    quality: "diminished",
    stringSet: [3, 4, 5],
    inversion: "second",
    startFret: 8,
    notes: [
      { string: 5, fretOffset: 1, interval: 5 },
      { string: 4, fretOffset: 2, interval: 1 },
      { string: 3, fretOffset: 0, interval: 3 },
    ],
  },
  {
    id: "dim-456-root",
    quality: "diminished",
    stringSet: [4, 5, 6],
    inversion: "root",
    startFret: 4,
    notes: [
      { string: 6, fretOffset: 4, interval: 1 },
      { string: 5, fretOffset: 2, interval: 3 },
      { string: 4, fretOffset: 0, interval: 5 },
    ],
  },
  {
    id: "dim-456-first",
    quality: "diminished",
    stringSet: [4, 5, 6],
    inversion: "first",
    startFret: 9,
    notes: [
      { string: 6, fretOffset: 2, interval: 3 },
      { string: 5, fretOffset: 0, interval: 5 },
      { string: 4, fretOffset: 1, interval: 1 },
    ],
  },
  {
    id: "dim-456-second",
    quality: "diminished",
    stringSet: [4, 5, 6],
    inversion: "second",
    startFret: 1,
    notes: [
      { string: 6, fretOffset: 1, interval: 5 },
      { string: 5, fretOffset: 2, interval: 1 },
      { string: 4, fretOffset: 0, interval: 3 },
    ],
  },
];

export const TRIADS: Triad[] = [...MAJOR, ...MINOR, ...DIMINISHED];

export const QUALITY_LABEL: Record<Quality, string> = {
  major: "Major",
  minor: "minor",
  diminished: "deminished",
};

export const QUALITY_COLOR: Record<Quality, string> = {
  major: "#ff2a92",
  minor: "#00f0ff",
  diminished: "#b066ff",
};

export const QUALITY_COLOR_SOFT: Record<Quality, string> = {
  major: "#1a0a18",
  minor: "#0a1a1c",
  diminished: "#150a1f",
};

export const INVERSION_LABEL: Record<Inversion, string> = {
  root: "Root",
  first: "1st Inv.",
  second: "2nd Inv.",
};

export const STRING_NAMES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "e",
  2: "B",
  3: "G",
  4: "D",
  5: "A",
  6: "E",
};

export type ChordLabel = { roman: string; chord: string; notes: string };

export const KEY_PROGRESSIONS: Record<string, Record<number, ChordLabel>> = {
  D: {
    1: { roman: "I", chord: "D Major", notes: "D, F#, A" },
    2: { roman: "ii", chord: "E minor", notes: "E, G, B" },
    3: { roman: "iii", chord: "F# minor", notes: "F#, A, C#" },
    4: { roman: "IV", chord: "G Major", notes: "G, B, D" },
    5: { roman: "V", chord: "A Major", notes: "A, C#, E" },
    6: { roman: "vi", chord: "B minor", notes: "B, D, F#" },
    7: { roman: "vii°", chord: "C# diminished", notes: "C#, E, G" },
    8: { roman: "I", chord: "D Major", notes: "D, F#, A" },
  },
  A: {
    1: { roman: "I", chord: "A Major", notes: "A, C#, E" },
    2: { roman: "ii", chord: "B minor", notes: "B, D, F#" },
    3: { roman: "iii", chord: "C# minor", notes: "C#, E, G#" },
    4: { roman: "IV", chord: "D Major", notes: "D, F#, A" },
    5: { roman: "V", chord: "E Major", notes: "E, G#, B" },
    6: { roman: "vi", chord: "F# minor", notes: "F#, A, C#" },
    7: { roman: "vii°", chord: "G# diminished", notes: "G#, B, D" },
    8: { roman: "I", chord: "A Major", notes: "A, C#, E" },
  },
};

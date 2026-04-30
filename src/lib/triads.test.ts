import { describe, it, expect } from "vitest";
import {
  TRIADS,
  QUALITY_LABEL,
  QUALITY_COLOR,
  QUALITY_COLOR_SOFT,
  INVERSION_LABEL,
  STRING_NAMES,
  KEY_PROGRESSIONS,
  type Quality,
  type Inversion,
} from "./triads";

describe("TRIADS data", () => {
  it("has exactly 36 triads", () => {
    expect(TRIADS).toHaveLength(36);
  });

  it("has 12 of each quality", () => {
    const counts = TRIADS.reduce<Record<Quality, number>>(
      (acc, t) => {
        acc[t.quality] = (acc[t.quality] ?? 0) + 1;
        return acc;
      },
      { major: 0, minor: 0, diminished: 0 }
    );
    expect(counts).toEqual({ major: 12, minor: 12, diminished: 12 });
  });

  it("has 4 string sets per quality, each with 3 inversions", () => {
    const stringSetCounts: Record<string, number> = {};
    for (const t of TRIADS) {
      const key = `${t.quality}-${t.stringSet.join(",")}`;
      stringSetCounts[key] = (stringSetCounts[key] ?? 0) + 1;
    }
    for (const v of Object.values(stringSetCounts)) {
      expect(v).toBe(3);
    }
    expect(Object.keys(stringSetCounts)).toHaveLength(12);
  });

  it("has unique IDs", () => {
    const ids = TRIADS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each triad has exactly 3 notes (1, 3, 5 intervals)", () => {
    for (const t of TRIADS) {
      expect(t.notes).toHaveLength(3);
      const intervals = t.notes.map((n) => n.interval).sort();
      expect(intervals).toEqual([1, 3, 5]);
    }
  });

  it("each triad's notes are on the strings in its stringSet", () => {
    for (const t of TRIADS) {
      const strings = new Set(t.notes.map((n) => n.string));
      const set = new Set(t.stringSet as readonly number[]);
      expect(strings).toEqual(set);
    }
  });

  it("each triad has a positive startFret and non-negative offsets", () => {
    for (const t of TRIADS) {
      expect(t.startFret).toBeGreaterThan(0);
      for (const n of t.notes) {
        expect(n.fretOffset).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("constants", () => {
  it("QUALITY_LABEL maps every quality", () => {
    expect(QUALITY_LABEL.major).toBeDefined();
    expect(QUALITY_LABEL.minor).toBeDefined();
    expect(QUALITY_LABEL.diminished).toBeDefined();
  });

  it("QUALITY_COLOR maps every quality with hex strings", () => {
    for (const q of ["major", "minor", "diminished"] as Quality[]) {
      expect(QUALITY_COLOR[q]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(QUALITY_COLOR_SOFT[q]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("INVERSION_LABEL maps every inversion", () => {
    for (const i of ["root", "first", "second"] as Inversion[]) {
      expect(INVERSION_LABEL[i]).toBeTruthy();
    }
  });

  it("STRING_NAMES maps strings 1-6", () => {
    expect(STRING_NAMES[1]).toBe("e");
    expect(STRING_NAMES[2]).toBe("B");
    expect(STRING_NAMES[3]).toBe("G");
    expect(STRING_NAMES[4]).toBe("D");
    expect(STRING_NAMES[5]).toBe("A");
    expect(STRING_NAMES[6]).toBe("E");
  });
});

describe("KEY_PROGRESSIONS", () => {
  it("has D and A keys", () => {
    expect(KEY_PROGRESSIONS.D).toBeDefined();
    expect(KEY_PROGRESSIONS.A).toBeDefined();
  });

  it("each key has 8 positions (1..8)", () => {
    for (const key of ["D", "A"]) {
      const prog = KEY_PROGRESSIONS[key];
      for (let i = 1; i <= 8; i++) {
        expect(prog[i]).toBeDefined();
        expect(prog[i].roman).toBeTruthy();
        expect(prog[i].chord).toBeTruthy();
        expect(prog[i].notes).toBeTruthy();
      }
    }
  });

  it("position 1 and 8 are the same chord (cadence back to I)", () => {
    expect(KEY_PROGRESSIONS.D[1]).toEqual(KEY_PROGRESSIONS.D[8]);
    expect(KEY_PROGRESSIONS.A[1]).toEqual(KEY_PROGRESSIONS.A[8]);
  });

  it("D key has the expected I-vii° progression", () => {
    expect(KEY_PROGRESSIONS.D[1].chord).toBe("D Major");
    expect(KEY_PROGRESSIONS.D[2].chord).toBe("E minor");
    expect(KEY_PROGRESSIONS.D[3].chord).toBe("F# minor");
    expect(KEY_PROGRESSIONS.D[4].chord).toBe("G Major");
    expect(KEY_PROGRESSIONS.D[5].chord).toBe("A Major");
    expect(KEY_PROGRESSIONS.D[6].chord).toBe("B minor");
    expect(KEY_PROGRESSIONS.D[7].chord).toBe("C# diminished");
  });

  it("A key has the expected I-vii° progression", () => {
    expect(KEY_PROGRESSIONS.A[1].chord).toBe("A Major");
    expect(KEY_PROGRESSIONS.A[2].chord).toBe("B minor");
    expect(KEY_PROGRESSIONS.A[3].chord).toBe("C# minor");
    expect(KEY_PROGRESSIONS.A[4].chord).toBe("D Major");
    expect(KEY_PROGRESSIONS.A[5].chord).toBe("E Major");
    expect(KEY_PROGRESSIONS.A[6].chord).toBe("F# minor");
    expect(KEY_PROGRESSIONS.A[7].chord).toBe("G# diminished");
  });
});

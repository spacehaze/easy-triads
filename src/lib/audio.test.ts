import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Triad } from "./triads";

// Mock Tone.js — none of its real APIs touch a browser audio context.
const triggerAttackRelease = vi.fn();
const releaseAll = vi.fn();
const start = vi.fn().mockResolvedValue(undefined);
const now = vi.fn(() => 0);
const getContext = vi.fn(() => ({ state: "running" }));

class FakeSampler {
  triggerAttackRelease = triggerAttackRelease;
  releaseAll = releaseAll;
  toDestination() {
    return this;
  }
  constructor(opts: { onload?: () => void }) {
    // Simulate samples loading immediately.
    if (opts.onload) queueMicrotask(opts.onload);
  }
}

vi.mock("tone", () => ({
  Sampler: FakeSampler,
  start,
  now,
  getContext,
}));

beforeEach(() => {
  triggerAttackRelease.mockClear();
  releaseAll.mockClear();
  start.mockClear();
});

const triad: Triad = {
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
};

describe("playTriad", () => {
  it("starts the audio context if not running and triggers each note", async () => {
    getContext.mockReturnValueOnce({ state: "suspended" });

    // Import inside the test so mocks are wired up first.
    const { playTriad } = await import("./audio");

    await playTriad(triad);
    // Wait for queued setTimeouts (1s and 2s — fake timers would be cleaner).
    await new Promise((r) => setTimeout(r, 0));

    expect(start).toHaveBeenCalledTimes(1);
    // First note plays immediately on triggerAttackRelease.
    expect(triggerAttackRelease).toHaveBeenCalled();
    const firstCall = triggerAttackRelease.mock.calls[0];
    expect(firstCall[0]).toMatch(/^[A-G]#?\d$/);
    expect(firstCall[1]).toBe(1);
  });

  it("calls releaseAll on a second invocation to cut prior playback", async () => {
    const { playTriad } = await import("./audio");
    await playTriad(triad);
    await playTriad(triad);
    expect(releaseAll).toHaveBeenCalled();
  });

  it("converts (string,fret) to the correct MIDI note name", async () => {
    triggerAttackRelease.mockClear();
    const { playTriad } = await import("./audio");
    await playTriad(triad);
    // string 4 (D3, MIDI 50) at fret 8+2=10 → MIDI 60 → C4
    const called = triggerAttackRelease.mock.calls.map((c) => c[0]);
    expect(called[0]).toBe("C4");
  });
});

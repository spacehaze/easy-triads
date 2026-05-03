import { describe, it, expect } from "vitest";
import {
  addSequence,
  addTheory,
  setKey,
  removeCard,
  moveCard,
  type PlacedCard,
} from "./board-state";

describe("addSequence", () => {
  it("appends N cards numbered 1..N", () => {
    const result = addSequence([], ["a", "b", "c"], 1000);
    expect(result).toHaveLength(3);
    expect(result.map((c) => c.sequenceNumber)).toEqual([1, 2, 3]);
  });

  it("gives all cards in a single call the same sequenceInstanceId", () => {
    const result = addSequence([], ["a", "b", "c"], 1000);
    const ids = new Set(result.map((c) => c.sequenceInstanceId));
    expect(ids.size).toBe(1);
  });

  it("3-card preset uses 3 columns × 1 row", () => {
    const result = addSequence([], ["a", "b", "c"], 1000);
    const ys = new Set(result.map((c) => c.y));
    expect(ys.size).toBe(1);
    const xs = result.map((c) => c.x).sort((a, b) => a - b);
    expect(xs).toEqual([20, 260, 500]);
  });

  it("8-card preset uses 4 columns × 2 rows", () => {
    const result = addSequence(
      [],
      ["a", "b", "c", "d", "e", "f", "g", "h"],
      1000
    );
    const ys = new Set(result.map((c) => c.y));
    expect(ys.size).toBe(2);
    expect(result[0].x).toBe(20);
    expect(result[3].x).toBe(20 + 3 * 240);
    expect(result[4].y).toBe(result[0].y + 300);
  });

  it("preserves existing cards", () => {
    const existing: PlacedCard = {
      instanceId: "x",
      x: 0,
      y: 0,
      triadId: "z",
    };
    const result = addSequence([existing], ["a"], 1000);
    expect(result[0]).toBe(existing);
  });
});

describe("addTheory", () => {
  it("appends a text card with no triadId", () => {
    const result = addTheory([], "hello", 1000);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("hello");
    expect(result[0].triadId).toBeUndefined();
  });

  it("does not assign a sequenceNumber", () => {
    const result = addTheory([], "hello", 1000);
    expect(result[0].sequenceNumber).toBeUndefined();
  });
});

describe("setKey", () => {
  const cards: PlacedCard[] = [
    {
      instanceId: "1",
      x: 0,
      y: 0,
      triadId: "a",
      sequenceNumber: 1,
      sequenceInstanceId: "seq-1",
    },
    {
      instanceId: "2",
      x: 0,
      y: 0,
      triadId: "b",
      sequenceNumber: 2,
      sequenceInstanceId: "seq-1",
    },
    {
      instanceId: "3",
      x: 0,
      y: 0,
      triadId: "c",
      sequenceNumber: 1,
      sequenceInstanceId: "seq-2",
    },
    { instanceId: "4", x: 0, y: 0, triadId: "d" }, // standalone, no sequence
  ];

  it("propagates key to all cards in the same sequence", () => {
    const result = setKey(cards, "1", "D");
    expect(result[0].selectedKey).toBe("D");
    expect(result[1].selectedKey).toBe("D");
    expect(result[2].selectedKey).toBeUndefined();
    expect(result[3].selectedKey).toBeUndefined();
  });

  it("sets key on standalone card (no sequence) without affecting others", () => {
    const result = setKey(cards, "4", "A");
    expect(result[3].selectedKey).toBe("A");
    expect(result[0].selectedKey).toBeUndefined();
  });

  it("returns unchanged array when instanceId not found", () => {
    const result = setKey(cards, "missing", "D");
    expect(result).toBe(cards);
  });
});

describe("removeCard", () => {
  it("filters out the card with matching instanceId", () => {
    const cards: PlacedCard[] = [
      { instanceId: "1", x: 0, y: 0, triadId: "a" },
      { instanceId: "2", x: 0, y: 0, triadId: "b" },
    ];
    expect(removeCard(cards, "1")).toEqual([cards[1]]);
  });

  it("returns the same array contents if no match", () => {
    const cards: PlacedCard[] = [{ instanceId: "1", x: 0, y: 0, triadId: "a" }];
    expect(removeCard(cards, "missing")).toEqual(cards);
  });
});

describe("moveCard", () => {
  const cards: PlacedCard[] = [{ instanceId: "1", x: 100, y: 200, triadId: "a" }];

  it("applies the delta", () => {
    const result = moveCard(cards, "1", 50, -30);
    expect(result[0]).toMatchObject({ x: 150, y: 170 });
  });

  it("clamps within bounds", () => {
    const result = moveCard(cards, "1", -1000, -1000, {
      width: 500,
      height: 500,
    });
    expect(result[0].x).toBe(0);
    expect(result[0].y).toBe(0);
  });

  it("clamps to the right/bottom bounds", () => {
    const result = moveCard(cards, "1", 1000, 1000, {
      width: 500,
      height: 500,
    });
    expect(result[0].x).toBe(500 - 220);
    expect(result[0].y).toBe(500 - 280);
  });

  it("leaves other cards untouched", () => {
    const multi: PlacedCard[] = [
      ...cards,
      { instanceId: "2", x: 50, y: 50, triadId: "b" },
    ];
    const result = moveCard(multi, "1", 10, 10);
    expect(result[1]).toBe(multi[1]);
  });
});

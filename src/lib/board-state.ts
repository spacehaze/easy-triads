export type PlacedCard = {
  instanceId: string;
  x: number;
  y: number;
  triadId?: string;
  text?: string;
  sequenceNumber?: number;
  selectedKey?: string;
  sequenceInstanceId?: string;
  sequenceVariant?: "second-inv" | "root";
};

export const CARD_WIDTH = 220;
export const CARD_HEIGHT = 280;

const CARD_GAP = 20;
const COL_PITCH = CARD_WIDTH + CARD_GAP; // 240
const ROW_PITCH = CARD_HEIGHT + CARD_GAP; // 300

/**
 * Add a sequence (preset) of triad cards. Cards in the same sequence share a
 * sequenceInstanceId so a key change on card 1 can propagate to its siblings.
 * Layout: 1 row if N <= 3, else ceil(N/2) cols × 2 rows.
 */
export function addSequence(
  prev: PlacedCard[],
  ids: string[],
  ts: number = Date.now(),
  variant: "second-inv" | "root" = "second-inv"
): PlacedCard[] {
  const sequenceInstanceId = `seq-${ts}`;
  const cols = ids.length <= 3 ? ids.length : Math.ceil(ids.length / 2);
  const startRow = Math.floor(prev.length / 3);
  return [
    ...prev,
    ...ids.map((triadId, i) => ({
      instanceId: `${triadId}-${ts}-${i}`,
      triadId,
      x: 20 + (i % cols) * COL_PITCH,
      y: 20 + (startRow + Math.floor(i / cols)) * ROW_PITCH,
      sequenceNumber: i + 1,
      sequenceInstanceId,
      sequenceVariant: variant,
    })),
  ];
}

/**
 * Append a theory (text) card to the board.
 */
export function addTheory(
  prev: PlacedCard[],
  text: string,
  ts: number = Date.now()
): PlacedCard[] {
  return [
    ...prev,
    {
      instanceId: `theory-${ts}`,
      text,
      x: 20,
      y: 20 + Math.floor(prev.length / 3) * ROW_PITCH,
    },
  ];
}

/**
 * Set the selected key on a placed card. If the card is part of a sequence
 * (has sequenceInstanceId), propagate the key to all siblings.
 */
export function setKey(
  prev: PlacedCard[],
  instanceId: string,
  key: string
): PlacedCard[] {
  const card = prev.find((p) => p.instanceId === instanceId);
  if (!card) return prev;
  const seqId = card.sequenceInstanceId;
  return prev.map((p) => {
    if (seqId && p.sequenceInstanceId === seqId) {
      return { ...p, selectedKey: key };
    }
    if (p.instanceId === instanceId) {
      return { ...p, selectedKey: key };
    }
    return p;
  });
}

export function removeCard(
  prev: PlacedCard[],
  instanceId: string
): PlacedCard[] {
  return prev.filter((p) => p.instanceId !== instanceId);
}

/**
 * Move a placed card by a delta, optionally clamped to a board rect.
 */
export function moveCard(
  prev: PlacedCard[],
  instanceId: string,
  dx: number,
  dy: number,
  bounds?: { width: number; height: number }
): PlacedCard[] {
  return prev.map((p) => {
    if (p.instanceId !== instanceId) return p;
    let nx = p.x + dx;
    let ny = p.y + dy;
    if (bounds) {
      nx = Math.max(0, Math.min(bounds.width - CARD_WIDTH, nx));
      ny = Math.max(0, Math.min(bounds.height - CARD_HEIGHT, ny));
    }
    return { ...p, x: nx, y: ny };
  });
}

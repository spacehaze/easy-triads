"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import {
  TRIADS,
  type Triad,
  type Quality,
  QUALITY_LABEL,
  QUALITY_COLOR,
  QUALITY_COLOR_SOFT,
  KEY_FRETS_BY_VARIANT,
  type SequenceVariant,
} from "@/lib/triads";
import { playSequence, stopSequence } from "@/lib/audio";
import {
  addSequence,
  addTheory,
  setKey,
  removeCard,
  moveCard,
  CARD_WIDTH,
  CARD_HEIGHT,
  type PlacedCard,
} from "@/lib/board-state";
import { TriadCard } from "./triad-card";

const STORAGE_KEY = "easy-triads.board.v1";
const SIDEBAR_WIDTH_KEY = "easy-triads.sidebar-width.v1";
const SIDEBAR_DEFAULT_WIDTH = 220;
const SIDEBAR_MIN_WIDTH = 180;
const SIDEBAR_MAX_WIDTH = 600;
const LIB_CARD_WIDTH = 180;

function SidebarResizer({
  onResizeDelta,
}: {
  onResizeDelta: (dx: number) => void;
}) {
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    if (e.movementX !== 0) onResizeDelta(e.movementX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="hidden md:block w-1.5 shrink-0 cursor-col-resize hover:bg-[#c98152] active:bg-[#c98152] transition-colors"
      style={{ background: "rgba(201,129,82,0.18)", touchAction: "none" }}
    />
  );
}

const TRIAD_BY_ID = new Map(TRIADS.map((t) => [t.id, t]));

type Sequence = {
  label: string;
  ids: string[];
  quality: Quality;
  variant: SequenceVariant;
  color?: string;
  colorSoft?: string;
};

const SEQUENCES: Sequence[] = [
  {
    label: "D chords",
    quality: "major",
    variant: "second-inv",
    color: "#c98152",
    colorSoft: "#2a1a0d",
    ids: [
      "major-234-second",
      "minor-234-first",
      "minor-234-first",
      "major-234-root",
      "major-234-root",
      "minor-234-second",
      "dim-234-root",
      "major-234-second",
    ],
  },
  {
    label: "A chords",
    quality: "major",
    variant: "root",
    color: "#d9c4a0",
    colorSoft: "#2e1d0a",
    ids: [
      "major-234-root",
      "minor-234-second",
      "minor-234-second",
      "major-234-second",
      "major-234-second",
      "minor-234-second",
      "dim-234-second",
      "major-234-root",
    ],
  },
];

function getTriad(id: string): Triad | undefined {
  return TRIAD_BY_ID.get(id);
}

function DraggableLibraryCard({ triad }: { triad: Triad }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib:${triad.id}`,
    data: { source: "library", triadId: triad.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing touch-none"
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      <TriadCard triad={triad} compact />
    </div>
  );
}

function TheoryCard({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl border-2 select-none flex items-center justify-center text-center"
      style={{
        width: 220,
        minHeight: 200,
        background: "#1f1107",
        borderColor: "#ecd29a",
        padding: 20,
        boxShadow:
          "0 0 16px rgba(236,210,154,0.5), 0 0 32px rgba(236,210,154,0.25), inset 0 0 24px rgba(236,210,154,0.06)",
      }}
    >
      <div
        className="font-display text-lg leading-snug uppercase tracking-wider"
        style={{
          color: "#ecd29a",
          textShadow: "0 0 8px rgba(236,210,154,0.7)",
        }}
      >
        “{text}”
      </div>
    </div>
  );
}

function DraggablePlacedCard({
  placed,
  onRemove,
  onSetKey,
  onPlaySequence,
  isSequencePlaying,
  isPlayingNow,
}: {
  placed: PlacedCard;
  onRemove: (id: string) => void;
  onSetKey: (instanceId: string, key: string) => void;
  onPlaySequence?: () => void;
  isSequencePlaying?: boolean;
  isPlayingNow?: boolean;
}) {
  const triad = placed.triadId ? getTriad(placed.triadId) : undefined;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed:${placed.instanceId}`,
      data: { source: "placed", instanceId: placed.instanceId },
    });

  if (!triad && !placed.text) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    left: placed.x,
    top: placed.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group touch-none">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(placed.instanceId);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c98152]"
        style={{ boxShadow: "0 0 8px rgba(201,129,82,0.7)" }}
        aria-label="Remove card"
      >
        ×
      </button>
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        {triad ? (
          <TriadCard
            triad={triad}
            sequenceNumber={placed.sequenceNumber}
            selectedKey={placed.selectedKey}
            sequenceVariant={placed.sequenceVariant}
            onKeyChange={(key) => onSetKey(placed.instanceId, key)}
            onPlaySequence={onPlaySequence}
            isSequencePlaying={isSequencePlaying}
            isPlayingNow={isPlayingNow}
          />
        ) : (
          <TheoryCard text={placed.text!} />
        )}
      </div>
    </div>
  );
}

function BoardDropZone({
  placed,
  onRemove,
  onSetKey,
  onTogglePlaySequence,
  playingSequenceId,
  playingIndex,
  boardRef,
}: {
  placed: PlacedCard[];
  onRemove: (id: string) => void;
  onSetKey: (instanceId: string, key: string) => void;
  onTogglePlaySequence: (sequenceInstanceId: string) => void;
  playingSequenceId: string | null;
  playingIndex: number | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "board" });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        boardRef.current = node;
      }}
      className={`relative flex-1 min-h-[600px] rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
        isOver ? "border-[#d9c4a0] bg-[#d9c4a0]/5" : "border-[#4a2e1a]"
      }`}
      style={{ background: "rgba(31, 17, 7, 0.4)" }}
    >
      {placed.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm pointer-events-none font-display tracking-wider uppercase"
          style={{ color: "#a8936d", textShadow: "0 0 8px #a8936d66" }}
        >
          {"// Drag cards from the library to build your study board"}
        </div>
      )}
      {placed.map((p) => {
        const isFirstInSeq =
          p.sequenceNumber === 1 && p.sequenceInstanceId !== undefined;
        const isThisSequencePlaying =
          p.sequenceInstanceId !== undefined &&
          playingSequenceId === p.sequenceInstanceId;
        const isPlayingNow =
          isThisSequencePlaying &&
          playingIndex !== null &&
          p.sequenceNumber !== undefined &&
          playingIndex === p.sequenceNumber - 1;
        return (
          <DraggablePlacedCard
            key={p.instanceId}
            placed={p}
            onRemove={onRemove}
            onSetKey={onSetKey}
            onPlaySequence={
              isFirstInSeq && p.sequenceInstanceId
                ? () => onTogglePlaySequence(p.sequenceInstanceId!)
                : undefined
            }
            isSequencePlaying={isFirstInSeq && isThisSequencePlaying}
            isPlayingNow={isPlayingNow}
          />
        );
      })}
    </div>
  );
}

const STRING_SET_LABELS: { label: string; key: string }[] = [
  { label: "1-2-3", key: "1,2,3" },
  { label: "2-3-4", key: "2,3,4" },
  { label: "3-4-5", key: "3,4,5" },
  { label: "4-5-6", key: "4,5,6" },
];

function Library({
  open,
  onClose,
  width,
}: {
  open: boolean;
  onClose: () => void;
  width: number;
}) {
  const [activeQuality, setActiveQuality] = useState<Quality>("major");
  const [openSet, setOpenSet] = useState<string | null>(null);
  const accent = QUALITY_COLOR[activeQuality];
  const accentSoft = QUALITY_COLOR_SOFT[activeQuality];

  const toggleSet = (key: string) => {
    setOpenSet((prev) => (prev === key ? null : key));
  };

  const triadsForQuality = TRIADS.filter((t) => t.quality === activeQuality);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close library"
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/40 z-40 cursor-default"
        />
      )}
      <aside
        className={`w-[260px] md:w-[var(--sidebar-w)] shrink-0 overflow-y-auto fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 md:z-auto border-r-2 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(31, 17, 7, 0.92)",
          borderColor: "#4a2e1a",
          ["--sidebar-w" as string]: `${width}px`,
        }}
      >
        <div
          className="p-4 border-b-2 sticky top-0 z-10"
          style={{
            background: "rgba(31, 17, 7, 0.95)",
            borderColor: "#4a2e1a",
          }}
        >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="font-display text-base uppercase tracking-widest"
              style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a088" }}
            >
              Card Library
            </h2>
            <p
              className="text-[10px] mt-0.5 mb-3 font-display tracking-wider"
              style={{ color: "#a8936d" }}
            >
              {"// drag onto the board"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="md:hidden -mt-1 -mr-1 w-7 h-7 rounded-md text-[#a8936d] hover:bg-[#a8936d]/20 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="flex gap-1">
          {(["major", "minor", "diminished"] as const).map((q) => {
            const active = activeQuality === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => setActiveQuality(q)}
                className="flex-1 text-[11px] font-bold uppercase tracking-wider py-1.5 rounded transition-colors"
                style={
                  active
                    ? { background: QUALITY_COLOR[q], color: "#ffffff" }
                    : { color: QUALITY_COLOR[q], background: QUALITY_COLOR_SOFT[q] }
                }
              >
                {q === "diminished" ? "Dim" : QUALITY_LABEL[q]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-3 space-y-2">
        {STRING_SET_LABELS.map((ss) => {
          const triads = triadsForQuality.filter(
            (t) => t.stringSet.join(",") === ss.key
          );
          const isOpen = openSet === ss.key;
          return (
            <section key={ss.key}>
              <button
                type="button"
                onClick={() => toggleSet(ss.key)}
                className="w-full text-left text-[11px] font-display uppercase tracking-widest px-2 py-1.5 rounded flex items-center justify-between cursor-pointer transition border"
                style={{
                  color: accent,
                  background: "rgba(31, 17, 7, 0.5)",
                  borderColor: `${accent}55`,
                  textShadow: `0 0 6px ${accent}66`,
                }}
                aria-expanded={isOpen}
              >
                <span>Strings {ss.label}</span>
                <span
                  className="inline-block transition-transform"
                  style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                  ›
                </span>
              </button>
              {isOpen && (
                <div className="flex flex-col gap-2 items-center mt-2 mb-2">
                  {triads.map((triad) => (
                    <DraggableLibraryCard key={triad.id} triad={triad} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
      </aside>
    </>
  );
}

function SequencesList({
  open,
  onClose,
  onAdd,
  width,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (ids: string[], variant: SequenceVariant) => void;
  width: number;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sequences"
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/40 z-40 cursor-default"
        />
      )}
      <aside
        className={`w-[260px] md:w-[var(--sidebar-w)] shrink-0 overflow-y-auto fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 md:z-auto border-r-2 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(31, 17, 7, 0.92)",
          borderColor: "#4a2e1a",
          ["--sidebar-w" as string]: `${width}px`,
        }}
      >
        <div
          className="p-4 border-b-2 sticky top-0 z-10"
          style={{
            background: "rgba(31, 17, 7, 0.95)",
            borderColor: "#4a2e1a",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="font-display text-base uppercase tracking-widest"
                style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a088" }}
              >
                Sequences
              </h2>
              <p
                className="text-[10px] mt-0.5 font-display tracking-wider"
                style={{ color: "#a8936d" }}
              >
                {"// click to add to board"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="md:hidden -mt-1 -mr-1 w-7 h-7 rounded-md text-[#a8936d] hover:bg-[#a8936d]/20 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {SEQUENCES.map((seq) => {
            const c = seq.color ?? QUALITY_COLOR[seq.quality];
            const cs = seq.colorSoft ?? QUALITY_COLOR_SOFT[seq.quality];
            const firstTriad = TRIAD_BY_ID.get(seq.ids[0]);
            return (
              <button
                key={seq.label}
                type="button"
                data-testid={`seq-${seq.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  onAdd(seq.ids, seq.variant);
                  onClose();
                }}
                className="rounded-lg border-2 p-2 transition flex justify-center"
                style={{
                  borderColor: c,
                  background: "rgba(31, 17, 7, 0.6)",
                  boxShadow: `0 0 10px ${c}66`,
                }}
              >
                {firstTriad && (
                  <div
                    className="overflow-hidden"
                    style={{ width: 90, height: 100 }}
                  >
                    <div
                      style={{
                        transform: "scale(0.5)",
                        transformOrigin: "top left",
                      }}
                    >
                      <TriadCard
                        triad={firstTriad}
                        compact
                        preview
                        sequenceNumber={1}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

type TheoryItem = { id: string; title: string; text: string };

const THEORY_ITEMS: TheoryItem[] = [
  {
    id: "first-thing",
    title: "1",
    text: "We live on the bottom of air ocean",
  },
  {
    id: "second",
    title: "2",
    text: "Then we move we disturb the air, create invisible waves, something like ripples on the water",
  },
  {
    id: "third",
    title: "3",
    text: "and these changes in the air our ears sense, we call it sound",
  },
];

function TheoryPanel({
  open,
  onClose,
  onAddTheory,
  width,
}: {
  open: boolean;
  onClose: () => void;
  onAddTheory: (text: string) => void;
  width: number;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close theory"
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/40 z-40 cursor-default"
        />
      )}
      <aside
        className={`w-[260px] md:w-[var(--sidebar-w)] shrink-0 overflow-y-auto fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 md:z-auto border-r-2 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(31, 17, 7, 0.92)",
          borderColor: "#4a2e1a",
          ["--sidebar-w" as string]: `${width}px`,
        }}
      >
        <div
          className="p-4 border-b-2 sticky top-0 z-10"
          style={{
            background: "rgba(31, 17, 7, 0.95)",
            borderColor: "#4a2e1a",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="font-display text-base uppercase tracking-widest"
                style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a088" }}
              >
                Theory
              </h2>
              <p
                className="text-[10px] mt-0.5 font-display tracking-wider"
                style={{ color: "#a8936d" }}
              >
                {"// click to add to board"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="md:hidden -mt-1 -mr-1 w-7 h-7 rounded-md text-[#a8936d] hover:bg-[#a8936d]/20 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {THEORY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`theory-${item.id}`}
              onClick={() => {
                onAddTheory(item.text);
                onClose();
              }}
              className="w-full text-left text-sm font-display uppercase tracking-widest px-3 py-2.5 rounded-lg border-2 transition"
              style={{
                color: "#ecd29a",
                borderColor: "#ecd29a",
                background: "rgba(31, 17, 7, 0.6)",
                boxShadow: "0 0 10px rgba(255, 228, 0, 0.4)",
                textShadow: "0 0 6px rgba(255, 228, 0, 0.6)",
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

export function Board() {
  const [placed, setPlaced] = useState<PlacedCard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"triads" | "sequences" | "theory">("triads");
  const [playingSequenceId, setPlayingSequenceId] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(SIDEBAR_DEFAULT_WIDTH);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot SSR-safe localStorage hydration
      if (raw) setPlaced(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placed));
    } catch {}
  }, [placed, hydrated]);

  useEffect(() => {
    return () => {
      stopSequence();
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (!raw) return;
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) {
        setSidebarWidth(
          Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, n))
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
    } catch {}
  }, [sidebarWidth, hydrated]);

  const handleSidebarResize = (dx: number) => {
    setSidebarWidth((prev) =>
      Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, prev + dx))
    );
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] min-h-[500px]">
        <div className="h-10 border-b-2 border-[#4a2e1a]" />
        <div className="flex flex-1">
          <aside className="hidden md:block w-[220px] shrink-0 border-r-2 border-[#4a2e1a]" />
          <div className="flex-1" />
        </div>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setLibraryOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over, delta, activatorEvent } = event;

    if (active.data.current?.source === "library") {
      if (over?.id !== "board") return;
      const triadId = active.data.current.triadId as string;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;
      const pointer = activatorEvent as PointerEvent;
      const dropX = pointer.clientX + delta.x - boardRect.left - CARD_WIDTH / 2;
      const dropY = pointer.clientY + delta.y - boardRect.top - 40;
      const x = Math.max(0, Math.min(boardRect.width - CARD_WIDTH, dropX));
      const y = Math.max(0, Math.min(boardRect.height - CARD_HEIGHT, dropY));
      setPlaced((prev) => [
        ...prev,
        {
          instanceId: `${triadId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          triadId,
          x,
          y,
        },
      ]);
      return;
    }

    if (active.data.current?.source === "placed") {
      const instanceId = active.data.current.instanceId as string;
      const boardRect = boardRef.current?.getBoundingClientRect();
      const bounds = boardRect
        ? { width: boardRect.width, height: boardRect.height }
        : undefined;
      setPlaced((prev) =>
        moveCard(prev, instanceId, delta.x, delta.y, bounds)
      );
    }
  };

  const handleRemove = (instanceId: string) => {
    setPlaced((prev) => removeCard(prev, instanceId));
  };

  const handleSetKey = (instanceId: string, key: string) => {
    setPlaced((prev) => setKey(prev, instanceId, key));
  };

  const handleClear = () => {
    stopSequence();
    setPlayingSequenceId(null);
    setPlayingIndex(null);
    setPlaced([]);
  };

  const handleAddTheory = (text: string) => {
    setPlaced((prev) => addTheory(prev, text));
  };

  const handleAddPreset = (ids: string[], variant: SequenceVariant) => {
    setPlaced((prev) => addSequence(prev, ids, Date.now(), variant));
  };

  const handleTogglePlaySequence = (sequenceInstanceId: string) => {
    if (playingSequenceId === sequenceInstanceId) {
      stopSequence();
      setPlayingSequenceId(null);
      setPlayingIndex(null);
      return;
    }
    const siblings = placed
      .filter((p) => p.sequenceInstanceId === sequenceInstanceId && p.triadId)
      .sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));
    const items = siblings.flatMap((p) => {
      const triad = p.triadId ? getTriad(p.triadId) : undefined;
      if (!triad) return [];
      const variant = p.sequenceVariant ?? "second-inv";
      const frets =
        p.selectedKey && p.sequenceNumber !== undefined
          ? KEY_FRETS_BY_VARIANT[variant]?.[p.selectedKey]?.[p.sequenceNumber]
          : undefined;
      return [{ triad, startFret: frets ? frets[0] : undefined }];
    });
    if (items.length === 0) return;
    setPlayingSequenceId(sequenceInstanceId);
    setPlayingIndex(0);
    void playSequence(items, (i) => setPlayingIndex(i));
  };

  const activeTriad = (() => {
    if (!activeId) return null;
    if (activeId.startsWith("lib:")) return getTriad(activeId.slice(4)) ?? null;
    if (activeId.startsWith("placed:")) {
      const p = placed.find((p) => `placed:${p.instanceId}` === activeId);
      return p && p.triadId ? getTriad(p.triadId) ?? null : null;
    }
    return null;
  })();

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] min-h-[500px]">
        <div
          className="flex border-b-2 shrink-0"
          style={{
            background: "rgba(31, 17, 7, 0.92)",
            borderColor: "#4a2e1a",
          }}
        >
          {(["theory", "triads", "sequences"] as const).map((t) => {
            const active = activeTab === t;
            return (
              <button
                key={t}
                type="button"
                data-testid={`tab-${t}`}
                onClick={() => {
                  setActiveTab(t);
                  setLibraryOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-display uppercase tracking-widest transition-colors border-b-2"
                style={
                  active
                    ? {
                        color: "#c98152",
                        borderColor: "#c98152",
                        textShadow: "0 0 8px #c98152aa",
                      }
                    : {
                        color: "#6b4a30",
                        borderColor: "transparent",
                      }
                }
              >
                {t === "triads"
                  ? "Triads"
                  : t === "sequences"
                  ? "Sequences"
                  : "Theory"}
              </button>
            );
          })}
        </div>
        <div className="flex flex-1 min-h-0 relative">
          {activeTab === "triads" ? (
            <Library
              open={libraryOpen}
              onClose={() => setLibraryOpen(false)}
              width={sidebarWidth}
            />
          ) : activeTab === "sequences" ? (
            <SequencesList
              open={libraryOpen}
              onClose={() => setLibraryOpen(false)}
              onAdd={handleAddPreset}
              width={sidebarWidth}
            />
          ) : (
            <TheoryPanel
              open={libraryOpen}
              onClose={() => setLibraryOpen(false)}
              onAddTheory={handleAddTheory}
              width={sidebarWidth}
            />
          )}
          <SidebarResizer onResizeDelta={handleSidebarResize} />
          <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLibraryOpen(true)}
                  className="md:hidden flex items-center gap-1.5 text-xs font-display uppercase tracking-wider rounded-md px-2.5 py-1 border-2"
                  style={{
                    color: "#d9c4a0",
                    borderColor: "#d9c4a0",
                    background: "rgba(255, 165, 0, 0.06)",
                  }}
                  aria-label={
                    activeTab === "triads"
                      ? "Open card library"
                      : activeTab === "sequences"
                      ? "Open sequences"
                      : "Open theory"
                  }
                >
                  <span aria-hidden>☰</span>{" "}
                  {activeTab === "triads"
                    ? "Cards"
                    : activeTab === "sequences"
                    ? "Sequences"
                    : "Theory"}
                </button>
                <div
                  className="text-xs font-display uppercase tracking-widest"
                  style={{ color: "#a8936d" }}
                >
                  {placed.length === 0
                    ? "// empty board"
                    : `// ${placed.length} ${placed.length === 1 ? "card" : "cards"} on board`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={placed.length === 0}
                className="text-xs font-display uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{ color: "#c98152" }}
              >
                Clear board
              </button>
            </div>
          <BoardDropZone
            placed={placed}
            onRemove={handleRemove}
            onSetKey={handleSetKey}
            onTogglePlaySequence={handleTogglePlaySequence}
            playingSequenceId={playingSequenceId}
            playingIndex={playingIndex}
            boardRef={boardRef}
          />
        </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTriad ? (
          <div style={{ width: activeId?.startsWith("lib:") ? LIB_CARD_WIDTH : CARD_WIDTH }}>
            <TriadCard triad={activeTriad} compact={activeId?.startsWith("lib:")} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

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
} from "@/lib/triads";
import { TriadCard } from "./triad-card";

type PlacedCard = {
  instanceId: string;
  triadId: string;
  x: number;
  y: number;
  sequenceNumber?: number;
};

const STORAGE_KEY = "easy-triads.board.v1";
const CARD_WIDTH = 220;
const CARD_HEIGHT = 210;
const LIB_CARD_WIDTH = 180;

const TRIAD_BY_ID = new Map(TRIADS.map((t) => [t.id, t]));

type Sequence = {
  label: string;
  ids: string[];
  quality: Quality;
  color?: string;
  colorSoft?: string;
};

const SEQUENCES: Sequence[] = [
  {
    label: "D chords",
    quality: "major",
    color: "#16a34a",
    colorSoft: "#f0fdf4",
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
    label: "Sequence 2",
    quality: "major",
    color: "#ca8a04",
    colorSoft: "#fffbeb",
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

function DraggablePlacedCard({
  placed,
  onRemove,
}: {
  placed: PlacedCard;
  onRemove: (id: string) => void;
}) {
  const triad = getTriad(placed.triadId);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed:${placed.instanceId}`,
      data: { source: "placed", instanceId: placed.instanceId },
    });

  if (!triad) return null;

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
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
        aria-label="Remove card"
      >
        ×
      </button>
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        <TriadCard triad={triad} sequenceNumber={placed.sequenceNumber} />
      </div>
    </div>
  );
}

function BoardDropZone({
  placed,
  onRemove,
  boardRef,
}: {
  placed: PlacedCard[];
  onRemove: (id: string) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "board" });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        boardRef.current = node;
      }}
      className={`relative flex-1 min-h-[600px] bg-zinc-50 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
        isOver ? "border-[#2563a0] bg-blue-50/40" : "border-zinc-200"
      }`}
    >
      {placed.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm pointer-events-none">
          Drag cards from the library to build your study board
        </div>
      )}
      {placed.map((p) => (
        <DraggablePlacedCard
          key={p.instanceId}
          placed={p}
          onRemove={onRemove}
        />
      ))}
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
}: {
  open: boolean;
  onClose: () => void;
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
        className={`w-[260px] md:w-[220px] shrink-0 bg-white border-r border-zinc-200 overflow-y-auto fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="p-4 border-b border-zinc-200 sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-sm text-zinc-900">Card Library</h2>
            <p className="text-xs text-zinc-500 mt-0.5 mb-3">Drag onto the board</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="md:hidden -mt-1 -mr-1 w-7 h-7 rounded-md text-zinc-500 hover:bg-zinc-100 flex items-center justify-center"
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
                className="w-full text-left text-[11px] font-bold uppercase tracking-wider px-2 py-1.5 rounded flex items-center justify-between cursor-pointer hover:brightness-95 transition"
                style={{ color: accent, background: accentSoft }}
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
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (ids: string[]) => void;
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
        className={`w-[260px] md:w-[220px] shrink-0 bg-white border-r border-zinc-200 overflow-y-auto fixed inset-y-0 left-0 z-50 transition-transform md:relative md:translate-x-0 md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-zinc-200 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-sm text-zinc-900">Sequences</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Click to add to board</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="md:hidden -mt-1 -mr-1 w-7 h-7 rounded-md text-zinc-500 hover:bg-zinc-100 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {SEQUENCES.map((seq) => {
            const c = seq.color ?? QUALITY_COLOR[seq.quality];
            const cs = seq.colorSoft ?? QUALITY_COLOR_SOFT[seq.quality];
            return (
            <button
              key={seq.label}
              type="button"
              data-testid={`seq-${seq.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => {
                onAdd(seq.ids);
                onClose();
              }}
              className="text-left rounded-lg border px-3 py-2.5 hover:brightness-95 transition"
              style={{
                color: c,
                borderColor: `${c}66`,
                background: cs,
              }}
            >
              <div className="text-[11px] opacity-80">
                {seq.ids.length} {seq.ids.length === 1 ? "card" : "cards"}
              </div>
            </button>
            );
          })}
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
  const [activeTab, setActiveTab] = useState<"triads" | "sequences">("triads");
  const boardRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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

  if (!hydrated) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] min-h-[500px]">
        <div className="h-10 border-b border-zinc-200 bg-white" />
        <div className="flex flex-1">
          <aside className="hidden md:block w-[220px] shrink-0 bg-white border-r border-zinc-200" />
          <div className="flex-1 bg-zinc-50" />
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
      setPlaced((prev) =>
        prev.map((p) => {
          if (p.instanceId !== instanceId) return p;
          let nx = p.x + delta.x;
          let ny = p.y + delta.y;
          if (boardRect) {
            nx = Math.max(0, Math.min(boardRect.width - CARD_WIDTH, nx));
            ny = Math.max(0, Math.min(boardRect.height - CARD_HEIGHT, ny));
          }
          return { ...p, x: nx, y: ny };
        })
      );
    }
  };

  const handleRemove = (instanceId: string) => {
    setPlaced((prev) => prev.filter((p) => p.instanceId !== instanceId));
  };

  const handleClear = () => {
    setPlaced([]);
  };

  const handleAddPreset = (ids: string[]) => {
    const ts = Date.now();
    setPlaced((prev) => {
      const cols = ids.length <= 3 ? ids.length : Math.ceil(ids.length / 2);
      const startRow = Math.floor(prev.length / 3);
      return [
        ...prev,
        ...ids.map((triadId, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return {
            instanceId: `${triadId}-${ts}-${i}`,
            triadId,
            x: 20 + col * 240,
            y: 20 + (startRow + row) * 240,
            sequenceNumber: i + 1,
          };
        }),
      ];
    });
  };

  const activeTriad = (() => {
    if (!activeId) return null;
    if (activeId.startsWith("lib:")) return getTriad(activeId.slice(4)) ?? null;
    if (activeId.startsWith("placed:")) {
      const p = placed.find((p) => `placed:${p.instanceId}` === activeId);
      return p ? getTriad(p.triadId) ?? null : null;
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
        <div className="flex border-b border-zinc-200 bg-white shrink-0">
          {(["triads", "sequences"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-testid={`tab-${t}`}
              onClick={() => {
                setActiveTab(t);
                setLibraryOpen(false);
              }}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === t
                  ? "text-[#1e3a5f] border-[#1e3a5f]"
                  : "text-zinc-500 border-transparent hover:text-zinc-800"
              }`}
            >
              {t === "triads" ? "Triads" : "Sequences"}
            </button>
          ))}
        </div>
        <div className="flex flex-1 min-h-0 relative">
          {activeTab === "triads" ? (
            <Library open={libraryOpen} onClose={() => setLibraryOpen(false)} />
          ) : (
            <SequencesList
              open={libraryOpen}
              onClose={() => setLibraryOpen(false)}
              onAdd={handleAddPreset}
            />
          )}
          <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLibraryOpen(true)}
                  className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-zinc-700 border border-zinc-300 rounded-md px-2.5 py-1 hover:bg-zinc-50"
                  aria-label={activeTab === "triads" ? "Open card library" : "Open sequences"}
                >
                  <span aria-hidden>☰</span>{" "}
                  {activeTab === "triads" ? "Cards" : "Sequences"}
                </button>
                <div className="text-sm text-zinc-600">
                  {placed.length === 0
                    ? "Empty board"
                    : `${placed.length} ${placed.length === 1 ? "card" : "cards"} on board`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={placed.length === 0}
                className="text-xs font-semibold text-zinc-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear board
              </button>
            </div>
          <BoardDropZone
            placed={placed}
            onRemove={handleRemove}
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

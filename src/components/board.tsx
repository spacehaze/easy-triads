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

import { TRIADS, type Triad, QUALITY_LABEL } from "@/lib/triads";
import { TriadCard } from "./triad-card";

type PlacedCard = {
  instanceId: string;
  triadId: string;
  x: number;
  y: number;
};

const STORAGE_KEY = "easy-triads.board.v1";
const CARD_WIDTH = 220;
const CARD_HEIGHT = 210;
const LIB_CARD_WIDTH = 180;

const TRIAD_BY_ID = new Map(TRIADS.map((t) => [t.id, t]));

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
        <TriadCard triad={triad} />
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
        <DraggablePlacedCard key={p.instanceId} placed={p} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Library() {
  const grouped = {
    major: TRIADS.filter((t) => t.quality === "major"),
    minor: TRIADS.filter((t) => t.quality === "minor"),
    diminished: TRIADS.filter((t) => t.quality === "diminished"),
  };

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-zinc-200 overflow-y-auto">
      <div className="p-4 border-b border-zinc-200 sticky top-0 bg-white z-10">
        <h2 className="font-bold text-sm text-zinc-900">Card Library</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Drag onto the board</p>
      </div>
      <div className="p-3 space-y-6">
        {(["major", "minor", "diminished"] as const).map((q) => (
          <section key={q}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2563a0] mb-2 px-1">
              {QUALITY_LABEL[q]}
            </h3>
            <div className="flex flex-col gap-2 items-center">
              {grouped[q].map((triad) => (
                <DraggableLibraryCard key={triad.id} triad={triad} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

export function Board() {
  const [placed, setPlaced] = useState<PlacedCard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
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
      <div className="flex h-[calc(100vh-64px)] min-h-[600px]">
        <aside className="w-[220px] shrink-0 bg-white border-r border-zinc-200" />
        <div className="flex-1 bg-zinc-50" />
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
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

  const handlePresetMajor123 = () => {
    const ids = ["major-123-root", "major-123-first", "major-123-second"];
    const ts = Date.now();
    setPlaced((prev) => [
      ...prev,
      ...ids.map((triadId, i) => ({
        instanceId: `${triadId}-${ts}-${i}`,
        triadId,
        x: 20 + i * 240,
        y: 20,
      })),
    ]);
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
      <div className="flex h-[calc(100vh-64px)] min-h-[600px]">
        <Library />
        <div className="flex-1 flex flex-col p-4 gap-3 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              {placed.length === 0
                ? "Empty board"
                : `${placed.length} ${placed.length === 1 ? "card" : "cards"} on board`}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                data-testid="preset-major-123"
                onClick={handlePresetMajor123}
                className="text-xs font-semibold text-[#2563a0] hover:text-[#1e3a5f] border border-[#2563a0]/40 hover:border-[#1e3a5f] rounded-md px-2.5 py-1"
              >
                + Major 1-2-3 inversions
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={placed.length === 0}
                className="text-xs font-semibold text-zinc-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear board
              </button>
            </div>
          </div>
          <BoardDropZone
            placed={placed}
            onRemove={handleRemove}
            boardRef={boardRef}
          />
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

import {
  type Triad,
  QUALITY_LABEL,
  KEY_PROGRESSIONS_BY_VARIANT,
  KEY_FRETS_BY_VARIANT,
  SEQUENCE_KEYS_BY_VARIANT,
  type SequenceVariant,
} from "@/lib/triads";
import { playTriad } from "@/lib/audio";

const STRINGS: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
const FRET_COUNT = 5;

const SEQUENCE_ROMAN: Record<number, string> = {
  1: "I",
  2: "ii",
  3: "iii",
  4: "IV",
  5: "V",
  6: "vi",
  7: "vii",
  8: "I",
};

const INVERSION_LABEL: Record<"root" | "first" | "second", string> = {
  root: "Root",
  first: "1st inv.",
  second: "2nd inv.",
};

const WATERMARK: Record<"root" | "first" | "second", string> = {
  root: "R",
  first: "1",
  second: "2",
};

type Props = {
  triad: Triad;
  compact?: boolean;
  sequenceNumber?: number;
  preview?: boolean;
  selectedKey?: string;
  onKeyChange?: (key: string) => void;
  onPlaySequence?: () => void;
  isSequencePlaying?: boolean;
  isPlayingNow?: boolean;
  sequenceVariant?: SequenceVariant;
};

export function TriadCard({
  triad,
  compact,
  sequenceNumber,
  preview,
  selectedKey,
  onKeyChange,
  onPlaySequence,
  isSequencePlaying,
  isPlayingNow,
  sequenceVariant = "second-inv",
}: Props) {
  const width = compact ? 160 : 220;
  const titleSize = compact ? 18 : 20;
  const watermarkSize = compact ? 88 : 110;
  const boardWidth = width - 40;
  const boardHeight = compact ? 110 : 138;
  const paddingLeft = 28;
  const paddingTop = 14;
  const fretSpacing = boardWidth / FRET_COUNT;
  const stringSpacing = boardHeight / 5;

  const stringSet = triad.stringSet as readonly number[];
  const isActive = (s: number) => stringSet.includes(s);

  const maxFretOffset = Math.max(...triad.notes.map((n) => n.fretOffset));
  const visibleFretCount = maxFretOffset + 1;
  const visibleBoardWidth = visibleFretCount * fretSpacing;

  const availableKeys = SEQUENCE_KEYS_BY_VARIANT[sequenceVariant];
  const chordRoot =
    selectedKey && sequenceNumber
      ? KEY_PROGRESSIONS_BY_VARIANT[sequenceVariant]?.[selectedKey]?.[
          sequenceNumber
        ]?.chord.split(" ")[0]
      : null;
  const fretNumbers =
    selectedKey && sequenceNumber
      ? KEY_FRETS_BY_VARIANT[sequenceVariant]?.[selectedKey]?.[sequenceNumber] ??
        null
      : null;

  const watermarkChar =
    sequenceNumber !== undefined
      ? SEQUENCE_ROMAN[sequenceNumber] ?? ""
      : WATERMARK[triad.inversion];

  return (
    <div
      className="relative select-none overflow-hidden transition-transform duration-200"
      style={{
        width,
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        borderRadius: 4,
        transform: isPlayingNow ? "scale(1.03)" : undefined,
      }}
    >
      <span
        aria-hidden
        className="absolute select-none"
        style={{
          right: -2,
          bottom: -22,
          fontFamily: 'var(--font-serif), "Source Serif 4", Georgia, serif',
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: watermarkSize,
          letterSpacing: "-0.04em",
          color: "var(--ink)",
          opacity: "var(--watermark-opacity)",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {watermarkChar}
      </span>

      <div
        className={`flex items-baseline justify-between gap-2 ${
          compact ? "px-3 pt-3 pb-2" : "px-[18px] pt-4 pb-2"
        }`}
      >
        <div
          className="leading-none"
          style={{
            fontFamily: 'var(--font-serif), "Source Serif 4", Georgia, serif',
            fontSize: titleSize,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          {QUALITY_LABEL[triad.quality]}
        </div>
        {!preview && sequenceNumber === 1 && onKeyChange ? (
          <select
            value={selectedKey ?? ""}
            onChange={(e) => onKeyChange(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            aria-label="Sequence key"
            className="text-[11px] font-bold rounded px-1.5 py-0.5 cursor-pointer"
            style={{
              color: "var(--ink)",
              border: "1px solid var(--rule)",
              background: "var(--paper)",
            }}
          >
            <option value="">KEY</option>
            {availableKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        ) : !preview &&
          sequenceNumber !== undefined &&
          sequenceNumber !== 1 &&
          chordRoot ? (
          <div
            className="text-[11px] font-bold rounded px-1.5 py-0.5"
            style={{
              color: "var(--ink)",
              border: "1px solid var(--rule)",
              background: "var(--paper)",
            }}
          >
            {chordRoot}
          </div>
        ) : (
          <span
            className="uppercase"
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 9.5,
              letterSpacing: "0.18em",
              color: "var(--muted)",
            }}
          >
            {INVERSION_LABEL[triad.inversion]}
          </span>
        )}
      </div>

      <div style={{ height: 1, background: "var(--rule)" }} />

      <svg
        viewBox={`0 0 ${width} ${boardHeight + 26}`}
        width={width}
        height={boardHeight + 26}
        className="block"
        style={{ marginTop: 8 }}
      >
        {STRINGS.map((s, i) => {
          const y = paddingTop + i * stringSpacing;
          const active = isActive(s);
          return (
            <g key={`string-${s}`}>
              <text
                x={paddingLeft - 10}
                y={y + 3.5}
                textAnchor="end"
                fontSize={10}
                fontWeight={active ? 700 : 400}
                fill={active ? "var(--ink-2)" : "var(--muted)"}
                opacity={active ? 1 : 0.4}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {s}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + visibleBoardWidth}
                y2={y}
                stroke={active ? "var(--ink-2)" : "var(--rule)"}
                strokeWidth={active ? 1.4 : 1}
                opacity={active ? 1 : 0.6}
              />
            </g>
          );
        })}

        {Array.from({ length: visibleFretCount + 1 }).map((_, i) => {
          const x = paddingLeft + i * fretSpacing;
          return (
            <line
              key={`fret-${i}`}
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={paddingTop + (STRINGS.length - 1) * stringSpacing}
              stroke="var(--rule)"
              strokeWidth={1}
            />
          );
        })}

        {fretNumbers &&
          fretNumbers.map((fret, i) => (
            <text
              key={`fret-num-${i}`}
              x={paddingLeft + i * fretSpacing + fretSpacing / 2}
              y={paddingTop + (STRINGS.length - 1) * stringSpacing + 14}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="var(--muted)"
              fontFamily='ui-monospace, "SF Mono", Menlo, monospace'
            >
              {fret}
            </text>
          ))}

        {triad.notes.map((note, i) => {
          const stringIdx = STRINGS.indexOf(note.string);
          const cx =
            paddingLeft + note.fretOffset * fretSpacing + fretSpacing / 2;
          const cy = paddingTop + stringIdx * stringSpacing;
          const isRoot = note.interval === 1;
          return (
            <g key={`note-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isRoot ? "var(--accent)" : "var(--paper)"}
                stroke={isRoot ? "var(--accent)" : "var(--ink)"}
                strokeWidth={1}
              />
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={isRoot ? "#FFFFFF" : "var(--ink)"}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {note.interval}
              </text>
            </g>
          );
        })}
      </svg>

      {!preview && (
        <div
          className={`${
            compact ? "px-3" : "px-[18px]"
          } pb-3 pt-1 flex items-center justify-between gap-2`}
        >
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              void playTriad(
                triad,
                fretNumbers ? { startFret: fretNumbers[0] } : undefined
              );
              const chordName =
                selectedKey && sequenceNumber
                  ? KEY_PROGRESSIONS_BY_VARIANT[sequenceVariant]?.[selectedKey]?.[
                      sequenceNumber
                    ]?.chord
                  : null;
              const announceText = chordName
                ? `Playing ${chordName}`
                : `Playing ${QUALITY_LABEL[triad.quality]} chord on strings ${triad.stringSet.join("-")}`;
              window.dispatchEvent(
                new CustomEvent("triad-play", { detail: { text: announceText } })
              );
            }}
            aria-label={(() => {
              const chordName =
                selectedKey && sequenceNumber
                  ? KEY_PROGRESSIONS_BY_VARIANT[sequenceVariant]?.[selectedKey]?.[
                      sequenceNumber
                    ]?.chord
                  : null;
              return chordName
                ? `Play ${chordName}`
                : `Play ${QUALITY_LABEL[triad.quality]} chord on strings ${triad.stringSet.join("-")}`;
            })()}
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)]"
            style={{
              background: "transparent",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
            }}
          >
            <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden>
              <polygon points="2,1 9,5 2,9" fill="currentColor" />
            </svg>
          </button>
          {sequenceNumber === 1 && selectedKey && onPlaySequence && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onPlaySequence();
              }}
              aria-label={isSequencePlaying ? "Stop sequence" : "Play sequence"}
              aria-pressed={isSequencePlaying ?? false}
              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors hover:bg-[var(--accent-soft)]"
              style={{
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                background: "transparent",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              {isSequencePlaying ? "Stop" : "Play seq."}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

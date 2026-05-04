"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Comment = {
  id: string;
  name: string | null;
  text: string;
  ts: number;
};

const TEXT_MAX = 600;
const NAME_MAX = 32;
const PEEK_HEIGHT = 36;
const SHEET_HEIGHT = 480;

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

function initial(name: string | null): string {
  return name?.trim()?.[0]?.toUpperCase() || "·";
}

export function SiteCommentsFooter() {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Track mount so we only call createPortal on the client (avoids SSR portal errors).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Fetch comments once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setComments(data.comments ?? []);
        setConfigured(data.configured ?? false);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // When sheet opens or new comment lands, scroll the list to its bottom.
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments, open]);

  // ESC closes the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          name: name.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not post");
        return;
      }
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setText("");
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const onTextKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop while open */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        />
      )}
      <div
        role="region"
        aria-label="Comments"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: "var(--paper)",
          borderTop: "1px solid var(--rule)",
          height: open ? SHEET_HEIGHT : PEEK_HEIGHT,
          minHeight: open ? SHEET_HEIGHT : PEEK_HEIGHT,
          maxHeight: "85vh",
          transition: "height 200ms ease, min-height 200ms ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close comments" : "Open comments"}
          style={{
            height: PEEK_HEIGHT,
            width: "100%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span aria-hidden>{open ? "▾" : "▴"}</span>
          <span>{`// comments · ${comments.length}`}</span>
        </button>

        {open && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              padding: "0 28px 24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: 16,
                alignItems: "baseline",
                paddingBottom: 12,
                marginBottom: 16,
                borderBottom: "1px solid var(--rule)",
              }}
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                § 05
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                }}
              >
                Comments
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {comments.length} {comments.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily:
                    'var(--font-serif), "Source Serif 4", Georgia, serif',
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  color: "var(--ink)",
                }}
              >
                Leave a note on the{" "}
                <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                  redesign
                </span>
                .
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--muted)",
                }}
              >
                Anonymous, no login. Be kind. New entries land at the bottom.
              </p>
            </div>

            <div
              ref={listRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                border: "1px solid var(--rule)",
                background: "var(--paper)",
              }}
            >
              {!loaded ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: "center",
                    color: "var(--muted)",
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  loading…
                </div>
              ) : comments.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: "center",
                    color: "var(--muted)",
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {"// no comments yet — be the first"}
                </div>
              ) : (
                comments.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px 1fr",
                      gap: 16,
                      padding: "16px 20px",
                      borderTop: i === 0 ? "none" : "1px solid var(--rule)",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--paper)",
                        border: "1px solid var(--rule)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily:
                          'ui-monospace, "SF Mono", Menlo, monospace',
                        fontWeight: 500,
                        fontSize: 13,
                        color: "var(--ink)",
                        textTransform: "uppercase",
                      }}
                    >
                      {initial(c.name)}
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 500,
                            fontSize: 14,
                            color: "var(--ink)",
                          }}
                        >
                          {c.name || "anonymous"}
                        </span>
                        <span
                          style={{
                            fontFamily:
                              'ui-monospace, "SF Mono", Menlo, monospace',
                            fontSize: 10.5,
                            color: "var(--muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {formatTimestamp(c.ts)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "ui-sans-serif, system-ui, sans-serif",
                          fontSize: 14,
                          lineHeight: 1.55,
                          color: "var(--ink-2)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <div
              style={{
                marginTop: 14,
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                placeholder="Name (optional)"
                maxLength={NAME_MAX}
                disabled={!configured}
                style={{
                  border: "none",
                  borderBottom: "1px solid var(--rule)",
                  padding: "8px 12px",
                  background: "transparent",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                }}
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, TEXT_MAX))}
                onKeyDown={onTextKey}
                placeholder={
                  configured
                    ? "Your comment…"
                    : "Comments backend not configured (set KV env vars on Vercel)"
                }
                rows={2}
                maxLength={TEXT_MAX}
                disabled={!configured}
                style={{
                  border: "none",
                  padding: "8px 12px",
                  background: "transparent",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--ink)",
                  outline: "none",
                  resize: "vertical",
                  minHeight: 56,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {error ?? `${text.length}/${TEXT_MAX} · ⌘/Ctrl+Enter to post`}
                </span>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!text.trim() || submitting || !configured}
                  style={{
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    padding: "8px 16px",
                    border: "1px solid var(--ink)",
                    background: text.trim() && configured ? "var(--ink)" : "transparent",
                    color: text.trim() && configured ? "var(--paper)" : "var(--muted)",
                    cursor:
                      text.trim() && configured && !submitting
                        ? "pointer"
                        : "not-allowed",
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  {submitting ? "Posting…" : "Post comment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.documentElement
  );
}

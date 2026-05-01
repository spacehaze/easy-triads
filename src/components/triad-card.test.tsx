import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TriadCard } from "./triad-card";
import { TRIADS } from "@/lib/triads";
import { playTriad } from "@/lib/audio";

vi.mock("@/lib/audio", () => ({
  playTriad: vi.fn(),
}));

const major123Root = TRIADS.find((t) => t.id === "major-123-root")!;
const minor234Second = TRIADS.find((t) => t.id === "minor-234-second")!;
const dim123Root = TRIADS.find((t) => t.id === "dim-123-root")!;

describe("TriadCard", () => {
  it("renders the quality label in the header", () => {
    render(<TriadCard triad={major123Root} />);
    expect(screen.getByText("Major")).toBeInTheDocument();
  });

  it("renders 'minor' (lowercase) for minor triads", () => {
    render(<TriadCard triad={minor234Second} />);
    expect(screen.getByText("minor")).toBeInTheDocument();
  });

  it("renders 'deminished' for diminished triads", () => {
    render(<TriadCard triad={dim123Root} />);
    expect(screen.getByText("deminished")).toBeInTheDocument();
  });

  it("renders a play button by default", () => {
    render(<TriadCard triad={major123Root} />);
    expect(screen.getByLabelText("Play chord")).toBeInTheDocument();
  });

  it("hides the play button in preview mode", () => {
    render(<TriadCard triad={major123Root} preview />);
    expect(screen.queryByLabelText("Play chord")).not.toBeInTheDocument();
  });

  it("shows the KEY dropdown only on the first sequence card with onKeyChange", () => {
    const onKeyChange = vi.fn();
    render(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        onKeyChange={onKeyChange}
      />
    );
    expect(screen.getByLabelText("Sequence key")).toBeInTheDocument();
  });

  it("does not render KEY dropdown without sequenceNumber", () => {
    render(<TriadCard triad={major123Root} onKeyChange={vi.fn()} />);
    expect(screen.queryByLabelText("Sequence key")).not.toBeInTheDocument();
  });

  it("does not render KEY dropdown on cards 2-N", () => {
    render(
      <TriadCard
        triad={minor234Second}
        sequenceNumber={2}
        onKeyChange={vi.fn()}
      />
    );
    expect(screen.queryByLabelText("Sequence key")).not.toBeInTheDocument();
  });

  it("renders chord root for cards 2-N when key is selected", () => {
    render(
      <TriadCard triad={minor234Second} sequenceNumber={2} selectedKey="D" />
    );
    // Card 2 in D is "E minor" → root is "E"
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  it("renders C# for diminished card 7 in D key", () => {
    render(<TriadCard triad={dim123Root} sequenceNumber={7} selectedKey="D" />);
    expect(screen.getByText("C#")).toBeInTheDocument();
  });

  it("passes the transposed startFret to playTriad when key is selected", async () => {
    const user = userEvent.setup();
    vi.mocked(playTriad).mockClear();
    // Position 7 (vii°) in key D maps to frets [8, 9, 10, 11] —
    // the play button must override startFret to 8 so audio matches the displayed frets.
    render(<TriadCard triad={dim123Root} sequenceNumber={7} selectedKey="D" />);
    await user.click(screen.getByLabelText("Play chord"));
    expect(playTriad).toHaveBeenCalledWith(dim123Root, { startFret: 8 });
  });

  it("shows the play-sequence button only on card 1 with a key selected", () => {
    const onPlaySequence = vi.fn();
    const { rerender } = render(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        onPlaySequence={onPlaySequence}
      />
    );
    // No key → no button
    expect(screen.queryByLabelText(/play sequence|stop sequence/i)).toBeNull();

    rerender(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        selectedKey="D"
        onPlaySequence={onPlaySequence}
      />
    );
    expect(screen.getByLabelText("Play sequence")).toBeInTheDocument();

    // Not on card 2
    rerender(
      <TriadCard
        triad={minor234Second}
        sequenceNumber={2}
        selectedKey="D"
        onPlaySequence={onPlaySequence}
      />
    );
    expect(screen.queryByLabelText(/play sequence|stop sequence/i)).toBeNull();
  });

  it("toggles label between Play and Stop based on isSequencePlaying", () => {
    const { rerender } = render(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        selectedKey="D"
        onPlaySequence={vi.fn()}
        isSequencePlaying={false}
      />
    );
    expect(screen.getByLabelText("Play sequence")).toBeInTheDocument();

    rerender(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        selectedKey="D"
        onPlaySequence={vi.fn()}
        isSequencePlaying={true}
      />
    );
    expect(screen.getByLabelText("Stop sequence")).toBeInTheDocument();
  });

  it("invokes onPlaySequence when the button is clicked", async () => {
    const user = userEvent.setup();
    const onPlaySequence = vi.fn();
    render(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        selectedKey="D"
        onPlaySequence={onPlaySequence}
      />
    );
    await user.click(screen.getByLabelText("Play sequence"));
    expect(onPlaySequence).toHaveBeenCalledTimes(1);
  });

  it("plays the original startFret when no key is selected", async () => {
    const user = userEvent.setup();
    vi.mocked(playTriad).mockClear();
    render(<TriadCard triad={major123Root} />);
    await user.click(screen.getByLabelText("Play chord"));
    expect(playTriad).toHaveBeenCalledWith(major123Root, undefined);
  });

  it("invokes onKeyChange when KEY dropdown changes", async () => {
    const user = userEvent.setup();
    const onKeyChange = vi.fn();
    render(
      <TriadCard
        triad={major123Root}
        sequenceNumber={1}
        onKeyChange={onKeyChange}
      />
    );
    await user.selectOptions(screen.getByLabelText("Sequence key"), "D");
    expect(onKeyChange).toHaveBeenCalledWith("D");
  });
});

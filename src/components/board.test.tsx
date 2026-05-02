import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/audio", () => ({
  playTriad: vi.fn(),
  playSequence: vi.fn(),
  stopSequence: vi.fn(),
}));

import { Board } from "./board";

beforeEach(() => {
  window.localStorage.removeItem("easy-triads.board.v1");
});

async function renderBoard() {
  const result = render(<Board />);
  // Board returns a skeleton until useEffect sets hydrated=true.
  await act(() => Promise.resolve());
  return result;
}

describe("Board", () => {
  it("renders the visible tabs (Theory hidden for now)", async () => {
    await renderBoard();
    expect(screen.getByTestId("tab-triads")).toBeInTheDocument();
    expect(screen.getByTestId("tab-sequences")).toBeInTheDocument();
    expect(screen.queryByTestId("tab-theory")).not.toBeInTheDocument();
  });

  it("starts on the Triads tab with the card library", async () => {
    await renderBoard();
    // Library sidebar shows the quality pills row (Major / Minor / Dim).
    expect(screen.getByRole("button", { name: "Major" })).toBeInTheDocument();
  });

  it("switches to the Sequences tab on click", async () => {
    const user = userEvent.setup();
    await renderBoard();
    await user.click(screen.getByTestId("tab-sequences"));
    expect(screen.getByTestId("seq-d-chords")).toBeInTheDocument();
  });

  it("clicking a sequence button adds cards to the board", async () => {
    const user = userEvent.setup();
    await renderBoard();
    await user.click(screen.getByTestId("tab-sequences"));
    await user.click(screen.getByTestId("seq-d-chords"));
    expect(screen.getByText(/8 cards on board/i)).toBeInTheDocument();
  });

  it("Clear board button empties placed cards", async () => {
    const user = userEvent.setup();
    await renderBoard();
    await user.click(screen.getByTestId("tab-sequences"));
    await user.click(screen.getByTestId("seq-d-chords"));
    await user.click(screen.getByText(/Clear board/i));
    expect(screen.getByText(/empty board/i)).toBeInTheDocument();
  });

  it("rehydrates placed cards from localStorage", async () => {
    window.localStorage.setItem(
      "easy-triads.board.v1",
      JSON.stringify([
        { instanceId: "x1", x: 0, y: 0, text: "saved quote" },
      ])
    );
    await renderBoard();
    expect(screen.getByText(/1 card on board/i)).toBeInTheDocument();
    expect(screen.getByText(/saved quote/)).toBeInTheDocument();
  });
});

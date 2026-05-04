import { NextResponse } from "next/server";
import { addComment, isKvConfigured, listComments } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const comments = await listComments();
  return NextResponse.json({ comments, configured: isKvConfigured() });
}

export async function POST(request: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Comments backend not configured" },
      { status: 503 }
    );
  }
  let body: { name?: string; text?: string };
  try {
    body = (await request.json()) as { name?: string; text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const created = await addComment({
    name: typeof body.name === "string" ? body.name : null,
    text: body.text,
  });
  if (!created) {
    return NextResponse.json(
      { error: "Could not create comment" },
      { status: 500 }
    );
  }
  return NextResponse.json({ comment: created }, { status: 201 });
}

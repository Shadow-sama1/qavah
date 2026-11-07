import { NextResponse } from "next/server";
import { findPassage, parseReference } from "@/lib/bible";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") ?? "";
  const translation = new URL(request.url).searchParams.get("translation") ?? "KJV";
  const parsed = parseReference(reference);
  if (!parsed) return NextResponse.json({ error: "We couldn't parse that reference." }, { status: 400 });
  return NextResponse.json(findPassage(parsed.book, parsed.chapter, parsed.verseStart, parsed.verseEnd, translation));
}

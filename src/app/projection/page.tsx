"use client";

import { useEffect, useState } from "react";
import { Maximize, MonitorUp } from "lucide-react";
import type { Passage } from "@/lib/bible";

const channelName = "qavah-projection";
const initialPassage: Passage = { book: "John", chapter: 3, verseStart: 16, verseEnd: 16, translation: "KJV", verses: [{ verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." }] };

type ProjectionSettings = { fontSize: number; align: string; showReference: boolean; theme: string };

export default function ProjectionPage() {
  const [passage, setPassage] = useState(initialPassage);
  const [settings, setSettings] = useState<ProjectionSettings>({ fontSize: 72, align: "center", showReference: true, theme: "forest" });
  const [blank, setBlank] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel(channelName);
    channel.onmessage = (event) => {
      if (event.data.type === "passage") {
        setPassage(event.data.passage);
        setSettings(event.data.settings);
        setBlank(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => { if (event.code === "Space" || event.key.toLowerCase() === "b") { event.preventDefault(); setBlank((current) => !current); } };
    window.addEventListener("keydown", handleKey);
    return () => { channel.close(); window.removeEventListener("keydown", handleKey); };
  }, []);

  function fullScreen() { document.documentElement.requestFullscreen?.(); }
  const isNight = settings.theme === "night";
  const reference = `${passage.book} ${passage.chapter}:${passage.verseStart}${passage.verseEnd !== passage.verseStart ? `–${passage.verseEnd}` : ""}`;

  return <main className={`relative flex min-h-screen items-center justify-center overflow-hidden px-8 transition-colors duration-500 ${blank ? "bg-black" : isNight ? "bg-[#111a18]" : "bg-[#1e3d32]"}`}>
    {!blank && <><div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 15% 15%, rgba(182,209,189,.22), transparent 28%), radial-gradient(circle at 85% 80%, rgba(217,111,60,.14), transparent 26%)" }} /><div className="relative flex w-full max-w-[1400px] flex-col items-center text-center"><div className="serif max-w-[1100px] text-[clamp(2.2rem,5.5vw,6rem)] leading-[1.15] text-[#f8f6ee]">{passage.verses.map((verse) => <span key={verse.verse}><sup className="mr-2 align-super font-sans text-[.26em] font-bold text-[#b6d1bd]">{verse.verse}</sup>{verse.text}{" "}</span>)}</div>{settings.showReference && <div className="mono mt-12 text-[clamp(.65rem,1vw,1rem)] uppercase tracking-[.28em] text-[#b6d1bd]">{reference} · {passage.translation}</div>}</div><div className="absolute bottom-7 left-7 flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-2 text-[10px] text-white/45 opacity-0 transition hover:opacity-100"><MonitorUp size={13} /> Qavah display</div><button onClick={fullScreen} aria-label="Enter fullscreen" className="absolute bottom-7 right-7 rounded-full border border-white/15 bg-black/10 p-2 text-white/45 opacity-0 transition hover:opacity-100"><Maximize size={15} /></button></>}
  </main>;
}

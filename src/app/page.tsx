"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ExternalLink, MonitorUp, Moon, MoreHorizontal, Search, Settings2, Sparkles, Sun, Type } from "lucide-react";
import { findPassage, parseReference, type Passage } from "@/lib/bible";

const channelName = "qavah-projection";
const defaults = { reference: "John 3:16", translation: "KJV", fontSize: 72, align: "center", showReference: true, theme: "forest" };

type HistoryItem = { reference: string; time: string };

export default function Home() {
  const [reference, setReference] = useState(defaults.reference);
  const [translation, setTranslation] = useState(defaults.translation);
  const [passage, setPassage] = useState<Passage>(() => findPassage("John", 3, 16, 16));
  const [history, setHistory] = useState<HistoryItem[]>([
    { reference: "John 3:16", time: "Now" },
    { reference: "Psalm 23:1–6", time: "8:42 PM" },
    { reference: "Philippians 4:6–7", time: "8:34 PM" },
  ]);
  const [settings, setSettings] = useState(defaults);
  const [status, setStatus] = useState("Ready to present");

  const suggestions = useMemo(() => {
    const query = reference.toLowerCase();
    return ["John 3:16", "Psalm 23:1–6", "1 Corinthians 13:4–8", "Philippians 4:6–7"].filter((item) => item.toLowerCase().includes(query) && item !== reference).slice(0, 3);
  }, [reference]);

  function loadReference(value: string, shouldSend = false) {
    const parsed = parseReference(value);
    if (!parsed) return;
    const next = findPassage(parsed.book, parsed.chapter, parsed.verseStart, parsed.verseEnd, translation);
    setReference(value);
    setPassage(next);
    if (shouldSend) sendToProjection(next, value);
  }

  function sendToProjection(nextPassage = passage, nextReference = reference) {
    const payload = { type: "passage", passage: nextPassage, reference: nextReference, settings: { ...settings } };
    if (typeof window !== "undefined" && "BroadcastChannel" in window) new BroadcastChannel(channelName).postMessage(payload);
    setHistory((items) => [{ reference: nextReference, time: "Now" }, ...items.filter((item) => item.reference !== nextReference)].slice(0, 6));
    setStatus("Live on projection");
  }

  useEffect(() => {
    const parsed = parseReference(reference);
    if (!parsed) return;
    const timer = window.setTimeout(() => setPassage(findPassage(parsed.book, parsed.chapter, parsed.verseStart, parsed.verseEnd, translation)), 180);
    return () => window.clearTimeout(timer);
  }, [reference, translation]);

  return (
    <main className="shell flex flex-col">
      <header className="flex h-[76px] items-center justify-between border-b border-[#dfe3dc] bg-[#fbfaf6] px-6 lg:px-10">
        <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2d6a4f] text-white"><Sparkles size={17} /></div><div><div className="text-[17px] font-extrabold tracking-[-.04em]">qavah<span className="text-[#d96f3c]">.</span></div><div className="mono text-[9px] uppercase tracking-[.18em] text-[#89928c]">worship presentation</div></div></div>
        <div className="flex items-center gap-5"><div className="hidden items-center gap-2 text-[11px] text-[#71807a] sm:flex"><span className="h-2 w-2 rounded-full bg-[#4c9b68] shadow-[0_0_0_4px_#e4f1e4]" />{status}</div><button className="flex items-center gap-2 rounded-full border border-[#dfe3dc] bg-white px-3 py-2 text-xs font-semibold text-[#52615a]"><CircleHelp size={14} />Help</button><button className="rounded-full p-2 text-[#52615a] hover:bg-[#eef1eb]" aria-label="Settings"><Settings2 size={17} /></button></div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="w-full border-b border-[#dfe3dc] bg-[#f8f8f3] px-6 py-7 lg:w-[350px] lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
          <div className="mb-7 flex items-center justify-between"><div><p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[#a0aaa3]">Control room</p><h1 className="text-[22px] font-extrabold tracking-[-.04em]">Find a passage</h1></div><span className="rounded-full bg-[#e7eee7] px-2.5 py-1 mono text-[9px] font-medium uppercase tracking-[.14em] text-[#558063]">KJV</span></div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#78847d]" htmlFor="reference">Reference</label>
          <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9da8a1]" size={17} /><input id="reference" value={reference} onChange={(event) => setReference(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendToProjection(); }} className="h-12 w-full rounded-[11px] border border-[#cfd8d0] bg-white pl-11 pr-4 text-sm font-semibold outline-none ring-[#b6d1bd] transition focus:border-[#6e9e7e] focus:ring-4" placeholder="Try John 3:16" /></div>
          {suggestions.length > 0 && <div className="mt-2 overflow-hidden rounded-[11px] border border-[#e0e5df] bg-white shadow-sm">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => loadReference(suggestion)} className="flex w-full items-center justify-between border-b border-[#eef0eb] px-4 py-3 text-left text-xs font-semibold last:border-0 hover:bg-[#f3f7f1]"><span>{suggestion}</span><ArrowUpRight size={13} className="text-[#9caaa0]" /></button>)}</div>}
          <div className="mt-6 flex items-center justify-between border-b border-[#e1e5df] pb-3"><span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#78847d]">Translation</span><select value={translation} onChange={(event) => setTranslation(event.target.value)} className="bg-transparent text-xs font-bold text-[#2d6a4f] outline-none"><option>KJV</option><option>WEB</option></select></div>
          <button onClick={() => sendToProjection()} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#d96f3c] text-sm font-extrabold text-white shadow-[0_5px_0_#b8542b] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_#b8542b] active:translate-y-0 active:shadow-[0_3px_0_#b8542b]"><MonitorUp size={17} />Send to projection</button>
          <div className="mt-10"><div className="mb-4 flex items-center justify-between"><span className="mono text-[10px] font-medium uppercase tracking-[.18em] text-[#a0aaa3]">Recent passages</span><button className="text-[#98a49c]" aria-label="More history"><MoreHorizontal size={17} /></button></div><div className="space-y-1">{history.map((item, index) => <button key={`${item.reference}-${index}`} onClick={() => loadReference(item.reference, true)} className="group flex w-full items-center justify-between rounded-[9px] px-3 py-3 text-left transition hover:bg-[#eaf0e9]"><span className="text-[13px] font-semibold text-[#35443c]">{item.reference}</span><span className="mono text-[9px] text-[#a0aaa3] group-hover:text-[#71807a]">{item.time}</span></button>)}</div></div>
        </aside>

        <section className="flex-1 px-6 py-7 lg:px-12 lg:py-10 xl:px-20">
          <div className="mx-auto max-w-[900px]"><div className="mb-8 flex items-end justify-between"><div><p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[#a0aaa3]">Live preview</p><h2 className="text-[25px] font-extrabold tracking-[-.05em]">{passage.book} {passage.chapter}:{passage.verseStart}{passage.verseEnd !== passage.verseStart ? `–${passage.verseEnd}` : ""}</h2></div><div className="flex items-center gap-2"><button className="rounded-full border border-[#dfe3dc] p-2 text-[#6c7a72] hover:bg-white" aria-label="Previous passage"><ChevronLeft size={16} /></button><button className="rounded-full border border-[#dfe3dc] p-2 text-[#6c7a72] hover:bg-white" aria-label="Next passage"><ChevronRight size={16} /></button></div></div>
            <div className="fade-up relative min-h-[380px] overflow-hidden rounded-[14px] bg-[#1e3d32] px-8 py-12 text-center text-[#f8f6ee] shadow-[0_16px_40px_rgba(38,64,53,.12)] lg:px-24 lg:py-16"><div className="absolute left-0 top-0 h-1 w-1/3 bg-[#d96f3c]" /><div className="absolute right-0 top-0 h-1 w-1/3 bg-[#b6d1bd]" /><div className="relative flex min-h-[280px] flex-col items-center justify-center"><div className="serif max-w-[690px] text-[32px] leading-[1.18] lg:text-[45px]">{passage.verses.map((verse) => <span key={verse.verse}><sup className="mr-1 align-super font-sans text-[12px] font-bold text-[#b6d1bd]">{verse.verse}</sup>{verse.text}{" "}</span>)}</div><div className="mono mt-10 text-[10px] uppercase tracking-[.24em] text-[#b6d1bd]">{passage.book} {passage.chapter}:{passage.verseStart}{passage.verseEnd !== passage.verseStart ? `–${passage.verseEnd}` : ""} · {translation}</div></div></div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe3dc] pb-6"><div className="flex items-center gap-3 text-xs text-[#71807a]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#4c9b68]" />Projection connected</span><span className="h-4 w-px bg-[#d5dcd5]" /><button onClick={() => window.open("/projection", "Qavah Projection", "width=1200,height=800")} className="flex items-center gap-1.5 font-semibold text-[#2d6a4f] hover:underline">Open display <ExternalLink size={13} /></button></div><button onClick={() => setSettings((current) => ({ ...current, showReference: !current.showReference }))} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${settings.showReference ? "border-[#b6d1bd] bg-[#edf5ed] text-[#2d6a4f]" : "border-[#dfe3dc] text-[#71807a]"}`}><Type size={14} />Reference {settings.showReference ? "on" : "off"}</button></div>
            <div className="mt-6 flex items-center justify-between"><span className="mono text-[10px] uppercase tracking-[.18em] text-[#a0aaa3]">Display settings</span><div className="flex items-center gap-2"><button onClick={() => setSettings((current) => ({ ...current, theme: current.theme === "forest" ? "night" : "forest" }))} className="rounded-full border border-[#dfe3dc] p-2 text-[#71807a] hover:bg-white" aria-label="Toggle display theme">{settings.theme === "forest" ? <Moon size={15} /> : <Sun size={15} />}</button><button className="rounded-full border border-[#dfe3dc] p-2 text-[#71807a] hover:bg-white" aria-label="More display settings"><ChevronDown size={15} /></button></div></div>
          </div>
        </section>
      </div>
    </main>
  );
}

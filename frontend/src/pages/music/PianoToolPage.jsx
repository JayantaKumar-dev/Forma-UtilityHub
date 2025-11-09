// src/pages/music/PianoToolPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Speaker,
  Music,
  ToggleLeft,
  Disc,
  RotateCw,
  Play,
  RefreshCw,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/*
  Full updated PianoToolPage.jsx
  - Option D: responsive, rotate prompt, fullscreen attempt after user gesture
  - Improved visuals: stronger shadows, pressed color, 3D feel
  - Reduce accidental black-key taps by careful hit areas and z-index
  - Exact container width to prevent blank sliding
  - Scroll-snap for nicer UX on mobile
  - Sustain behavior refined and Release All stops everything immediately
*/

/* ---------- Constants & helpers ---------- */
const ALL_MIDI = Array.from({ length: 88 }, (_, i) => 21 + i);
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const ALL_NOTES = ALL_MIDI.map((m) => {
  const o = Math.floor(m / 12) - 1;
  return `${NOTE_NAMES[m % 12]}${o}`;
});

const COMPUTER_KEY_MAP = {
  z: "C3", s: "C#3", x: "D3", d: "D#3", c: "E3", v: "F3", g: "F#3", b: "G3", h: "G#3", n: "A3", j: "A#3", m: "B3",
  q: "C4", "2": "C#4", w: "D4", "3": "D#4", e: "E4", r: "F4", "5": "F#4", t: "G4", "6": "G#4", y: "A4", "7": "A#4", u: "B4",
  i: "C5", "9": "C#5", o: "D5", "0": "D#5", p: "E5"
};

const CLASSIC_BASE =
  "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/master/FluidR3_GM/acoustic_grand_piano-mp3/";
const CLASSIC_MAP = { A0: "A0.mp3", C1: "C1.mp3", C2: "C2.mp3", C3: "C3.mp3", C4: "C4.mp3", C5: "C5.mp3", C6: "C6.mp3", C7: "C7.mp3", C8: "C8.mp3" };

/* ---------- UI subcomponents ---------- */
function WhiteKey({ shifted, active, onPointerDown, onPointerUp, theme, showLabel }) {
  const visualClass = theme === "neon"
    ? "bg-gradient-to-b from-slate-100 to-zinc-100 border border-zinc-300 shadow-[0_6px_12px_rgba(0,0,0,0.22)]"
    : theme === "realistic"
      ? "bg-gradient-to-b from-[#fffffa] to-[#eae0c9] border border-[#c8b89f] shadow-[0_8px_16px_rgba(0,0,0,0.32)]"
      : "bg-gradient-to-b from-white to-slate-100 border border-gray-300 shadow-[0_6px_12px_rgba(0,0,0,0.18)]";

  // white key has a slightly wider hit area and scroll-snap alignment
  return (
    <div style={{ width: 64 }} className="relative select-none scroll-snap-align-start">
      {/* small invisible lower hit area helps prevent accidental black key presses */}
      <div className="absolute inset-x-0 -bottom-3 h-6" />
      <motion.div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        whileTap={{ y: 8, scale: 0.994 }}
        animate={{ y: active ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={`${visualClass} h-56 rounded-b-xl flex items-end justify-center pb-2 relative`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {showLabel && <div className="text-[11px] text-gray-700 pb-1 pointer-events-none">{shifted}</div>}
        {active && <div className="absolute inset-0 rounded-b-xl bg-indigo-200/28 pointer-events-none" />}
      </motion.div>
    </div>
  );
}

function BlackKey({ shifted, active, onPointerDown, onPointerUp, theme }) {
  const visualClass = theme === "realistic"
    ? "bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a] shadow-[0_6px_16px_rgba(0,0,0,0.7)]"
    : theme === "neon"
      ? "bg-gradient-to-b from-black to-zinc-900 shadow-[0_6px_18px_rgba(0,0,0,0.75)]"
      : "bg-gradient-to-b from-zinc-900 to-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.65)]";

  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      whileTap={{ y: 8 }}
      animate={{ y: active ? 8 : 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${visualClass} absolute -top-2 left-[62%] -translate-x-1/2 h-40 w-12 rounded-md flex items-end justify-center text-white pointer-events-auto`}
      style={{ zIndex: 40 }}
    >
      <div className="text-[10px] pb-1 pointer-events-none">{shifted}</div>
      {active && <div className="absolute inset-0 rounded-md bg-indigo-200/20 pointer-events-none" />}
    </motion.div>
  );
}

/* ---------- Orientation / fullscreen helpers ---------- */
function useMobileLandscapePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    const check = () => {
      const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);
      const portrait = window.matchMedia && window.matchMedia("(orientation: portrait)").matches;
      setShowPrompt(isMobile && portrait);
    };
    check();
    window.addEventListener("orientationchange", check);
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("orientationchange", check); window.removeEventListener("resize", check); };
  }, []);
  return { showPrompt, setShowPrompt };
}

async function requestLandscape() {
  try {
    if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    if (screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape");
  } catch (e) {
    // ignore — many browsers disallow programmatic lock
  }
}

/* ---------- Main component ---------- */
export default function PianoToolPage() {
  const { showPrompt, setShowPrompt } = useMobileLandscapePrompt();

  const [contextStarted, setContextStarted] = useState(false);
  const [instrument, setInstrument] = useState("classic");
  const [useSampler, setUseSampler] = useState(true);
  const [sustain, setSustain] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [octaveOffset, setOctaveOffset] = useState(0);
  const [theme, setTheme] = useState("modern"); // modern | neon | realistic
  const [reverbWet, setReverbWet] = useState(0.12);
  const [showLabels, setShowLabels] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Loading audio...");

  const samplerRef = useRef(null);
  const synthRef = useRef(null);
  const masterGainRef = useRef(null);
  const reverbRef = useRef(null);
  const pointerMapRef = useRef({});
  const scrollRef = useRef(null);

  const whiteNotes = useMemo(() => ALL_NOTES.filter((n) => !n.includes("#")), []);
  const whiteKeyWidth = 64; // px, used to compute exact container width
  const containerWidth = whiteNotes.length * whiteKeyWidth;

  const hasSharpAfter = (whiteNote) => {
    const n = whiteNote.slice(0, -1);
    return !(n === "E" || n === "B");
  };

  /* ---------- Audio init ---------- */
  useEffect(() => {
    masterGainRef.current = new Tone.Gain(volume).toDestination();
    reverbRef.current = new Tone.Reverb({ decay: 2.6, wet: reverbWet }).connect(masterGainRef.current);

    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.12, sustain: 0.7, release: 1.2 }
    }).connect(reverbRef.current);

    return () => {
      try { samplerRef.current?.dispose?.(); synthRef.current?.dispose?.(); reverbRef.current?.dispose?.(); masterGainRef.current?.dispose?.(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingSamples(true);
    setStatusMsg("Loading instrument...");

    try { samplerRef.current?.dispose?.(); synthRef.current?.dispose?.(); samplerRef.current = null; synthRef.current = null; } catch (e) {}

    const build = async () => {
      try {
        if (instrument === "classic") {
          const s = new Tone.Sampler({
            urls: CLASSIC_MAP,
            baseUrl: CLASSIC_BASE,
            release: 1.6,
            onload: () => {
              if (cancelled) return;
              samplerRef.current = s.connect(reverbRef.current);
              setLoadingSamples(false);
              setStatusMsg("Classic piano ready");
              setUseSampler(true);
            }
          });
          // sampler loads asynchronously
        } else {
          // synth presets for other instruments
          const preset = buildSynthPreset(instrument);
          preset.connect(reverbRef.current);
          synthRef.current = preset;
          setLoadingSamples(false);
          setUseSampler(false);
          setStatusMsg(`${instrument.charAt(0).toUpperCase() + instrument.slice(1)} preset ready`);
        }
      } catch (err) {
        console.error("Instrument init failed:", err);
        setStatusMsg("Instrument failed: using fallback synth");
        const fallback = buildSynthPreset("electric");
        fallback.connect(reverbRef.current);
        synthRef.current = fallback;
        setUseSampler(false);
        setLoadingSamples(false);
      }
    };

    build();
    return () => { cancelled = true; };
  }, [instrument, reverbWet]);

  useEffect(() => {
    if (masterGainRef.current) {
      try { masterGainRef.current.gain.rampTo(volume, 0.05); } catch (e) { try { masterGainRef.current.gain.value = volume; } catch {} }
    }
  }, [volume]);

  useEffect(() => {
    if (reverbRef.current) {
      try { reverbRef.current.wet.value = reverbWet; } catch {}
    }
  }, [reverbWet]);

  function buildSynthPreset(id) {
    if (id === "electric") {
      const synth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 16,
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.005, decay: 0.15, sustain: 0.7, release: 0.8 },
      });
      const chorus = new Tone.Chorus(1.5, 2.5, 0.2).start();
      synth.connect(chorus);
      return synth;
    }
    if (id === "harpsichord") {
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3, modulationIndex: 5,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0.2, release: 0.15 }
      });
    }
    if (id === "organ") {
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.9, release: 0.6 }
      });
    }
    if (id === "upright") {
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.25, sustain: 0.7, release: 1.0 }
      });
    }
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.12, sustain: 0.7, release: 1.2 }
    });
  }

  /* ---------- Audio helpers ---------- */
  async function ensureAudioStarted() {
    if (!contextStarted) {
      try {
        await Tone.start();
        setContextStarted(true);
        setStatusMsg("Audio unlocked");
      } catch (err) {
        console.warn("Audio start blocked", err);
      }
    }
  }

  const shiftNote = (note, offset) => {
    const match = note.match(/([A-G]#?)(\d)/);
    if (!match) return note;
    const [, n, o] = match;
    return `${n}${parseInt(o, 10) + offset}`;
  };

  const noteOn = async (note, velocity = 0.95) => {
    await ensureAudioStarted();
    const target = shiftNote(note, octaveOffset);

    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.add(target);
      return next;
    });

    if (instrument === "classic" && samplerRef.current && samplerRef.current.loaded) {
      try { samplerRef.current.triggerAttack(target, Tone.now(), velocity); return; } catch (e) {}
    }

    try { synthRef.current?.triggerAttack(target, Tone.now(), velocity); } catch (e) { console.warn(e); }
  };

  const noteOff = (note) => {
    const target = shiftNote(note, octaveOffset);

    setActiveNotes((prev) => {
      const next = new Set(prev);
      if (!sustain) next.delete(target);
      return next;
    });

    if (instrument === "classic" && samplerRef.current && samplerRef.current.loaded) {
      try { samplerRef.current.triggerRelease(target, Tone.now()); } catch (e) {}
    } else {
      try { synthRef.current?.triggerRelease(target, Tone.now()); } catch (e) {}
    }
  };

  const releaseAll = () => {
    Array.from(activeNotes).forEach((n) => {
      try {
        if (instrument === "classic" && samplerRef.current && samplerRef.current.loaded) samplerRef.current.triggerRelease(n);
        else synthRef.current?.triggerRelease?.(n);
      } catch {}
    });
    // Clear active notes immediately (Release All should always stop sound)
    setActiveNotes(new Set());
  };

  /* ---------- Input handling ---------- */
  const handlePointerDown = async (e, note) => {
    await ensureAudioStarted();
    const id = e.pointerId ?? "mouse";
    pointerMapRef.current[id] = note;
    const velocity = (typeof e.pressure === "number" && e.pressure > 0) ? e.pressure : 1;
    noteOn(note, velocity);
    try { e.target.setPointerCapture?.(id); } catch {}
  };

  const handlePointerUp = (e) => {
    const id = e?.pointerId ?? "mouse";
    const n = pointerMapRef.current[id];
    if (n) {
      if (!sustain) noteOff(n);
      delete pointerMapRef.current[id];
    }
    try { e?.target?.releasePointerCapture?.(id); } catch {}
  };

  useEffect(() => {
    const onKeyDown = async (ev) => {
      await ensureAudioStarted();
      const k = String(ev.key).toLowerCase();
      if (COMPUTER_KEY_MAP[k]) {
        const note = COMPUTER_KEY_MAP[k];
        if (!activeNotes.has(shiftNote(note, octaveOffset))) noteOn(note);
      }
      if (k === " ") { ev.preventDefault(); setSustain((s) => !s); }
      if (k === "arrowleft") scrollRef.current?.scrollBy({ left: -whiteKeyWidth * 4, behavior: "smooth" });
      if (k === "arrowright") scrollRef.current?.scrollBy({ left: whiteKeyWidth * 4, behavior: "smooth" });
    };
    const onKeyUp = (ev) => {
      const k = String(ev.key).toLowerCase();
      if (COMPUTER_KEY_MAP[k]) noteOff(COMPUTER_KEY_MAP[k]);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument, octaveOffset, sustain, activeNotes]);

  /* ---------- Test sound ---------- */
  const testSound = async () => {
    await ensureAudioStarted();
    setStatusMsg("Playing test notes...");
    const notes = ["C4", "E4", "G4", "C5"];
    notes.forEach((n, i) => {
      setTimeout(() => noteOn(n, 0.9), i * 160);
      setTimeout(() => noteOff(n), i * 160 + 420);
    });
    setTimeout(() => setStatusMsg("Ready"), notes.length * 220 + 200);
  };

  /* ---------- Scroll helpers ---------- */
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -whiteKeyWidth * 4, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: whiteKeyWidth * 4, behavior: "smooth" });

  /* ---------- Render ---------- */
  return (
    <motion.div className={`min-h-screen p-4 ${theme === "neon" ? "bg-gradient-to-br from-black via-slate-900 to-zinc-900" : theme === "realistic" ? "bg-gradient-to-b from-[#efe8df] to-[#f8f6f3]" : "bg-gradient-to-b from-slate-50 to-white"}`}>
      <div className="max-w-7xl mx-auto">
        <Card className={`rounded-2xl shadow-2xl overflow-hidden border ${theme === "neon" ? "border-zinc-800" : "border-gray-200"}`}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4" style={{ background: theme === "realistic" ? "linear-gradient(90deg,#fff8f0,#f0ece7)" : "linear-gradient(90deg,#f5f7ff,#eef2ff)" }}>
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 ${theme === "neon" ? "bg-gradient-to-br from-indigo-900 to-purple-900" : "bg-gradient-to-br from-indigo-200 to-indigo-100"} shadow-md`}>
                <Music className={`w-6 h-6 ${theme === "neon" ? "text-white" : "text-indigo-700"}`} />
              </div>
              <div>
                <CardTitle className="text-lg font-medium">Virtual Piano</CardTitle>
                <div className="text-sm text-gray-600">88 keys · multi-instruments · mobile & keyboard ready</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1 shadow-sm">
                <Speaker className="w-4 h-4 text-gray-600" />
                <input aria-label="volume" type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
              </div>

              <select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="py-1 px-2 rounded-md border" title="Instrument">
                <option value="classic">Classic Piano</option>
                <option value="upright">Upright</option>
                <option value="electric">Electric</option>
                <option value="harpsichord">Harpsichord</option>
                <option value="organ">Organ</option>
              </select>

              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="py-1 px-2 rounded-md border" title="Theme">
                <option value="modern">Modern</option>
                <option value="neon">Neon</option>
                <option value="realistic">Realistic</option>
              </select>

              <Button onClick={() => setUseSampler(s => !s)} variant="ghost" className="px-3"><ToggleLeft className="mr-2 h-4 w-4" /> {useSampler ? "Sampler" : "Synth"}</Button>
              <Button onClick={() => setSustain(s => !s)} variant={sustain ? "default" : "outline"}><Disc className="mr-2 h-4 w-4" /> {sustain ? "Sustain On" : "Sustain Off"}</Button>
              <Button onClick={() => { setLoadingSamples(true); setStatusMsg("Reloading..."); setInstrument(instrument); }} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Reload</Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button onClick={() => setOctaveOffset(o => Math.max(o - 1, -4))} size="sm"><ArrowLeft /></Button>
                <div className="px-3 py-1 rounded bg-gray-100 border">Octave: {octaveOffset}</div>
                <Button onClick={() => setOctaveOffset(o => Math.min(o + 1, 4))} size="sm"><ArrowRight /></Button>
                <div className="ml-3 text-sm text-gray-600 hidden sm:block">Tip: use z/x/c... or tap keys (multi-touch). Space toggles sustain.</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-white shadow-sm"><SunMedium className="w-4 h-4 text-amber-500" /><input title="Reverb" type="range" min={0} max={0.6} step={0.01} value={reverbWet} onChange={(e) => setReverbWet(parseFloat(e.target.value))} /></div>
                <div className="text-xs text-gray-500 px-3 py-1 rounded bg-white shadow-sm">{statusMsg}</div>
                <Button onClick={testSound} size="sm" variant="outline"><Play className="mr-2" />Test</Button>
              </div>
            </div>

            {/* Rotate prompt modal */}
            {showPrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-4 max-w-sm w-full text-center shadow-xl">
                  <div className="text-lg font-semibold mb-2">Rotate your device</div>
                  <div className="text-sm text-gray-600 mb-4">Landscape mode gives the best piano experience. You can try full-screen mode to lock orientation (may not work on all browsers).</div>
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => setShowPrompt(false)} variant="outline">Dismiss</Button>
                    <Button onClick={async () => { await requestLandscape(); setShowPrompt(false); }}><RotateCw className="mr-2" />Try Fullscreen</Button>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="relative">
              <button onClick={scrollLeft} aria-label="scroll-left" className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 rounded-full shadow hover:scale-105 transition hidden sm:inline-flex"><ArrowLeft /></button>

              <div ref={scrollRef} className="overflow-x-auto no-scrollbar py-4" style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}>
                <div style={{ width: containerWidth }} className="relative">
                  <div className="flex relative" style={{ position: "relative" }}>
                    {whiteNotes.map((whiteNote, idx) => {
                      const octave = parseInt(whiteNote.slice(-1), 10);
                      const name = whiteNote.slice(0, -1);
                      const hasSharp = hasSharpAfter(whiteNote);
                      const blackName = hasSharp ? `${name}#${octave}` : null;

                      const shiftedWhite = shiftNote(whiteNote, octaveOffset);
                      const whiteActive = activeNotes.has(shiftedWhite);

                      return (
                        <div key={`${whiteNote}-${idx}`} style={{ width: whiteKeyWidth }} className="relative scroll-snap-align-start">
                          <WhiteKey shifted={shiftedWhite} active={whiteActive} onPointerDown={(e) => handlePointerDown(e, whiteNote)} onPointerUp={handlePointerUp} theme={theme} showLabel={showLabels} />

                          {hasSharp && (
                            <BlackKey shifted={shiftNote(blackName, octaveOffset)} active={activeNotes.has(shiftNote(blackName, octaveOffset))} onPointerDown={(e) => handlePointerDown(e, blackName)} onPointerUp={handlePointerUp} theme={theme} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button onClick={scrollRight} aria-label="scroll-right" className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/90 rounded-full shadow hover:scale-105 transition hidden sm:inline-flex"><ArrowRight /></button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={releaseAll}><Play className="mr-2" /> Release All</Button>
                <div className="text-sm text-gray-600">Keyboard: z/x/c ... · Click anywhere to unlock audio</div>
              </div>
              <div className="text-xs text-gray-400">Built with Tone.js — Classic uses sampled piano; other instruments use synth presets.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

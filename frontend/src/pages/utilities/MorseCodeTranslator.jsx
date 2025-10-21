import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Volume2, RefreshCw, Code } from "lucide-react";

export default function MorseCodeTranslator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("text-to-morse");
  const [message, setMessage] = useState("");

  const morseMap = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---",
    "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.", " ": "/",
  };
  const textMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

  const translate = () => {
    if (!input.trim()) {
      setMessage("⚠️ Please enter text to translate!");
      return;
    }

    let result = "";
    if (mode === "text-to-morse") {
      result = input
        .toUpperCase()
        .split("")
        .map((char) => morseMap[char] || "")
        .join(" ");
    } else {
      result = input
        .split(" ")
        .map((code) => textMap[code] || "")
        .join("");
    }

    setOutput(result);
    setMessage("✅ Translation complete!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setMessage("📋 Copied to clipboard!");
  };

  const handlePlay = () => {
    if (!output) {
      setMessage("⚠️ Nothing to play!");
      return;
    }
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const unit = 0.15;

    const playBeep = (duration) => {
      const oscillator = audioCtx.createOscillator();
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    };

    let time = 0;
    for (let symbol of output) {
      if (symbol === ".") {
        playBeep(unit);
      } else if (symbol === "-") {
        playBeep(unit * 3);
      }
      time += unit * 2;
    }
    setMessage("🔊 Playing Morse code...");
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setMessage("🔄 Reset successful!");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-full max-w-4xl bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Code className="w-10 h-10 text-pink-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Morse Code Translator</h2>
          <p className="text-gray-200 text-sm sm:text-base">
            Convert between text and Morse code easily 🔤
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={() => setMode("text-to-morse")}
            className={`${
              mode === "text-to-morse"
                ? "bg-pink-400 text-black"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            Text ➜ Morse
          </Button>
          <Button
            onClick={() => setMode("morse-to-text")}
            className={`${
              mode === "morse-to-text"
                ? "bg-pink-400 text-black"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            Morse ➜ Text
          </Button>
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter ${mode === "text-to-morse" ? "text" : "morse"} here...`}
          className="w-full p-3 rounded-lg text-black bg-white/90 border border-gray-300 mb-4"
          rows={4}
        />

        {/* Output */}
        <textarea
          value={output}
          readOnly
          placeholder="Your result will appear here..."
          className="w-full p-3 rounded-lg text-black bg-gray-100 border border-gray-300 mb-4"
          rows={4}
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={translate} className="bg-pink-400 hover:bg-pink-300 text-black">
            Translate
          </Button>
          <Button onClick={handleCopy} variant="outline" className="bg-yellow-400 text-black border-white/40">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button onClick={handlePlay} className="bg-green-400 hover:bg-green-300 text-black">
            <Volume2 className="w-4 h-4 mr-2" /> Play
          </Button>
          <Button onClick={handleReset} variant="outline" className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Message */}
        {message && (
          <motion.p
            className="text-center mt-4 text-yellow-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

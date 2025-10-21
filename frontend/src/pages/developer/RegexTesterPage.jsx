import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Check, ClipboardCopy, RefreshCw, Zap, Regex } from "lucide-react";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Flag states
  const [globalFlag, setGlobalFlag] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [multiline, setMultiline] = useState(false);

  // Combine flags dynamically
  const updateFlags = (g, i, m) => {
    const newFlags = `${g ? "g" : ""}${i ? "i" : ""}${m ? "m" : ""}`;
    setFlags(newFlags || ""); // if none selected
  };

  // 🧠 Test Regex and highlight matches
  const handleTest = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testString.matchAll(regex)];

      if (matches.length === 0) {
        setError("⚠️ No matches found!");
        setResult(testString);
        return;
      }

      // Highlight matches
      let highlighted = testString;
      const sorted = matches.sort((a, b) => b.index - a.index);
      sorted.forEach((m) => {
        const start = m.index;
        const end = start + m[0].length;
        highlighted =
          highlighted.slice(0, start) +
          `<mark class='bg-yellow-400 text-black font-semibold rounded px-1'>${m[0]}</mark>` +
          highlighted.slice(end);
      });

      setResult(highlighted);
      setError(`✅ Found ${matches.length} match(es)!`);
    } catch (err) {
      setError(`❌ Invalid Regex: ${err.message}`);
      setResult("");
    }
  };

  // 📋 Copy all matches
  const handleCopy = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      if (!matches) {
        setError("⚠️ No matches to copy!");
        return;
      }
      navigator.clipboard.writeText(matches.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("❌ Invalid regex pattern!");
    }
  };

  // 🔄 Clear all
  const handleClear = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
    setResult("");
    setError("");
    setGlobalFlag(true);
    setIgnoreCase(false);
    setMultiline(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <Regex className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Regex Tester & Highlighter</h2>
          <p className="text-sm text-white mb-6 text-center">
            Test, Highlight & Copy your Regex Matches ⚡
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter regex pattern (e.g. \\d+)"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white/40 text-black border border-white/30 focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        {/* Flag Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <label className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/30 transition">
            <input
              type="checkbox"
              checked={globalFlag}
              onChange={() => {
                setGlobalFlag(!globalFlag);
                updateFlags(!globalFlag, ignoreCase, multiline);
              }}
            />
            <span className="text-sm">Global (g)</span>
          </label>
          <label className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/30 transition">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={() => {
                setIgnoreCase(!ignoreCase);
                updateFlags(globalFlag, !ignoreCase, multiline);
              }}
            />
            <span className="text-sm">Case-insensitive (i)</span>
          </label>
          <label className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/30 transition">
            <input
              type="checkbox"
              checked={multiline}
              onChange={() => {
                setMultiline(!multiline);
                updateFlags(globalFlag, ignoreCase, !multiline);
              }}
            />
            <span className="text-sm">Multiline (m)</span>
          </label>
        </div>

        {/* Test String Input */}
        <Textarea
          placeholder="Enter your test string here..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-40 focus:ring-2 focus:ring-yellow-300"
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={handleTest} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            <Zap className="w-4 h-4 mr-2" /> Test
          </Button>
          <Button onClick={handleCopy} className="bg-green-400 hover:bg-green-300 text-black">
            <ClipboardCopy className="w-4 h-4 mr-2" /> Copy Matches
          </Button>
          <Button onClick={handleClear} variant="outline" className="text-black border-white/40 hover:bg-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Error or Status */}
        {error && (
          <motion.p
            className={`text-sm text-center mb-3 px-3 ${
              error.includes("✅") ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Result Display */}
        {result && (
          <motion.div
            className="relative bg-white/10 p-4 rounded-lg text-sm text-left text-gray-100 font-mono max-h-64 overflow-y-auto overflow-x-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="whitespace-pre-wrap break-words pr-10"
              dangerouslySetInnerHTML={{ __html: result }}
            ></div>

            {/* Copy Button in corner */}
            <div className="absolute top-3 right-3 z-10">
              <Button
                size="sm"
                variant="ghost"
                className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

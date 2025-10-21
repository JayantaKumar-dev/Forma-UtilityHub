import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, Check, RefreshCw, Type } from "lucide-react";

export default function TextUtilitiesPage() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ words: 0, chars: 0, sentences: 0, paragraphs: 0 });
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // === Calculate Stats ===
  const calculateStats = (input) => {
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const chars = input.length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = input.split(/\n+/).filter(Boolean).length;
    setStats({ words, chars, sentences, paragraphs });
  };

  // === Handle Input Change ===
  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    calculateStats(val);
  };

  // === Transformations ===
  const toUpperCase = () => {
    if (!text.trim()) return setMessage("⚠️ Please enter some text first!");
    setText(text.toUpperCase());
    setMessage("✅ Converted to UPPERCASE.");
  };

  const toLowerCase = () => {
    if (!text.trim()) return setMessage("⚠️ Please enter some text first!");
    setText(text.toLowerCase());
    setMessage("✅ Converted to lowercase.");
  };

  const toTitleCase = () => {
    if (!text.trim()) return setMessage("⚠️ Please enter some text first!");
    setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()));
    setMessage("✅ Converted to Title Case.");
  };

  const removeExtraSpaces = () => {
    if (!text.trim()) return setMessage("⚠️ Please enter some text first!");
    setText(text.replace(/\s+/g, " ").trim());
    setMessage("✅ Removed extra spaces.");
  };

  const handleClear = () => {
    setText("");
    setStats({ words: 0, chars: 0, sentences: 0, paragraphs: 0 });
    setMessage("🧹 Cleared all text!");
  };

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setMessage("✅ Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-4xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <Type className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Text Utilities Suite ✍️</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Transform, clean, and analyze your text instantly ✨
          </p>
        </div>

        {/* Text Area */}
        <Textarea
          placeholder="Enter or paste your text here..."
          value={text}
          onChange={handleChange}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-48 resize-none"
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={toUpperCase} className="bg-blue-500 hover:bg-blue-400 text-black">
            UPPERCASE
          </Button>
          <Button onClick={toLowerCase} className="bg-blue-500 hover:bg-blue-400 text-black">
            lowercase
          </Button>
          <Button onClick={toTitleCase} className="bg-indigo-400 hover:bg-indigo-300 text-black">
            Title Case
          </Button>
          <Button onClick={removeExtraSpaces} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            Remove Spaces
          </Button>
          <Button onClick={handleCopy} className="bg-green-400 hover:bg-green-300 text-black">
            {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
          </Button>
          <Button onClick={handleClear} className="bg-red-400 hover:bg-red-300 text-black">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Feedback Message */}
        {message && (
          <motion.p
            className={`text-sm text-center mb-3 ${
              message.includes("✅") ? "text-green-300" : "text-yellow-200"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center bg-white/10 rounded-lg p-4 shadow-inner"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-gray-200 text-sm">Words</p>
            <p className="text-xl font-bold text-blue-300">{stats.words}</p>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Characters</p>
            <p className="text-xl font-bold text-green-300">{stats.chars}</p>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Sentences</p>
            <p className="text-xl font-bold text-yellow-300">{stats.sentences}</p>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Paragraphs</p>
            <p className="text-xl font-bold text-pink-300">{stats.paragraphs}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

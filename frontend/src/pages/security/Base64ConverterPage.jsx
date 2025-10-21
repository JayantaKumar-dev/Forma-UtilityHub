import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, Shield } from "lucide-react";

export default function Base64ConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode"); // "encode" or "decode"
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    if (!input.trim()) {
      setError("⚠️ Please enter text to convert.");
      return;
    }
    try {
      let result = "";
      if (mode === "encode") {
        result = btoa(unescape(encodeURIComponent(input))); // Encode to Base64
      } else {
        result = decodeURIComponent(escape(atob(input))); // Decode from Base64
      }
      setOutput(result);
      setError("");
    } catch (err) {
      setOutput("");
      setError("❌ Invalid Base64 input! Unable to decode.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
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
          <Shield className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">
            Base64 Encoder & Decoder
          </h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Encode or decode text instantly ⚙️
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="encode"
              checked={mode === "encode"}
              onChange={() => setMode("encode")}
              className="accent-yellow-400 scale-125"
            />
            <span>Encode</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="decode"
              checked={mode === "decode"}
              onChange={() => setMode("decode")}
              className="accent-yellow-400 scale-125"
            />
            <span>Decode</span>
          </label>
        </div>

        {/* Input Text */}
        <Textarea
          placeholder="Enter text or Base64 string here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-40"
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button
            onClick={handleConvert}
            className="bg-yellow-400 hover:bg-yellow-300 text-black"
          >
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            className={`text-sm text-center mb-3 ${
              error.includes("❌") ? "text-red-300" : "text-yellow-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Output Box */}
        {output && (
          <motion.div
            className="relative bg-white/10 p-4 rounded-lg text-sm text-left text-gray-100 font-mono overflow-auto max-h-64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <pre className="whitespace-pre-wrap break-words">{output}</pre>

            {/* Copy Button */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-3 right-3 text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

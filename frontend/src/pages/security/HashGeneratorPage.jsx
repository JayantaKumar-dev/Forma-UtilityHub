import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, Check, RefreshCw, KeyRound } from "lucide-react";
import md5 from "js-md5";

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("MD5");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleHash = async () => {
    setCopied(false);
    setOutput("");
    setMessage("");

    if (!input.trim()) {
      setMessage("❌ Please enter text to hash.");
      return;
    }

    try {
      if (algorithm === "MD5") {
        const hash = md5(input);
        setOutput(hash);
        setMessage("✅ MD5 hash generated.");
      } else if (algorithm === "SHA-256") {
        const enc = new TextEncoder();
        const data = enc.encode(input);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        setOutput(hashHex);
        setMessage("✅ SHA-256 hash generated.");
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  const handleCopy = () => {
    if (!output) {
      setMessage("❌ Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopied(true);
    setMessage("✅ Copied to clipboard.");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMessage("");
    setCopied(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <KeyRound className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Hash Generator</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Generate <span className="text-yellow-300">{algorithm}</span> hash for your text ⚙️
          </p>
        </div>

        <Textarea
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-6 h-32"
        />

        {/* 🔀 Toggle Switch for Algorithm */}
        <div className="flex justify-center items-center mb-6">
          <span className="mr-3 text-sm font-semibold text-yellow-200">MD5</span>

          <div
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition ${
              algorithm === "SHA-256" ? "bg-green-400" : "bg-yellow-400"
            }`}
            onClick={() => setAlgorithm(algorithm === "MD5" ? "SHA-256" : "MD5")}
          >
            <motion.div
              className="absolute bg-white w-6 h-6 rounded-full shadow-md"
              animate={{
                x: algorithm === "SHA-256" ? 28 : 2,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>

          <span className="ml-3 text-sm font-semibold text-green-200">SHA-256</span>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={handleHash}
            className="bg-blue-400 hover:bg-blue-300 text-black transition"
          >
            Generate
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-black border-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {message && (
          <motion.p
            className={`text-sm text-center mb-3 ${
              message.startsWith("✅") ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {output && (
          <motion.div
            className="relative bg-white/10 p-4 rounded-lg text-sm text-gray-100 font-mono overflow-x-auto whitespace-pre-wrap break-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <pre>{output}</pre>
            <Button
              size="sm"
              variant="ghost"
              className="fixed bottom-6 right-6 text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

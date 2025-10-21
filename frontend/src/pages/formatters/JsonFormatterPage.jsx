import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ClipboardCopy, Check, RefreshCw, Code, Zap } from "lucide-react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // 🧩 Auto-fix for common JSON issues
  const autoFixJson = (str) => {
    return str
      .replace(/'/g, '"') // convert single quotes to double quotes
      .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
      .replace(/:\s*([a-zA-Z0-9_]+)(\s*[},])/g, ':"$1"$2'); // add quotes around unquoted values
  };

  // 🧠 Beautify JSON
  const handleBeautify = () => {
    try {
      const fixed = autoFixJson(input);
      const formatted = JSON.stringify(JSON.parse(fixed), null, 2);
      setOutput(formatted);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // 🔒 Minify JSON
  const handleMinify = () => {
    try {
      const fixed = autoFixJson(input);
      const minified = JSON.stringify(JSON.parse(fixed));
      setOutput(minified);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // ✅ Validate JSON + show line/column of error
  const handleValidate = () => {
    try {
      JSON.parse(input);
      setError("✅ JSON is valid!");
      setOutput("");
    } catch (err) {
      handleError(err);
    }
  };

  // 🧠 Error handler with line & column detection
  const handleError = (err) => {
    const message = err.message;
    const match = message.match(/position (\d+)/);
    let detailedError = "❌ Invalid JSON!";

    if (match) {
      const pos = Number(match[1]);
      const lines = input.substring(0, pos).split("\n");
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      detailedError = `❌ Invalid JSON at line ${line}, column ${col}. (${message})`;
    } else {
      detailedError = `❌ ${message}`;
    }

    setError(detailedError);
    setOutput("");
  };

  // 📋 Copy output
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔄 Clear everything
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
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
          <Code className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">JSON Formatter & Validator</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Beautify, Minify, Validate & Auto-fix your JSON ⚡
          </p>
        </div>

        {/* Input Area */}
        <Textarea
          placeholder="Paste or write your JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-48 focus:ring-2 focus:ring-yellow-300"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={handleBeautify} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            Beautify
          </Button>
          <Button onClick={handleMinify} className="bg-green-400 hover:bg-green-300 text-black">
            Minify
          </Button>
          <Button onClick={handleValidate} className="bg-blue-400 hover:bg-blue-300 text-black">
            Validate
          </Button>
          <Button onClick={handleClear} variant="outline" className="text-black border-white/40 hover:bg-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Error Message */}
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

        {/* Output Display */}
        {output && (
            <motion.div
                className="relative bg-white/10 p-4 rounded-lg text-sm text-left text-gray-100 font-mono max-h-64 overflow-y-auto overflow-x-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* JSON Output */}
                <pre className="whitespace-pre-wrap break-words pr-10">{output}</pre>

                {/* Floating Copy Button — fixed inside container corner */}
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

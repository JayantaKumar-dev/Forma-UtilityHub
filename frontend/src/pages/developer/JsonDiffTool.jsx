import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, FileJson } from "lucide-react";

export default function JsonDiffTool() {
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [diffResult, setDiffResult] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const parseJSON = (input) => {
    try {
      return JSON.parse(input);
    } catch {
      throw new Error("Invalid JSON");
    }
  };

  const findDifferences = (obj1, obj2, path = "") => {
    const diffs = [];

    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in obj2)) {
        diffs.push(`❌ Removed: ${currentPath}`);
      } else if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
        diffs.push(...findDifferences(obj1[key], obj2[key], currentPath));
      } else if (obj1[key] !== obj2[key]) {
        diffs.push(`⚠️ Changed: ${currentPath} (${obj1[key]} → ${obj2[key]})`);
      }
    }

    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj1)) {
        diffs.push(`✅ Added: ${currentPath}`);
      }
    }

    return diffs;
  };

  const handleCompare = () => {
    try {
      const parsed1 = parseJSON(json1);
      const parsed2 = parseJSON(json2);
      const differences = findDifferences(parsed1, parsed2);

      setDiffResult(
        differences.length
          ? differences.join("\n")
          : "✅ Both JSONs are identical!"
      );
      showMessage("Comparison done successfully!", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleReset = () => {
    setJson1("");
    setJson2("");
    setDiffResult("");
    showMessage("🔄 Reset done!", "info");
  };

  const copyResult = () => {
    navigator.clipboard.writeText(diffResult);
    showMessage("📋 Result copied to clipboard!", "success");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-6xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <FileJson className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">JSON Diff Tool</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Compare two JSON objects and highlight differences 🔍
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <motion.p
            className={`text-center mb-4 font-medium ${
              message.type === "success"
                ? "text-green-300"
                : message.type === "error"
                ? "text-red-300"
                : "text-yellow-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message.text}
          </motion.p>
        )}

        {/* Editors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <textarea
            value={json1}
            onChange={(e) => setJson1(e.target.value)}
            placeholder="Enter first JSON here..."
            className="w-full h-60 p-3 rounded-lg text-black bg-white/90 border border-gray-300 text-sm font-mono"
          ></textarea>
          <textarea
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
            placeholder="Enter second JSON here..."
            className="w-full h-60 p-3 rounded-lg text-black bg-white/90 border border-gray-300 text-sm font-mono"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button
            onClick={handleCompare}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold"
          >
            Compare JSONs
          </Button>
          <Button
            onClick={copyResult}
            className="bg-blue-400 hover:bg-blue-300 text-black font-semibold"
          >
            Copy Result
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Result */}
        {diffResult && (
          <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md whitespace-pre-wrap text-sm overflow-auto">
            {diffResult}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, KeyRound } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const generateUuid = () => {
    if (count < 1 || count > 1000) {
      showMessage("⚠️ Enter a number between 1 and 1000!", "error");
      return;
    }
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
    showMessage(`✅ Generated ${count} UUID${count > 1 ? "s" : ""}!`, "success");
  };

  const copyToClipboard = (text, label = "UUID") => {
    navigator.clipboard.writeText(text);
    showMessage(`📋 ${label} Copied!`, "success");
  };

  const handleReset = () => {
    setUuids([]);
    setCount(1);
    showMessage("🔄 Reset Successful!", "info");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-4xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <KeyRound className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">UUID Generator</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Generate secure, unique UUIDs instantly 🔑
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

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full sm:w-1/3 p-2 rounded-lg text-black bg-white/90 border border-gray-300 text-center"
            min={1}
            max={1000}
            placeholder="Enter count"
          />
          <Button
            onClick={generateUuid}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold w-full sm:w-auto"
          >
            Generate UUIDs
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* UUID Display Section */}
        {uuids.length > 0 && (
          <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-300">
                Generated UUIDs ({uuids.length})
              </h3>
              <Button
                onClick={() => copyToClipboard(uuids.join("\n"), "All UUIDs")}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm"
              >
                <Copy className="w-4 h-4 mr-1" /> Copy All
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 text-sm">
              {uuids.map((id, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg"
                >
                  <span className="break-all">{id}</span>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(id, "UUID")}
                    className="bg-green-400 hover:bg-green-300 text-black font-semibold text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

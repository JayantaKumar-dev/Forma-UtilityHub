import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Calculator } from "lucide-react";

export default function BaseConverter() {
  const [inputValue, setInputValue] = useState("");
  const [baseType, setBaseType] = useState("decimal");
  const [converted, setConverted] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleConvert = () => {
    if (!inputValue) {
      showMessage("⚠️ Please enter a value!", "error");
      return;
    }

    try {
      let decimalValue;
      switch (baseType) {
        case "binary":
          decimalValue = parseInt(inputValue, 2);
          break;
        case "octal":
          decimalValue = parseInt(inputValue, 8);
          break;
        case "decimal":
          decimalValue = parseInt(inputValue, 10);
          break;
        case "hex":
          decimalValue = parseInt(inputValue, 16);
          break;
        default:
          return;
      }

      if (isNaN(decimalValue)) {
        showMessage("❌ Invalid input for selected base!", "error");
        return;
      }

      setConverted({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hex: decimalValue.toString(16).toUpperCase(),
      });

      showMessage("✅ Conversion successful!", "success");
    } catch {
      showMessage("❌ Conversion failed!", "error");
    }
  };

  const handleReset = () => {
    setInputValue("");
    setConverted({});
    showMessage("🔄 Reset Successful!", "info");
  };

  const copyToClipboard = (value, label) => {
    navigator.clipboard.writeText(value);
    showMessage(`📋 ${label} Copied!`, "success");
  };

  useEffect(() => {
    if (inputValue) handleConvert();
    // eslint-disable-next-line
  }, [inputValue, baseType]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-3xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Calculator className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Base Converter</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Convert between Binary, Octal, Decimal, and Hexadecimal ✨
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

        {/* Input Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <select
            value={baseType}
            onChange={(e) => setBaseType(e.target.value)}
            className="w-full sm:w-1/3 p-2 rounded-lg text-black bg-white/90 border border-gray-300"
          >
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="decimal">Decimal</option>
            <option value="hex">Hexadecimal</option>
          </select>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.trim())}
            placeholder="Enter number"
            className="w-full sm:w-1/3 p-2 rounded-lg text-black bg-white/90 border border-gray-300 text-center"
          />

          <Button
            onClick={handleConvert}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold w-full sm:w-auto"
          >
            Convert
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Conversion Result */}
        {Object.keys(converted).length > 0 && (
          <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md space-y-3">
            {Object.entries(converted).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg"
              >
                <span className="capitalize font-semibold text-yellow-300">
                  {key}:
                </span>
                <span className="break-all text-sm">{value}</span>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(value, key)}
                  className="bg-green-400 hover:bg-green-300 text-black font-semibold text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react";

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [ratio, setRatio] = useState("16:9");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleCalculate = () => {
    const [rw, rh] = ratio.split(":").map(Number);
    if (!rw || !rh) {
      showMessage("❌ Invalid aspect ratio!", "error");
      return;
    }

    if (width && !height) {
      const calculated = (width * rh) / rw;
      setHeight(calculated.toFixed(2));
      showMessage("✅ Height calculated successfully!");
    } else if (!width && height) {
      const calculated = (height * rw) / rh;
      setWidth(calculated.toFixed(2));
      showMessage("✅ Width calculated successfully!");
    } else {
      showMessage("⚠️ Enter only one value (width or height)!", "error");
    }
  };

  const handleReset = () => {
    setWidth("");
    setHeight("");
    setRatio("16:9");
    showMessage("🔄 Reset successful!", "info");
  };

  const commonRatios = [
    "1:1", "4:3", "3:2", "16:9", "21:9", "9:16", "5:4", "2.35:1"
  ];

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
          <Maximize2 className="w-10 h-10 text-cyan-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Aspect Ratio Calculator</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Calculate missing width or height while maintaining perfect proportions 📏
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

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-4 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Width</h3>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Enter width (leave empty if unknown)"
              className="w-full p-2 rounded-lg text-black bg-white/80 border border-gray-300"
            />
          </div>

          <div className="bg-white/10 p-4 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Height</h3>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height (leave empty if unknown)"
              className="w-full p-2 rounded-lg text-black bg-white/80 border border-gray-300"
            />
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="bg-white/10 p-4 rounded-xl shadow-md mb-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3">
            Select Aspect Ratio
          </h3>
          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full md:w-2/3 mx-auto p-2 rounded-lg text-black bg-white/80 border border-gray-300 focus:ring-2 focus:ring-cyan-300"
          >
            {commonRatios.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={handleCalculate}
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold"
          >
            <Minimize2 className="w-4 h-4 mr-2" /> Calculate
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

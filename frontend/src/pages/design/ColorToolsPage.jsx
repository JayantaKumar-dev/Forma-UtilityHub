import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, PaintBucket } from "lucide-react";

export default function ColorToolsPage() {
  const [activeTab, setActiveTab] = useState("picker");
  const [color, setColor] = useState("#3498db");
  const [color2, setColor2] = useState("#e91e63");
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState("linear");
  const [copyMessage, setCopyMessage] = useState("");

  // === Conversions ===
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // === Copy Function with Message ===
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("✅ Copied to clipboard!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  const gradientCSS =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${color}, ${color2})`
      : `radial-gradient(circle, ${color}, ${color2})`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 relative overflow-hidden">
      <Card className="w-full max-w-5xl bg-gray-900 text-white shadow-2xl rounded-2xl p-4 sm:p-6">
        <CardHeader className="text-center text-xl sm:text-2xl font-semibold mb-6">
          🎨 Advanced Color Tools
        </CardHeader>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
          <Button
            onClick={() => setActiveTab("picker")}
            className={`px-5 sm:px-6 ${
              activeTab === "picker"
                ? "bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Droplet className="mr-2" /> Color Picker
          </Button>
          <Button
            onClick={() => setActiveTab("gradient")}
            className={`px-5 sm:px-6 ${
              activeTab === "gradient"
                ? "bg-pink-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <PaintBucket className="mr-2" /> Gradient Generator
          </Button>
        </div>

        <CardContent>
          {activeTab === "picker" ? (
            // === COLOR PICKER ===
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 text-center"
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-24 h-24 sm:w-32 sm:h-32 cursor-pointer rounded-full border-none shadow-lg"
              />

              <div
                className="w-full h-32 sm:h-40 rounded-xl shadow-inner transition-all"
                style={{ background: color }}
              ></div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-800 rounded-xl">
                  <p className="text-gray-400 text-sm">HEX</p>
                  <p className="text-lg font-semibold break-words">{color}</p>
                  <Button
                    onClick={() => copyToClipboard(color)}
                    className="mt-2 bg-blue-700 hover:bg-blue-600"
                  >
                    Copy
                  </Button>
                </div>

                <div className="p-4 bg-gray-800 rounded-xl">
                  <p className="text-gray-400 text-sm">RGB</p>
                  <p className="text-lg font-semibold break-words">
                    {hexToRgb(color)}
                  </p>
                  <Button
                    onClick={() => copyToClipboard(hexToRgb(color))}
                    className="mt-2 bg-green-700 hover:bg-green-600"
                  >
                    Copy
                  </Button>
                </div>

                <div className="p-4 bg-gray-800 rounded-xl">
                  <p className="text-gray-400 text-sm">HSL</p>
                  <p className="text-lg font-semibold break-words">
                    {hexToHsl(color)}
                  </p>
                  <Button
                    onClick={() => copyToClipboard(hexToHsl(color))}
                    className="mt-2 bg-purple-700 hover:bg-purple-600"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            // === GRADIENT GENERATOR ===
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 text-center"
            >
              <div className="flex flex-wrap justify-center gap-6">
                <div>
                  <p className="mb-2">🎨 Color 1</p>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer rounded-full shadow-lg"
                  />
                </div>
                <div>
                  <p className="mb-2">🌈 Color 2</p>
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer rounded-full shadow-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => setGradientType("linear")}
                  className={`px-4 ${
                    gradientType === "linear"
                      ? "bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Linear
                </Button>
                <Button
                  onClick={() => setGradientType("radial")}
                  className={`px-4 ${
                    gradientType === "radial"
                      ? "bg-pink-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Radial
                </Button>
              </div>

              {gradientType === "linear" && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <label>Angle: {angle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    className="w-56 sm:w-64 accent-blue-500"
                  />
                </div>
              )}

              <div
                className="w-full h-40 sm:h-48 rounded-xl shadow-inner"
                style={{ background: gradientCSS }}
              ></div>

              <div className="bg-gray-800 p-4 rounded-xl overflow-auto">
                <p className="text-gray-400 text-sm mb-2">CSS Output</p>
                <p className="text-sm font-mono break-all">{`background: ${gradientCSS};`}</p>
                <Button
                  onClick={() =>
                    copyToClipboard(`background: ${gradientCSS};`)
                  }
                  className="mt-3 bg-green-700 hover:bg-green-600"
                >
                  Copy CSS
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* === Copy Message at Bottom === */}
      <AnimatePresence>
        {copyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full shadow-lg text-sm sm:text-base"
          >
            {copyMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { create, all } from "mathjs";

// Initialize math.js safely
const math = create(all, {});

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  // Evaluate expression safely
  const evaluateExpression = () => {
    if (expression.trim() === "") {
      setResult("");
      return;
    }
    try {
      let exp = expression.replace(/√/g, "sqrt"); // Replace √ with sqrt()
      const res = math.evaluate(exp);
      setResult(Number.isFinite(res) ? res.toString() : "Error");
    } catch {
      setResult("Error");
    }
  };

  // Handle button press
  const handleButtonClick = (value) => {
    if (value === "AC") {
      setExpression("");
      setResult("");
    } else if (value === "DEL") {
      setExpression(expression.slice(0, -1));
    } else if (value === "=") {
      evaluateExpression();
    } else {
      setExpression(expression + value);
    }
  };

  // Support keyboard input
  useEffect(() => {
    const handleKey = (e) => {
      if ((/[0-9+\-*/().%]/.test(e.key)) || e.key === "Enter" || e.key === "Backspace") {
        e.preventDefault();
        if (e.key === "Enter") evaluateExpression();
        else if (e.key === "Backspace") setExpression((prev) => prev.slice(0, -1));
        else setExpression((prev) => prev + e.key);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const buttons = [
    "AC", "DEL", "(", ")",
    "7", "8", "9", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "−",
    "0", ".", "%", "+",
    "√", "="
  ];

  // Replace display symbols
  const displayExpr = expression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷");

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-4">
          <Calculator className="w-10 h-10 text-yellow-300 mb-2" />
          <h2 className="text-2xl font-bold text-center">Simple Calculator</h2>
          <p className="text-sm text-gray-200">Basic math made elegant ⚡</p>
        </div>

        {/* Display */}
        <div className="bg-white/20 rounded-lg p-3 text-right font-mono text-xl mb-3 min-h-[60px] break-all">
          <div className="text-gray-300">{displayExpr || "0"}</div>
          {result && (
            <motion.div
              className="text-2xl font-semibold text-yellow-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              = {result}
            </motion.div>
          )}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => handleButtonClick(
                btn === "÷" ? "/" :
                btn === "×" ? "*" :
                btn === "−" ? "-" : btn
              )}
              className={`${
                btn === "="
                  ? "col-span-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
                  : ["AC", "DEL"].includes(btn)
                  ? "bg-red-400 hover:bg-red-300 text-black font-bold"
                  : "bg-white/40 hover:bg-white/60 text-black"
              } rounded-lg py-6 text-lg transition-all duration-200`}
            >
              {btn}
            </Button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

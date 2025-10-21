import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import * as math from "mathjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ScientificCalculatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [angleMode, setAngleMode] = useState("DEG");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("calcHistory")) || []);
  const [memory, setMemory] = useState(() => parseFloat(localStorage.getItem("calcMemory")) || 0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
    localStorage.setItem("calcMemory", memory.toString());
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [history, memory, darkMode]);

  const handleButtonClick = (value) => setInput((prev) => prev + value);
  const clearAll = () => { setInput(""); setResult(""); setGraphData(null); };
  const deleteLast = () => setInput((prev) => prev.slice(0, -1));
  const toggleAngleMode = () => {
    setAngleMode((prev) => (prev === "DEG" ? "RAD" : prev === "RAD" ? "GRAD" : "DEG"));
  };

  const safeEvaluate = (expr) => {
    try {
      let sanitized = expr
        .replace(/sin/g, `sin${angleMode === "DEG" ? "Deg" : ""}`)
        .replace(/cos/g, `cos${angleMode === "DEG" ? "Deg" : ""}`)
        .replace(/tan/g, `tan${angleMode === "DEG" ? "Deg" : ""}`);
      return math.evaluate(sanitized);
    } catch {
      throw new Error("Invalid Expression");
    }
  };

  const calculateResult = () => {
    try {
      if (!input.trim()) return setResult("Enter Expression");
      let evalResult = safeEvaluate(input);
      setResult(evalResult.toString());
      setHistory((prev) => [...prev.slice(-24), `${input} = ${evalResult}`]);
    } catch {
      setResult("Math Error");
    }
  };

  // === Memory Operations ===
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => setInput((prev) => prev + memory.toString());
  const memoryAdd = () => setMemory((prev) => prev + (parseFloat(result) || 0));
  const memorySubtract = () => setMemory((prev) => prev - (parseFloat(result) || 0));

  // === Advanced Operations ===
  const handleAdvanced = (type) => {
    try {
      if (!input.trim()) return setResult("Enter Expression");
      let res;
      switch (type) {
        case "derivative": res = math.derivative(input, "x").toString(); break;
        case "integrate": res = math.integral(input, "x").toString(); break;
        case "limit": res = math.evaluate(`limit(${input}, x, 0)`); break;
        case "determinant": res = math.det(math.evaluate(input)); break;
        case "inverse": res = math.inv(math.evaluate(input)); break;
        case "transpose": res = math.transpose(math.evaluate(input)); break;
        case "mean": res = math.mean(math.evaluate(input)); break;
        case "median": res = math.median(math.evaluate(input)); break;
        case "mode": res = math.mode(math.evaluate(input)); break;
        case "std": res = math.std(math.evaluate(input)); break;
        case "variance": res = math.variance(math.evaluate(input)); break;
        case "bin": res = Number(input).toString(2); break;
        case "oct": res = Number(input).toString(8); break;
        case "hex": res = Number(input).toString(16).toUpperCase(); break;
        default: res = "N/A";
      }
      setResult(res.toString());
      setHistory((prev) => [...prev.slice(-24), `${type}(${input}) = ${res}`]);
    } catch {
      setResult("Math Error");
    }
  };

  // === Graph Plotting ===
  const plotGraph = () => {
    try {
      if (!input.trim()) return setResult("Enter Expression");
      const fn = math.parse(input).compile();
      const xValues = math.range(-10, 10, 0.1).toArray();
      const yValues = xValues.map((x) => {
        try { return fn.evaluate({ x }); } catch { return NaN; }
      });
      setGraphData({
        labels: xValues,
        datasets: [{ label: `y = ${input}`, data: yValues, borderColor: "rgb(75,192,192)", tension: 0.2 }],
      });
    } catch {
      setResult("Graph Error");
    }
  };

  const downloadHistory = () => {
    const blob = new Blob([history.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculator_history.txt";
    link.click();
  };

  const clearHistory = () => setHistory([]);

  const themeClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

  const renderButton = (label, onClick, color = "bg-gray-800") => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      key={label}
      onClick={() => onClick(label)}
      className={`${color} text-white text-base p-3 rounded-xl hover:opacity-90 transition-all break-words`}
      title={label}
    >
      {label}
    </motion.button>
  );

  const numButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "00"];
  const opButtons = ["+", "-", "*", "/", "^", "%"];
  const trigButtons = ["sin(", "cos(", "tan(", "asin(", "acos(", "atan("];
  const expButtons = ["ln(", "log(", "sqrt(", "exp(", "pi", "e"];
  const calcButtons = ["(", ")", "!", "abs(", "mod(", "pow("];

  const advOps = [
    { name: "Derivative", type: "derivative", color: "bg-purple-700" },
    { name: "Integrate", type: "integrate", color: "bg-purple-700" },
    { name: "Limit", type: "limit", color: "bg-purple-700" },
    { name: "Det", type: "determinant", color: "bg-indigo-700" },
    { name: "Inverse", type: "inverse", color: "bg-indigo-700" },
    { name: "Transpose", type: "transpose", color: "bg-indigo-700" },
    { name: "Mean", type: "mean", color: "bg-blue-800" },
    { name: "Median", type: "median", color: "bg-blue-800" },
    { name: "Mode", type: "mode", color: "bg-blue-800" },
    { name: "Std", type: "std", color: "bg-blue-800" },
    { name: "Var", type: "variance", color: "bg-blue-800" },
    { name: "BIN", type: "bin", color: "bg-yellow-600" },
    { name: "OCT", type: "oct", color: "bg-yellow-600" },
    { name: "HEX", type: "hex", color: "bg-yellow-600" },
  ];

  return (
    <div className={`flex justify-center items-center min-h-screen p-3 transition-all ${themeClass}`}>
      <Card className={`w-full max-w-6xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} shadow-2xl rounded-2xl`}>
        <CardHeader className="text-center text-xl md:text-2xl font-semibold tracking-wide flex flex-wrap justify-between items-center gap-3">
          <span>🧮 Full Scientific Calculator</span>
          <Button onClick={() => setDarkMode(!darkMode)} className="bg-gray-700 hover:bg-gray-600 text-sm">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </CardHeader>

        <CardContent>
          {/* Display */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded-xl p-4 mb-4 text-right font-mono shadow-inner break-words`}>
            <div className="text-gray-400 text-xs sm:text-sm mb-1">
              {angleMode} MODE | MEM: {memory}
            </div>
            <div className="text-base sm:text-xl md:text-2xl">{input || "0"}</div>
            <div className="text-green-400 text-lg sm:text-2xl md:text-3xl font-bold mt-1 truncate">{result}</div>
          </div>

          {/* Utility Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <Button onClick={toggleAngleMode} className="bg-blue-700 hover:bg-blue-600">{angleMode}</Button>
            <Button onClick={clearAll} className="bg-red-700 hover:bg-red-600">AC</Button>
            <Button onClick={deleteLast} className="bg-yellow-600 hover:bg-yellow-500">DEL</Button>
            <Button onClick={calculateResult} className="bg-green-700 hover:bg-green-600">=</Button>
            <Button onClick={plotGraph} className="bg-indigo-700 hover:bg-indigo-600">📈 Plot</Button>
            <Button onClick={downloadHistory} className="bg-gray-700 hover:bg-gray-600">📜 Save</Button>
            <Button onClick={clearHistory} className="bg-gray-700 hover:bg-gray-600">🗑 Clear</Button>
          </div>

          {/* Memory Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button onClick={memoryClear} className="bg-gray-700 hover:bg-gray-600">MC</Button>
            <Button onClick={memoryRecall} className="bg-gray-700 hover:bg-gray-600">MR</Button>
            <Button onClick={memoryAdd} className="bg-gray-700 hover:bg-gray-600">M+</Button>
            <Button onClick={memorySubtract} className="bg-gray-700 hover:bg-gray-600">M−</Button>
          </div>

          {/* Main Keypads */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3">
            {[...trigButtons, ...expButtons, ...calcButtons, ...opButtons, ...numButtons].map((btn) =>
              renderButton(btn, handleButtonClick, "bg-gray-700")
            )}
          </div>

          {/* Advanced Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {advOps.map((op) => (
              <Button key={op.type} onClick={() => handleAdvanced(op.type)} className={`${op.color} text-white hover:opacity-90 rounded-xl`}>
                {op.name}
              </Button>
            ))}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className={`${darkMode ? "bg-gray-800" : "bg-gray-200"} mt-6 p-3 rounded-lg h-32 overflow-y-auto text-xs sm:text-sm`}>
              <div className="font-semibold text-gray-400 mb-1">History:</div>
              {history.slice(-10).map((h, i) => (
                <div key={i} className="text-gray-400">{h}</div>
              ))}
            </div>
          )}

          {/* Graph */}
          {graphData && (
            <div className="bg-gray-800 mt-6 p-4 rounded-lg">
              <Line data={graphData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

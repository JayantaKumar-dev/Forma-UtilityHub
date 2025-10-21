import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, Hash, Sigma } from "lucide-react";

export default function NumberToolsPage() {
  const [number, setNumber] = useState("");
  const [primeResult, setPrimeResult] = useState("");
  const [factorialResult, setFactorialResult] = useState("");
  const [fibonacciCount, setFibonacciCount] = useState("");
  const [fibonacciResult, setFibonacciResult] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ Prime Checker
  const handlePrimeCheck = () => {
    const num = parseInt(number);
    if (isNaN(num) || num < 1) {
      setMessage({ text: "❌ Please enter a valid positive number!", type: "error" });
      setPrimeResult("");
      return;
    }
    if (num === 1) {
      setPrimeResult("1 is neither prime nor composite.");
      setMessage({ text: "⚠️ 1 is a special case!", type: "info" });
      return;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        setPrimeResult(`${num} ❌ is NOT a prime number.`);
        setMessage({ text: "❌ Not a prime number!", type: "error" });
        return;
      }
    }
    setPrimeResult(`${num} ✅ is a PRIME number!`);
    setMessage({ text: "✅ Successfully checked for prime!", type: "success" });
  };

  // ✅ Factorial Calculator
  const handleFactorial = () => {
    const num = parseInt(number);
    if (isNaN(num) || num < 0) {
      setMessage({ text: "❌ Please enter a valid non-negative number!", type: "error" });
      setFactorialResult("");
      return;
    }
    let result = 1n;
    for (let i = 2n; i <= BigInt(num); i++) result *= i;
    setFactorialResult(`${num}! = ${result.toString()}`);
    setMessage({ text: "✅ Factorial calculated successfully!", type: "success" });
  };

  // ✅ Fibonacci Generator
  const handleFibonacci = () => {
    const count = parseInt(fibonacciCount);
    if (isNaN(count) || count < 1) {
      setMessage({ text: "❌ Please enter a valid positive count!", type: "error" });
      setFibonacciResult([]);
      return;
    }
    let fib = [0, 1];
    for (let i = 2; i < count; i++) fib[i] = fib[i - 1] + fib[i - 2];
    setFibonacciResult(fib.slice(0, count));
    setMessage({ text: "✅ Fibonacci sequence generated!", type: "success" });
  };

  // Reset
  const handleReset = () => {
    setNumber("");
    setPrimeResult("");
    setFactorialResult("");
    setFibonacciCount("");
    setFibonacciResult([]);
    setMessage({ text: "🔄 Reset successful!", type: "info" });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-5xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Calculator className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Number Tools</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Check primes, calculate factorials, and generate Fibonacci sequences 🔢
          </p>
        </div>

        {/* Status Message */}
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

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Prime Checker */}
          <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex justify-center items-center gap-2">
              <Hash className="w-5 h-5" /> Prime Checker
            </h3>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter number"
              className="w-full p-2 rounded-lg text-black text-base bg-white/70 border border-white/30 mb-3"
            />
            <Button
              onClick={handlePrimeCheck}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
            >
              Check Prime
            </Button>
            {primeResult && <p className="mt-3 text-green-300 text-sm">{primeResult}</p>}
          </div>

          {/* Factorial Calculator */}
          <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-green-300 mb-3 flex justify-center items-center gap-2">
              <Sigma className="w-5 h-5" /> Factorial
            </h3>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter number"
              className="w-full p-2 rounded-lg text-black text-base bg-white/70 border border-white/30 mb-3"
            />
            <Button
              onClick={handleFactorial}
              className="w-full bg-green-400 hover:bg-green-300 text-black font-semibold"
            >
              Calculate Factorial
            </Button>
            {factorialResult && (
              <p className="mt-3 text-yellow-300 text-sm break-all">{factorialResult}</p>
            )}
          </div>

          {/* Fibonacci Generator */}
          <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-pink-300 mb-3 flex justify-center items-center gap-2">
              <Calculator className="w-5 h-5" /> Fibonacci
            </h3>
            <input
              type="number"
              value={fibonacciCount}
              onChange={(e) => setFibonacciCount(e.target.value)}
              placeholder="Number of terms"
              className="w-full p-2 rounded-lg text-black text-base bg-white/70 border border-white/30 mb-3"
            />
            <Button
              onClick={handleFibonacci}
              className="w-full bg-pink-400 hover:bg-pink-300 text-black font-semibold"
            >
              Generate
            </Button>
            {fibonacciResult.length > 0 && (
              <p className="mt-3 text-blue-300 text-sm break-all">
                {fibonacciResult.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            Reset All
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Copy, RefreshCw, Clock } from "lucide-react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let interval;
    if (dob) {
      interval = setInterval(() => {
        calculateAge();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [dob]);

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const now = new Date();
    const diff = now - birthDate;

    if (diff < 0) {
      setMessage("⚠️ Please select a valid past date!");
      setAge(null);
      return;
    }

    const milliseconds = diff;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(months / 12);

    setAge({
      years,
      months: months % 12,
      days: Math.floor(days % 30.44),
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      milliseconds: milliseconds % 1000,
    });

    setMessage("✅ Age calculated successfully!");
  };

  const handleCopy = () => {
    if (!age) return;
    const text = `Your Age: ${age.years}y ${age.months}m ${age.days}d ${age.hours}h ${age.minutes}m ${age.seconds}s ${age.milliseconds}ms`;
    navigator.clipboard.writeText(text);
    setMessage("📋 Copied to clipboard!");
  };

  const handleReset = () => {
    setDob("");
    setAge(null);
    setMessage("🔄 Reset successful!");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-4xl bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Calendar className="w-10 h-10 text-pink-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Age Calculator</h2>
          <p className="text-gray-200 text-sm sm:text-base">
            Calculate your exact age in every possible unit ⏳
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="p-3 rounded-lg text-black w-full sm:w-72"
          />
          <Button onClick={calculateAge} className="bg-pink-400 hover:bg-pink-300 text-black">
            Calculate
          </Button>
          <Button onClick={handleReset} variant="outline" className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Output */}
        {age && (
          <motion.div
            className="bg-white/10 p-4 rounded-xl text-center text-lg sm:text-xl font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-pink-200 mb-2">🎂 Your Exact Age</p>
            <p className="text-white">
              {age.years} Years, {age.months} Months, {age.days} Days
            </p>
            <p className="text-white mt-1">
              {age.hours} Hours, {age.minutes} Minutes, {age.seconds} Seconds,{" "}
              {age.milliseconds} ms
            </p>
          </motion.div>
        )}

        {/* Copy Button */}
        {age && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleCopy} variant="outline" className="bg-yellow-400 text-black border-white/40 hover:bg-yellow-300">
              <Copy className="w-4 h-4 mr-2" /> Copy Age
            </Button>
          </div>
        )}

        {/* Message */}
        {message && (
          <motion.p
            className="text-center mt-4 text-yellow-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

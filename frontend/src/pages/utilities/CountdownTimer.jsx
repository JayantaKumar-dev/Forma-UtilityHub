import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Copy, RefreshCw, TimerReset } from "lucide-react";

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
        setMessage("🎉 Countdown Finished!");
      } else {
        setTimeLeft(formatTime(diff));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return { days, hours, minutes, seconds, milliseconds };
  };

  const handleCopy = () => {
    if (!timeLeft) return;
    const text = `⏳ Time Left: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s ${timeLeft.milliseconds}ms`;
    navigator.clipboard.writeText(text);
    setMessage("✅ Countdown copied to clipboard!");
  };

  const handleReset = () => {
    setTargetDate("");
    setTimeLeft(null);
    setMessage("🔄 Reset successful!");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
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
          <Clock className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Countdown Timer</h2>
          <p className="text-gray-200 text-sm sm:text-base">
            Set a target date & time, then watch the countdown live ⏱️
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="p-3 rounded-lg text-black w-full sm:w-72"
          />
          <Button
            onClick={() => setMessage("✅ Countdown started!")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black"
          >
            Start
          </Button>
          <Button onClick={handleReset} variant="outline" className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Timer Display */}
        {timeLeft && (
          <motion.div
            className="bg-white/10 p-6 rounded-xl text-center font-semibold text-lg sm:text-2xl tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-wrap justify-center gap-6">
              <div><span className="text-yellow-300">{timeLeft.days}</span> Days</div>
              <div><span className="text-green-300">{timeLeft.hours}</span> Hours</div>
              <div><span className="text-blue-300">{timeLeft.minutes}</span> Minutes</div>
              <div><span className="text-pink-300">{timeLeft.seconds}</span> Seconds</div>
              <div><span className="text-purple-300">{timeLeft.milliseconds}</span> ms</div>
            </div>
          </motion.div>
        )}

        {/* Copy Button */}
        {timeLeft && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleCopy} variant="outline" className="bg-green-300 text-black border-white/40">
              <Copy className="w-4 h-4 mr-2" /> Copy Time
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

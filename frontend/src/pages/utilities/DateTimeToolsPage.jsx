import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, RefreshCw } from "lucide-react";

// 🌍 Common timezones (can be expanded)
const timezones = [
  "UTC", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Kolkata", "Asia/Tokyo", "Asia/Dubai", "Asia/Singapore",
  "America/New_York", "America/Los_Angeles", "America/Chicago",
  "Australia/Sydney", "Africa/Johannesburg"
];

export default function DateTimeToolsPage() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [humanDate, setHumanDate] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [convertedTime, setConvertedTime] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    handleTimestampToDate();
  }, []);

  // Convert timestamp → human date
  const handleTimestampToDate = () => {
    if (!timestamp) return;
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) {
      setMessage({ text: "❌ Invalid timestamp!", type: "error" });
      return;
    }
    setHumanDate(date.toLocaleString());
    setMessage({ text: "✅ Successfully converted to Human Date!", type: "success" });
  };

  // Convert human date → timestamp
  const handleDateToTimestamp = () => {
    if (!humanDate) {
      setMessage({ text: "⚠️ Please enter a date first!", type: "error" });
      return;
    }
    const date = new Date(humanDate);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000));
      setMessage({ text: "✅ Successfully converted to Unix Timestamp!", type: "success" });
    } else {
      setMessage({ text: "❌ Invalid date format!", type: "error" });
    }
  };

  // Timezone conversion
  const handleTimezoneConvert = () => {
    try {
      const date = new Date();
      const options = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const timeString = date.toLocaleTimeString("en-US", options);
      setConvertedTime(timeString);
      setMessage({ text: `✅ Converted successfully for ${timezone}`, type: "success" });
    } catch (e) {
      setMessage({ text: "❌ Invalid timezone selected!", type: "error" });
    }
  };

  // Reset all
  const handleReset = () => {
    setTimestamp(Math.floor(Date.now() / 1000));
    setHumanDate("");
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setConvertedTime("");
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
        className="w-full max-w-4xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Clock className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Date & Time Tools</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Convert between Unix Timestamp, Human Date, and Timezones 🌍
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

        {/* Timestamp ↔ Date Converter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Timestamp → Date */}
          <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">
              Unix Timestamp → Human Date
            </h3>
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full p-2 rounded-lg text-black text-base bg-white/70 border border-white/30 mb-3"
              placeholder="Enter Unix Timestamp"
            />
            <Button
              onClick={handleTimestampToDate}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
            >
              Convert to Date
            </Button>
            <p className="mt-3 text-green-300 font-medium text-sm break-all">
              {humanDate && <>🗓️ {humanDate}</>}
            </p>
          </div>

          {/* Date → Timestamp */}
          <div className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-green-300 mb-3">
              Human Date → Unix Timestamp
            </h3>
            <input
              type="datetime-local"
              onChange={(e) => setHumanDate(e.target.value)}
              className="w-full p-2 rounded-lg text-black text-base bg-white/70 border border-white/30 mb-3"
            />
            <Button
              onClick={handleDateToTimestamp}
              className="w-full bg-green-400 hover:bg-green-300 text-black font-semibold"
            >
              Convert to Timestamp
            </Button>
            <p className="mt-3 text-yellow-300 font-medium text-sm break-all">
              {timestamp && <>🕒 {timestamp}</>}
            </p>
          </div>
        </div>

        {/* Timezone Converter */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex justify-center items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Timezone Converter
          </h3>

          {/* Dropdown */}
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full md:w-2/3 mx-auto p-2 mb-3 rounded-lg text-black bg-white/70 border border-white/30 focus:ring-2 focus:ring-blue-300"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>

          {/* Search bar for custom timezone */}
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full md:w-2/3 mx-auto p-2 rounded-lg text-black bg-white/70 border border-white/30 mb-3"
            placeholder="Or type your own timezone (e.g. Asia/Kolkata)"
          />

          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              onClick={handleTimezoneConvert}
              className="bg-blue-400 hover:bg-blue-300 text-black font-semibold"
            >
              Convert Time
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-black border-white/40 hover:bg-white/40"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>

          <p className="mt-4 text-pink-300 font-medium">
            {convertedTime && `🕰️ Local Time: ${convertedTime}`}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

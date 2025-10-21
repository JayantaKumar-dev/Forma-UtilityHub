import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, Network, RefreshCw, LocateFixed } from "lucide-react";

export default function IpLocationFinder() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState(null);
  const [msg, setMsg] = useState("Loading your IP info...");

  const fetchIPInfo = async (targetIp = "") => {
  try {
    setMsg("⏳ Fetching data...");
    const url = targetIp
      ? `http://localhost:8080/api/ip?ip=${targetIp}`
      : `http://localhost:8080/api/ip`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      setMsg("❌ Invalid IP or not found.");
      setInfo(null);
    } else {
      setInfo(data);
      setMsg("✅ Data fetched successfully!");
    }
  } catch (e) {
    console.error(e);
    setMsg("❌ Failed to fetch data.");
  }
};


  useEffect(() => {
    fetchIPInfo();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-3xl bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Globe className="w-12 h-12 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">IP / Location Finder</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Find your public IP and detailed location info 🌍
          </p>
        </div>

        {/* Input + Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter IP address..."
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full sm:w-72 p-3 rounded-lg text-black bg-white/80 border border-white/40 focus:ring-2 focus:ring-yellow-300"
          />
          <Button
            onClick={() => fetchIPInfo(ip)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            <LocateFixed className="w-4 h-4 mr-2" /> Search
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchIPInfo()}
            className="text-black bg-green-400 border-black/40 hover:bg-green-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> My IP
          </Button>
        </div>

        {/* Message */}
        <p className="text-center text-yellow-300 mb-4 font-medium">{msg}</p>

        {/* Info Card */}
        {info && (
          <motion.div
            className="bg-white/10 p-6 rounded-xl text-center grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div><strong>🌐 IP:</strong> {info.ip}</div>
            <div><strong>🏙️ City:</strong> {info.city}</div>
            <div><strong>🗺️ Region:</strong> {info.region}</div>
            <div><strong>🌎 Country:</strong> {info.country_name}</div>
            <div><strong>🕒 Timezone:</strong> {info.timezone}</div>
            <div><strong>💼 ISP:</strong> {info.org}</div>
            <a
              href={`https://www.google.com/maps?q=${info.latitude},${info.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 sm:col-span-2 underline text-yellow-300 hover:text-yellow-200 mt-2"
            >
              📍 View on Google Maps
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

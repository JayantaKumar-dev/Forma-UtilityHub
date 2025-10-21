import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CloudSun, MapPin, Thermometer, Wind, Droplets, RefreshCw } from "lucide-react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setMessage("⚠️ Please enter a city name.");
      return;
    }
    setMessage("⏳ Fetching weather...");

    try {
      // Step 1: Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setMessage("❌ City not found!");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      const current = weatherData.current_weather;

      setWeather({
        name,
        country,
        temp: current.temperature,
        wind: current.windspeed,
        code: current.weathercode,
      });
      setMessage("✅ Weather fetched successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch weather!");
    }
  };

  const handleReset = () => {
    setCity("");
    setWeather(null);
    setMessage("🔄 Reset successful!");
  };

  const weatherIcons = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Fog",
    51: "🌦️ Drizzle",
    61: "🌧️ Rain",
    71: "❄️ Snow",
    95: "⛈️ Thunderstorm",
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-3 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-3xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <CloudSun className="w-12 h-12 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Weather App</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Get real-time weather info anywhere on Earth 🌎
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full sm:w-72 p-3 rounded-lg text-black bg-white/80 border border-white/40 focus:ring-2 focus:ring-yellow-300"
          />
          <Button
            onClick={fetchWeather}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            Search
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Message */}
        {message && (
          <motion.p
            className="text-center mb-4 text-yellow-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Weather Info */}
        {weather && (
          <motion.div
            className="bg-white/10 p-6 rounded-xl shadow-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-semibold mb-3">
              <MapPin className="inline-block w-5 h-5 text-red-400" /> {weather.name},{" "}
              {weather.country}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Thermometer className="w-6 h-6 text-orange-300 mb-2" />
                <p className="text-lg">{weather.temp}°C</p>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-6 h-6 text-blue-300 mb-2" />
                <p className="text-lg">{weather.wind} km/h</p>
              </div>
              <div className="flex flex-col items-center">
                <Droplets className="w-6 h-6 text-teal-300 mb-2" />
                <p className="text-lg">
                  {weatherIcons[weather.code] || "🌈 Unknown"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeftRight as Swap, RefreshCw, Check, ClipboardCopy, Weight } from "lucide-react";
import * as math from "mathjs";

/**
 * UnitConverterPage.jsx
 * - Real-time conversion using mathjs units (fallbacks handled)
 * - Same style + animations as your other tools
 */

const UNITS = {
  length: [
    { value: "m", label: "Meter (m)" },
    { value: "km", label: "Kilometer (km)" },
    { value: "cm", label: "Centimeter (cm)" },
    { value: "mm", label: "Millimeter (mm)" },
    { value: "in", label: "Inch (in)" },
    { value: "ft", label: "Foot (ft)" },
    { value: "yd", label: "Yard (yd)" },
    { value: "mi", label: "Mile (mi)" }
  ],
  weight: [
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "mg", label: "Milligram (mg)" },
    { value: "lb", label: "Pound (lb)" },
    { value: "oz", label: "Ounce (oz)" },
    { value: "ton", label: "Metric Ton (t)" }
  ],
  temperature: [
    { value: "C", label: "Celsius (°C)" },
    { value: "F", label: "Fahrenheit (°F)" },
    { value: "K", label: "Kelvin (K)" }
  ],
  volume: [
    { value: "l", label: "Liter (L)" },
    { value: "ml", label: "Milliliter (mL)" },
    { value: "m^3", label: "Cubic meter (m³)" },
    { value: "gal", label: "Gallon (gal)" },
    { value: "pt", label: "Pint (pt)" }
  ],
  area: [
    { value: "m^2", label: "Square meter (m²)" },
    { value: "km^2", label: "Square kilometer (km²)" },
    { value: "ft^2", label: "Square foot (ft²)" },
    { value: "acre", label: "Acre" },
    { value: "ha", label: "Hectare (ha)" }
  ],
  speed: [
    { value: "m/s", label: "Meter/second (m/s)" },
    { value: "km/h", label: "Kilometer/hour (km/h)" },
    { value: "mph", label: "Miles/hour (mph)" },
    { value: "knot", label: "Knot (kt)" }
  ],
  time: [
    { value: "s", label: "Second (s)" },
    { value: "min", label: "Minute (min)" },
    { value: "h", label: "Hour (h)" },
    { value: "day", label: "Day" }
  ],
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState(UNITS.length[0].value);
  const [toUnit, setToUnit] = useState(UNITS.length[1].value);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const list = UNITS[category];
    setFromUnit(list[0].value);
    setToUnit(list[1]?.value ?? list[0].value);
    setInput("");
    setOutput("");
    setMessage("");
    setCopied(false);
  }, [category]);

  useEffect(() => {
    if (!input.toString().trim()) {
      setOutput("");
      setMessage("");
      return;
    }
    convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, fromUnit, toUnit, category]);

  const isEmpty = (s) => !s && s !== 0;

  const convertTemperature = (val, fromU, toU) => {
    const v = parseFloat(val);
    if (Number.isNaN(v)) throw new Error("Invalid number");
    if (fromU === toU) return v;
    let c;
    if (fromU === "C") c = v;
    if (fromU === "F") c = (v - 32) * (5 / 9);
    if (fromU === "K") c = v - 273.15;
    if (toU === "C") return c;
    if (toU === "F") return c * (9 / 5) + 32;
    if (toU === "K") return c + 273.15;
    throw new Error("Unsupported temperature unit");
  };

  const convertGeneric = (val, fromU, toU) => {
    try {
      const u = math.unit(parseFloat(val), fromU);
      const converted = u.to(toU);
      return typeof converted.toNumber === "function"
        ? converted.toNumber()
        : converted.value;
    } catch (err) {
      throw err;
    }
  };

  const convert = () => {
    setCopied(false);
    setMessage("");
    if (isEmpty(input) || input.toString().trim() === "") {
      setOutput("");
      return;
    }
    try {
      let res;
      if (category === "temperature") {
        res = convertTemperature(input, fromUnit, toUnit);
      } else {
        res = convertGeneric(input, fromUnit, toUnit);
      }
      if (typeof res === "number") {
        const rounded = +Number.parseFloat(res).toPrecision(8);
        setOutput(String(rounded));
      } else {
        setOutput(String(res));
      }
      setMessage(`✅ Converted ${input} ${fromUnit} → ${toUnit}`);
    } catch (err) {
      setOutput("");
      setMessage("❌ Conversion error: incompatible units or invalid number.");
    }
  };

  const handleSwap = () => {
    setCopied(false);
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
    if (output) {
      setInput(output);
    }
  };

  const handleCopy = () => {
    if (!output) {
      setMessage("❌ Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopied(true);
    setMessage("✅ Copied to clipboard.");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMessage("");
    setCopied(false);
  };

  const unitOptions = UNITS[category];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-3xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <Weight className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Unit Converter</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Convert units quickly — real-time and accurate ⚡
          </p>
        </div>

        {/* Category + Swap */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 w-full max-w-2xl">
          <Select onValueChange={(val) => setCategory(val)} value={category}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white text-black">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(UNITS).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex sm:flex-1 justify-between sm:justify-end gap-2">
            <Button
              onClick={handleSwap}
              className="bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              <Swap className="w-4 h-4 mr-2" /> Swap
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="text-black border-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        {/* Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center mb-4">
          <div className="col-span-12 sm:col-span-5">
            <Input
              placeholder="Enter value"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-white/40 text-black placeholder-gray-700 border border-white/30 w-full"
            />
          </div>

          <div className="col-span-12 sm:col-span-3">
            <Select onValueChange={(val) => setFromUnit(val)} value={fromUnit}>
              <SelectTrigger className="w-full bg-white text-black">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:flex sm:col-span-1 justify-center text-xl">→</div>

          <div className="col-span-12 sm:col-span-3">
            <Select onValueChange={(val) => setToUnit(val)} value={toUnit}>
              <SelectTrigger className="w-full bg-white text-black">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 mt-2 w-full">
            <div className="text-sm text-gray-200">Output</div>
            <div className="bg-white/10 p-3 rounded-lg text-left text-gray-100 font-mono overflow-auto max-h-28">
              {output ? (
                <div className="text-yellow-300 text-lg">
                  {output}{" "}
                  <span className="text-xs text-gray-300 ml-2">{toUnit}</span>
                </div>
              ) : (
                <div className="text-gray-400">
                  Converted value will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.p
            className={`text-sm text-center mb-3 ${
              message.startsWith("✅") ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Fixed Copy Button */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 text-white bg-black/40 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-yellow-400 hover:text-black transition"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <ClipboardCopy className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileCode2, RefreshCw, Copy } from "lucide-react";
import YAML from "yaml";
import Papa from "papaparse"; 
import xmljs from "xml-js";

export default function UniversalConverter() {
  const [input, setInput] = useState("");
  const [fromFormat, setFromFormat] = useState("json");
  const [toFormat, setToFormat] = useState("yaml");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleConvert = () => {
    try {
      let data;
      // Parse input based on source format
      switch (fromFormat) {
        case "json":
          data = JSON.parse(input);
          break;
        case "yaml":
          data = YAML.parse(input);
          break;
        case "csv":
          data = Papa.parse(input, { header: true }).data;
          break;
        case "xml":
          data = JSON.parse(xmljs.xml2json(input, { compact: true }));
          break;
        default:
          throw new Error("Invalid source format");
      }

      // Convert to target format
      let result = "";
      switch (toFormat) {
        case "json":
          result = JSON.stringify(data, null, 2);
          break;
        case "yaml":
          result = YAML.stringify(data);
          break;
        case "csv":
          result = Papa.unparse(data);
          break;
        case "xml":
          result = xmljs.json2xml(JSON.stringify(data), { compact: true, spaces: 2 });
          break;
        default:
          throw new Error("Invalid target format");
      }

      setOutput(result);
      showMessage("✅ Conversion successful!", "success");
    } catch (err) {
      showMessage("❌ Conversion failed: Invalid format or input", "error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showMessage("📋 Copied to clipboard!", "success");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-6xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <FileCode2 className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            Universal Converter (JSON ⇄ CSV ⇄ XML ⇄ YAML)
          </h2>
          <p className="text-sm sm:text-base text-gray-200">
            Convert between multiple data formats effortlessly ⚙️
          </p>
        </div>

        {/* Format Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-black">
          <select
            value={fromFormat}
            onChange={(e) => setFromFormat(e.target.value)}
            className="p-2 rounded-lg border w-full text-center"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>

          <div className="flex justify-center items-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>

          <select
            value={toFormat}
            onChange={(e) => setToFormat(e.target.value)}
            className="p-2 rounded-lg border w-full text-center"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>

        {/* Input / Output Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea
            rows={12}
            className="w-full p-3 rounded-xl text-black text-base bg-white/90 border border-gray-300"
            placeholder={`Enter your ${fromFormat.toUpperCase()} data here...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="relative">
            <textarea
              rows={12}
              readOnly
              className="w-full p-3 rounded-xl text-black text-base bg-gray-100 border border-gray-300"
              placeholder="Converted output will appear here..."
              value={output}
            />
            {output && (
              <Button
                onClick={handleCopy}
                className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
              >
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
            )}
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleConvert}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold px-6 py-2"
          >
            Convert
          </Button>
        </div>

        {/* Message */}
        {message.text && (
          <p
            className={`mt-4 text-center font-medium ${
              message.type === "error" ? "text-red-400" : "text-green-300"
            }`}
          >
            {message.text}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  Link2, FileJson, Calculator, Shield, QrCode, KeyRound, Shuffle,
  FileCode2, FileSpreadsheet, Binary, Droplet, Code, FileText,
  Clock, Weight, Lock, Maximize2, TimerReset, CloudSun, MapPin,
  Image, Repeat
} from "lucide-react";

export const allServices = [
  { title: "URL Shortener", icon: <Link2 />, path: "/url-shortener", category: "utilities" },
  { title: "QR Code Generator & Scanner", icon: <QrCode />, path: "/qr-code", category: "utilities" },
  { title: "Password Generator", icon: <KeyRound />, path: "/password-generator", category: "security" },
  { title: "IP / Location Finder", icon: <MapPin />, path: "/ip-finder", category: "utilities" },
  { title: "JSON Formatter & Validator", icon: <FileJson />, path: "/json-formatter", category: "formatters" },
  { title: "YAML ⇄ JSON Converter", icon: <Shuffle />, path: "/yaml-json-converter", category: "converters" },
  { title: "XML Formatter & Converter", icon: <FileCode2 />, path: "/xml-formatter", category: "converters" },
  { title: "CSV ⇄ JSON Converter", icon: <FileSpreadsheet />, path: "/csv-json-converter", category: "converters" },
  { title: "Universal Converter", icon: <FileCode2 />, path: "/universal-converter", category: "converters" },
  { title: "Hash Generator", icon: <Shield />, path: "/hash-generator", category: "security" },
  { title: "Image Enhancer", icon: <Image />, path: "/image-enhancer", category: "design" },
  { title: "Image Compressor", icon: <Image />, path: "/image-compressor", category: "design" },
  { title: "Image Converter", icon: <Repeat />, path: "/image-converter", category: "design" },
  { title: "Base64 Encoder / Decoder", icon: <Binary />, path: "/base64-converter", category: "security" },
  { title: "Weather App", icon: <CloudSun />, path: "/weather-app", category: "utilities" },
  { title: "Simple Calculator", icon: <Calculator />, path: "/calculator", category: "calculators" },
  { title: "Scientific Calculator", icon: <Calculator />, path: "/scientific-calculator", category: "calculators" },
  { title: "Unit Converter", icon: <Weight />, path: "/unit-converter", category: "converters" },
  { title: "Text Utilities", icon: <FileCode2 />, path: "/text-utilities", category: "utilities" },
  { title: "Color Picker", icon: <Droplet />, path: "/color-tools", category: "design" },
  { title: "Regex Tester", icon: <Code />, path: "/regex-tester", category: "developer" },
  { title: "Markdown Previewer", icon: <FileText />, path: "/markdown-previewer", category: "developer" },
  { title: "Date / Time Tools", icon: <Clock />, path: "/datetime-tools", category: "utilities" },
  { title: "JWT Decoder", icon: <Shield />, path: "/jwt-decoder", category: "security" },
  { title: "UUID Generator", icon: <KeyRound />, path: "/uuid-generator", category: "developer" },
  { title: "Base Converter", icon: <Calculator />, path: "/base-converter", category: "developer" },
  { title: "JSON Diff Tool", icon: <FileJson />, path: "/json-diff-tool", category: "developer" },
  { title: "Age Calculator", icon: <Clock />, path: "/age-calculator", category: "utilities" },
  { title: "Number Tools", icon: <Calculator />, path: "/number-tools", category: "calculators" },
  { title: "Morse Code Translator", icon: <Code />, path: "/morse-code", category: "utilities" },
  { title: "Aspect Ratio Calculator", icon: <Maximize2 />, path: "/aspect-ratio", category: "design" },
  { title: "Encrypt / Decrypt Text (AES-256)", icon: <Lock />, path: "/aes-encryptor", category: "security" },
  { title: "Countdown Timer", icon: <TimerReset />, path: "/countdown-timer", category: "utilities" },
];

export default function ServicesGrid({ filteredServices, loading }) {
  if (loading) return <LoadingSkeleton />;

  const displayList = filteredServices?.length ? filteredServices : allServices;

  return (
    <div className="p-6 sm:p-8">
      {displayList.length === 0 ? (
        <p className="text-center text-gray-500">No tools found 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
          {displayList.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link to={service.path}>
                <Card className="cursor-pointer hover:shadow-lg hover:border-indigo-500 transition-all duration-300 border-black/30 bg-white/80 hover:bg-indigo-100 rounded-2xl">
                  <CardHeader className="flex items-center space-x-2">
                    <span className="text-indigo-600 text-xl">{service.icon}</span>
                    <CardTitle className="text-base sm:text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Click to open tool</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

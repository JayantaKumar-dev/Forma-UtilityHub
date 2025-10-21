import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileJson, Shuffle, Shield, Calculator, Droplet, Code, Link2, Image, Clock,
} from "lucide-react";

export default function DocsPage() {
  const categories = [
    {
      title: "Formatters & Validators",
      icon: <FileJson className="text-indigo-500" />,
      desc: "Learn how to format and validate JSON, XML, CSV, and YAML files easily using Forma’s clean and fast UI.",
      tools: [
        { name: "JSON Formatter & Validator", path: "/json-formatter" },
        { name: "XML Formatter", path: "/xml-formatter" },
        { name: "CSV ⇄ JSON Converter", path: "/csv-json-converter" },
        { name: "YAML ⇄ JSON Converter", path: "/yaml-json-converter" },
      ],
    },
    {
      title: "Converters",
      icon: <Shuffle className="text-indigo-500" />,
      desc: "Convert between multiple data formats in just a click — Base64, Units, Numbers, or even complex developer conversions.",
      tools: [
        { name: "Universal Converter", path: "/universal-converter" },
        { name: "Base64 Encoder / Decoder", path: "/base64-converter" },
        { name: "Unit Converter", path: "/unit-converter" },
        { name: "Base Converter", path: "/base-converter" },
      ],
    },
    {
      title: "Security & Encryption",
      icon: <Shield className="text-indigo-500" />,
      desc: "Forma’s security tools help you generate strong passwords, encode data, or encrypt sensitive text securely.",
      tools: [
        { name: "Password Generator", path: "/password-generator" },
        { name: "Hash Generator", path: "/hash-generator" },
        { name: "AES Encrypt / Decrypt", path: "/aes-encryptor" },
        { name: "JWT Decoder", path: "/jwt-decoder" },
        { name: "UUID Generator", path: "/uuid-generator" },
      ],
    },
    {
      title: "Calculators",
      icon: <Calculator className="text-indigo-500" />,
      desc: "Perform calculations like age, aspect ratio, number base conversions, and more — all inside Forma.",
      tools: [
        { name: "Simple Calculator", path: "/calculator" },
        { name: "Scientific Calculator", path: "/scientific-calculator" },
        { name: "Age Calculator", path: "/age-calculator" },
        { name: "Aspect Ratio Calculator", path: "/aspect-ratio" },
        { name: "Number Tools", path: "/number-tools" },
      ],
    },
    {
      title: "Design & Image Tools",
      icon: <Image className="text-indigo-500" />,
      desc: "Enhance, compress, and convert images seamlessly within Forma — no upload required.",
      tools: [
        { name: "Image Enhancer", path: "/image-enhancer" },
        { name: "Image Compressor", path: "/image-compressor" },
        { name: "Image Converter", path: "/image-converter" },
        { name: "Color Picker", path: "/color-tools" },
      ],
    },
    {
      title: "Developer Tools",
      icon: <Code className="text-indigo-500" />,
      desc: "Empowering developers with tools like Regex Tester, Markdown Previewer, JSON Diff, and more for smoother workflows.",
      tools: [
        { name: "Regex Tester", path: "/regex-tester" },
        { name: "Markdown Previewer", path: "/markdown-previewer" },
        { name: "JSON Diff Tool", path: "/json-diff-tool" },
      ],
    },
    {
      title: "Utilities & Misc",
      icon: <Link2 className="text-indigo-500" />,
      desc: "From URL shorteners to weather updates and timers — Forma packs handy utilities for everyday productivity.",
      tools: [
        { name: "URL Shortener", path: "/url-shortener" },
        { name: "QR Code Generator & Scanner", path: "/qr-code" },
        { name: "Weather App", path: "/weather-app" },
        { name: "IP / Location Finder", path: "/ip-finder" },
        { name: "Countdown Timer", path: "/countdown-timer" },
        { name: "Date / Time Tools", path: "/datetime-tools" },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto py-20 px-6"
    >
      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-6 text-indigo-600 text-center">
        Documentation & Help
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
        Explore detailed usage guides and categories for every tool inside{" "}
        <strong>Forma</strong>. Whether you’re a developer, designer, or just exploring — Forma makes your tasks effortless.
      </p>

      {/* Categories Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              {cat.icon}
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {cat.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
              {cat.desc}
            </p>
            <ul className="space-y-2 text-sm">
              {cat.tools.map((tool, i) => (
                <li key={i}>
                  <Link
                    to={tool.path}
                    className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                  >
                    • {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl mx-auto">
          ⚡ Forma is continuously evolving — new tools, optimizations, and
          documentation updates are added regularly.  
          Have a suggestion or idea for a new feature? Reach out on the{" "}
          <Link
            to="/contact"
            className="text-indigo-500 hover:underline"
          >
            Contact Page
          </Link>.
        </p>
      </div>
    </motion.div>
  );
}

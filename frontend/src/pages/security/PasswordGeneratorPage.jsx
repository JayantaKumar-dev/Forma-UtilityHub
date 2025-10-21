import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Copy, KeyRound, RefreshCw } from "lucide-react";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()-_=+[]{}|;:,.<>?";
    if (!charset) return;

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    const generated = Array.from(array, (num) =>
      charset[num % charset.length]
    ).join("");

    setPassword(generated);
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPassword("");
    setCopied(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <KeyRound className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">
            Password Generator
          </h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Create secure passwords instantly 🔒
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Password Length: {length}
          </label>
          <Slider
                min={4}
                max={32}
                step={1}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
            <span className="text-sm">Uppercase</span>
            <Switch
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
            />
          </div>
          <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
            <span className="text-sm">Lowercase</span>
            <Switch
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
            />
          </div>
          <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
            <span className="text-sm">Numbers</span>
            <Switch
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
            />
          </div>
          <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
            <span className="text-sm">Symbols</span>
            <Switch
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <Button
            onClick={generatePassword}
            className="bg-yellow-400 hover:bg-yellow-300 text-black"
          >
            Generate
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-black border-grey/40 hover:bg-white/40"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {password && (
          <motion.div
            className="mt-4 bg-white/10 rounded-lg p-4 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              readOnly
              value={password}
              className="bg-transparent text-yellow-300 text-center font-mono"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, RefreshCw, Copy } from "lucide-react";
import CryptoJS from "crypto-js";

export default function AesEncryptor() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("encrypt");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleEncrypt = () => {
    if (!text || !key) {
      showMessage("⚠️ Please enter text and key!", "error");
      return;
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      setResult(encrypted);
      showMessage("✅ Text encrypted successfully!", "success");
    } catch (e) {
      showMessage("❌ Encryption failed!", "error");
    }
  };

  const handleDecrypt = () => {
    if (!text || !key) {
      showMessage("⚠️ Please enter ciphertext and key!", "error");
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(text, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error("Invalid key or ciphertext");
      setResult(decrypted);
      showMessage("✅ Text decrypted successfully!", "success");
    } catch (e) {
      showMessage("❌ Decryption failed! Check your key or ciphertext.", "error");
    }
  };

  const handleReset = () => {
    setText("");
    setKey("");
    setResult("");
    setMode("encrypt");
    showMessage("🔄 Reset successful!", "info");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
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
        className="w-full max-w-4xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          {mode === "encrypt" ? (
            <Lock className="w-10 h-10 text-green-300 mb-3" />
          ) : (
            <Unlock className="w-10 h-10 text-yellow-300 mb-3" />
          )}
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            AES-256 {mode === "encrypt" ? "Encryption" : "Decryption"} Tool
          </h2>
          <p className="text-sm sm:text-base text-gray-200">
            Securely encrypt or decrypt text using AES algorithm 🔐
          </p>
        </div>

        {/* Message */}
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

        {/* Input Section */}
        <div className="grid gap-4 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "encrypt"
                ? "Enter text to encrypt..."
                : "Enter encrypted text (ciphertext)..."
            }
            className="w-full h-40 p-3 rounded-lg text-black bg-white/90 border border-gray-300 text-sm font-mono"
          />
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full p-2 rounded-lg text-black bg-white/90 border border-gray-300 text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button
            onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold"
          >
            {mode === "encrypt" ? "Encrypt Text" : "Decrypt Text"}
          </Button>
          <Button
            onClick={() => setMode(mode === "encrypt" ? "decrypt" : "encrypt")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            Switch to {mode === "encrypt" ? "Decrypt" : "Encrypt"}
          </Button>
          <Button
            onClick={handleCopy}
            className="bg-blue-400 hover:bg-blue-300 text-black font-semibold"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy Result
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white/10 p-4 rounded-xl shadow-md text-sm font-mono break-all">
            {result}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

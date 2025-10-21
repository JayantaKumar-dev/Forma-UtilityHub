import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Copy, RefreshCw } from "lucide-react";

export default function JwtDecoder() {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState({ header: "", payload: "", signature: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const base64UrlDecode = (str) => {
    try {
      return decodeURIComponent(
        atob(str.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (e) {
      return null;
    }
  };

  const handleDecode = () => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      setDecoded({
        header: JSON.stringify(header, null, 2),
        payload: JSON.stringify(payload, null, 2),
        signature,
      });
      showMessage("✅ JWT Decoded Successfully!", "success");
    } catch {
      showMessage("❌ Invalid JWT Token!", "error");
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showMessage(`📋 ${label} Copied!`);
  };

  const handleReset = () => {
    setJwt("");
    setDecoded({ header: "", payload: "", signature: "" });
    showMessage("🔄 Reset Successful!", "info");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 flex flex-col items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-5xl bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Shield className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">JWT Decoder</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Decode JWT tokens to view header, payload, and signature 🔐
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <p
            className={`text-center mb-4 font-medium ${
              message.type === "success"
                ? "text-green-300"
                : message.type === "error"
                ? "text-red-300"
                : "text-yellow-300"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Input Field */}
        <textarea
          className="w-full p-3 rounded-xl text-black text-base bg-white/90 border border-gray-300 mb-4"
          rows={4}
          placeholder="Paste your JWT token here..."
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          <Button
            onClick={handleDecode}
            className="bg-green-400 hover:bg-green-300 text-black font-semibold"
          >
            Decode JWT
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black border-white/40 hover:bg-white/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Decoded Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Header", "Payload", "Signature"].map((section, index) => (
            <div key={index} className="bg-white/10 p-4 rounded-xl shadow-md relative">
              <h3
                className={`text-lg font-semibold mb-3 ${
                  section === "Header"
                    ? "text-yellow-300"
                    : section === "Payload"
                    ? "text-green-300"
                    : "text-pink-300"
                }`}
              >
                {section}
              </h3>
              <textarea
                readOnly
                rows={section === "Signature" ? 5 : 10}
                className="w-full p-2 rounded-lg text-black bg-white/90 border border-gray-300 text-sm"
                value={decoded[section.toLowerCase()] || ""}
              />
              {decoded[section.toLowerCase()] && (
                <Button
                  onClick={() =>
                    handleCopy(decoded[section.toLowerCase()], section)
                  }
                  className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

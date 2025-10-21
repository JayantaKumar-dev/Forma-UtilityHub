import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, Copy, RefreshCw } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrCodeToolPage() {
  const [text, setText] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Copy scanned text or QR content
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    // Download generated QR Code as an image
  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


  // Start QR Scanner
  const startScanner = () => {
    setShowScanner(true);
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
        setShowScanner(false);
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  const handleClear = () => {
    setText("");
    setScanResult("");
    setCopied(false);
    setShowScanner(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <QrCode className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">
            QR Code Generator & Scanner
          </h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Create or scan QR codes instantly ⚡
          </p>
        </div>

        {/* Input and QR Generator */}
        <div className="flex w-full space-x-2 mb-4">
          <Input
            placeholder="Enter text or URL..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-white/40 text-white placeholder-gray-300 border border-white/30"
          />
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-black border-grey/40 hover:bg-white/40"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {/* QR Generator Output */}
        {text && (
          <motion.div
            className="mt-6 bg-white/10 rounded-lg p-4 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QRCodeCanvas value={text} size={180} bgColor="transparent" />
            <p className="text-sm text-gray-200 break-all">{text}</p>
            <Button
              onClick={() => handleCopy(text)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy Text
            </Button>
            {copied && (
              <p className="text-green-300 text-sm">✅ Copied to clipboard!</p>
            )}
            <Button
                onClick={handleDownload}
                size="sm"
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-400 hover:text-black transition-all"
                >
                ⬇️ Download QR
            </Button>
          </motion.div>
        )}

        {/* Scanner Section */}
        <div className="mt-8 text-center">
          {!showScanner && (
            <Button
              onClick={startScanner}
              className="bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              <Camera className="mr-2 h-4 w-4" /> Start QR Scanner
            </Button>
          )}
          <div id="reader" className="mt-4"></div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <motion.div
            className="mt-6 bg-white/10 rounded-lg p-4 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-gray-200">Scanned QR Content:</p>
            <p className="text-yellow-300 break-all">{scanResult}</p>
            <Button
              onClick={() => handleCopy(scanResult)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy Result
            </Button>
             {copied && (
              <p className="text-green-300 text-sm">✅ Copied to clipboard!</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

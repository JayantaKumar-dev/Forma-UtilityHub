import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, RefreshCw, Download, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [convertedSrc, setConvertedSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const canvasRef = useRef(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setMessage("❌ Please select an image file.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage("⚠️ Only image files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      setConvertedSrc(null);
      setMessage("✅ Image loaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  // Perform conversion
  const convertImage = async () => {
    if (!imageSrc) {
      setMessage("❌ Please upload an image first.");
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let w = resizeWidth ? parseInt(resizeWidth) : img.width;
      let h = resizeHeight ? parseInt(resizeHeight) : img.height;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      let mime = "image/png";
      switch (outputFormat) {
        case "jpg":
          mime = "image/jpeg";
          break;
        case "webp":
          mime = "image/webp";
          break;
        case "bmp":
          mime = "image/bmp";
          break;
        case "gif":
          mime = "image/gif";
          break;
        default:
          mime = "image/png";
      }

      const dataUrl = canvas.toDataURL(mime, quality);
      setConvertedSrc(dataUrl);
      setMessage(`✅ Image converted to ${outputFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Conversion failed. Please try again.");
    }
  };

  const reset = () => {
    setImageSrc(null);
    setConvertedSrc(null);
    setMessage("");
    setResizeWidth("");
    setResizeHeight("");
    setShowAdvanced(false);
  };

  const downloadImage = () => {
    if (!convertedSrc) return;
    const a = document.createElement("a");
    a.href = convertedSrc;
    a.download = `converted.${outputFormat}`;
    a.click();
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-5xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-6">
          <ImageIcon className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">🖼️ Image Converter Pro</h2>
          <p className="text-sm text-gray-200 text-center">
            Convert images between JPG, PNG, WebP, BMP, and GIF formats — all in your browser.
          </p>
        </div>

        {/* Upload */}
        <div className="text-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 text-sm text-gray-900 bg-white/80 rounded-lg cursor-pointer"
          />
        </div>

        {imageSrc && (
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <Button onClick={convertImage} className="bg-yellow-400 text-black">
              Convert Image
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced((s) => !s)}
              className="text-black border-white/40"
            >
              <Settings2 className="w-4 h-4 mr-2" /> Advanced Options
            </Button>

            <Button variant="outline" onClick={reset} className="text-black border-white/40">
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        )}

        {showAdvanced && (
          <motion.div
            className="bg-white/10 p-4 rounded-xl mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-white/80 text-black"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WebP</option>
                  <option value="bmp">BMP</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Quality (only for JPG/WebP)</label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <p className="text-xs mt-1">{Math.round(quality * 100)}%</p>
              </div>

              <div>
                <label className="text-sm">Resize Width (px)</label>
                <input
                  type="number"
                  value={resizeWidth}
                  onChange={(e) => setResizeWidth(e.target.value)}
                  placeholder="Optional"
                  className="w-full mt-1 p-2 rounded-lg bg-white/80 text-black"
                />
              </div>

              <div>
                <label className="text-sm">Resize Height (px)</label>
                <input
                  type="number"
                  value={resizeHeight}
                  onChange={(e) => setResizeHeight(e.target.value)}
                  placeholder="Optional"
                  className="w-full mt-1 p-2 rounded-lg bg-white/80 text-black"
                />
              </div>
            </div>
          </motion.div>
        )}

        {message && (
          <motion.p
            className={`text-center text-sm mb-4 ${
              message.startsWith("✅") ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Before/After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageSrc && (
            <div className="text-center">
              <h4 className="text-sm text-yellow-200 mb-2">Original</h4>
              <img src={imageSrc} alt="Original" className="rounded-lg w-full shadow-md" />
            </div>
          )}

          {convertedSrc && (
            <div className="text-center">
              <h4 className="text-sm text-green-200 mb-2">Converted</h4>
              <img src={convertedSrc} alt="Converted" className="rounded-lg w-full shadow-md" />
            </div>
          )}
        </div>

        {convertedSrc && (
          <div className="flex justify-center mt-6">
            <Button onClick={downloadImage} className="bg-green-400 hover:bg-green-300 text-black">
              <Download className="w-4 h-4 mr-2" /> Download {outputFormat.toUpperCase()}
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </motion.div>
    </motion.div>
  );
}

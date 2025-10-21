import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  SlidersHorizontal,
  RefreshCw,
  Download,
  Settings,
  AlertCircle,
} from "lucide-react";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ImageEnhancer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [enhancedSrc, setEnhancedSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
  });
  const [showAdvanced, setShowAdvanced] = useState(true);
  const canvasRef = useRef(null);

  // 🖼️ Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("❌ Please upload a valid image file (JPG, PNG, etc).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      setEnhancedSrc(null);
      setMessage("✅ Image loaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  // 🔁 Live preview while changing filters
  useEffect(() => {
    if (!imageSrc) return;
    const debouncedEnhance = debounce(() => {
      applyEnhancement(false);
    }, 300);
    debouncedEnhance();
    return () => clearTimeout(debouncedEnhance);
  }, [filters]);

  // 🪄 Apply Enhancements
  const applyEnhancement = async (manual = true) => {
    if (!imageSrc) {
      if (manual) setMessage("❌ Please upload an image before enhancing.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
      ctx.drawImage(img, 0, 0);

      // ✨ Apply Sharpening visibly
      if (filters.sharpness > 0.01 && manual) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const sharpenLevel = filters.sharpness * 2.5; // stronger visible effect
        const kernel = [
          0, -sharpenLevel, 0,
          -sharpenLevel, 1 + 4 * sharpenLevel, -sharpenLevel,
          0, -sharpenLevel, 0,
        ];

        const copy = new Uint8ClampedArray(data);
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const px = (y + ky) * canvas.width + (x + kx);
                const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                r += copy[px * 4] * weight;
                g += copy[px * 4 + 1] * weight;
                b += copy[px * 4 + 2] * weight;
              }
            }
            const idx = (y * canvas.width + x) * 4;
            data[idx] = Math.min(255, Math.max(0, r));
            data[idx + 1] = Math.min(255, Math.max(0, g));
            data[idx + 2] = Math.min(255, Math.max(0, b));
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const finalDataURL = canvas.toDataURL("image/png");
      const file = await imageCompression.getFilefromDataUrl(finalDataURL, "enhanced.png");
      const compressedDataUrl = await imageCompression.getDataUrlFromFile(file);
      setEnhancedSrc(compressedDataUrl);
      if (manual) setMessage("✅ Enhancement applied successfully!");
    };

    img.onerror = () => setMessage("❌ Failed to load image. Please try again.");
    img.src = imageSrc;
  };

  // ♻️ Reset all
  const reset = () => {
    setImageSrc(null);
    setEnhancedSrc(null);
    setMessage("");
    setFilters({ brightness: 100, contrast: 100, saturation: 100, sharpness: 0 });
  };

  // 💾 Download handler
  const handleDownload = (format) => {
    if (!enhancedSrc) return;
    const link = document.createElement("a");
    link.href = enhancedSrc.replace("image/png", `image/${format}`);
    link.download = `enhanced.${format}`;
    link.click();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-3 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <SlidersHorizontal className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Image Quality Enhancer</h2>
          <p className="text-sm text-gray-200 text-center">
            Adjust brightness, contrast, saturation & sharpness 🎨
          </p>
        </div>

        {/* Upload Input */}
        <div className="text-center mb-4 flex flex-col sm:flex-row justify-center items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full sm:w-auto text-sm text-gray-900 bg-white/80 rounded-lg cursor-pointer px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        {/* Advanced Settings */}
        {imageSrc && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mb-3 bg-yellow-300 text-black hover:bg-yellow-400"
            >
              <Settings className="w-4 h-4 mr-2" /> {showAdvanced ? "Hide" : "Show"} Advanced Options
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="flex justify-between capitalize">
                      <span>{key}</span> <span>{value}{key === "sharpness" ? "" : "%"}</span>
                    </label>
                    <input
                      type="range"
                      min={key === "sharpness" ? "0" : "50"}
                      max={key === "sharpness" ? "1" : "150"}
                      step={key === "sharpness" ? "0.01" : "1"}
                      value={value}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: parseFloat(e.target.value) })
                      }
                      className="w-full accent-yellow-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={() => applyEnhancement(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
            <ImageIcon className="w-4 h-4 mr-2" /> Apply Enhancement
          </Button>
          <Button variant="outline" onClick={reset} className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Message */}
        {message && (
          <motion.p
            className={`flex items-center justify-center gap-2 text-center text-sm mb-4 ${
              message.startsWith("✅") ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message.startsWith("❌") && <AlertCircle className="w-4 h-4" />}
            {message}
          </motion.p>
        )}

        {/* Image Previews */}
        {imageSrc && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h4 className="text-sm mb-2">Original Image</h4>
              <img src={imageSrc} alt="Original" className="rounded-lg w-full shadow-lg" />
            </div>

            {enhancedSrc && (
              <div className="text-center">
                <h4 className="text-sm mb-2">Enhanced Image</h4>
                <img src={enhancedSrc} alt="Enhanced" className="rounded-lg w-full shadow-lg" />
                <div className="flex justify-center gap-3 mt-3 flex-wrap">
                  <Button onClick={() => handleDownload("png")} className="bg-green-400 text-black hover:bg-green-500">
                    <Download className="w-4 h-4 mr-1" /> PNG
                  </Button>
                  <Button onClick={() => handleDownload("jpeg")} className="bg-blue-400 text-black hover:bg-blue-500">
                    <Download className="w-4 h-4 mr-1" /> JPG
                  </Button>
                  <Button onClick={() => handleDownload("webp")} className="bg-pink-400 text-black hover:bg-pink-500">
                    <Download className="w-4 h-4 mr-1" /> WebP
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </motion.div>
    </motion.div>
  );
}

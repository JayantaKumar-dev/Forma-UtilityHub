import { useState } from "react";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Upload, Minimize2 as Compress, Download, RefreshCw, Settings2 } from "lucide-react";


export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [message, setMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("❌ Please upload a valid image file.");
      return;
    }

    setOriginalImage(file);
    setCompressedImage(null);
    setOriginalSize((file.size / 1024 / 1024).toFixed(2));
    setMessage("✅ Image loaded successfully!");
  };

  const compressImage = async () => {
    if (!originalImage) {
      setMessage("❌ Please upload an image before compressing.");
      return;
    }

    try {
      const options = {
        maxSizeMB: Number(maxSizeMB),
        maxWidthOrHeight: width ? Number(width) : undefined,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      const compressed = await imageCompression(originalImage, options);
      const compressedBlob = await imageCompression.getDataUrlFromFile(compressed);

      setCompressedImage(compressedBlob);
      setCompressedSize((compressed.size / 1024 / 1024).toFixed(2));
      setMessage("✅ Image compressed successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error compressing image. Please try again.");
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setMessage("");
    setQuality(80);
    setMaxSizeMB(1);
    setWidth("");
    setHeight("");
  };

  const downloadImage = (format) => {
    if (!compressedImage) return;
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed.${format}`;
    link.click();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-3xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-6">
          <Compress className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">Image Compressor</h2>
          <p className="text-sm text-gray-200 text-center">
            Compress images without losing quality ⚡
          </p>
        </div>

        {/* File Input */}
        <div className="text-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mx-auto mb-4 text-sm text-gray-900 bg-white/80 rounded-lg cursor-pointer"
          />
        </div>

        {/* Advanced Settings */}
        <div className="flex justify-center mb-3">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            className="border-white/40 text-black bg-yellow-300 hover:bg-yellow-400"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            {showAdvanced ? "Hide Advanced" : "Advanced Settings"}
          </Button>
        </div>

        {showAdvanced && (
          <motion.div
            className="bg-white/10 p-4 rounded-xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="flex justify-between text-sm mb-2">
              <span>Quality</span> <span>{quality}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full accent-yellow-400 mb-4"
            />

            <label className="flex justify-between text-sm mb-2">
              <span>Max Size (MB)</span> <span>{maxSizeMB} MB</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="5"
              step="0.1"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(e.target.value)}
              className="w-full accent-yellow-400 mb-4"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-md px-2 py-1 text-black"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="text-sm">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-md px-2 py-1 text-black"
                  placeholder="auto"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <Button onClick={compressImage} className="bg-orange-400 text-black hover:bg-orange-500">
            <Compress className="w-4 h-4 mr-2" /> Compress
          </Button>
          <Button variant="outline" onClick={reset} className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Message */}
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

        {/* Image Preview */}
        <div className="grid md:grid-cols-2 gap-6 text-center">
          {originalImage && (
            <div>
              <h3 className="font-semibold mb-2">Original Image</h3>
              <img
                src={URL.createObjectURL(originalImage)}
                alt="original"
                className="rounded-lg w-full object-contain"
              />
              <p className="text-xs mt-1 text-gray-300">{originalSize} MB</p>
            </div>
          )}

          {compressedImage && (
            <div>
              <h3 className="font-semibold mb-2">Compressed Image</h3>
              <img
                src={compressedImage}
                alt="compressed"
                className="rounded-lg w-full object-contain"
              />
              <p className="text-xs mt-1 text-gray-300">{compressedSize} MB</p>

              {/* Download Options */}
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => downloadImage("png")}
                  className="bg-green-400 text-black"
                >
                  <Download className="w-4 h-4 mr-1" /> PNG
                </Button>
                <Button
                  size="sm"
                  onClick={() => downloadImage("jpg")}
                  className="bg-blue-400 text-black"
                >
                  <Download className="w-4 h-4 mr-1" /> JPG
                </Button>
                <Button
                  size="sm"
                  onClick={() => downloadImage("webp")}
                  className="bg-pink-400 text-black"
                >
                  <Download className="w-4 h-4 mr-1" /> WebP
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

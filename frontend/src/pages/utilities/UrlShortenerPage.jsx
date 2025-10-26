// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function UrlShortenerPage() {
//   const [url, setUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");

//   const handleShorten = async () => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/v1/url/shorten?originalUrl=${encodeURIComponent(url)}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ originalUrl: url }),
//       });
//       const data = await res.json();
//       setShortUrl(`http://localhost:8080/api/v1/url/${data.shortCode}`);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-8">
//       <h2 className="text-2xl font-bold mb-4">URL Shortener</h2>
//       <div className="flex w-full max-w-lg space-x-2">
//         <Input
//           placeholder="Enter your long URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <Button onClick={handleShorten}>Shorten</Button>
//       </div>
//       {shortUrl && (
//         <p className="mt-4">
//           Shortened URL:{" "}
//           <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
//             {shortUrl}
//           </a>
//         </p>
//       )}
//     </div>
//   );
// }




import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Link2, RefreshCw } from "lucide-react";

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleShorten = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL!");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/url/shorten?originalUrl=${encodeURIComponent(url)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!res.ok) throw new Error("Failed to shorten URL");
      const data = await res.json();

      setShortUrl(`${BASE_URL}/api/v1/url/${data.shortCode}`);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setUrl("");
    setShortUrl("");
    setError("");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
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
          <Link2 className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">URL Shortener</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Paste your long link and get a short one instantly ⚡
          </p>
        </div>

        <div className="flex w-full space-x-2 mb-4">
          <Input
            placeholder="Enter your long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-white/40 text-white placeholder-gray-300 border border-white/30"
          />
          <Button
            onClick={handleShorten}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 text-black"
          >
            {loading ? "Shortening..." : "Shorten"}
          </Button>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-black border-grey/40 hover:bg-white/40"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {error && (
          <p className="text-red-300 text-sm mt-3 text-center">{error}</p>
        )}

        {shortUrl && (
          <motion.div
            className="mt-6 bg-white/10 rounded-lg p-4 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-gray-200">Your shortened URL:</p>
            <div className="flex items-center space-x-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 underline break-all"
              >
                {shortUrl}
              </a>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-green-300 text-sm">✅ Copied to clipboard!</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

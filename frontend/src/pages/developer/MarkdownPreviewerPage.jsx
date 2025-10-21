import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardCopy, RefreshCw, FileText, Check } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function MarkdownPreviewerPage() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer!

Type **Markdown** on the left ✍️  
See the **preview** on the right ⚡

### Features:
- **Bold**, *italic*, ~~strikethrough~~
- [Links](https://example.com)
- \`Inline code\`
- \`\`\`js
function hello() {
  console.log("Hello Markdown!");
}
\`\`\`

Enjoy writing!
`);
  const [copied, setCopied] = useState(false);

  const htmlContent = DOMPurify.sanitize(marked.parse(markdown));

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMarkdown("");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white p-4 sm:p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-7xl bg-black/30 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <FileText className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Markdown Previewer</h2>
          <p className="text-sm sm:text-base text-gray-200">
            Write Markdown on the left — see live HTML preview on the right
          </p>
        </div>

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-200">
              Markdown Editor ✍️
            </h3>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[50vh] sm:h-[55vh] lg:h-[65vh] p-3 sm:p-4 bg-white/40 text-black rounded-lg border border-white/30 focus:ring-2 focus:ring-yellow-300 resize-none font-mono text-sm sm:text-base overflow-auto"
              placeholder="Write your Markdown here..."
            />
          </div>

          {/* Preview Section */}
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between items-center mb-2 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-green-200">
                Preview 🪄
              </h3>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                <Button
                  onClick={handleCopy}
                  className="bg-green-400 hover:bg-green-300 text-black text-sm sm:text-base flex items-center"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <ClipboardCopy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy HTML"}
                </Button>

                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="text-black border-white/40 hover:bg-white/40 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Clear
                </Button>
              </div>
            </div>

            {/* Preview Box */}
            <motion.div
              className="bg-white/10 text-left text-gray-100 p-3 sm:p-4 rounded-lg h-[50vh] sm:h-[55vh] lg:h-[65vh] overflow-y-auto prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

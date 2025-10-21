import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, Check, RefreshCw, FileCode2, DownloadCloud } from "lucide-react";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

export default function XmlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
  };

  const builderOptions = {
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
    format: true,
    indentBy: "  ",
    supressEmptyNode: true,
  };

  const isEmpty = (s) => !s || s.trim().length === 0;

  // Validate XML
  const handleValidate = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste XML content to validate.");
      return;
    }
    const validationResult = XMLValidator.validate(input);
    if (validationResult === true) {
      setMessage("✅ XML is valid!");
    } else {
      // validationResult is object with err info
      const err = validationResult;
      // fast-xml-parser returns error with msg and (sometimes) position info
      const msg = err?.err?.msg || err?.msg || JSON.stringify(err);
      setMessage(`❌ XML Validation Error: ${msg}`);
    }
  };

  // Beautify / Format XML
  const handleBeautify = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste XML to beautify.");
      return;
    }
    const valid = XMLValidator.validate(input);
    if (valid !== true) {
      setMessage("❌ Can't beautify: XML is invalid. Try Fix Errors first.");
      return;
    }
    try {
      const parser = new XMLParser(parserOptions);
      const obj = parser.parse(input);
      const builder = new XMLBuilder({ ...builderOptions, format: true });
      const xml = builder.build(obj);
      setOutput(xml);
      setMessage("✅ XML beautified!");
    } catch (err) {
      setMessage("❌ Beautify error: " + (err?.message || String(err)));
    }
  };

  // Minify XML (remove pretty spacing)
  const handleMinify = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste XML to minify.");
      return;
    }
    const valid = XMLValidator.validate(input);
    if (valid !== true) {
      setMessage("❌ Can't minify: XML is invalid. Try Fix Errors first.");
      return;
    }
    try {
      // parse then re-build without format
      const parser = new XMLParser(parserOptions);
      const obj = parser.parse(input);
      const builder = new XMLBuilder({ ...builderOptions, format: false, indentBy: "" });
      const xml = builder.build(obj);
      setOutput(xml);
      setMessage("✅ XML minified!");
    } catch (err) {
      setMessage("❌ Minify error: " + (err?.message || String(err)));
    }
  };

  // XML -> JSON
  const handleXmlToJson = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste XML to convert.");
      return;
    }
    const valid = XMLValidator.validate(input);
    if (valid !== true) {
      setMessage("❌ Can't convert: XML invalid. Try Fix Errors first.");
      return;
    }
    try {
      const parser = new XMLParser(parserOptions);
      const obj = parser.parse(input);
      const json = JSON.stringify(obj, null, 2);
      setOutput(json);
      setMessage("✅ XML converted to JSON!");
    } catch (err) {
      setMessage("❌ Conversion error: " + (err?.message || String(err)));
    }
  };

  // JSON -> XML
  const handleJsonToXml = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste JSON to convert.");
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(input);
    } catch (err) {
      setMessage("❌ Invalid JSON: " + (err?.message || String(err)));
      return;
    }
    try {
      const builder = new XMLBuilder(builderOptions);
      const xml = builder.build(parsed);
      setOutput(xml);
      setMessage("✅ JSON converted to XML!");
    } catch (err) {
      setMessage("❌ JSON→XML error: " + (err?.message || String(err)));
    }
  };

  // Simple attempts to auto-fix common XML mistakes:
  // - Replace stray & with &amp; (but not &amp; already)
  // - Replace tabs with two spaces
  // - If multiple top-level nodes exist, wrap in <root> .. </root>
  // - Try to close lone opening tags? (limited)
  const tryAutoFixXml = (text) => {
    if (!text) return text;
    let t = text;

    // Replace bare & (not part of &xxx;) -> &amp;
    // Simple regex: replace & that is not followed by word+; or #...
    t = t.replace(/&(?!(#[0-9]+|[a-zA-Z]+;))/g, "&amp;");

    // Replace tabs
    t = t.replace(/\t/g, "  ");

    // Trim repeated blank lines
    t = t.replace(/\n{3,}/g, "\n\n");

    // If multiple root-level elements (very common when user pasted concatenated fragments),
    // detect by counting top-level tags: simple heuristic — count occurrences of "<tag"
    // We'll attempt to wrap entire content in <root>...</root> if validator fails.
    return t;
  };

  // Fix errors handler: try JSON fixes first, else try XML fixes
  const handleFixErrors = () => {
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("⚠️ Please paste XML or JSON to fix.");
      return;
    }

    // First try JSON auto-fix strategies (if user intended JSON)
    try {
      // attempt to auto-correct common JSON mistakes:
      let jsonCandidate = input
        .replace(/(['"])?([A-Za-z0-9_]+)(['"])?:/g, '"$2":') // ensure keys quoted
        .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
        .replace(/'/g, '"'); // single -> double quotes

      // parse
      const parsedJson = JSON.parse(jsonCandidate);
      const pretty = JSON.stringify(parsedJson, null, 2);
      setInput(pretty);
      setOutput(pretty);
      setMessage("✅ Auto-fixed input as JSON.");
      return;
    } catch {
      // Not JSON / can't fix as JSON — continue to XML attempts
    }

    // Try simple XML fixes
    try {
      let tryText = tryAutoFixXml(input);

      // If validation fails, try wrapping in <root> if multiple top-level nodes suspected
      let validation = XMLValidator.validate(tryText);
      if (validation !== true) {
        // attempt to wrap html-like fragments if there are more than one top-level tags
        // naive detection: count number of top-level opening tags occurrences
        const stripped = tryText.replace(/<!--[\s\S]*?-->/g, ""); // remove comments
        const openTags = (stripped.match(/<([a-zA-Z0-9\-_]+)(\s|>)/g) || []).length;
        const closeTags = (stripped.match(/<\/([a-zA-Z0-9\-_]+)\s*>/g) || []).length;

        if (openTags > 1 && openTags === closeTags) {
          // possibly multiple siblings but balanced — still try root wrap
          tryText = `<root>\n${tryText}\n</root>`;
        } else if (validation && typeof validation === "object" && validation.err) {
          // If err mentions unclosed tag or unexpected end, try to escape lone &
          tryText = tryText.replace(/&(?!(#[0-9]+|[a-zA-Z]+;))/g, "&amp;");
        }
      }

      validation = XMLValidator.validate(tryText);
      if (validation === true) {
        const parser = new XMLParser(parserOptions);
        const obj = parser.parse(tryText);
        const builder = new XMLBuilder({ ...builderOptions, format: true });
        const xmlOut = builder.build(obj);
        setInput(tryText);
        setOutput(xmlOut);
        setMessage("✅ Auto-fixed XML (best-effort).");
        return;
      } else {
        // Could not fix
        setMessage("❌ Could not auto-fix XML. Try manual edits (check tags, quotes, & chars).");
        setOutput("");
      }
    } catch (err) {
      setMessage("❌ Auto-fix error: " + (err?.message || String(err)));
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (isEmpty(output)) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (isEmpty(output)) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.xml";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMessage("");
    setCopied(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-4xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <FileCode2 className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">XML Formatter & Converter</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Validate, Beautify, Minify, Convert XML ↔ JSON, or try auto-fix ✨
          </p>
        </div>

        <Textarea
          placeholder="Paste XML or JSON (for JSON→XML) here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-56"
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={handleValidate} className="bg-blue-500 hover:bg-blue-400 text-black">
            Validate
          </Button>
          <Button onClick={handleBeautify} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            Beautify
          </Button>
          <Button onClick={handleMinify} className="bg-green-400 hover:bg-green-300 text-black">
            Minify
          </Button>
          <Button onClick={handleXmlToJson} className="bg-pink-400 hover:bg-pink-300 text-black">
            XML → JSON
          </Button>
          <Button onClick={handleJsonToXml} className="bg-indigo-400 hover:bg-indigo-300 text-black">
            JSON → XML
          </Button>
          <Button onClick={handleFixErrors} className="bg-orange-400 hover:bg-orange-300 text-black">
            Auto-Fix
          </Button>
          <Button onClick={handleClear} variant="outline" className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {message && (
          <motion.p className={`text-sm text-center mb-3 ${message.includes("✅") ? "text-green-300" : "text-red-300"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {message}
          </motion.p>
        )}

        {/* Output */}
        {output && (
          <motion.div className="relative bg-white/10 p-4 rounded-lg text-sm text-left text-gray-100 font-mono overflow-y-auto max-h-64 whitespace-pre-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <pre>{output}</pre>

            {/* Fixed floating action buttons */}
            <div className="fixed bottom-6 right-6 flex space-x-3 z-50">
              <Button size="sm" variant="ghost" className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition" onClick={handleDownload}>
                <DownloadCloud className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

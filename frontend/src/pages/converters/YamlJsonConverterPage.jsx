import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ClipboardCopy, Check, RefreshCw, Shuffle } from "lucide-react";
import yaml from "js-yaml";

export default function YamlJsonConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Helpers
  const isEmpty = (s) => !s || s.trim().length === 0;

  // Try JSON.parse — returns {ok: true, value} or {ok:false, err}
  const tryParseJson = (text) => {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch (err) {
      return { ok: false, err };
    }
  };

  // Try YAML load — returns {ok: true, value} or {ok:false, err}
  const tryParseYaml = (text) => {
    try {
      return { ok: true, value: yaml.load(text) };
    } catch (err) {
      return { ok: false, err };
    }
  };

  // Determine if YAML parsing result looks like "structured" YAML (object/array) or a scalar
  const yamlLooksStructured = (parsedValue, rawText) => {
    if (parsedValue !== null && typeof parsedValue === "object") return true;
    // For scalars, require signs that user intended YAML: colon (key:), list marker (- ), or multiline
    const hints = [":", "\n-", "\n  ", "\n"];
    const hasHint = hints.some((h) => rawText.includes(h));
    // Also if rawText contains leading dash or multiple lines treat as structured
    if (rawText.trim().startsWith("- ") || rawText.includes("\n")) return true;
    return hasHint;
  };

  // Build helpful YAML parse error message using err.mark (if present)
  const yamlErrorMessage = (err) => {
    if (!err) return "Unknown YAML parse error";
    // js-yaml error typically has message and mark (with line/column)
    const base = err?.message || String(err);
    if (err.mark && typeof err.mark.line === "number") {
      const line = err.mark.line + 1;
      const col = err.mark.column + 1;
      return `${base} (line ${line}, column ${col})`;
    }
    return base;
  };

  // Actions

  const handleYamlToJson = () => {
    setCopied(false);
    setOutput("");
    setError("");

    if (isEmpty(input)) {
      setError("❌ Please enter YAML input first.");
      return;
    }

    // If user actually entered JSON, require them to use JSON → YAML
    const jsonAttempt = tryParseJson(input);
    if (jsonAttempt.ok) {
      setError("❌ Input appears to be JSON. Use the JSON → YAML button instead.");
      return;
    }

    const yamlAttempt = tryParseYaml(input);
    if (!yamlAttempt.ok) {
      setError(`❌ YAML Parsing Error: ${yamlErrorMessage(yamlAttempt.err)}`);
      return;
    }

    const parsed = yamlAttempt.value;
    // Accept conversion only if YAML parsed into structured data OR input suggests YAML intention
    if (!yamlLooksStructured(parsed, input)) {
      setError("❌ Input parsed as a YAML scalar (plain text). Not converting to JSON.");
      return;
    }

    try {
      const json = JSON.stringify(parsed, null, 2);
      setOutput(json);
      setError("✅ YAML converted to JSON successfully!");
    } catch (err) {
      setOutput("");
      setError(`❌ Conversion failed: ${String(err)}`);
    }
  };

  const handleJsonToYaml = () => {
    setCopied(false);
    setOutput("");
    setError("");

    if (isEmpty(input)) {
      setError("❌ Please enter JSON input first.");
      return;
    }

    const jsonAttempt = tryParseJson(input);
    if (!jsonAttempt.ok) {
      setError("❌ Invalid JSON: " + (jsonAttempt.err?.message || String(jsonAttempt.err)));
      return;
    }

    // If JSON parsed, convert to YAML
    try {
      const yamlText = yaml.dump(jsonAttempt.value, { indent: 2 });
      setOutput(yamlText);
      setError("✅ JSON converted to YAML successfully!");
    } catch (err) {
      setOutput("");
      setError("❌ Conversion failed: " + String(err));
    }
  };

  const handleValidate = () => {
    setCopied(false);
    setOutput("");
    setError("");

    if (isEmpty(input)) {
      setError("❌ Please enter input to validate (JSON or YAML).");
      return;
    }

    // First test JSON strictly
    const jsonAttempt = tryParseJson(input);
    if (jsonAttempt.ok) {
      setError("✅ Valid JSON format!");
      return;
    }

    // Then test YAML — but only declare valid if structured or clearly YAML-ish
    const yamlAttempt = tryParseYaml(input);
    if (!yamlAttempt.ok) {
      setError(`❌ YAML Validation Error: ${yamlErrorMessage(yamlAttempt.err)}`);
      return;
    }

    const parsed = yamlAttempt.value;
    if (!yamlLooksStructured(parsed, input)) {
      // For scalars (like "hello") we treat them as ambiguous, not "valid YAML file"
      setError("❌ Input is a YAML scalar (plain text). Not considered a valid JSON/YAML document.");
      return;
    }

    setError("✅ Valid YAML format!");
  };

  const handleBeautifyYaml = () => {
    setCopied(false);
    setOutput("");
    setError("");

    if (isEmpty(input)) {
      setError("❌ Please enter YAML input to beautify.");
      return;
    }

    // If input is JSON, avoid beautifying as YAML — ask to use JSON→YAML
    const jsonAttempt = tryParseJson(input);
    if (jsonAttempt.ok) {
      setError("❌ Input appears to be JSON. Use JSON → YAML to convert (then you'll have beautified YAML).");
      return;
    }

    const yamlAttempt = tryParseYaml(input);
    if (!yamlAttempt.ok) {
      setError(`❌ YAML Beautify Error: ${yamlErrorMessage(yamlAttempt.err)}`);
      return;
    }

    const parsed = yamlAttempt.value;
    if (!yamlLooksStructured(parsed, input)) {
      setError("❌ Input parsed as YAML scalar — nothing to beautify.");
      return;
    }

    try {
      const beautified = yaml.dump(parsed, { indent: 2 });
      setOutput(beautified);
      setError("✅ YAML beautified successfully!");
    } catch (err) {
      setOutput("");
      setError("❌ Beautify failed: " + String(err));
    }
  };

  const handleCopy = () => {
    if (isEmpty(output)) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  // UI
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4 sm:p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-5xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <Shuffle className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">YAML ⇄ JSON Converter & Validator</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">
            Convert, Validate, and Beautify YAML or JSON easily ⚡
          </p>
        </div>

        {/* Input / Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Textarea
            placeholder="Enter YAML or JSON input here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white/40 text-black border border-white/30 rounded-lg h-72"
          />

          <div className="relative">
            <Textarea
              placeholder="Output will appear here..."
              value={output}
              readOnly
              className="bg-white/10 text-gray-100 border border-white/30 rounded-lg h-72 font-mono overflow-y-auto whitespace-pre-wrap"
            />

            {/* Floating copy button — placed outside the scroll area (absolute within the right column) */}
            {output && (
              <div className="absolute top-3 right-3 z-20">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={handleYamlToJson} className="bg-yellow-400 hover:bg-yellow-300 text-black" disabled={isEmpty(input)}>
            YAML → JSON
          </Button>
          <Button onClick={handleJsonToYaml} className="bg-green-400 hover:bg-green-300 text-black" disabled={isEmpty(input)}>
            JSON → YAML
          </Button>
          <Button onClick={handleValidate} className="bg-blue-400 hover:bg-blue-300 text-black" disabled={isEmpty(input)}>
            Validate
          </Button>
          <Button onClick={handleBeautifyYaml} className="bg-pink-400 hover:bg-pink-300 text-black" disabled={isEmpty(input)}>
            Beautify YAML
          </Button>
          <Button onClick={handleClear} variant="outline" className="text-black border-white/40">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Message */}
        {error && (
          <motion.p
            className={`text-sm text-center ${error.includes("✅") ? "text-green-300" : "text-red-300"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

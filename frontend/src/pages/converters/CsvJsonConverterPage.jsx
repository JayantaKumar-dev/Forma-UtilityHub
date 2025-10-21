import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ClipboardCopy, Check, RefreshCw, FileSpreadsheet } from "lucide-react";

/**
 * CsvJsonConverterPage.jsx
 * - Beautify CSV button fixed and functional
 * - No external toast lib required; uses inline messages
 */

export default function CsvJsonConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState(""); // show success/error messages here
  const [copied, setCopied] = useState(false);

  const isEmpty = (s) => !s || s.trim() === "";

  // --- Utility helpers ---
  const splitLines = (text) => text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.length > 0);

  // CSV -> JSON
  const handleCsvToJson = () => {
    setCopied(false);
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("❌ Please paste CSV input first.");
      return;
    }

    try {
      const lines = splitLines(input);
      if (lines.length < 1) throw new Error("CSV must have at least one row (header).");

      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1);
      const arr = rows.map((row, rIndex) => {
        const cols = row.split(",");
        if (cols.length !== headers.length) {
          // allow but warn
          // pad missing with empty string or trim extra
          const padded = headers.map((_, i) => (typeof cols[i] !== "undefined" ? cols[i].trim() : ""));
          return headers.reduce((obj, h, i) => ((obj[h] = padded[i]), obj), {});
        }
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = cols[i] ? cols[i].trim() : "";
        });
        return obj;
      });

      setOutput(JSON.stringify(arr, null, 2));
      setMessage(`✅ CSV converted to JSON (${rows.length} rows).`);
    } catch (err) {
      setOutput("");
      setMessage(`❌ CSV → JSON Error: ${err.message || String(err)}`);
    }
  };

  // JSON -> CSV
  const handleJsonToCsv = () => {
    setCopied(false);
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("❌ Please paste JSON input first.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setMessage("❌ JSON must be a non-empty array of objects.");
        return;
      }

      const first = parsed[0];
      if (typeof first !== "object" || first === null) {
        setMessage("❌ JSON array items must be objects.");
        return;
      }

      const headers = Object.keys(first);
      const csvLines = [headers.join(",")];

      parsed.forEach((obj) => {
        const row = headers.map((h) => {
          let val = obj[h];
          if (val === null || typeof val === "undefined") return "";
          if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          const s = String(val);
          // if contains comma or quotes or newline, quote it
          if (s.includes(",") || s.includes('"') || s.includes("\n")) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        });
        csvLines.push(row.join(","));
      });

      setOutput(csvLines.join("\n"));
      setMessage(`✅ JSON converted to CSV (${parsed.length} rows).`);
    } catch (err) {
      setOutput("");
      setMessage(`❌ JSON → CSV Error: ${err.message || String(err)}`);
    }
  };

  // Beautify JSON (if input is JSON)
  const handleBeautifyJson = () => {
    setCopied(false);
    setOutput("");
    setMessage("");
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setOutput(formatted);
      setMessage("✅ JSON beautified.");
    } catch {
      setMessage("❌ Input is not valid JSON.");
    }
  };

  // Beautify CSV: align columns and trim cells
  const handleBeautifyCsv = () => {
    setCopied(false);
    setOutput("");
    setMessage("");

    if (isEmpty(input)) {
      setMessage("❌ Please paste CSV input first.");
      return;
    }

    try {
      const lines = splitLines(input).map((ln) =>
        // split CSV respecting simple quoted fields (not covering all edge cases but good for common CSVs)
        // We'll do a simple CSV parsing that handles quoted commas
        (() => {
          const result = [];
          let cur = "";
          let inQuotes = false;
          for (let i = 0; i < ln.length; i++) {
            const ch = ln[i];
            if (ch === '"' && ln[i + 1] === '"') {
              // escaped quote
              cur += '"';
              i++;
              continue;
            }
            if (ch === '"') {
              inQuotes = !inQuotes;
              continue;
            }
            if (ch === "," && !inQuotes) {
              result.push(cur.trim());
              cur = "";
              continue;
            }
            cur += ch;
          }
          result.push(cur.trim());
          return result;
        })()
      );

      // find col count from header (first row) or maximum
      const colCount = Math.max(...lines.map((r) => r.length));
      const colWidths = new Array(colCount).fill(0);
      lines.forEach((row) => {
        for (let i = 0; i < colCount; i++) {
          const cell = row[i] ?? "";
          colWidths[i] = Math.max(colWidths[i], String(cell).length);
        }
      });

      // Build beautified CSV with padded columns separated by " , "
      const beautifiedLines = lines.map((row) =>
        row
          .map((cell, i) => {
            const s = cell ?? "";
            // if cell contains comma or quote, keep quotes and escape existing quotes
            if (s.includes(",") || s.includes('"') || s.includes("\n")) {
              return `"${String(s).replace(/"/g, '""')}"`;
            }
            // pad for visual alignment (non-essential for CSV validity)
            return String(s).padEnd(colWidths[i], " ");
          })
          .join(" , ")
      );

      // Set beautified into input (so user can edit), and also set output as beautified
      const beautifiedText = beautifiedLines.join("\n");
      setOutput(beautifiedText);
      setMessage(`✅ CSV beautified (${lines.length} rows, ${colCount} cols).`);
    } catch (err) {
      setOutput("");
      setMessage(`❌ Beautify CSV Error: ${err.message || String(err)}`);
    }
  };

  // Simple "fix formatting" that tries to convert single-line JSON-ish input to valid JSON (small fixes)
  const handleFixFormatting = () => {
    setCopied(false);
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("❌ Please paste content to fix.");
      return;
    }

    // Try JSON-style fixes
    try {
      let candidate = input
        .replace(/,\s*([}\]])/g, "$1") // remove trailing commas
        .replace(/(['`])([^'`]+)\1/g, '"$2"') // 'a' -> "a" (best-effort)
        .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":'); // unquoted keys -> quoted

      const parsed = JSON.parse(candidate);
      setOutput(JSON.stringify(parsed, null, 2));
      setMessage("✅ Auto-fixed and parsed as JSON.");
      return;
    } catch {
      // continue to CSV fixes
    }

    // Try CSV fixes: normalize separators, collapse multiple spaces
    try {
      let t = input.replace(/\t/g, ",").replace(/;+/g, ",");
      // if it looks like CSV headerless, attempt no more
      // fallback: just normalize newlines and commas
      setOutput(t);
      setMessage("✅ Attempted CSV normalization (basic).");
    } catch (err) {
      setMessage(`❌ Fix failed: ${err.message || String(err)}`);
    }
  };

  const handleValidate = () => {
    setCopied(false);
    setOutput("");
    setMessage("");
    if (isEmpty(input)) {
      setMessage("❌ Please paste JSON/CSV to validate.");
      return;
    }

    // Try JSON parse
    try {
      JSON.parse(input);
      setMessage("✅ Valid JSON.");
      return;
    } catch {
      // not JSON
    }

    // Try CSV validation: ensure equal columns per row
    try {
      const lines = splitLines(input);
      if (lines.length === 0) {
        setMessage("❌ Empty input.");
        return;
      }
      const counts = lines.map((ln) => {
        // respect quoted fields simplistically
        let inQuotes = false;
        let cols = 1;
        for (let i = 0; i < ln.length; i++) {
          const ch = ln[i];
          if (ch === '"' && ln[i + 1] === '"') {
            i++;
            continue;
          }
          if (ch === '"') {
            inQuotes = !inQuotes;
            continue;
          }
          if (ch === "," && !inQuotes) cols++;
        }
        return cols;
      });
      const expected = counts[0];
      for (let i = 1; i < counts.length; i++) {
        if (counts[i] !== expected) {
          setMessage(`❌ CSV Validation: row ${i + 1} has ${counts[i]} columns (expected ${expected}).`);
          return;
        }
      }
      setMessage(`✅ CSV looks valid (${counts.length} rows, ${expected} columns).`);
    } catch (err) {
      setMessage(`❌ Validation error: ${err.message || String(err)}`);
    }
  };

  const handleCopyOutput = () => {
    if (isEmpty(output)) {
      setMessage("❌ Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopied(true);
    setMessage("✅ Copied to clipboard.");
    setTimeout(() => setCopied(false), 1500);
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
          <FileSpreadsheet className="w-10 h-10 text-yellow-300 mb-3" />
          <h2 className="text-3xl font-bold mb-2 text-center">CSV ⇄ JSON Converter</h2>
          <p className="text-sm text-gray-200 mb-6 text-center">Convert, Beautify, Fix & Validate your CSV or JSON data ⚡</p>
        </div>

        <Textarea
          placeholder="Paste CSV or JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/40 text-black border border-white/30 rounded-lg mb-4 h-48"
        />

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={handleCsvToJson} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            CSV → JSON
          </Button>

          <Button onClick={handleJsonToCsv} className="bg-green-400 hover:bg-green-300 text-black">
            JSON → CSV
          </Button>

          <Button onClick={handleBeautifyCsv} className="bg-blue-400 hover:bg-blue-300 text-black">
            Beautify CSV
          </Button>

          <Button onClick={handleBeautifyJson} className="bg-pink-400 hover:bg-pink-300 text-black">
            Beautify JSON
          </Button>

          <Button onClick={handleFixFormatting} className="bg-indigo-400 hover:bg-indigo-300 text-black">
            Fix Formatting
          </Button>

          <Button onClick={handleValidate} variant="outline" className="text-black border-white/30">
            Validate
          </Button>

          <Button onClick={handleClear} variant="outline" className="text-black border-white/30">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        {/* Message */}
        {message && (
          <motion.p
            className={`text-sm text-center mb-3 ${message.startsWith("✅") ? "text-green-300" : "text-red-300"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Output */}
        {output && (
          <motion.div
            className="relative bg-white/10 p-4 rounded-lg text-sm text-left text-gray-100 font-mono overflow-y-auto max-h-64 whitespace-pre-wrap break-words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <pre>{output}</pre>

            {/* Fixed Copy Button */}
            <Button
              size="sm"
              variant="ghost"
              className="fixed bottom-10 right-10 text-white bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 hover:text-black transition"
              onClick={handleCopyOutput}
            >
              {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

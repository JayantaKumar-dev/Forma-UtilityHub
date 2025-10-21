import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HeroSection({ onSearch, onCategoryChange }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearchClick = () => {
    onSearch && onSearch(query.trim(), category);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    onCategoryChange && onCategoryChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center text-center py-12 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-b-2xl"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
        Forma : Multi-Utility Web App
      </h1>
      <p className="mb-6 text-base md:text-lg text-center">
        All your dev & daily tools in one place ⚡
      </p>

      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-3 sm:space-y-0 w-full max-w-xl">
        <Input
          placeholder="Search for a service..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-black placeholder-black bg-white/40 border-black/60"
        />
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[140px] bg-white text-black">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="formatters">Formatters</SelectItem>
            <SelectItem value="converters">Converters</SelectItem>
            <SelectItem value="calculators">Calculators</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearchClick} className="w-full sm:w-auto">
          Search
        </Button>
      </div>
    </motion.div>
  );
}

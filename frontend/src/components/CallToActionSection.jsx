// components/CallToActionSection.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CallToActionSection({ onCategoryChange }) {
  const handleExplore = () => {
    onCategoryChange && onCategoryChange("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white text-center rounded-none"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
        Ready to Boost Your Productivity?
      </h2>

      <p className="mb-5 sm:mb-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2 leading-relaxed">
        Explore all Forma tools and simplify your daily workflow.
      </p>

      <Button
        size="lg"
        onClick={handleExplore}
        className="bg-white text-purple-600 font-semibold hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4"
      >
        Start Exploring
      </Button>
    </motion.div>
  );
}

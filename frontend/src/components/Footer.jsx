// components/Footer.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Added for React routing
import { Github, Mail, Globe, Youtube, ArrowUpCircle } from "lucide-react";

export default function Footer({ onCategoryChange, totalTools = 30 }) {
  const [showScroll, setShowScroll] = useState(false);
  const [hideScroll, setHideScroll] = useState(false);
  let timeoutId;

  // ✅ Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScroll(true);
        setHideScroll(false);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setHideScroll(true), 3500);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category) => {
    onCategoryChange && onCategoryChange(category);
    scrollToTop();
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 hover:text-pink-400 transition-colors duration-300">
            Forma
          </h2>
          <p className="text-sm text-gray-400">
            Your all-in-one toolbox for developers, designers, and daily users.  
            Simplify your workflow — all tools, one platform.
          </p>

          {/* ✅ Beta Dynamic Stats */}
          <p className="mt-4 text-sm text-pink-400 italic">
            🚀 Currently in <span className="font-semibold">Beta</span> — {totalTools}+ tools and growing!
          </p>
        </div>

        {/* ✅ Quick Links (Replaced <a> with <Link>) */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-pink-400 transition-colors duration-300">Home</Link></li>
            <li><Link to="/docs" className="hover:text-pink-400 transition-colors duration-300">Docs</Link></li>
            <li><Link to="/about" className="hover:text-pink-400 transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" className="hover:text-pink-400 transition-colors duration-300">Contact</Link></li>
            <li><Link to="/owner" className="hover:text-pink-400 transition-colors duration-300">Owner</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            {[ 
              { name: "Utilities", value: "utilities" },
              { name: "Converters", value: "converters" },
              { name: "Security", value: "security" },
              { name: "Design", value: "design" },
              { name: "Formatters", value: "formatters" },
              { name: "Calculators", value: "calculators" },
              { name: "Developer", value: "developer" },
            ].map((item, i) => (
              <li
                key={i}
                onClick={() => handleCategoryClick(item.value)}
                className="cursor-pointer hover:text-pink-400 transition-colors duration-300"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <div className="flex space-x-4">
            <a href="https://github.com/JayantaKumar-dev" target="_blank" rel="noreferrer"
              className="hover:text-pink-400 transition-transform transform hover:scale-110"><Github /></a>
            <a href="https://www.youtube.com/@JayantCodeCraft" target="_blank" rel="noreferrer"
              className="hover:text-pink-400 transition-transform transform hover:scale-110"><Youtube /></a>
            <a href="mailto:jayantatechnical28@gmail.com"
              className="hover:text-pink-400 transition-transform transform hover:scale-110"><Mail /></a>
            <a href="https://jayant-dev-ochre.vercel.app/" target="_blank" rel="noreferrer"
              className="hover:text-pink-400 transition-transform transform hover:scale-110"><Globe /></a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} <span className="text-white font-semibold hover:text-pink-400 transition-colors duration-300">Forma</span>. 
        Built with ❤️ by <span className="text-pink-500 hover:text-white transition-colors duration-300">Jayant Samal</span>.
      </div>

      {/* ✅ Back to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-700 hover:scale-110 hover:bg-pink-600 ${
            hideScroll ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <ArrowUpCircle className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
}

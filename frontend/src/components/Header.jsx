import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Wrench,
  Info,
  Briefcase,
  Mail,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opaque, setOpaque] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Tools", path: "/", icon: <Wrench size={16} /> },
    { name: "Docs", path: "/docs", icon: <BookOpen size={16} /> },
    { name: "About", path: "/about", icon: <Info size={16} /> },
    {
      name: "Portfolio",
      path: "https://jayant-dev-ochre.vercel.app/",
      icon: <Briefcase size={16} />,
      external: true,
    },
    { name: "Contact", path: "/contact", icon: <Mail size={16} /> },
  ];

  // handle scroll hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const current = window.scrollY;
        const delta = current - lastScrollY.current;

        setOpaque(current > 24);

        if (current > 80 && delta > 5) {
          setVisible(false);
        } else if (delta < -10 || current < 80) {
          setVisible(true);
        }

        lastScrollY.current = current;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        animate={{
          y: visible ? 0 : -92,
          opacity: visible ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`w-full backdrop-blur-lg border-b border-white/20 transition-all duration-300 ${
            opaque
              ? "bg-white/80 shadow-md"
              : "bg-gradient-to-r from-white/25 via-white/15 to-white/10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-0">
                <motion.img
                  src="https://i.ibb.co/d0cvDH9q/Picsart-25-10-19-10-13-18-996.png"
                  alt="Forma Logo"
                  className="h-9 w-9 object-contain"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ duration: 0.25 }}
                />
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
                  Forma
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-6">
                {navItems.map((item, idx) =>
                  item.external ? (
                    <a
                      key={idx}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-pink-600 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <NavLink
                      key={idx}
                      to={item.path}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-2 text-sm font-medium transition-transform duration-200 ${
                          isActive
                            ? "text-pink-600"
                            : "text-black hover:text-blue-600 hover:-translate-y-0.5"
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  )
                )}
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  className="p-2 text-black"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200"
            >
              <div className="px-4 pb-6 pt-3 space-y-2">
                {navItems.map((item, idx) =>
                  item.external ? (
                    <a
                      key={idx}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-md text-black hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 transition"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-2 py-2 rounded-md transition ${
                          isActive
                            ? "bg-gradient-to-r from-pink-50 to-blue-50 text-pink-600"
                            : "text-black hover:bg-gray-100"
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer below header */}
      <div aria-hidden className="h-16" />
    </>
  );
}

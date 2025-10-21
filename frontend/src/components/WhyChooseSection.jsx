// components/WhyChooseSection.jsx
import { motion } from "framer-motion";
import { Wrench, Zap, Lock, Smile } from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    { icon: <Wrench size={32} />, title: "All-in-One Toolkit", desc: "No need to visit multiple sites — everything you need is right here." },
    { icon: <Zap size={32} />, title: "Lightning Fast", desc: "Optimized tools that work instantly, no waiting or ads." },
    { icon: <Lock size={32} />, title: "Secure & Reliable", desc: "Privacy-first design. Your data never leaves your browser." },
    { icon: <Smile size={32} />, title: "Built for Developers", desc: "Created by a developer, for developers and creators alike." },
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-indigo-50 via-pink-50 to-purple-50">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-10">Why Choose Forma?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center"
          >
            <div className="text-indigo-600 mb-4">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

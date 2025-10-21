// components/BuiltBySection.jsx
import { motion } from "framer-motion";

export default function BuiltBySection() {
  return (
    <div className="py-12 text-center bg-white">
      <motion.img
        src="https://i.ibb.co/Ld0CrPZJ/Picsart-24-03-16-14-15-12-064.png" // your GitHub or logo image
        alt="Jayant Samal"
        className="h-16 w-16 rounded-full mx-auto mb-4 shadow-md"
        whileHover={{ rotate: 5, scale: 1.1 }}
      />
      <h3 className="text-xl font-semibold">Built by <span className="text-indigo-600">Jayant Samal</span></h3>
      <p className="text-gray-500">Full Stack Developer • AWS & DevOps Engineer</p>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Use Link instead of <a> for smooth routing

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto py-20 px-6 text-center"
    >
      {/* === Main Title === */}
      <h1 className="text-5xl font-extrabold mb-6 text-indigo-600 dark:text-indigo-400">
        About <span className="text-gray-900 dark:text-gray-100">Forma</span>
      </h1>

      {/* === Tagline === */}
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        <strong>Forma</strong> is a modern, all-in-one web application built for
        developers, designers, and creators. It brings together a growing
        collection of smart utilities — from formatters and converters to
        generators and optimizers — all in one sleek, fast, and accessible
        interface.
      </p>

      {/* === Divider === */}
      <div className="my-12 border-t border-gray-300 dark:border-gray-700 w-24 mx-auto" />

      {/* === Mission Section === */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
          ⚙️ Our Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          We believe everyday technical tasks shouldn’t require 10 different
          tabs. Forma’s mission is to simplify your workflow by combining the
          most useful tools for developers and professionals into a single
          beautifully designed space — fast, reliable, and distraction-free.
        </p>
      </div>

      {/* === Features Section === */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-8">
          🚀 Key Highlights
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Formatters & Validators",
              desc: "Clean, validate, and beautify JSON, HTML, CSS, and more with instant previews.",
            },
            {
              title: "Converters",
              desc: "Easily convert data types — JSON ↔ XML, Base64 ↔ Text, and beyond.",
            },
            {
              title: "Generators",
              desc: "Generate random passwords, UUIDs, colors, and mock data for development.",
            },
            {
              title: "Image Tools",
              desc: "Compress, resize, and optimize images right in your browser with zero upload.",
            },
            {
              title: "Developer Focused",
              desc: "Designed for speed and usability — no ads, no clutter, just pure productivity.",
            },
            {
              title: "Offline First",
              desc: "Works seamlessly even with low connectivity. Your tools, always available.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-500 dark:text-indigo-300 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === Tech Stack Section === */}
      <div className="mt-20">
        <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
          🧠 Built With Modern Tech
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Forma is crafted using cutting-edge web technologies to ensure
          performance, scalability, and reliability.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {[
            "React.js",
            "Tailwind CSS",
            "Framer Motion",
            "Vite",
            "Gradle",
            "Maven",
            "Spring Boot",
            "MongoDB",
            "MySQL",
            "Cloudinary / AWS (for storage)",
          ].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* === Closing Message === */}
      <div className="mt-20">
        <p className="text-gray-600 dark:text-gray-400 italic text-lg max-w-3xl mx-auto">
          “Forma is more than just a toolbox — it’s your digital workspace where
          productivity meets simplicity. New tools are added regularly to help
          you code, design, and create effortlessly.”
        </p>
      </div>

      {/* === Footer CTA === */}
      <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Explore Tools
        </Link>
        <Link
          to="/owner"
          className="inline-block px-8 py-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
        >
          Meet the Creator
        </Link>
      </div>
    </motion.div>
  );
}

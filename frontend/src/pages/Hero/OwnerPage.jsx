import { motion } from "framer-motion";
import { Github, Youtube, Mail, Globe } from "lucide-react";
import IconCloudDemo from "@/components/globe";
import HeroImg from "@/assets/images/mypic.JPG"; // ✅ your profile image

export default function OwnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center py-20 px-6">

      {/* === Hero Section === */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500">
          Meet the Creator
        </h1>

        {/* === Profile Image === */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex justify-center mt-10 mb-6"
        >
          <motion.img
            src={HeroImg}
            alt="Jayant Samal"
            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-transparent bg-gradient-to-tr from-indigo-500 via-pink-500 to-purple-500 p-[3px] object-cover shadow-2xl"
            whileHover={{
              scale: 1.05,
              rotate: 1.5,
              boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.5)",
            }}
          />
        </motion.div>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Hi 👋, I’m <span className="font-semibold text-indigo-600 dark:text-indigo-400">Jayant Samal</span> — a passionate
          <span className="text-pink-500 font-semibold"> Full Stack Java Developer </span> and
          <span className="text-purple-500 font-semibold"> Cloud DevOps Engineer</span>.
        </p>
      </motion.div>

      {/* === Globe Section === */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-16 mb-12"
      >
        <IconCloudDemo />
      </motion.div>

      {/* === About Section === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Who Am I?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          I’m a creator who loves turning complex ideas into beautiful, functional products.
          From crafting modern UI with React to building scalable backend systems using Spring Boot,
          my focus is on delivering performance, reliability, and style.
        </p>
      </motion.div>

      {/* === Skills Section === */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mt-10 max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">💻 Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Java",
            "Spring Boot",
            "hibernate",
            "React.js",
            "MongoDB",
            "AWS",
            "Docker",
            "Kubernetes",

            // Frontend
            "html5",
            "css3",
            "javascript",
            "typescript",
            "react",
            "tailwindcss",

            // Microservices
            "nodedotjs",   // (used as placeholder for microservices/server)
            "nginx",       // (API gateway / reverse proxy)
            "graphql",     // alt for service communication

            // Cloud / DevOps
            "git",
            "github",
            "gitlab",
            "jira",
            "jenkins",     // (CI/CD)

            // Tools
            "visualstudiocode",
            "intellijidea",
            "postman",
            "swagger",
            "maven",
            "gradle",
          ].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow border border-gray-200 dark:border-gray-700 text-sm font-medium hover:scale-105 transition"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* === Social Links === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-12 flex gap-6 justify-center"
      >
        {[
          {
            icon: <Github className="w-6 h-6" />,
            href: "https://github.com/JayantaKumar-dev",
          },
          {
            icon: <Youtube className="w-6 h-6" />,
            href: "https://www.youtube.com/@JayantCodeCraft",
          },
          {
            icon: <Mail className="w-6 h-6" />,
            href: "mailto:jayantatechnical28@gmail.com",
          },
          {
            icon: <Globe className="w-6 h-6" />,
            href: "https://jayant-dev-ochre.vercel.app/",
          },
        ].map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-full text-white shadow hover:scale-110 transition"
          >
            {link.icon}
          </a>
        ))}
      </motion.div>

      {/* === Closing Quote === */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="mt-16 text-center italic text-gray-600 dark:text-gray-400 max-w-2xl"
      >
        “Coding isn’t just about writing logic — it’s about creating experiences that inspire, empower, and make life easier.”
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Github, Linkedin, Globe, Youtube, Send } from "lucide-react";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const contacts = [
    { icon: <Mail />, label: "Email", value: "jayantakumar@gmail.com", link: "mailto:jayantatechnical28@gmail.com" },
    { icon: <Github />, label: "GitHub", value: "github.com/JayantaKumar-dev", link: "https://github.com/JayantaKumar-dev" },
    { icon: <Youtube />, label: "YouTube", value: "www.youtube.com/@JayantCodeCraft", link: "https://www.youtube.com/@JayantCodeCraft" },
    { icon: <Globe />, label: "Portfolio", value: "https://jayant-dev.app", link: "https://jayant-dev-ochre.vercel.app/" },
  ];

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;
    if (!formData.name.trim()) { tempErrors.name = "Name is required"; isValid = false; }
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email address";
      isValid = false;
    }
    if (!formData.subject.trim()) { tempErrors.subject = "Subject is required"; isValid = false; }
    if (!formData.message.trim()) { tempErrors.message = "Message is required"; isValid = false; }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatus("Please fill in all required fields correctly.");
      return;
    }

    const formKey = import.meta.env.VITE_WEB3FORMS_KEY;
    const form = new FormData();
    form.append("access_key", formKey);
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("subject", formData.subject);
    form.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });
      const result = await response.json();

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        setStatus(result.message || "There was an error sending your message.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-16 px-6 text-center"
    >
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Contact</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Get in touch for feedback, suggestions, or collaborations.
      </p>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {contacts.map((c, i) => (
          <motion.a
            key={i}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-indigo-500 transition bg-white/80 dark:bg-gray-800/60"
          >
            <span className="text-indigo-600 mb-2">{c.icon}</span>
            <p className="font-semibold">{c.label}</p>
            <p className="text-sm text-gray-500">{c.value}</p>
          </motion.a>
        ))}
      </div>

      {/* Button to Toggle Message Form */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowForm(!showForm)}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow-md font-semibold hover:opacity-90 transition"
      >
        {showForm ? "Close Message Form" : "💬 Drop a Message"}
      </motion.button>

      {/* Animated Message Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-8 bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-lg backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
                    errors.name ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                  } focus:border-indigo-500 focus:outline-none`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
                    errors.email ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                  } focus:border-indigo-500 focus:outline-none`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
                    errors.subject ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                  } focus:border-indigo-500 focus:outline-none`}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
                    errors.message ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                  } focus:border-indigo-500 focus:outline-none resize-none`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Send className="w-5 h-5" /> Send Message
              </motion.button>

              {status && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center mt-4 ${
                    status.includes("success") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status}
                </motion.p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

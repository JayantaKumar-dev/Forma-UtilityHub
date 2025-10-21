import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useRef } from "react";

export default function Layout() {
  // ✅ Store a ref to the handleCategoryChange from HomePage when available
  const categoryHandlerRef = useRef(null);

  // ✅ Function to receive the handleCategoryChange function from HomePage
  const setCategoryHandler = (fn) => {
    categoryHandlerRef.current = fn;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        {/* ✅ Pass down setter function through Outlet context */}
        <Outlet context={{ setCategoryHandler }} />
      </main>
      <Footer
        onCategoryChange={(category) => {
          // ✅ Call HomePage’s handler dynamically if it exists
          if (categoryHandlerRef.current) {
            categoryHandlerRef.current(category);
          }
          scrollToTop();
        }}
      />
    </div>
  );
}

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import Fuse from "fuse.js";
import Layout from "./components/Layout";
import HeroSection from "./components/HeroSection";
import ServicesGrid, { allServices } from "./components/ServicesGrid";
import WhyChooseSection from "./components/WhyChooseSection";
import CallToActionSection from "./components/CallToActionSection";
import BuiltBySection from "./components/BuiltBySection";
import Footer from "./components/Footer";

// ✅ Pages
import UrlShortenerPage from "./pages/utilities/UrlShortenerPage";
import QrCodeToolPage from "./pages/utilities/QrCodeToolPage";
import PasswordGeneratorPage from "./pages/security/PasswordGeneratorPage";
import JsonFormatterPage from "./pages/formatters/JsonFormatterPage";
import YamlJsonConverterPage from "./pages/converters/YamlJsonConverterPage";
import XmlFormatterPage from "@/pages/converters/XmlFormatterPage";
import CsvJsonConverterPage from "@/pages/converters/CsvJsonConverterPage";
import HashGeneratorPage from "@/pages/security/HashGeneratorPage";
import Base64ConverterPage from "@/pages/security/Base64ConverterPage";
import SimpleCalculatorPage from "./pages/calculators/SimpleCalculatorPage";
import ScientificCalculatorPage from "./pages/calculators/ScientificCalculatorPage";
import UnitConverterPage from "@/pages/converters/UnitConverterPage";
import TextUtilitiesPage from "./pages/utilities/TextUtilitiesPage";
import ColorToolsPage from "./pages/design/ColorToolsPage";
import RegexTesterPage from "./pages/developer/RegexTesterPage";
import MarkdownPreviewerPage from "./pages/developer/MarkdownPreviewerPage";
import DateTimeToolsPage from "./pages/utilities/DateTimeToolsPage";
import NumberToolsPage from "./pages/calculators/NumberToolsPage";
import UniversalConverter from "./pages/converters/UniversalConverter";
import JwtDecoder from "./pages/security/JwtDecoder";
import UuidGenerator from "./pages/developer/UuidGenerator";
import BaseConverter from "./pages/developer/BaseConverter";
import JsonDiffTool from "./pages/developer/JsonDiffTool";
import AesEncryptor from "./pages/security/AesEncryptor";
import AspectRatioCalculator from "./pages/design/AspectRatioCalculator";
import MorseCodeTranslator from "./pages/utilities/MorseCodeTranslator";
import AgeCalculator from "./pages/utilities/AgeCalculator";
import CountdownTimer from "./pages/utilities/CountdownTimer";
import WeatherApp from "./pages/utilities/WeatherApp";
import IpLocationFinder from "./pages/utilities/IpLocationFinder";
import ImageEnhancer from "./pages/design/ImageEnhancer";
import ImageCompressor from "./pages/design/ImageCompressor";
import ImageConverter from "./pages/design/ImageConverter";

// Info Pages
import AboutPage from "./pages/Hero/AboutPage";
import ContactPage from "./pages/Hero/ContactPage";
import DocsPage from "./pages/Hero/DocsPage";
import OwnerPage from "./pages/Hero/OwnerPage";


// ✅ Keep your working HomePage logic here inside App.jsx
function HomePage() {
  const { setCategoryHandler } = useOutletContext();
  // setCategoryHandler(handleCategoryChange);
  const [filteredServices, setFilteredServices] = useState(allServices);
  const [loading, setLoading] = useState(false);

  const fuse = new Fuse(allServices, {
    keys: ["title", "category"],
    threshold: 0.4,
  });

  const handleSearch = (query, category) => {
    setLoading(true);
    setTimeout(() => {
      let results = allServices;

      if (category !== "all") {
        results = results.filter((s) => s.category === category);
      }

      if (query) {
        const fuseResults = fuse.search(query);
        results = fuseResults.map((r) => r.item);
      }

      setFilteredServices(results);
      setLoading(false);
    }, 700);
  };

  const handleCategoryChange = (category) => {
    setLoading(true);
    setTimeout(() => {
      const results =
        category === "all"
          ? allServices
          : allServices.filter((s) => s.category === category);
      setFilteredServices(results);
      setLoading(false);
    }, 600);
  };

  // ✅ Register category handler AFTER defining it
  setCategoryHandler(handleCategoryChange);

// ✅ Smooth scroll to top when category changes (for footer/CTA)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeroSection onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
      <ServicesGrid filteredServices={filteredServices} loading={loading} />
      <WhyChooseSection />
      {/* ✅ Pass props to make CTA functional */}
      <CallToActionSection
        onCategoryChange={(category) => {
          handleCategoryChange(category);
          scrollToTop();
        }}
      />
      <BuiltBySection />
      {/* ✅ Pass same props to Footer */}
      {/* <Footer
        onCategoryChange={(category) => {
          handleCategoryChange(category);
          scrollToTop();
        }}
      /> */}
    </>
  );
}


// ✅ Your main App component
export default function App() {
  return (
    <Routes>
      {/* Layout wraps header + outlet */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Tools Pages */}
        <Route path="url-shortener" element={<UrlShortenerPage />} />
        <Route path="qr-code" element={<QrCodeToolPage />} />
        <Route path="password-generator" element={<PasswordGeneratorPage />} />
        <Route path="json-formatter" element={<JsonFormatterPage />} />
        <Route path="yaml-json-converter" element={<YamlJsonConverterPage />} />
        <Route path="xml-formatter" element={<XmlFormatterPage />} />
        <Route path="csv-json-converter" element={<CsvJsonConverterPage />} />
        <Route path="hash-generator" element={<HashGeneratorPage />} />
        <Route path="base64-converter" element={<Base64ConverterPage />} />
        <Route path="calculator" element={<SimpleCalculatorPage />} />
        <Route path="scientific-calculator" element={<ScientificCalculatorPage />} />
        <Route path="unit-converter" element={<UnitConverterPage />} />
        <Route path="text-utilities" element={<TextUtilitiesPage />} />
        <Route path="color-tools" element={<ColorToolsPage />} />
        <Route path="regex-tester" element={<RegexTesterPage />} />
        <Route path="markdown-previewer" element={<MarkdownPreviewerPage />} />
        <Route path="datetime-tools" element={<DateTimeToolsPage />} />
        <Route path="number-tools" element={<NumberToolsPage />} />
        <Route path="universal-converter" element={<UniversalConverter />} />
        <Route path="jwt-decoder" element={<JwtDecoder />} />
        <Route path="uuid-generator" element={<UuidGenerator />} />
        <Route path="base-converter" element={<BaseConverter />} />
        <Route path="json-diff-tool" element={<JsonDiffTool />} />
        <Route path="aes-encryptor" element={<AesEncryptor />} />
        <Route path="aspect-ratio" element={<AspectRatioCalculator />} />
        <Route path="morse-code" element={<MorseCodeTranslator />} />
        <Route path="age-calculator" element={<AgeCalculator />} />
        <Route path="countdown-timer" element={<CountdownTimer />} />
        <Route path="weather-app" element={<WeatherApp />} />
        <Route path="ip-finder" element={<IpLocationFinder />} />
        <Route path="image-enhancer" element={<ImageEnhancer />} />
        <Route path="image-compressor" element={<ImageCompressor />} />
        <Route path="image-converter" element={<ImageConverter />} />

        {/* Info Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="owner" element={<OwnerPage />} />
      </Route>
    </Routes>
  );
}

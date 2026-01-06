"use client";

import { useState, useEffect } from "react";

// 24 best fonts for websites from Figma's resource library
const fonts = [
  { name: "Inter", value: "Inter", displayName: "Inter" },
  { name: "Josefin Sans", value: "Josefin Sans", displayName: "Josefin Sans" },
  { name: "Roboto", value: "Roboto", displayName: "Roboto" },
  { name: "Open Sans", value: "Open Sans", displayName: "Open Sans" },
  { name: "Rubik", value: "Rubik", displayName: "Rubik" },
  { name: "DM Sans", value: "DM Sans", displayName: "DM Sans" },
  { name: "Poppins", value: "Poppins", displayName: "Poppins" },
  { name: "Lato", value: "Lato", displayName: "Lato" },
  { name: "Nunito", value: "Nunito", displayName: "Nunito" },
  { name: "Ubuntu", value: "Ubuntu", displayName: "Ubuntu" },
  { name: "Ranade", value: "Ranade", displayName: "Ranade" },
  { name: "Source Sans Pro", value: "Source Sans Pro", displayName: "Source Sans Pro" },
  { name: "Work Sans", value: "Work Sans", displayName: "Work Sans" },
  { name: "Manrope", value: "Manrope", displayName: "Manrope" },
  { name: "Object Sans", value: "Object Sans", displayName: "Object Sans" },
  { name: "Raleway", value: "Raleway", displayName: "Raleway" },
  { name: "Montserrat", value: "Montserrat", displayName: "Montserrat" },
  { name: "Playfair Display", value: "Playfair Display", displayName: "Playfair Display" },
  { name: "Libre Baskerville", value: "Libre Baskerville", displayName: "Libre Baskerville" },
  { name: "Soria", value: "Soria", displayName: "Soria" },
  { name: "Neuton", value: "Neuton", displayName: "Neuton" },
  { name: "Lora", value: "Lora", displayName: "Lora" },
  { name: "Sreda", value: "Sreda", displayName: "Sreda" },
  { name: "Arvo", value: "Arvo", displayName: "Arvo" },
];

export function FontSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>("Inter");

  useEffect(() => {
    // Load saved font preference
    const savedFont = localStorage.getItem("dhinimex-font-preference");
    if (savedFont) {
      setSelectedFont(savedFont);
      applyFont(savedFont);
    } else {
      applyFont("Inter");
    }
  }, []);

  const loadGoogleFont = (fontName: string) => {
    // Skip loading for system fonts like Arial
    const systemFonts = ["Arial", "Helvetica", "Times New Roman", "Courier New"];
    if (systemFonts.includes(fontName)) return;

    // Check if font is already loaded
    const existingLink = document.querySelector(
      `link[href*="${fontName.replace(/\s+/g, "+")}"]`
    );
    if (existingLink) return;

    // Create link element to load Google Font
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s+/g,
      "+"
    )}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  const applyFont = (fontName: string) => {
    loadGoogleFont(fontName);
    
    // Apply font via CSS variable
    const root = document.documentElement;
    root.style.setProperty("--font-sans", `"${fontName}", sans-serif`);
    
    // Also update body font-family directly for immediate effect
    document.body.style.fontFamily = `"${fontName}", sans-serif`;
    
    // Save to localStorage
    localStorage.setItem("dhinimex-font-preference", fontName);
  };

  const handleFontSelect = (fontValue: string) => {
    setSelectedFont(fontValue);
    applyFont(fontValue);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-navy hover:bg-brand-red text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-14 h-14 group"
        aria-label="Font Switcher"
        title="Switch Font"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Font Selection Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-brand-navy text-white p-4">
              <h3 className="font-semibold text-lg">Choose Font</h3>
              <p className="text-sm text-brand-sky mt-1">
                Preview different fonts for the website
              </p>
            </div>

            {/* Font List */}
            <div className="overflow-y-auto flex-1 p-2">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => handleFontSelect(font.value)}
                  className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-all duration-200 ${
                    selectedFont === font.value
                      ? "bg-brand-sky text-brand-navy font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  style={{ fontFamily: `"${font.value}", sans-serif` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{font.displayName}</span>
                    {selectedFont === font.value && (
                      <svg
                        className="w-5 h-5 text-brand-red"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className="text-sm text-gray-500 mt-1"
                    style={{ fontFamily: `"${font.value}", sans-serif` }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Current: <span className="font-semibold">{selectedFont}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "he">("en");

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "he" : "en"));
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <button
        className="px-3 py-1 rounded-lg border text-sm font-medium"
        style={{
          background: "var(--surface)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
          transition: "background var(--transition), color var(--transition), border-color var(--transition)",
        }}
        type="button"
        onClick={handleToggleLanguage}
        aria-label="Toggle language"
      >
        {language === "en" ? "HE" : "EN"}
      </button>
    </div>
  );
}


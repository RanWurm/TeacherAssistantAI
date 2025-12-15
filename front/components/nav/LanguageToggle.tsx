"use client";

import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === "en" ? "he" : "en";
    i18n.changeLanguage(next);
  };

  return (
    <div className="flex items-center shrink-0">
      <button
        className="px-3 py-1 rounded-lg border text-sm font-medium"
        style={{
          background: "var(--surface)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
          transition:
            "background var(--transition), color var(--transition), border-color var(--transition)",
          cursor: "pointer",
        }}
        type="button"
        onClick={toggleLanguage}
        aria-label={t("nav.languageToggle.ariaLabel")}
      >
        {i18n.language === "en"
          ? t("nav.languageToggle.hebrew")
          : t("nav.languageToggle.english")}
      </button>
    </div>
  );
}

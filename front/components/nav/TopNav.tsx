"use client";

import { usePathname } from "next/navigation";
import '../../styles/variables.css';
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "react-i18next";

export function TopNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg"
      style={{
        backgroundColor: "rgba(var(--color-white-rgb), 0.8)",
        borderBottom: "1px solid var(--border-color)",
      }}
      aria-label={t("nav.navLogo.mainTitle")}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLogo />
          <div className="flex items-center gap-3">
            <NavLinks activePath={pathname} />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


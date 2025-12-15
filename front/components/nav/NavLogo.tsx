import Link from "next/link";
import { Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NavLogo() {
  const { t } = useTranslation();

  return (
    <Link href="/chat" className="flex items-center gap-3 group">
      <div
        className="w-10 h-10 flex items-center justify-center"
        style={{
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
          boxShadow: "var(--shadow-lg)",
          transition: "box-shadow var(--transition)",
        }}
      >
        <Brain className="w-5 h-5" style={{ color: "var(--on-primary)" }} />
      </div>
      <div className="hidden sm:flex flex-col">
        <span
          className="font-bold text-lg"
          style={{
            color: "var(--text-primary)",
          }}
        >
          {t("nav.navLogo.mainTitle")}
        </span>
        <span
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          {t("nav.navLogo.subtitle")}
        </span>
      </div>
    </Link>
  );
}

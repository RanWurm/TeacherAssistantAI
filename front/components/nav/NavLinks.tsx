import Link from "next/link";
import { NAV_ITEMS } from "./nav.config";

interface NavLinksProps {
  activePath: string;
}

export function NavLinks({ activePath }: NavLinksProps) {
  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((link) => {
        const active = activePath === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            style={
              active
                ? {
                    background: "linear-gradient(90deg, var(--primary-600), var(--primary-500))",
                    color: "var(--on-primary)",
                    boxShadow: "var(--shadow-lg)",
                    borderRadius: "var(--radius-lg)",
                    transition: "all var(--transition)",
                  }
                : {
                    color: "var(--text-secondary)",
                    borderRadius: "var(--radius-lg)",
                    transition: "all var(--transition)",
                  }
            }
            className={`
              flex items-center gap-2 px-4 py-2 font-medium text-sm
              ${!active ? "hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]" : ""}
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}


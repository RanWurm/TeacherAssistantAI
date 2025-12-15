import Link from "next/link";
import { useNavItems } from "./nav.config";

interface NavLinksProps {
  activePath: string;
}

export function NavLinks({ activePath }: NavLinksProps) {
  const navItems = useNavItems();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((link) => {
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
              ${!active ? "hover:bg-(--surface-hover) hover:text-(--text-primary)" : ""}
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

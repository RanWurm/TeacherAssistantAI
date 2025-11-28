"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, MessageSquare, Search, BarChart3 } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Chat", icon: MessageSquare },
    { href: "/search", label: "Search", icon: Search },
    { href: "/insights", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-slate-900 text-lg">
                Research Assistant
              </span>
              <span className="text-xs text-slate-500">
                AI-Powered Research Ideas
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
                    ${active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
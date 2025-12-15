import { MessageSquare, Search, BarChart3, LucideIcon } from 'lucide-react';
import { useTranslation } from "react-i18next";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function useNavItems(): NavItem[] {
  const { t } = useTranslation();

  return [
    { href: "/chat", label: t("nav.navLinks.chat"), icon: MessageSquare },
    { href: "/search", label: t("nav.navLinks.search"), icon: Search },
    { href: "/insights", label: t("nav.navLinks.insights"), icon: BarChart3 },
  ];
}

import { MessageSquare, Search, BarChart3, LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/search", label: "Search", icon: Search },
  { href: "/insights", label: "Statistics", icon: BarChart3 },
];


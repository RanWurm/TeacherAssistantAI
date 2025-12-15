// app/layout.tsx
import type { Metadata } from "next";
import { TopNav } from "../components/nav/TopNav";
import { HtmlDirection } from "../components/layout/HtmlDirection";
import "../styles/globals.css";
import I18nProvider from '../i18n/I18nProvider';

export const metadata: Metadata = {
  title: "Research Assistant",
  description: "AI-powered academic research assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col" style={{ background: "var(--background-light-blue)" }}>
      <I18nProvider>
        <HtmlDirection />

        {/* Navbar */}
        <TopNav />

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col min-h-0">
          <main className="flex-1 min-h-0">
            {children}
          </main>
        </div>
        </I18nProvider>

      </body>
    </html>
  );
}

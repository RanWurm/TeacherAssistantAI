// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/app/components/top-nav";

export const metadata: Metadata = {
  title: "Research Assistant",
  description: "AI-powered academic research assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          <TopNav />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

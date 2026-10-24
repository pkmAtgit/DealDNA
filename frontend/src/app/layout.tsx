import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export const metadata = {
  title: "DealDNA - Real Estate Revenue Experimentation + Intervention OS",
  description: "Next.js + FastAPI + JSON Starter Kit for DealDNA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top Navy Brand Banner */}
        <header className="bg-[#0f2942] text-white px-6 py-3.5 flex justify-between items-center border-b-4 border-[#1967fe]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
              DealDNA
            </Link>
            <span className="text-xs text-slate-300 tracking-wider uppercase hidden sm:inline">
              REAL ESTATE REVENUE EXPERIMENTATION + INTERVENTION OS
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <Link href="/login" className="hover:text-white underline">
              Screen 01 (Login)
            </Link>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-200">
              20-Screen Prototype
            </span>
          </div>
        </header>

        {/* Main Workspace Container */}
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            {/* Utility Search & Filter Bar */}
            <div className="bg-white px-6 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
              <span>■ Search deals, properties, clients...</span>
              <div className="flex items-center gap-6">
                <span>Project: All projects ■</span>
                <span className="font-semibold text-slate-800">Sarah Johnson ●</span>
              </div>
            </div>

            {/* Page Content */}
            <main className="flex-1 p-6">{children}</main>

            {/* Footer */}
            <footer className="bg-white px-6 py-3 border-t border-slate-200 text-xs text-slate-500">
              Concept wireframe • illustrative sample data • Next.js + Python FastAPI + JSON Starter
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

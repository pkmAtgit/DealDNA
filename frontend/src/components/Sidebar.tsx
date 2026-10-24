"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Command Center", href: "/dashboard", screen: "02" },
  { name: "Revenue at Risk", href: "/revenue-risk", screen: "03" },
  { name: "Portfolio Health", href: "/portfolio-health", screen: "04" },
  { name: "Deal Insights", href: "/deals/DEAL-4821", screen: "05" },
  { name: "Interventions", href: "/interventions", screen: "08" },
  { name: "Experiments", href: "/experiments", screen: "11" },
  { name: "Revenue Impact", href: "/revenue-impact", screen: "14" },
  { name: "Properties", href: "/properties", screen: "17" },
  { name: "Reports", href: "/reports", screen: "18" },
  { name: "Settings", href: "/settings", screen: "20" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#122d4f] text-slate-300 flex-shrink-0 min-h-[calc(100vh-110px)] flex flex-col justify-between">
      <div className="py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-5 py-3 text-xs font-medium border-l-4 transition-colors ${
                isActive
                  ? "bg-[#1967fe] text-white border-white font-semibold"
                  : "border-transparent hover:bg-[#0f2942] hover:text-white"
              }`}
            >
              ■ {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-700/60 bg-[#0f2942]/60">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          All 20 Wireframe Screens
        </div>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 20 }, (_, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <Link
                key={num}
                href={`/screens/${num}`}
                className="text-center py-1 text-[11px] rounded bg-slate-800 hover:bg-[#1967fe] text-slate-200 hover:text-white transition"
                title={`Open Screen ${num}`}
              >
                {num}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

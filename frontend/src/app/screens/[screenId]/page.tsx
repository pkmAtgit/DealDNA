import MetricCard from "@/components/MetricCard";
import RightRailInsight from "@/components/RightRailInsight";
import { fetchFromAPI } from "@/lib/api";
import Link from "next/link";

const FALLBACK_SCREENS: Record<string, any> = {
  "01": { id: "01", title: "Login / Welcome", subtitle: "Secure access to DealDNA", kpis: [], workspace: ["Email address & Password", "Remember me & Forgot password?", "Sign in", "Continue with Google / Microsoft"], insight: "Secure sign-in and workspace entry." },
  "02": { id: "02", title: "Command Center", subtitle: "Good morning, Sarah", kpis: [{ value: "₹2.4M", label: "Revenue at risk" }, { value: "₹1.1M", label: "Recovery opportunity" }, { value: "6", label: "Active experiments" }], workspace: ["Revenue at risk: ₹2.4M", "Recovery opportunity: ₹1.1M", "Active experiments: 6", "Revenue trend by month", "Deal health distribution", "Top interventions and priority alerts"], insight: "Executive snapshot with urgent actions first." },
  "03": { id: "03", title: "Revenue at Risk", subtitle: "Recoverable revenue across active deals", kpis: [{ value: "₹4.2M", label: "At-risk revenue" }, { value: "83%", label: "Healthy deals" }, { value: "24", label: "Priority opportunities" }], workspace: ["Filters: project, stage, risk type, owner, value band", "Riverside Tower | Follow-up gap | ₹320K | High | A. Mehta", "Maple Residences | Price objection | ₹275K | High | R. Singh", "Oakwood Commercial | Client disengagement | ₹210K | Medium | S. Khan"], insight: "Rank opportunities by recoverability and urgency." },
  "04": { id: "04", title: "Portfolio Health", subtitle: "Portfolio revenue health", kpis: [{ value: "₹24.8M", label: "Total pipeline" }, { value: "₹4.2M", label: "At risk" }, { value: "83%", label: "Healthy deals" }], workspace: ["Total pipeline: ₹24.8M", "At-risk revenue: ₹4.2M", "Healthy deals: 83%", "Revenue mix by property type", "Performance by region and sales stage", "Project-level risk table"], insight: "Compare projects and spot revenue leakage." }
};

export default async function DynamicScreenPage({ params }: { params: { screenId: string } }) {
  const id = params.screenId.padStart(2, "0");
  const screen = await fetchFromAPI(`/api/dashboard/screens/${id}`, FALLBACK_SCREENS[id] || {
    id,
    title: `DealDNA Screen ${id}`,
    subtitle: "Interactive Prototype Screen",
    kpis: [],
    workspace: ["Connected to backend /api/dashboard/screens/" + id],
    insight: "Review evidence -> assign owner -> record outcome -> measure impact."
  });

  return (
    <div>
      <div className="mb-5 flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {screen.id}. {screen.title}
          </h1>
          <p className="text-xs text-slate-500">
            {screen.subtitle} · SCREEN {screen.id} / 20
          </p>
        </div>
        <div className="flex gap-2">
          {Number(id) > 1 && (
            <Link
              href={`/screens/${String(Number(id) - 1).padStart(2, "0")}`}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              ← Prev
            </Link>
          )}
          {Number(id) < 20 && (
            <Link
              href={`/screens/${String(Number(id) + 1).padStart(2, "0")}`}
              className="px-3 py-1.5 text-xs bg-[#1967fe] text-white rounded hover:bg-blue-700"
            >
              Next Screen →
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {screen.kpis && screen.kpis.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {screen.kpis.map((k: any, idx: number) => (
                <MetricCard key={idx} value={k.value} label={k.label} />
              ))}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              WORKSPACE
            </div>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-800">
              {screen.workspace?.map((w: string, idx: number) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        <RightRailInsight insight={screen.insight} nextStep={screen.next_step} />
      </div>
    </div>
  );
}

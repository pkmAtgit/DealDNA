import MetricCard from "@/components/MetricCard";
import RightRailInsight from "@/components/RightRailInsight";
import { fetchFromAPI } from "@/lib/api";
import Link from "next/link";

export default async function RevenueRiskPage() {
  const deals = await fetchFromAPI("/api/deals", [
    { deal_id: "DEAL-4821", project: "Riverside Tower", primary_risk_reason: "Follow-up gap", recovery_value: "₹320K", current_probability: 32, owner: "A. Mehta", status: "At-Risk" },
    { deal_id: "DEAL-4822", project: "Maple Residences", primary_risk_reason: "Price objection", recovery_value: "₹275K", current_probability: 100, owner: "R. Singh", status: "Won" },
    { deal_id: "DEAL-4823", project: "Oakwood Commercial", primary_risk_reason: "Client disengagement", recovery_value: "₹210K", current_probability: 0, owner: "S. Khan", status: "Lost" }
  ]);

  return (
    <div>
      <div className="mb-5 border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">03. Revenue at Risk</h1>
        <p className="text-xs text-slate-500">Recoverable revenue across active deals · SCREEN 03 / 20</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard value="₹4.2M" label="At-risk revenue" />
            <MetricCard value="83%" label="Healthy deals" />
            <MetricCard value="24" label="Priority opportunities" />
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              WORKSPACE · PRIORITY DEALS TABLE (FROM JSON API)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <th className="py-2.5">Deal / Property</th>
                    <th className="py-2.5">Risk Reason</th>
                    <th className="py-2.5">Recovery Value</th>
                    <th className="py-2.5">Prob.</th>
                    <th className="py-2.5">Owner</th>
                    <th className="py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map((d: any) => (
                    <tr key={d.deal_id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">
                        {d.project} <span className="text-xs text-slate-400">({d.deal_id})</span>
                      </td>
                      <td className="py-3 text-slate-700">{d.primary_risk_reason}</td>
                      <td className="py-3 font-semibold text-slate-800">{d.recovery_value || "₹200K"}</td>
                      <td className="py-3">{d.current_probability}%</td>
                      <td className="py-3 text-slate-600">{d.owner}</td>
                      <td className="py-3">
                        <Link
                          href={`/deals/${d.deal_id}`}
                          className="text-[#1967fe] font-semibold hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <RightRailInsight insight="Rank opportunities by recoverability and urgency." />
      </div>
    </div>
  );
}

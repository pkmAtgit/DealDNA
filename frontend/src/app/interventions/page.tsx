import RightRailInsight from "@/components/RightRailInsight";
import { fetchFromAPI } from "@/lib/api";

export default async function InterventionsPage() {
  const interventions = await fetchFromAPI("/api/interventions", [
    {
      intervention_id: "INT-01",
      deal_id: "DEAL-4821",
      action: "Schedule finance + decision-maker call",
      why_now: "Engagement fell after price objection",
      status: "Planned",
      suggested_owner: "Sales Manager + Relationship Manager",
      expected_impact: "Medium-High",
      checklist: ["Confirm decision-makers", "Clarify budget", "Share payment plan"],
    },
  ]);

  return (
    <div>
      <div className="mb-5 border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">
          08–10 & 15. Closed-Loop Interventions Workflow
        </h1>
        <p className="text-xs text-slate-500">
          Recommend → Execute → Record Outcome → Playbook Library · SCREENS 08, 09, 10, 15
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {interventions.map((item: any) => (
            <div key={item.intervention_id} className="bg-white border border-slate-200 rounded-md p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1967fe]">
                  {item.intervention_id} · DEAL: {item.deal_id}
                </span>
                <span className="px-2.5 py-1 text-xs rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  {item.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-2">{item.action}</h2>
              <p className="text-sm text-slate-600 mb-4">
                <strong>Why now:</strong> {item.why_now} | <strong>Expected Impact:</strong> {item.expected_impact}
              </p>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-2">
                Execution Checklist (Screen 09):
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-800 mb-4">
                {item.checklist?.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
              <div className="flex gap-3 pt-3 border-t border-slate-100 text-xs font-semibold">
                <button className="bg-[#1967fe] text-white px-3.5 py-1.5 rounded">Accept & Execute</button>
                <button className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded">Record Outcome (Screen 10)</button>
                <button className="bg-slate-100 text-slate-500 px-3.5 py-1.5 rounded">Dismiss with reason</button>
              </div>
            </div>
          ))}
        </div>

        <RightRailInsight insight="Turn an insight into a specific, reviewable action and close the learning loop with structured outcomes." />
      </div>
    </div>
  );
}

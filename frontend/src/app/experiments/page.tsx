import MetricCard from "@/components/MetricCard";
import RightRailInsight from "@/components/RightRailInsight";
import { fetchFromAPI } from "@/lib/api";

export default async function ExperimentsPage() {
  const experiments = await fetchFromAPI("/api/experiments", [
    { experiment_id: "EXP-01", name: "Price objection recovery", status: "Running", deals_count: 84, conversion_lift: "+10%" },
    { experiment_id: "EXP-02", name: "Second visit impact", status: "Running", deals_count: 52, conversion_lift: "+12%" },
    { experiment_id: "EXP-03", name: "Alternate unit with discount", status: "Completed", deals_count: 60, conversion_lift: "+21%" },
  ]);

  return (
    <div>
      <div className="mb-5 border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">11–13. Experiment Center & Results</h1>
        <p className="text-xs text-slate-500">Revenue experiments & hypothesis testing · SCREENS 11, 12, 13</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard value="+12%" label="Conversion lift" />
            <MetricCard value="+8%" label="Revenue impact" />
            <MetricCard value="+3" label="Incremental deals" />
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              ACTIVE & COMPLETED REVENUE EXPERIMENTS
            </div>
            <ul className="space-y-3 text-sm text-slate-800">
              {experiments.map((exp: any) => (
                <li key={exp.experiment_id} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{exp.name}</span>
                    <span className="ml-3 text-xs text-slate-500">({exp.deals_count} deals)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">{exp.status}</span>
                    <span className="font-bold text-emerald-700">{exp.conversion_lift}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <RightRailInsight insight="Monitor tests and compare treatment vs control without overstating causality." />
      </div>
    </div>
  );
}

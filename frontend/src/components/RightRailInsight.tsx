interface RightRailProps {
  insight: string;
  nextStep?: string;
  status?: string;
}

export default function RightRailInsight({
  insight,
  nextStep = "Review evidence → assign owner → record outcome → measure impact.",
  status = "Ready for review",
}: RightRailProps) {
  return (
    <div className="bg-[#eef6ff] border border-blue-200 rounded-md p-5 h-fit">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        DEALDNA INSIGHT
      </div>
      <p className="text-sm text-slate-800 leading-relaxed mb-5">{insight}</p>

      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        NEXT STEP
      </div>
      <p className="text-sm text-slate-800 leading-relaxed mb-5">{nextStep}</p>

      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        STATUS
      </div>
      <p className="text-sm font-medium text-emerald-700">● {status}</p>
    </div>
  );
}

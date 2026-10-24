"use client";
import { useState } from "react";

export default function DevTraceSection({ trace }: { trace: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace || !trace.flagged_deals || trace.flagged_deals.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-blue-200/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>{isOpen ? "Hide Journey Evidence ▲" : "Why this briefing? (View AI Journey Evidence) ▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 bg-[#0a1526] text-slate-100 rounded-lg p-4 font-mono text-xs border border-indigo-950 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3 text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
            <span>⚡ XAI REASONING · EVIDENCE FROM MULTI-SOURCE FUSION</span>
            <span>Live Scan Verified</span>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {trace.flagged_deals.map((d: any, idx: number) => (
              <div key={idx} className="bg-[#0f1d33] p-3.5 rounded border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  {/* CLIENT NAME & DD-ID SYNC */}
                  <span className="text-blue-300 font-bold text-sm">
                    [{d.deal_id}] {d.project} · <span className="text-amber-300">{d.customer_name}</span> · {d.stage} ({d.days_in_stage}d in stage)
                  </span>
                  <span className="text-amber-400 font-bold">
                    Risk: {d.flagged_risk_reason} (Prob: {d.computed_probability})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  Scanned: {d.total_events_scanned} timeline journey row(s)
                </div>

                <div className="text-slate-300 text-[11px] space-y-1.5 pl-1">
                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Traceable Journey Evidence:
                  </div>
                  {d.ai_decision_factors && d.ai_decision_factors.map((factor: string, fIdx: number) => (
                    <div key={fIdx} className="leading-relaxed flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span className={factor.includes("Last Conversation") || factor.includes("Spoken Evidence") ? "text-amber-200 font-medium" : "text-slate-300"}>
                        {factor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
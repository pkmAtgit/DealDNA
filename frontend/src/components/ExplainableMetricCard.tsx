"use client";
import { useState } from "react";

interface ExplainableMetricCardProps {
  value: string;
  label: string;
  formula: string;
  factors: string[];
  confidence?: string;
  tag?: string;
}

export default function ExplainableMetricCard({
  value,
  label,
  formula,
  factors,
  confidence = "85% (Calibrated)",
  tag = "AI Derived"
}: ExplainableMetricCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm transition hover:border-indigo-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-1">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            {tag}
          </span>
        </div>
        <div className="text-xs font-medium text-slate-500 mb-3">{label}</div>
      </div>

      {/* Trigger to toggle explanation */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-semibold text-[#1967fe] hover:text-indigo-800 flex items-center justify-between w-full"
        >
          <span>{isOpen ? "Hide AI Reasoning ▲" : "Why this number? ▼"}</span>
          <span className="text-[10px] text-slate-400 font-mono">{confidence}</span>
        </button>

        {/* Explainability Breakdown Panel */}
        {isOpen && (
          <div className="mt-2.5 p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1.5 border border-slate-800 animate-fadeIn">
            <div>
              <span className="text-emerald-400 font-semibold">FORMULA: </span>
              <span className="text-slate-300">{formula}</span>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">DECISION FACTORS:</span>
              <ul className="list-disc pl-3.5 text-slate-400 mt-1 space-y-0.5">
                {factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
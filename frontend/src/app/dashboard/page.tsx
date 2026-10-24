"use client";

import { useState, useEffect } from "react";
import ExplainableMetricCard from "@/components/ExplainableMetricCard";
import RightRailInsight from "@/components/RightRailInsight";
import Link from "next/link";
import DevTraceSection from "./DevTraceSection";
import SimulateDataModal from "@/components/SimulateDataModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "${API_BASE}";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchDashboard = async () => {
    try {
      // Timestamp cache-busting taaki live recalculation turant fetch ho
      const res = await fetch(`${API_BASE}/api/dashboard/kpis?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Sirf transcripts.json ko init_transcripts.json se restore karne ka handler
  const handleResetTranscripts = async () => {
    if (!confirm("Do you want to reset the conversation transcripts back to the initial baseline?")) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/reset-transcripts`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchDashboard();
        alert("✅ The transcripts have been restored to the initial baseline!");
      } else {
        const errData = await res.json();
        alert(`Reset error: ${errData.detail || "Failed to reset"}`);
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Backend reset endpoint se connect nahi ho saka.");
    } finally {
      setResetting(false);
    }
  };

  const kpis = data || {
    revenue_at_risk: "₹8.16Cr",
    recovery_opportunity: "₹1.92Cr",
    active_experiments: 2,
    total_pipeline: "₹10.23Cr",
    won_revenue: "₹5.55Cr",
    win_rate: "60%",
    at_risk_count: 8,
    total_deals: 10,
    top_deal_id: "DD-1004",
    top_deal_name: "Riverside Tower · Sana Patel (DD-1004)",
    top_risk_reason: "Loan approval blocker",
    ai_briefing: "Loading live intelligence...",
    ai_dev_trace: { model_connected: "DealDNA Multi-Source Engine", flagged_deals: [] }
  };

  return (
    <div>
      {/* Top Header with Interactive Trigger Buttons */}
      <div className="mb-5 flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">02. Command Center</h1>
          <p className="text-xs text-slate-500">Good morning, Sarah · SCREEN 02 / 20</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 🔄 DEV RESET BUTTON: Sirf conversation transcripts reset karega, timeline events safe rahenge */}
          <button
            onClick={handleResetTranscripts}
            disabled={resetting}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 transition-all cursor-pointer disabled:opacity-50"
            title="Sirf transcripts ko init_transcripts.json se restore karega"
          >
            <span>{resetting ? "Resetting..." : "🔄 Reset Transcripts"}</span>
          </button>

          {/* ⚡ LIVE AI DATA INGESTION BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span>⚡</span>
            <span>Add Touchpoint / Simulate Call</span>
          </button>
        </div>
      </div>

      <SimulateDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboard}
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <ExplainableMetricCard
              label="Revenue at risk"
              value={kpis.revenue_at_risk}
              formula="Σ quoted_value_inr where AI flags friction across transcripts + journey"
              factors={[
                `Flagged deals: ${kpis.at_risk_count} of ${kpis.total_deals} opportunities`,
                "Source: Transcripts, CRM stage & Journey Events"
              ]}
              confidence="Live Multi-Source Calibrated"
            />
            <ExplainableMetricCard
              label="Recovery opportunity"
              value={kpis.recovery_opportunity}
              formula="Σ (quoted_value × risk_severity_weight × 40% playbook benchmark)"
              factors={[
                "Calibrated against: 10 closed-loop playbooks",
                "Targeted by: Price, Finance & Cadence recovery"
              ]}
              confidence="84% Calibrated"
            />
            <ExplainableMetricCard
              label="Active experiments"
              value={String(kpis.active_experiments)}
              tag="Testing Lab"
              formula="Count(experiments where status == 'Running')"
              factors={[
                "Exp 1: Price objection recovery (84 deals)",
                "Exp 2: Second visit impact (52 deals)"
              ]}
              confidence="Live Sync"
            />
          </div>

          {/* AI Executive Briefing */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1967fe] mb-1.5 flex justify-between items-center">
              <span>✨ AI MORNING EXECUTIVE BRIEFING</span>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                {kpis.ai_dev_trace?.model_connected}
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {kpis.ai_briefing}
            </p>
            <DevTraceSection trace={kpis.ai_dev_trace} />
          </div>

          {/* Portfolio Benchmarks */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              WORKSPACE · PORTFOLIO BENCHMARKS
            </div>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-800">
              <li>Total Pipeline Quoted: <strong>{kpis.total_pipeline}</strong> across {kpis.total_deals} deals</li>
              <li>Closed Won Revenue: <strong>{kpis.won_revenue}</strong> (Historical Win Rate: <strong>{kpis.win_rate}</strong>)</li>
              <li>Deals at Risk: <strong>{kpis.at_risk_count} deal(s)</strong> ({kpis.revenue_at_risk})</li>
              <li>
                Top Priority Intervention Alert:{" "}
                {kpis.top_deal_id ? (
                  <Link className="text-[#1967fe] font-semibold underline" href={`/deals/${kpis.top_deal_id}`}>
                    {kpis.top_deal_name} — Reason: {kpis.top_risk_reason} →
                  </Link>
                ) : (
                  <span>None</span>
                )}
              </li>
              <li>Running Revenue Experiments: <strong>{kpis.active_experiments} active</strong></li>
            </ul>
          </div>
        </div>

        {/* Right Rail Insight Panel */}
        <RightRailInsight
          insight="Executive snapshot with urgent actions first. Live simulated events immediately update pipeline risk scoring."
          nextStep="Review evidence → assign owner → record outcome → measure impact."
          status="Ready for review"
        />
      </div>
    </div>
  );
}
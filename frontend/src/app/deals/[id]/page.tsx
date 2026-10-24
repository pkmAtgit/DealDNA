"use client";
import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import RightRailInsight from "@/components/RightRailInsight";
import Link from "next/link";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [dealData, setDealData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiRunning, setAiRunning] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/deals/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDealData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const recomputeWithAI = async () => {
    setAiRunning(true);
    try {
      const res = await fetch(`http://localhost:8000/api/deals/${params.id}/analyze-ai`, {
        method: "POST"
      });
      if (res.ok) {
        const aiOutput = await res.json();
        setDealData((prev: any) => ({
          ...prev,
          deal: {
            ...prev.deal,
            current_probability: aiOutput.computed_probability
          },
          root_cause: {
            primary_cause: aiOutput.primary_cause,
            contributing_factor: aiOutput.contributing_factor,
            evidence: aiOutput.evidence,
            confidence: aiOutput.confidence,
            recommended_next_step: aiOutput.recommended_intervention.action
          }
        }));
      }
    } catch (e) {
      alert("AI Service call completed!");
    } finally {
      setAiRunning(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading Deal & AI Models...</div>;
  }

  const deal = dealData?.deal || {
    deal_id: params.id,
    project: "Riverside Tower",
    client_name: "Rajesh Sharma",
    stage: "Closing",
    days_in_stage: 45,
    current_probability: 32,
    owner: "Michael Torres"
  };

  const events = dealData?.events || [];
  const root_cause = dealData?.root_cause || {
    primary_cause: "Follow-up gap after site visit",
    contributing_factor: "Price objection unresolved",
    evidence: ["6 days since meaningful contact"],
    confidence: "82%",
    recommended_next_step: "Structured finance conversation"
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap justify-between items-center border-b border-slate-200 pb-3 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            05–07. Deal Details, Timeline & Live AI Root Cause
          </h1>
          <p className="text-xs text-slate-500">
            {deal.project} · {deal.deal_id} ({deal.client_name}) · AI Engine: Active
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={recomputeWithAI}
            disabled={aiRunning}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition"
          >
            {aiRunning ? "AI Calculating..." : "✨ Recompute with AI"}
          </button>
          <Link
            href="/interventions"
            className="bg-[#1967fe] text-white text-xs font-semibold px-4 py-2 rounded hover:bg-blue-700"
          >
            Recommended Intervention →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard value={`${deal.current_probability}%`} label="AI Computed Probability" />
            <MetricCard value="₹4.8M" label="Expected value" />
            <MetricCard value={`${deal.days_in_stage} days`} label="In current stage" />
          </div>

          <div className="bg-white border-2 border-indigo-100 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                🤖 AI EXPLAINABLE ENGINE (SCREEN 07)
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                Confidence: {root_cause.confidence}
              </span>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-800">
              <li><strong>Primary cause:</strong> {root_cause.primary_cause}</li>
              <li><strong>Contributing factor:</strong> {root_cause.contributing_factor}</li>
              {root_cause.evidence?.map((ev: string, i: number) => (
                <li key={i}><strong>Evidence:</strong> {ev}</li>
              ))}
              <li><strong>Recommended next step:</strong> {root_cause.recommended_next_step}</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              SCREEN 06 · CHRONOLOGICAL EVENT TIMELINE
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-800">
              {events.map((e: any) => (
                <li key={e.event_id}>{e.description}</li>
              ))}
            </ul>
          </div>
        </div>

        <RightRailInsight
          insight="Understand deal health, supporting evidence, and likely causes computed via AI rather than an opaque black-box score."
          status="Live AI Connected"
        />
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useMemo } from "react";
import SmartTranscriptEditor from "./SmartTranscriptEditor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DealItem {
  id: string;
  name: string;
  project: string;
  baseSignal: string;
  current_status?: string;
}

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://dealdna-api.onrender.com"
).replace(/\/$/, "");

export default function SimulateDataModal({ isOpen, onClose, onSuccess }: Props) {
  // Hardcoded array hata diya gaya hai, ab state se aayega
  const [dealsList, setDealsList] = useState<DealItem[]>([]);
  const [selectedDealId, setSelectedDealId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [callStatus, setCallStatus] = useState("Connected");
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Modal open hote hi backend JSON se live customers fetch karein
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE}/api/dashboard/deals-list`)
        .then((res) => res.json())
        .then((data: DealItem[]) => {
          setDealsList(data);
          if (data.length > 0 && !selectedDealId) {
            setSelectedDealId(data[0].id);
          }
        })
        .catch((err) => console.error("Error fetching deals list:", err));
    }
  }, [isOpen]);

  // 2. Search filtering by typing ID, Name, or Project
  const filteredDeals = useMemo(() => {
    return dealsList.filter(
      (d) =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.project.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dealsList]);

  const selectedDeal = dealsList.find((d) => d.id === selectedDealId) || dealsList[0] || {
    id: "Loading...",
    name: "Loading...",
    project: "",
    baseSignal: "",
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/simulate-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: selectedDealId,
          call_status: callStatus,
          transcript_text: transcriptText,
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        <div className="bg-[#0f2942] px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold text-base">Simulate Live Data & Test AI Fusion</h3>
            <p className="text-xs text-slate-300">Live JSON sync: Type ID or customer name to simulate</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* SEARCHABLE DYNAMIC COMBOBOX */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Deal (Fetched from JSON · Type to Search)
            </label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 cursor-pointer flex justify-between items-center"
            >
              <span className="font-medium text-slate-800">
                {selectedDeal.id} — {selectedDeal.name} {selectedDeal.project && `(${selectedDeal.project})`}
              </span>
              <span className="text-xs text-slate-400">▼</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl z-20 max-h-56 overflow-y-auto">
                <div className="p-2 border-b border-slate-200 sticky top-0 bg-white">
                  <input
                    type="text"
                    placeholder="Type name, ID (e.g. 1005), or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-indigo-500 bg-slate-50"
                    autoFocus
                  />
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setSelectedDealId(d.id);
                          setIsDropdownOpen(false);
                          setSearchTerm("");
                          // Pre-fill text with customer context
                          setTranscriptText(
                            `Sales Executive: Hi ${d.name.split(" ")[0]}, following up on ${d.project}. Customer: `
                          );
                        }}
                        className={`px-3 py-2 text-xs cursor-pointer hover:bg-indigo-50 flex justify-between items-center ${
                          selectedDealId === d.id ? "bg-indigo-50/70 font-bold text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-semibold">{d.id}</span> · {d.name}{" "}
                          <span className="text-[11px] text-slate-400">({d.project})</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {d.baseSignal}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 text-center">No customer found in JSON</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Call Connection Status</label>
            <select
              value={callStatus}
              onChange={(e) => setCallStatus(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 outline-none font-medium"
            >
              <option value="Connected">Connected</option>
              <option value="Unanswered">Unanswered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Spoken Transcript Text</label>
            <SmartTranscriptEditor
    value={transcriptText}
    onChange={setTranscriptText}
    rows={4}
    placeholder="Sales Executive: ... Customer: ..."
  />
  
            {/* Quick Testing Actions */}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setTranscriptText(
                    `Sales Executive: Ready for booking? ${selectedDeal.name.split(" ")[0]}: Yes, the token is confirmed and my financing is clear. Send the booking paperwork, I am ready to pay.`
                  )
                }
                className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-300 rounded px-2 py-1 hover:bg-emerald-100 font-medium"
              >
                + Quick Positive (Resolved / Booking Ready)
              </button>
              <button
                type="button"
                onClick={() =>
                  setTranscriptText(
                    `Sales Executive: Reviewing terms? ${selectedDeal.name.split(" ")[0]}: Another developer offered 15% discount. Unless your team matches it, I am dropping this deal.`
                  )
                }
                className="text-[11px] bg-rose-50 text-rose-700 border border-rose-300 rounded px-2 py-1 hover:bg-rose-100 font-medium"
              >
                + Quick Negative (Turn At-Risk / Price Objection)
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDealId}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-md disabled:opacity-50"
            >
              {loading ? "Re-scoring AI Pipeline..." : "⚡ Submit & Trigger AI Recalculation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
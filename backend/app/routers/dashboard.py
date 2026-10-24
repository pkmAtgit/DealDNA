import os
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import run_multi_source_fusion
import shutil

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "data"))

def load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(filename: str, data):
    path = os.path.join(DATA_DIR, filename)
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def format_currency_inr(val: float) -> str:
    if val >= 10000000:
        return f"₹{val / 10000000:.2f}Cr"
    elif val >= 100000:
        return f"₹{val / 100000:.1f}L"
    elif val >= 1000:
        return f"₹{val / 1000:.0f}K"
    return f"₹{val:.0f}"

class CallSimulateRequest(BaseModel):
    deal_id: str
    call_status: str = "Connected"
    transcript_text: str
    call_date: Optional[str] = None

@router.get("/deals-list")
def get_all_deals_for_simulation():
    deals = load_json("deals.json")
    return [
        {
            "id": item.get("deal_id", ""),
            "name": item.get("customer_name", "Unknown"),
            "project": item.get("project", ""),
            "baseSignal": item.get("primary_risk_reason", "Active Deal"),
            "current_status": item.get("sample_outcome", "Active")
        }
        for item in deals
    ]

@router.get("/kpis")
def get_dashboard_kpis():
    transcripts = load_json("transcripts.json")
    deals = load_json("deals.json")
    events = load_json("events.json")
    experiments = load_json("experiments.json")

    total_pipeline_val = sum(d.get("quoted_value_inr", 0) for d in deals)
    won_deals = [d for d in deals if d.get("sample_outcome") == "Won"]
    won_revenue_val = sum(d.get("final_value_inr", 0) for d in won_deals)
    win_rate = f"{round((len(won_deals) / len(deals)) * 100)}%" if deals else "60%"

    flagged_deals = []
    total_revenue_at_risk = 0
    total_recovery_opp = 0

    for deal in deals:
        d_id = deal.get("deal_id")
        t_match = next((t for t in transcripts if t.get("deal_id") == d_id), {
            "deal_id": d_id,
            "call_status": "Connected",
            "transcript_text": f"Sales follow-up ongoing for {deal.get('customer_name')}.",
            "quoted_value_inr": deal.get("quoted_value_inr", 8500000)
        })

        deal_events = [
    e for e in events 
    if e.get("deal_id") == d_id or e.get("legacy_id") == d_id
]
        fusion_result = run_multi_source_fusion(deal, t_match, deal_events)

        if fusion_result["is_at_risk"]:
            total_revenue_at_risk += fusion_result["quoted_value_inr"]
            total_recovery_opp += fusion_result["recovery_opp_inr"]

            flagged_deals.append({
                "deal_id": d_id,
                "project": deal.get("project"),
                "customer_name": deal.get("customer_name"),
                "stage": deal.get("stage"),
                "days_in_stage": deal.get("days_in_stage"),
                "total_events_scanned": len(deal_events),
                "flagged_risk_reason": fusion_result["primary_risk_reason"],
                "computed_probability": f"{fusion_result['computed_prob']}%",
                "ai_decision_factors": fusion_result["multi_source_evidence"]
            })

    top_deal = flagged_deals[0] if flagged_deals else None
    ai_briefing = (
        f"Multi-Source AI Fusion: {len(flagged_deals)} deals flagged at risk ({format_currency_inr(total_revenue_at_risk)}). "
        f"Top alert: {top_deal.get('project')} · {top_deal.get('customer_name')} ({top_deal.get('deal_id')}) due to {top_deal.get('flagged_risk_reason').lower()}."
        if top_deal else "Multi-Source AI Fusion: All client journeys progressing stably."
    )

    return {
        "revenue_at_risk": format_currency_inr(total_revenue_at_risk),
        "recovery_opportunity": format_currency_inr(total_recovery_opp),
        "active_experiments": len([e for e in experiments if e.get("status", "").lower() == "running"]),
        "total_pipeline": format_currency_inr(total_pipeline_val),
        "won_revenue": format_currency_inr(won_revenue_val),
        "win_rate": win_rate,
        "at_risk_count": len(flagged_deals),
        "total_deals": len(deals),
        "top_deal_id": top_deal.get("deal_id") if top_deal else "",
        "top_deal_name": f"{top_deal.get('project')} · {top_deal.get('customer_name')} ({top_deal.get('deal_id')})" if top_deal else "",
        "top_risk_reason": top_deal.get("flagged_risk_reason") if top_deal else "",
        "ai_briefing": ai_briefing,
        "ai_dev_trace": {
            "model_connected": "DealDNA Multi-Source Data Fusion Engine (Local XAI)",
            "flagged_deals": flagged_deals
        }
    }

@router.post("/simulate-call")
def simulate_call_transcript(payload: CallSimulateRequest):
    transcripts = load_json("transcripts.json")
    target = next((t for t in transcripts if t.get("deal_id") == payload.deal_id), None)
    
    now_str = payload.call_date or datetime.now().strftime("%Y-%m-%d %H:%M")
    
    if target:
        target["call_status"] = payload.call_status
        target["transcript_text"] = payload.transcript_text
        target["call_datetime_local"] = now_str
    else:
        transcripts.append({
            "call_id": f"CALL-{payload.deal_id}-01",
            "deal_id": payload.deal_id,
            "call_status": payload.call_status,
            "transcript_text": payload.transcript_text,
            "call_datetime_local": now_str
        })

    save_json("transcripts.json", transcripts)
    return {"status": "success", "deal_id": payload.deal_id, "updated_at": now_str}

    

@router.post("/reset-transcripts")
def reset_transcripts_only():
    """
    Sirf transcripts.json ko init_transcripts.json se reset karta hai.
    Events aur Deals dataset ko touch nahi karta taaki history safe rahe.
    """
    init_file = os.path.join(DATA_DIR, "init_transcripts.json")
    active_file = os.path.join(DATA_DIR, "transcripts.json")

    if not os.path.exists(init_file):
        raise HTTPException(
            status_code=404, 
            detail="init_transcripts.json file nahi mili. Please check backend/app/data/ folder."
        )

    try:
        # init_transcripts.json ko transcripts.json par overwrite karein
        shutil.copyfile(init_file, active_file)
        print(f"✅ Reset Successful: transcripts.json restored from init_transcripts.json")
        return {
            "status": "success",
            "message": "Transcripts restored to initial blueprint baseline successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset error: {str(e)}")
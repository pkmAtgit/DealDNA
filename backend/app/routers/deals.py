import os
import json
from fastapi import APIRouter, HTTPException
from app.services.ai_service import analyze_deal_with_ai
from datetime import datetime

router = APIRouter(prefix="/api/deals", tags=["Deals"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json(filename: str):
    with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("")
def list_deals(status: str = None, project: str = None):
    deals = load_json("deals.json")
    if status:
        deals = [d for d in deals if d["status"].lower() == status.lower()]
    if project and project != "All projects":
        deals = [d for d in deals if d["project"].lower() == project.lower()]
    return deals

@router.get("/{deal_id}")
def get_deal_details(deal_id: str):
    deals = load_json("deals.json")
    events = load_json("events.json")
    interventions = load_json("interventions.json")
    
    deal = next((d for d in deals if d["deal_id"] == deal_id), None)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    deal_events = [e for e in events if e["deal_id"] == deal_id]
    deal_interventions = [i for i in interventions if i["deal_id"] == deal_id]

    # --- AUTOMATED DAYS_IN_STAGE CALCULATION START ---
    # Agar deal mein stage_entered_date hai ya timeline events mein timestamps hain
    try:
        stage_start_str = deal.get("stage_entered_date")
        
        # Agar deal level par date na mile toh timeline ke pehle event ki date use karein
        if not stage_start_str and deal_events:
            stage_start_str = deal_events[0].get("timestamp")
            
        if stage_start_str:
            # Current date se difference nikaalein
            # Format: '2026-09-07' ya ISO format match karega
            for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%SZ", "%d %b %Y", "%d %b"):
                try:
                    # Agar year missing ho jaise '12 Sep', toh current year lagayein
                    parsed_date = datetime.strptime(stage_start_str, fmt)
                    if parsed_date.year == 1900:
                        parsed_date = parsed_date.replace(year=datetime.now().year)
                    deal["days_in_stage"] = max(0, (datetime.now() - parsed_date).days)
                    break
                except ValueError:
                    continue
    except Exception as err:
        # Koi parsing issue ho toh deals.json ki default value safe rahegi
        print(f"Date calculation fallback: {err}")
    # --- AUTOMATED DAYS_IN_STAGE CALCULATION END ---
    
    return {
        "deal": deal,
        "events": deal_events,
        "interventions": deal_interventions,
        "root_cause": {
            "primary_cause": "Follow-up gap after site visit",
            "contributing_factor": "Price objection unresolved",
            "evidence": [
                "6 days since meaningful contact",
                "Buyer asked for revised payment plan"
            ],
            "confidence": "82%",
            "recommended_next_step": "Structured finance conversation"
        }
    }
# NAYA ENDPOINT: Frontend button ke liye
@router.post("/{deal_id}/analyze-ai")
def trigger_live_ai_analysis(deal_id: str):
    deals = load_json("deals.json")
    events = load_json("events.json")
    deal = next((d for d in deals if d["deal_id"] == deal_id), None)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal_events = [e for e in events if e["deal_id"] == deal_id]
    
    return analyze_deal_with_ai(deal, deal_events)
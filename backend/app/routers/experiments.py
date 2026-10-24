import os
import json
from fastapi import APIRouter
from app.models.intervention import OutcomeUpdate

router = APIRouter(prefix="/api", tags=["Interventions & Experiments"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json(filename: str):
    with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(filename: str, data):
    with open(os.path.join(DATA_DIR, filename), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@router.get("/interventions")
def list_interventions():
    return load_json("interventions.json")

@router.post("/interventions/outcome")
def record_intervention_outcome(payload: OutcomeUpdate):
    interventions = load_json("interventions.json")
    for item in interventions:
        if item["intervention_id"] == payload.intervention_id:
            item["status"] = "Completed"
            item["outcome"] = payload.outcome
            item["prob_after"] = payload.prob_after
            item["revenue_outcome"] = payload.revenue_outcome
            item["notes"] = payload.notes
            save_json("interventions.json", interventions)
            return {"message": "Outcome recorded successfully", "intervention": item}
    return {"error": "Intervention ID not found"}

@router.get("/experiments")
def list_experiments():
    return load_json("experiments.json")

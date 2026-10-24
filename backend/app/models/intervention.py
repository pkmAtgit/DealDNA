from pydantic import BaseModel
from typing import Optional, List

class Intervention(BaseModel):
    intervention_id: str
    deal_id: str
    action: str
    why_now: str
    status: str
    suggested_owner: str
    expected_impact: str
    checklist: List[str] = []
    outcome: Optional[str] = None
    prob_before: int
    prob_after: Optional[int] = None

class OutcomeUpdate(BaseModel):
    intervention_id: str
    outcome: str
    prob_after: int
    revenue_outcome: str
    notes: Optional[str] = ""

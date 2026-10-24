from pydantic import BaseModel
from typing import Optional, List

class Deal(BaseModel):
    deal_id: str
    project: str
    client_name: str
    stage: str
    days_in_stage: int
    quoted_value_inr: float
    final_booked_inr: float = 0
    current_probability: int
    previous_probability: Optional[int] = None
    status: str
    primary_risk_reason: str
    recovery_value: Optional[str] = None
    owner: str

class DealEvent(BaseModel):
    event_id: str
    deal_id: str
    timestamp: str
    event_type: str
    source: str
    sentiment: str
    description: str

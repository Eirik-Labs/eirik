from datetime import datetime

from pydantic import BaseModel
from typing import Any


class Incident(BaseModel):

    incidentId: str
    service: str
    alert: str
    severity: str
    source: str
    firstSeenAt: datetime
    lastSeenAt: datetime
    rawPayload: dict

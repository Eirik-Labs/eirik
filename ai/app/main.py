from datetime import datetime

from fastapi import FastAPI
from pydantic import BaseModel
from app.services.llm import LLMService
from app.services.prometheus import PrometheusService
from app.services.loki import LokiService 
from app.models.incident import Incident
from app.services.investigator import Investigator
app = FastAPI()

prometheus_service = PrometheusService()
loki_service = LokiService()
investigator = Investigator(prometheus_service, loki_service)
llm_service = LLMService()


@app.get("/health")
async def health():

    return {
        "status": "ok"
    }


@app.post("/analyze")
async def analyze(incident: Incident):

     # 1. Collect relevant observability evidence
     observability = await investigator.investigate(incident)

      # 2. Give incident + evidence to the LLM
     rca = await llm_service.analyze_incident(
         incident=incident,
         observability=observability
     )

     return {
         "incident": incident,
         "observability": observability,
         "root cause analysis":rca
     }
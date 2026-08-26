import os
import json

from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()


class LLMService:

    def __init__(self):

        self.client = AsyncGroq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        self.model = os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-120b"
        )

    async def analyze_incident(self, incident, context):

        incident_data = {
            "service": incident.service,
            "alert": incident.alert,
            "severity": incident.severity,
            "source": incident.source,
            "first_seen": str(incident.firstSeenAt),
            "last_seen": str(incident.lastSeenAt),
        }

        context_json = json.dumps(
            context,
            separators=(",", ":"),
            default=str
        )

        print("LLM CONTEXT SIZE:", len(context_json))

        prompt = f"""
You are an experienced Site Reliability Engineer investigating a production incident.

Analyze the incident using ONLY the supplied evidence.

INCIDENT:
{json.dumps(incident_data, separators=(",", ":"))}

OBSERVABILITY EVIDENCE:
{context_json}

Return ONLY valid JSON in exactly this structure:

{{
  "summary": "Short summary of what happened",
  "root_cause": "Most likely root cause",
  "evidence": [
    "Evidence supporting the conclusion"
  ],
  "missing_evidence": [
    "Information that would be useful but is currently unavailable"
  ],
  "recommended_actions": [
    "Concrete action an engineer should take"
  ],
  "confidence": 0.0
}}

Rules:

- Use ONLY the supplied evidence.
- Never invent metrics, logs, traces, or events.
- Clearly distinguish facts from hypotheses.
- If evidence is insufficient, say so.
- confidence must be between 0 and 1.
- Keep the response concise.
- Return valid JSON only.
"""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a production incident investigation "
                        "assistant. Return only valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=1000,
        )

        content = response.choices[0].message.content

        return json.loads(content)
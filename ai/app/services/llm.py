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

    async def analyze_incident(self, incident, observability):

        prompt = f"""
You are an experienced Site Reliability Engineer investigating a production incident.

Analyze the incident using ONLY the supplied evidence.

INCIDENT:
{json.dumps(incident, indent=2, default=str)}

OBSERVABILITY DATA:
{json.dumps(observability, indent=2, default=str)}

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

- Do not invent evidence.
- Distinguish facts from hypotheses.
- If evidence is insufficient, explicitly say so.
- confidence must be a number between 0 and 1.
- Keep the response concise.
"""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a production incident investigation assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
        )

        content = response.choices[0].message.content

        return json.loads(content)
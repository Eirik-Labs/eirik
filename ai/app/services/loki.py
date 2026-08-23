import os
import httpx
from urllib.parse import quote


class LokiService:

    def __init__(self):
        self.loki_url = os.getenv(
            "LOKI_URL",
            "http://localhost:3100"
        )

    async def query(self, query: str, limit: int = 100):

        url = f"{self.loki_url}/loki/api/v1/query_range"

        params = {
            "query": query,
            "limit": limit,
            "direction": "backward",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:

            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            data = response.json()

            if data.get("status") != "success":
                raise Exception("Loki query failed")

            return data["data"]["result"]
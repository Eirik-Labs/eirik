import httpx


class TempoService:

    def __init__(self, base_url="http://localhost:3200"):
        self.base_url = base_url

    async def get_trace(self, trace_id):

        url = f"{self.base_url}/api/traces/{trace_id}"

        async with httpx.AsyncClient() as client:

            response = await client.get(url)

            if response.status_code == 404:
                print(f"TEMPO TRACE NOT FOUND: {trace_id}")
                return None

            response.raise_for_status()

            return response.json()
from app.services.prometheus import PrometheusClient


class IncidentAnalyzer:

    def __init__(self, prometheus: PrometheusClient):
        self.prometheus = prometheus

    async def analyze(self, incident: dict):

        service = incident["service"]

        metrics = {}

        metrics["target_health"] = await self.prometheus.query(
            f'up{{job="{service}"}}'
        )

        return {
            "incident": incident,
            "observability": {
                "prometheus": metrics
            }
        }
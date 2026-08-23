import os
import httpx


class PrometheusService:

    def __init__(self):
        self.prometheus_url = os.getenv(
            "PROMETHEUS_URL",
            "http://localhost:9090",
        )

    async def query(self, promql: str):

        url = f"{self.prometheus_url}/api/v1/query"

        async with httpx.AsyncClient(timeout=10.0) as client:

            response = await client.get(
                url,
                params={"query": promql},
            )

            response.raise_for_status()

            data = response.json()

            if data.get("status") != "success":
                raise Exception("Prometheus query failed")

            return data["data"]["result"]

    # async def get_observability_data(self):

        queries = {

            "target_health":
                'up{job="eirik-api"}',

            "request_rate":
                'sum(rate(http_requests_total[5m]))',

            "error_rate":
                'sum(rate(http_requests_total{status_code=~"5.."}[5m]))',

            "error_percentage":
                '''
                100 *
                sum(rate(http_requests_total{status_code=~"5.."}[5m]))
                /
                sum(rate(http_requests_total[5m]))
                ''',

            "p95_latency":
                '''
                histogram_quantile(
                    0.95,
                    sum(
                        rate(http_request_duration_seconds_bucket[5m])
                    ) by (le)
                )
                ''',

            "cpu_usage":
                'rate(process_cpu_seconds_total[5m])',

            "memory_bytes":
                'process_resident_memory_bytes',
        }

        results = {}

        for name, query in queries.items():

            results[name] = await self.query(query)

        return results
from app.services.loki import LokiService
from app.services.prometheus import PrometheusService


class Investigator:

    def __init__(self, prometheus_service: PrometheusService,loki_service: LokiService,):
        self.prometheus = prometheus_service
        self.loki = loki_service

    def get_prometheus_queries(self, incident):

        service = incident.service
        alert = incident.alert.lower()    #we convert all the alerts to lowercase
        print(alert)
        # Base evidence we want for most incidents
        queries = {
            "target_health":
                f'up{{job="{service}"}}',

            "request_rate":
                f'rate(http_requests_total{{job="{service}"}}[5m])',

            "error_rate":
                f'rate(http_requests_total{{job="{service}",status_code=~"5.."}}[5m])',

            "p95_latency":
                f'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{{job="{service}"}}[5m]))',

            "cpu_usage":
                f'rate(process_cpu_seconds_total{{job="{service}"}}[5m])',

            "memory_bytes":
                f'process_resident_memory_bytes{{job="{service}"}}',
        }

        # Alert-specific evidence
        if "cpu" in alert:
            queries["cpu_usage"] = (
                f'rate(process_cpu_seconds_total{{job="{service}"}}[5m])'
            )

        elif "memory" in alert:
            queries["memory_bytes"] = (
                f'process_resident_memory_bytes{{job="{service}"}}'
            )

        elif "error" in alert:
            queries["error_rate"] = (
                f'rate(http_requests_total{{job="{service}",status_code=~"5.."}}[5m])'
            )

        elif "latency" in alert or "response" in alert:
            queries["p95_latency"] = (
                f'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{{job="{service}"}}[5m]))'
            )

        return queries

    async def investigate(self, incident):

        queries = self.get_prometheus_queries(incident)

        results = {}

        for name, query in queries.items():
            results[name] = await self.prometheus.query(query)

        service = incident.service
        results["logs"] = await self.loki.query(
            f'{{app="{service}"}}',
            limit=100
        ) 
        
        return results


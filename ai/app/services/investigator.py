from app.services.loki import LokiService
from app.services.prometheus import PrometheusService
from app.services.tempo import TempoService
import re
class Investigator:

    def __init__(self, prometheus_service: PrometheusService,loki_service: LokiService, tempo_service:TempoService,):
        self.prometheus = prometheus_service
        self.loki = loki_service
        self.tempo = tempo_service

    def get_prometheus_queries(self, incident):
        print("incident is",incident)
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
    

    def extract_trace_ids(self, logs):

        trace_ids = set()
    
        for stream in logs:
    
            for entry in stream.get("values", []):
    
                log_line = entry[1]
    
                matches = re.findall(
                    r'"trace_id"\s*:\s*"([a-fA-F0-9]{32})"',
                    log_line
                )
    
                for trace_id in matches:
                    trace_ids.add(trace_id)
    
        return list(trace_ids)




    async def investigate(self, incident):

        queries = self.get_prometheus_queries(incident)
    
        # --------------------------------------------------
        # PROMETHEUS
        # --------------------------------------------------
    
        metrics = {}
    
        for name, query in queries.items():
            try:
                metrics[name] = await self.prometheus.query(query)
            except Exception as e:
                print(f"PROMETHEUS ERROR [{name}]: {e}")
                metrics[name] = None
    
        # --------------------------------------------------
        # LOKI
        # --------------------------------------------------
    
        service = incident.service
    
        try:
            logs = await self.loki.query(
                f'{{app="{service}"}}',
                limit=50
            )
        except Exception as e:
            print(f"LOKI ERROR: {e}")
            logs = []
    
        # --------------------------------------------------
        # FILTER IMPORTANT LOGS
        # --------------------------------------------------
    
        important_logs = []
    
        for stream in logs:
    
            for entry in stream.get("values", []):
    
                timestamp, message = entry
    
                message_lower = message.lower()
    
                if (
                    "error" in message_lower
                    or "exception" in message_lower
                    or "fatal" in message_lower
                    or "warn" in message_lower
                ):
                    important_logs.append({
                        "timestamp": timestamp,
                        "message": message
                    })
    
        # --------------------------------------------------
        # TRACE IDS
        # --------------------------------------------------
    
        trace_ids = self.extract_trace_ids(
            [
                {
                    "values": [
                        [log["timestamp"], log["message"]]
                        for log in important_logs
                    ]
                }
            ]
        )
    
        print("TRACE IDS FOUND:", trace_ids)
    
        # --------------------------------------------------
        # TEMPO
        # --------------------------------------------------
    
        traces = []
    
        for trace_id in trace_ids[:5]:
    
            try:
    
                trace = await self.tempo.get_trace(trace_id)
    
                if trace is None:
                    print(f"SKIPPING MISSING TRACE: {trace_id}")
                    continue
    
                traces.append({
                    "trace_id": trace_id,
                    "trace": trace
                })
    
            except Exception as e:
    
                print(
                    f"TEMPO ERROR [{trace_id}]: {e}"
                )
    
                continue
    
        # --------------------------------------------------
        # RETURN
        # --------------------------------------------------
    
        return {
            "metrics": metrics,
            "logs": logs,
            "traces": traces,
        }
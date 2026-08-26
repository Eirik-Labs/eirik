import re


class ContextBuilder:

    MAX_LOGS = 20
    MAX_TRACES = 3
    MAX_SPANS_PER_TRACE = 15
    MAX_MESSAGE_LENGTH = 500

    def build(self, incident, observability):

        metrics = observability.get("metrics", {})
        logs = observability.get("logs", [])
        traces = observability.get("traces", [])

        return {
            "incident": self.build_incident_context(incident),
            "metrics": self.build_metrics_context(metrics),
            "logs": self.build_logs_context(logs),
            "traces": self.build_traces_context(traces),
        }

    # --------------------------------------------------
    # INCIDENT
    # --------------------------------------------------

    def build_incident_context(self, incident):

        return {
            "service": incident.service,
            "alert": incident.alert,
            "severity": incident.severity,
            "source": incident.source,
            "first_seen": str(incident.firstSeenAt),
            "last_seen": str(incident.lastSeenAt),
        }

    # --------------------------------------------------
    # METRICS
    # --------------------------------------------------

    def build_metrics_context(self, metrics):

        return {
            "target_health": metrics.get("target_health"),
            "request_rate": metrics.get("request_rate"),
            "error_rate": metrics.get("error_rate"),
            "p95_latency": metrics.get("p95_latency"),
            "cpu_usage": metrics.get("cpu_usage"),
            "memory_bytes": metrics.get("memory_bytes"),
        }

    # --------------------------------------------------
    # LOGS
    # --------------------------------------------------

    def build_logs_context(self, logs):

         important_logs = []
     
         for stream in logs:
     
             values = stream.get("values", [])
     
             for timestamp, message in values:
     
                 message_lower = message.lower()
     
                 if (
                     "error" in message_lower
                     or "exception" in message_lower
                     or "fatal" in message_lower
                     or "warn" in message_lower
                 ):
     
                     important_logs.append({
                         "timestamp": timestamp,
                         "message": message[:self.MAX_MESSAGE_LENGTH]
                     })
     
         important_logs = important_logs[-self.MAX_LOGS:]
     
         trace_ids = self.extract_trace_ids(important_logs)
     
         return {
             "important_logs": important_logs,
             "trace_ids": trace_ids,
         }
    # --------------------------------------------------
    # TRACE IDS
    # --------------------------------------------------

    def extract_trace_ids(self, logs):

        trace_ids = set()

        pattern = re.compile(
            r'"trace_id"\s*:\s*"([a-fA-F0-9]{32})"'
        )

        for log in logs:

            matches = pattern.findall(log["message"])

            for trace_id in matches:
                trace_ids.add(trace_id)

        return list(trace_ids)

    # --------------------------------------------------
    # TRACES
    # --------------------------------------------------

    def build_traces_context(self, traces):

        simplified_traces = []

        for item in traces[:self.MAX_TRACES]:

            trace_id = item.get("trace_id")
            trace = item.get("trace")

            if not trace:
                continue

            simplified_trace = self.simplify_trace(
                trace_id,
                trace
            )

            if simplified_trace:
                simplified_traces.append(simplified_trace)

        return simplified_traces

    # --------------------------------------------------
    # TRACE SIMPLIFICATION
    # --------------------------------------------------

    def simplify_trace(self, trace_id, trace):

        batches = trace.get("batches", [])

        spans = []

        for batch in batches:

            resource = batch.get("resource", {})

            service_name = None

            for attr in resource.get("attributes", []):

                if attr.get("key") == "service.name":

                    service_name = (
                        attr.get("value", {})
                        .get("stringValue")
                    )

            for scope in batch.get("scopeSpans", []):

                for span in scope.get("spans", []):

                    status = span.get("status", {})

                    span_data = {
                        "span_id": span.get("spanID"),
                        "parent_span_id": span.get("parentSpanID"),
                        "name": span.get("name"),
                        "service": service_name,
                        "start_time": span.get("startTimeUnixNano"),
                        "end_time": span.get("endTimeUnixNano"),
                        "status": span.get("status"),
                        "attributes": self.extract_important_attributes(span),
                    }
                    
                    spans.append(span_data)

        # --------------------------------------------------
        # Prioritize error spans
        # --------------------------------------------------

        error_spans = [
            span
            for span in spans
            if span.get("status", {}).get("code")
            == "STATUS_CODE_ERROR"
        ]

        if error_spans:

            selected = error_spans[:self.MAX_SPANS_PER_TRACE]

        else:

            selected = spans[:self.MAX_SPANS_PER_TRACE]

        return {
            "trace_id": trace_id,
            "span_count": len(spans),
            "spans": selected,
        }


    def extract_important_attributes(self, span):

        important_keys = {
            "http.request.method",
            "http.response.status_code",
            "http.route",
            "url.path",
            "db.system.name",
            "db.namespace",
            "db.query.text",
            "server.address",
            "server.port",
            "error.type",
            "error.message",
        }
    
        attributes = {}
    
        for attr in span.get("attributes", []):
    
            key = attr.get("key")
    
            if key not in important_keys:
                continue
    
            value = attr.get("value", {})
    
            attributes[key] = (
                value.get("stringValue")
                or value.get("intValue")
                or value.get("boolValue")
            )
    
        return attributes


import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
const consoleExporter = new ConsoleSpanExporter();

const tempoExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  serviceName: 'eirik-api',

  spanProcessors: [
    // new SimpleSpanProcessor(consoleExporter),
    new SimpleSpanProcessor(tempoExporter),
  ],

  instrumentations: [
      getNodeAutoInstrumentations(),
    ],
});

sdk.start();

console.log('==============================');
console.log('OTEL SDK STARTED');
console.log('==============================');







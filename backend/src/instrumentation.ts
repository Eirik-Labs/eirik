// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import {
//   ConsoleSpanExporter,
//   SimpleSpanProcessor,
// } from '@opentelemetry/sdk-trace-node';

// try {
//   const otlpEndpoint =
//     process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces';

//   const otlpExporter = new OTLPTraceExporter({
//     url: otlpEndpoint,
//   });

//   const consoleExporter = new ConsoleSpanExporter();

//   const sdk = new NodeSDK({
//     serviceName: 'eirik-api',
//     traceExporter: otlpExporter,
//     spanProcessors: [
//       new SimpleSpanProcessor(consoleExporter),
//     ],
//     instrumentations: [
//       getNodeAutoInstrumentations(),
//     ],
//   });

//   sdk.start();
//   console.log('OpenTelemetry initialized with endpoint:', otlpEndpoint);
// } catch (error) {
//   console.error('OpenTelemetry initialization failed:', error);
// }



// import {
//   diag,
//   DiagConsoleLogger,
//   DiagLogLevel,
// } from '@opentelemetry/api';

// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// try {
//   const otlpEndpoint =
//     process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
//     'http://localhost:4318/v1/traces';

//   const sdk = new NodeSDK({
//     serviceName: 'eirik-api',
//     traceExporter: new OTLPTraceExporter({
//       url: otlpEndpoint,
//     }),
//     instrumentations: [
//       getNodeAutoInstrumentations(),
//     ],
//   });

//   sdk.start();
//   console.log('OpenTelemetry initialized; exporting traces to Tempo at:', otlpEndpoint);
// } catch (error) {
//   console.error('OpenTelemetry initialization failed:', error);
// }

import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
} from '@opentelemetry/api';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

try {
  // Use base endpoint host without path suffix
  const otlpBaseEndpoint =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

  const sdk = new NodeSDK({
    serviceName: 'eirik-api',
    traceExporter: new OTLPTraceExporter({
      // OTLPTraceExporter automatically appends /v1/traces if you supply the base endpoint
      url: `${otlpBaseEndpoint}/v1/traces`,
    }),
    metricReader: undefined,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable fs instrumentation if it gets too noisy in console
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();
  console.log('OpenTelemetry initialized; exporting traces to Tempo at:', `${otlpBaseEndpoint}/v1/traces`);
} catch (error) {
  console.error('OpenTelemetry initialization failed:', error);
}
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
    new SimpleSpanProcessor(consoleExporter),
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

// process.env.OTEL_METRICS_EXPORTER = 'none';
// process.env.OTEL_LOGS_EXPORTER = 'none';
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
//   // Use base endpoint host without path suffix
//   const otlpBaseEndpoint =
//     process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

//   const sdk = new NodeSDK({
//     serviceName: 'eirik-api',
//     traceExporter: new OTLPTraceExporter({
//       // OTLPTraceExporter automatically appends /v1/traces if you supply the base endpoint
//       url: `${otlpBaseEndpoint}/v1/traces`,
//     }),
//     metricReader: undefined,
//     instrumentations: [
//       getNodeAutoInstrumentations({
//         // Disable fs instrumentation if it gets too noisy in console
//         '@opentelemetry/instrumentation-fs': { enabled: false },
//       }),
//     ],
//   });

//   sdk.start();
//   console.log('OpenTelemetry initialized; exporting traces to Tempo at:', `${otlpBaseEndpoint}/v1/traces`);
// } catch (error) {
//   console.error('OpenTelemetry initialization failed:', error);
// }

// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
// import { resourceFromAttributes } from '@opentelemetry/resources';
// import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const otlpBaseEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://127.0.0.1:4318';

// const otlpExporter = new OTLPTraceExporter({
//   url: `${otlpBaseEndpoint}/v1/traces`,
// });

// const sdk = new NodeSDK({
//   resource: resourceFromAttributes({
//     [ATTR_SERVICE_NAME]: 'eirik-api',
//   }),
//   spanProcessors: [
//     new BatchSpanProcessor(otlpExporter, {
//       scheduledDelayMillis: 1000,
//       maxQueueSize: 2048,
//     }),
//     new BatchSpanProcessor(new ConsoleSpanExporter(), {
//       scheduledDelayMillis: 1000,
//     }),
//   ],
//   instrumentations: [
//     getNodeAutoInstrumentations({
//       '@opentelemetry/instrumentation-fs': { enabled: false },
//     }),
//   ],
// });

// try {
//   sdk.start();
//   console.log(`OpenTelemetry initialized; exporting traces to Tempo at: ${otlpBaseEndpoint}/v1/traces`);
// } catch (error) {
//   console.error('OpenTelemetry initialization failed:', error);
// }

// process.on('SIGINT', async () => {
//   await sdk.shutdown();
//   process.exit(0);
// });
// process.on('SIGTERM', async () => {
//   await sdk.shutdown();
//   process.exit(0);
// });


// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

// // diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// // 1. Immediately register instrumentation hooks before NestJS imports anything
// registerInstrumentations({
//   instrumentations: [
//     getNodeAutoInstrumentations({
//       '@opentelemetry/instrumentation-fs': { enabled: false },
//     }),
//   ],
// });

// // 2. Initialize NodeSDK
// // const otlpBaseEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://127.0.0.1:4318';

// const otlpExporter = new OTLPTraceExporter({
//   // url: `${otlpBaseEndpoint}/v1/traces`,
//   url: `http://127.0.0.1:4318/v1/traces`,
// });

// const sdk = new NodeSDK({
//   serviceName: 'eirik-api',
//   spanProcessors: [
//     new BatchSpanProcessor(otlpExporter, {
//       scheduledDelayMillis: 1000, // Flush spans every 1 second
//     }),
//   ],
// });

// try {
//   sdk.start();
//   console.log(`OpenTelemetry initialized and listening...`);
// } catch (error) {
//   console.error('OpenTelemetry initialization failed:', error);
// }

// process.on('SIGINT', async () => {
//   await sdk.shutdown();
//   process.exit(0);
// });

// process.on('SIGTERM', () => {
//   sdk.shutdown()
//     .then(() => console.log('Tracing terminated'))
//     .catch((error) => console.error('Error terminating tracing', error))
//     .finally(() => process.exit(0));
// });






// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
// import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
// import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
// import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const sdk = new NodeSDK({
//   serviceName: 'eirik-api',
//   spanProcessors: [
//     // Flushes immediately to Tempo without batch delay
//     new SimpleSpanProcessor(
//       new OTLPTraceExporter({
//         url: 'http://127.0.0.1:4318/v1/traces',
//       })
//     ),
//     // Prints spans directly to your terminal window
//     new SimpleSpanProcessor(new ConsoleSpanExporter()),
//   ],
//   instrumentations: [
//     new HttpInstrumentation(),
//     new ExpressInstrumentation(),
//     new NestInstrumentation(),
//   ],
// });

// sdk.start();
// console.log('OpenTelemetry initialized with explicit HTTP/Express/NestJS instrumentations.');
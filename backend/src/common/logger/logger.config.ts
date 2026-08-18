import { utilities as nestWinstonUtilities } from 'nest-winston';
import { WinstonModule } from 'nest-winston';
import LokiTransport  from 'winston-loki';
import * as winston from 'winston';

export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonUtilities.format.nestLike('Eirik', {
          prettyPrint: true,
        }),
      ),
    }),

    new LokiTransport({
      host: 'http://localhost:3100',   //when using locally , use http://localhost:3100
      labels: {
        app: 'eirik-api',
        environment: 'development',
      },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => {
        console.error('Loki connection error:', err);
      },
    }),
  ],
});


//  NestJS on PC  ──► localhost:3100 ──► Loki
// NestJS in Docker ──► loki:3100 ──► Loki
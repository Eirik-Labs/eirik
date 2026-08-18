import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const start = process.hrtime.bigint();

    return next.handle().pipe(
      finalize(() => {
        const duration =
          Number(process.hrtime.bigint() - start) / 1_000_000_000;

        const method = request.method;
        const route = request.route?.path ?? request.path;
        const statusCode = response.statusCode.toString();

        this.metricsService.httpRequestsTotal.inc({
          method,
          route,
          status_code: statusCode,
        });

        this.metricsService.httpRequestDuration.observe(
          {
            method,
            route,
            status_code: statusCode,
          },
          duration,
        );
      }),
    );
  }
}
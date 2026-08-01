import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { IncidentsService } from 'src/incidents/incidents.service';
import { IncidentsModule } from 'src/incidents/incidents.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [IncidentsModule]
})
export class WebhookModule {}

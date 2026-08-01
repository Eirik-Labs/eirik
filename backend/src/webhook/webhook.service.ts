import { Injectable } from '@nestjs/common';
import { IncidentsService } from 'src/incidents/incidents.service';
import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';

@Injectable()
export class WebhookService {
    
    constructor(private readonly incidentsService: IncidentsService){}

    async receiveAlert(payload: AlertmanagerWebhookDto){
        console.log("incoming alert", payload)
        
        for(const alert of payload.alerts){
            await this.incidentsService.processIncomingAlert(alert)
        }
        
          return {
         message: 'Webhook processed successfully',
          }
    }
}

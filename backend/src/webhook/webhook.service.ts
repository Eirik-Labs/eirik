import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IncidentsService } from 'src/incidents/incidents.service';
import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class WebhookService {
    
    constructor(
        private readonly organizationsService: OrganizationsService,
        private readonly incidentsService: IncidentsService
    ){}

    async receiveAlert(payload: AlertmanagerWebhookDto, webhookSecret:string){
        console.log("incoming alert", payload)
        
        const organization= await this.organizationsService.findByWebhookSecret(webhookSecret)
        
         if (!organization) {
          throw new UnauthorizedException('Invalid webhook secret');
        }

        for(const alert of payload.alerts){
            await this.incidentsService.processIncomingAlert(alert, organization.id)
        }
        
          return {
         message: 'Webhook processed successfully',
          }
    }
}

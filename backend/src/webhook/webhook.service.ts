// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { IncidentsService } from 'src/incidents/incidents.service';
// import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';
// import { OrganizationsService } from 'src/organizations/organizations.service';

// @Injectable()
// export class WebhookService {
    
//     constructor(
//         private readonly organizationsService: OrganizationsService,
//         private readonly incidentsService: IncidentsService
//     ){}

//     async receiveAlert(payload: AlertmanagerWebhookDto, webhookSecret:string){
//         console.log("incoming alert", payload)
        
//         const organization= await this.organizationsService.findByWebhookSecret(webhookSecret)
        
//          if (!organization) {
//           throw new UnauthorizedException('Invalid webhook secret');
//         }

//         for(const alert of payload.alerts){
//             await this.incidentsService.processIncomingAlert(alert, organization.id)
//         }
        
//           return {
//          message: 'Webhook processed successfully',
//           }
//     }
// }





import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { IncidentsService } from 'src/incidents/incidents.service';
import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class WebhookService {

  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly incidentsService: IncidentsService,
  ) {}

  async receiveAlert(
    payload: AlertmanagerWebhookDto,
    webhookSecret: string,
  ) {

    this.logger.log(
      `Alertmanager webhook received: ${payload.alerts?.length ?? 0} alerts`,
    );

    const organization =
      await this.organizationsService.findByWebhookSecret(webhookSecret);

    if (!organization) {

      this.logger.warn(
        'Alertmanager webhook rejected: invalid webhook secret',
      );

      throw new UnauthorizedException('Invalid webhook secret');
    }

    this.logger.log(
      `Alertmanager webhook authenticated for organization ${organization.id}`,
    );

    for (const alert of payload.alerts) {

      this.logger.log(
        `Processing alert: fingerprint=${alert.fingerprint}, status=${alert.status}`,
      );

      await this.incidentsService.processIncomingAlert(
        alert,
        organization.id,
      );
    }

    this.logger.log(
      `Alertmanager webhook processed successfully: ${payload.alerts?.length ?? 0} alerts`,
    );

    return {
      message: 'Webhook processed successfully',
    };
  }
}
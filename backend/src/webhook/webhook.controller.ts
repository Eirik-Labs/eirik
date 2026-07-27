import { Controller, Post,Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('alert')
  receiveAlert(@Body() payload: AlertmanagerWebhookDto){
    return this.webhookService.receiveAlert(payload)
  }


}

import { Controller, Post,Body,Headers } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { AlertmanagerWebhookDto } from './dto/alertmanager-webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('alert')
  receiveAlert(@Body() payload: AlertmanagerWebhookDto, @Headers('x-webhook-secret') webhookSecret:string ){
    return this.webhookService.receiveAlert(payload, webhookSecret)
  }


}

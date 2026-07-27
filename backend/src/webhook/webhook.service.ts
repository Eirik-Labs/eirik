import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    receiveAlert(payload: any){
        console.log("incoming alert", payload)

        return {
            status:"received",
            timestamp: new Date().toISOString()
        }
    }
}

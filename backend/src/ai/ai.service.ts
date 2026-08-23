import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AnalyzeIncidentDto } from './dto/analyze-incident.dto';
@Injectable()
export class AiService {
    
   private readonly aiUrl = process.env.AI_SERVICE_URL!;

  async analyzeIncident(incident: AnalyzeIncidentDto) {
   const response = await fetch(`${this.aiUrl}/analyze`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(incident),
   });
   if (!response.ok) {
     throw new Error(
       `AI service returned ${response.status}`,
     );
   }
   return response.json();
}

}

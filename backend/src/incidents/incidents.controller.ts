import { Controller } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Get, Param, Query, Patch, Body } from '@nestjs/common';
import { GetIncidentsQueryDto } from './dto/get-incident-query.dto';
import { AssignIncidentDto } from './dto/assign-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}
   
    @Get('stats')
    getIncidentStats(){
     return this.incidentsService.getIncidentStats()
   }

   @Get()
   getAllIncidents(@Query() query: GetIncidentsQueryDto){
    return this.incidentsService.getAllIncidents(query)
   }

   @Get(':id')
   getIncidentById(@Param('id')id: string){
    return this.incidentsService.getIncidentById(id)
   }

   @Patch(':id/assign')
   assignIncident(@Param('id')id:string, @Body() dto:AssignIncidentDto){
        return this.incidentsService.assignIncident(id, dto.assignee)
   }

   @Patch(':id')
   updateIncidentStatus(@Param('id')id:string, @Body() dto:UpdateIncidentStatusDto){
    return this.incidentsService.updateIncidentStatus(id,dto.status)
   }

}

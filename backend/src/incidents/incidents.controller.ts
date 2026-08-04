import { Controller, UseGuards } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Get, Param, Query, Patch, Body } from '@nestjs/common';
import { GetIncidentsQueryDto } from './dto/get-incident-query.dto';
import { AssignIncidentDto } from './dto/assign-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}
   
    @Get('stats')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.VIEWER)
   getAllIncidents(@Query() query: GetIncidentsQueryDto){
    return this.incidentsService.getAllIncidents(query)
   }

   @Get(':id')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.VIEWER)
   getIncidentById(@Param('id')id: string){
    return this.incidentsService.getIncidentById(id)
   }

   @Patch(':id/assign')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER)
   assignIncident(@Param('id')id:string, @Body() dto:AssignIncidentDto){
        return this.incidentsService.assignIncident(id, dto.assignee)
   }

   @Patch(':id')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER)
   updateIncidentStatus(@Param('id')id:string, @Body() dto:UpdateIncidentStatusDto){
    return this.incidentsService.updateIncidentStatus(id,dto.status)
   }

}

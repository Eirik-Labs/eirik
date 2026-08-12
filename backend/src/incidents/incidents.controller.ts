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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}
   
    @Get('stats')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.VIEWER, UserRole.SUPERADMIN)
   getAllIncidents(@Query() query: GetIncidentsQueryDto, @CurrentUser() user: JwtPayload){
    return this.incidentsService.getAllIncidents(query,user)
   }

   @Get(':id')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.VIEWER, UserRole.SUPERADMIN)
   getIncidentById(@Param('id')id: string, @CurrentUser() user:JwtPayload){
    return this.incidentsService.getIncidentById(id,user)
   }

   @Patch(':id/assign')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.SUPERADMIN)
   assignIncident(@Param('id')id:string, @Body() dto:AssignIncidentDto, @CurrentUser() user:JwtPayload){
        return this.incidentsService.assignIncident(id, dto.assignee,user)
   }

   @Patch(':id')
   @Roles(UserRole.ADMIN, UserRole.ENGINEER, UserRole.SUPERADMIN)
   updateIncidentStatus(@Param('id')id:string, @Body() dto:UpdateIncidentStatusDto, @CurrentUser() user:JwtPayload){
    return this.incidentsService.updateIncidentStatus(id,dto.status,user)
   }

}

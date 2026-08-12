import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

UseGuards(JwtAuthGuard,RolesGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(
        private readonly organizationsService: OrganizationsService
    ){}

    @Post()
    @Roles(UserRole.SUPERADMIN)
    create(@Body() dto:CreateOrganizationDto){
        return this.organizationsService.create(dto)
    }

    @Get()
    @Roles(UserRole.SUPERADMIN)
    findAll(){
        return this.organizationsService.findAll()
    }

    @Get(':id')
    @Roles(UserRole.SUPERADMIN)
    findById(@Param('id') id:string){
        return this.findById(id)
    }
    
    @Patch(':id')
    @Roles(UserRole.SUPERADMIN)
    update(
      @Param('id') id: string,
      @Body() dto: UpdateOrganizationDto,
    ) {
      return this.organizationsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
      return this.organizationsService.softDelete(id);
    }

    @Patch(':id/restore')
    @Roles(UserRole.SUPERADMIN)
    restore(@Param('id') id: string) {
      return this.organizationsService.restore(id);
    }
}

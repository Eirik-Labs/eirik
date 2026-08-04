import { Controller, Post, Body, Query, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard'
import {Roles} from '../auth/decorators/roles.decorator'
import {UserRole} from '../common/enums/user-role.enum'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateUserDto, @CurrentUser() user:JwtPayload) {
    return this.usersService.create(dto, user.organizationId);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.ENGINEER,UserRole.VIEWER)
    // findAll(@Req() req) {
    //   return this.usersService.findAll(req.user.organizationId);
    // }
    findAll(@CurrentUser() user:JwtPayload){
        return this.usersService.findAll(user.organizationId)
    }
 

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER,UserRole.VIEWER)
    findById(@Param('id') id:string, @CurrentUser() user:JwtPayload) {
        return this.usersService.findById(id, user.organizationId)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER)
    update(@Param('id')id:string, @CurrentUser() user:JwtPayload, @Body()dto: UpdateUserDto){
        return this.usersService.update(id, dto, user.organizationId)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string, @CurrentUser() user:JwtPayload) {
      return this.usersService.softDelete(id, user.organizationId);
    }

    @Patch(':id/restore')
    @Roles(UserRole.ADMIN)
    restore(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.restore(id, user.organizationId)
    }

    @Patch(':id/deactivate')
    @Roles(UserRole.ADMIN)
    deactivate(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.deactivate(id, user.organizationId)
    } 
    
    @Patch(':id/activate')
    @Roles(UserRole.ADMIN)
    activate(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.activate(id, user.organizationId)
    }


}

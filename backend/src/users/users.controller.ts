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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {trace} from '@opentelemetry/api'

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    private readonly tracer = trace.getTracer('eirik-api');

     @Get('test-trace')
  testTrace() {
    const span = this.tracer.startSpan('manual-test-span');

    span.setAttribute('test', true);
    span.setAttribute('service', 'eirik-api');

    console.log('TRACE ID:', span.spanContext().traceId);
    console.log('SPAN ID:', span.spanContext().spanId);


    span.end();

    return {
      message: 'span created',
      traceId: span.spanContext().traceId,
    };
  }
    @Post()
    @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
    @ApiOperation({ summary: 'Create a user' })
    @ApiResponse({
      status: 201,
      description: 'User created successfully',
    })
    @ApiResponse({
      status: 401,
      description: 'Authentication required',
    })
    @ApiResponse({
      status: 403,
      description: 'Only administrators can create users',
    })
    @ApiResponse({
      status: 409,
      description: 'User with this email already exists',
    })
    create(@Body() dto: CreateUserDto, @CurrentUser() user:JwtPayload) {
    return this.usersService.create(dto, user);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.ENGINEER,UserRole.VIEWER, UserRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get users in the current organization' })
    @ApiResponse({
      status: 200,
      description: 'List of users accessible to the current user',
    })
    findAll(@CurrentUser() user:JwtPayload){
        return this.usersService.findAll(user)
    }
 

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER,UserRole.VIEWER, UserRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({
      status: 200,
      description: 'User found',
    })
    @ApiResponse({
      status: 404,
      description: 'User not found',
    })
    findById(@Param('id') id:string, @CurrentUser() user:JwtPayload) {
        return this.usersService.findById(id, user)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.ENGINEER,UserRole.SUPERADMIN)
    update(@Param('id')id:string, @CurrentUser() user:JwtPayload, @Body()dto: UpdateUserDto){
        return this.usersService.update(id, dto, user)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    remove(@Param('id') id: string, @CurrentUser() user:JwtPayload) {
      return this.usersService.softDelete(id, user);
    }

    @Patch(':id/restore')
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    restore(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.restore(id, user)
    }

    @Patch(':id/deactivate')
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    deactivate(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.deactivate(id, user)
    } 
    
    @Patch(':id/activate')
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    activate(@Param('id')id:string, @CurrentUser() user:JwtPayload){
        return this.usersService.activate(id, user)
    }


}

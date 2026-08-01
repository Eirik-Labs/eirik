import { Controller, Post, Body, Query, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
    }

    @Get()
    findAll(@Query('organizationId') organizationId: string) {
      return this.usersService.findAll(organizationId);
    }

    @Get(':id')
    findById(@Param('id') id:string){
        return this.usersService.findById(id)
    }

    @Patch(':id')
    update(@Param('id')id:string, @Body()dto: UpdateUserDto){
        return this.usersService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.usersService.softDelete(id);
    }

    @Patch(':id/restore')
    restore(@Param('id')id:string){
        return this.usersService.restore(id)
    }

    @Patch(':id/deactivate')
    deactivate(@Param('id')id:string){
        return this.usersService.deactivate(id)
    } 
    
    @Patch(':id/activate')
    activate(@Param('id')id:string){
        return this.usersService.activate(id)
    }


}

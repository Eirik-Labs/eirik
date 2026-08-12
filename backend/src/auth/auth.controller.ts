import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
     constructor(private readonly authService: AuthService){}

     @Post('login')
     @ApiOperation({ summary: 'Authenticate a user' })
     @ApiResponse({
       status: 201,
       description: 'User successfully authenticated',
     })
     @ApiResponse({
       status: 401,
       description: 'Invalid email or password',
     })
     login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }
    
}

import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
      example: 'your-email',
      description: 'User email address',
    })
    @IsEmail()
    @IsNotEmpty()
    email!:string



    @ApiProperty({
      example: 'your-password',
      description: 'User password',
    })
    @IsString()
    @IsNotEmpty()
    password!:string
}
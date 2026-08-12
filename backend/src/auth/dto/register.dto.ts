import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  organizationId!: string;
}

// we will not use it right now as we are making an org scoped platform,
// currently not allowing random users to signups
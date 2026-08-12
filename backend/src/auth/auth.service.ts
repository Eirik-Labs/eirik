import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt'
import {LoginDto} from './dto/login.dto'
@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

    async validateUser(email:string, password:string) {
        const user = await this.usersService.findByEmail(email)

        if(!user) throw new UnauthorizedException(`Invalid credentials`);
        const passwordMathches= await bcrypt.compare(password, user.password)
        
        if(!passwordMathches) throw new UnauthorizedException(`Invalid credentials`);
        
        if(!user.isActive) throw new ForbiddenException(`User is deactivated`);

        if(user.deletedAt) throw new ForbiddenException(`User is deleted`)
        
        return user    
    }

    async login(dto:LoginDto){
        const user = await this.validateUser(dto.email, dto.password)
        const payload = {
            sub:user.id, 
            email:user.email, 
            role:user.role,
            organizationId: user.organizationId
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return {
            accessToken,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                organizationId: user.organizationId
            }
        }

    }


}


// Client
//    │
//    ▼
// LocalAuthGuard
//    │
//    ▼
// LocalStrategy.validate(email,password)
//    │
//    ▼
// AuthService.validateUser()
//    │
//    ▼
// UsersService.findByEmail()
//    │
//    ▼
// bcrypt.compare()
//    │
//    ▼
// returns User
//    │
//    ▼
// Passport attaches user to req.user
//    │
//    ▼
// AuthController.login(req.user)
//    │
//    ▼
// AuthService.login(user)
//    │
//    ▼
// JWT generated




//              LOGIN
//                |
//                v
//       POST /auth/login
//                |
//                v
//      AuthService.validateUser()
//                |
//                v
//      Password matches?
//         /           \
//       No             Yes
//                      |
//                      v
//           JwtService.sign(payload)
//                      |
//                      v
//          JWT Token returned
//                      |
//                      |
//      ---------------------------------
//      Future Requests
//                      |
// Authorization: Bearer <JWT>
//                      |
//                      v
//           JwtStrategy executes
//                      |
//           validate(token payload)
//                      |
//                      v
//       req.user = returned object
//                      |
//                      v
//         Protected controller runs



// Application starts
//         ↓
// Nest creates modules
//         ↓
// Nest instantiates providers
//         ↓
// Passport registers strategies
//         ↓
// Request arrives
//         ↓
// Guard executes
//         ↓
// Passport selects the requested strategy
//         ↓
// Strategy validates the request
//         ↓
// Controller runs







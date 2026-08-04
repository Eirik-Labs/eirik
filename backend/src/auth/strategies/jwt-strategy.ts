import { Injectable } from "@nestjs/common";
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  //"Where should I look for the token?
         ignoreExpiration: false,                                    //expired token?
         secretOrKey: config.getOrThrow<string>('JWT_SECRET')        //secret key to verify the token
        })
    }

    async validate(payload:JwtPayload){    //passport will call this function after verifying the token. It says what should i return as the authenticated user.  So it calls validate(payload) and lets the application decide
         return payload
    }
}


// A strategy is simply a class that tells Passport how to authenticate a request. It doesn't have to be Google or GitHub.








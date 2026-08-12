import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core'
import {ROLES_KEY} from '../decorators/roles.decorator'
import {UserRole} from '../../common/enums/user-role.enum'

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if(!requiredRoles) return true

        const request = context.switchToHttp().getRequest()

        const user = request.user

        // return requiredRoles.includes(user.role)
        if (!requiredRoles.includes(user.role)) {
          throw new ForbiddenException('Insufficient permissions');
        }
        
        return true;
    }
}




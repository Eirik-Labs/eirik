import { JwtPayload } from "../../auth/interfaces/jwt-payload.interface";
import {UserRole} from '../enums/user-role.enum'

export class TenantUtils {
    static where(currentuser:JwtPayload) {
      if(currentuser.role === UserRole.SUPERADMIN){
        return {}
    }

    return{ organizationId: currentuser.organizationId }
}
}
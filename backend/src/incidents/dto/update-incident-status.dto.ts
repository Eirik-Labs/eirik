import {IsString, IsEnum} from 'class-validator'
import { IncidentStatus } from '../enums/incident-status.enum'

export class UpdateIncidentStatusDto {
    @IsString()
    @IsEnum(IncidentStatus)
    status!: IncidentStatus
}

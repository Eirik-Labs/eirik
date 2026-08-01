import {IsString} from 'class-validator'

export class AssignIncidentDto {
    @IsString()
    assignee!:string
}
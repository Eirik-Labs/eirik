import {IsEnum, IsInt, IsOptional, Min, IsString} from 'class-validator'
import {Type} from 'class-transformer'
import { IncidentStatus } from '../enums/incident-status.enum';
import { Severity } from '../../common/enums/severity.enum';
import { IncidentSource } from '../enums/incident-source.enum';

export class GetIncidentsQueryDto {
    @IsOptional()
    @IsEnum(IncidentStatus)
    status?: IncidentStatus

    @IsOptional()
    @IsEnum(Severity)
    severity?: Severity;
  
    @IsOptional()
    @IsEnum(IncidentSource)
    source?: IncidentSource;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page: number=1

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    limit:number=10

    @IsOptional()
    @IsString()
    search?:string
}
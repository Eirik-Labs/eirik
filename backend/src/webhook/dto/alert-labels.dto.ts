import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Severity } from '../../common/enums/severity.enum';

export class AlertLabelsDto{
    @IsString()
    alertname!:string

    @IsEnum(Severity)
    severity!:Severity

    @IsString()
    instance!:string

    @IsOptional()
    @IsString()
    job?: string;
    
    @IsOptional()
    @IsString()
    service?: string;
    
    @IsOptional()
    @IsString()
    namespace?: string
}
import { IsOptional, IsString } from 'class-validator';

export class AlertAnnotationsDto{
    @IsString()
    summary!:string
    
    @IsOptional()
    @IsString()
    description?:string
}
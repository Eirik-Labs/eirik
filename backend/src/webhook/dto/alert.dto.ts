import { Type } from "class-transformer";   
import {IsDateString, IsArray, IsEnum, IsString, IsOptional, ValidateNested} from 'class-validator'
import { AlertLabelsDto } from './alert-labels.dto';
import { AlertAnnotationsDto } from './alert-annotations.dto';
import { AlertStatus } from '../../common/enums/alert-status.enum';

export class AlertDto{
  @IsEnum(AlertStatus)
  status!: AlertStatus;
  
  @IsString()
  fingerprint!:string

  @ValidateNested()
  @Type(() => AlertLabelsDto)
  labels!: AlertLabelsDto;

  @ValidateNested()
  @Type(() => AlertAnnotationsDto)
  annotations!: AlertAnnotationsDto;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsString()
  generatorURL?: string;
}
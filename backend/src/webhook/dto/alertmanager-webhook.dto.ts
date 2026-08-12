import { Type } from "class-transformer";   
import {IsArray, IsEnum, IsString, ValidateNested, IsOptional, IsObject} from 'class-validator'
import {AlertDto} from './alert.dto'
import { AlertStatus } from "src/common/enums/alert-status.enum";

export class AlertmanagerWebhookDto{
   
   @IsString()
   version!: string;

   @IsString()
   receiver!:string;

   @IsOptional()
   @IsString()
   groupKey?: string;

   @IsObject()
   groupLabels!: Record<string, string>;
 
   @IsObject()
   commonLabels!: Record<string, string>;
 
   @IsObject()
   commonAnnotations!: Record<string, string>;
 
   @IsString()
   externalURL!: string;

   @IsEnum(AlertStatus)
   status!:AlertStatus;

   @IsArray()
   @ValidateNested({each:true})
   @Type(()=>AlertDto)
   alerts!:AlertDto[]

}





// The ! tells TypeScript:

// "I know this property will be assigned later."

// This is the standard practice for DTOs in NestJS.

// You'll do the same for all required DTO properties.
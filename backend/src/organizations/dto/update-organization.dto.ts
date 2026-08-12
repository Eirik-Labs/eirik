import {PartialType} from '@nestjs/mapped-types'
import {CreateOrganizationDto} from './create-organization.dto'

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}



// export class UpdateOrganizationDto {

//     @IsString()
//     @IsOptional()
//     name?:string

//     @IsString()
//     @IsOptional()
//     slug?:string

//     @IsString()
//     @IsOptional()
//     logoUrl?:string
// }
import { ConflictException, Injectable, NotFoundException,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organizations.entity';
import { Repository } from 'typeorm';
import {CreateOrganizationDto} from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrganizationsService {
    private readonly logger = new Logger(OrganizationsService.name)
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>
    ){}

    async create(createOrganizationDto: CreateOrganizationDto){
      const existingOrganization = await this.organizationRepository.findOne({
        where:[
            {name: createOrganizationDto.name},
            {slug: createOrganizationDto.slug}
        ]
      })

      if(existingOrganization){
        this.logger.warn(
        `Organization creation rejected: name or slug already exists`,
      );
        throw new ConflictException('Organization with the same name or slug already exists')
      }
      const webhookSecret = randomBytes(32).toString('hex');
      const organization = this.organizationRepository.create({...createOrganizationDto, webhookSecret})  //did not use await here bcs create is not an async operation
      const savedOrganization= await this.organizationRepository.save(organization)
      
      this.logger.log(
      `Organization created: organizationId=${savedOrganization.id}, name=${savedOrganization.name}`,
      );

      return savedOrganization
    }

    async findAll(){
        return this.organizationRepository.find({
            order:{
                createdAt:'DESC'
            }
        })
    }
    
    async findByWebhookSecret(webhookSecret: string) {
       const organization = await this.organizationRepository.findOne({
        where: { webhookSecret },
      });

      if (!organization) {
       this.logger.warn(
         'Organization lookup failed: invalid webhook secret',
       );
 
       return null;
     }

      this.logger.log(
        `Organization identified from webhook secret: organizationId=${organization.id}`,
      );
  
      return organization;
    }

    async findById(id:string){
        const organization= await this.organizationRepository.findOne({
            where:{id}
        })

        if(!organization){
            
          this.logger.warn(
            `Organization not found: organizationId=${id}`,
          )
          throw new NotFoundException('Organization not found')
        }
        return organization
    }

    async update(id:string, dto:UpdateOrganizationDto){
        const organization= await this.organizationRepository.findOne({
            where:{id}
        })
        if(!organization){
            this.logger.warn(
            `Organization update failed: organizationId=${id} not found`,
          );

          throw new NotFoundException('Organization not found')
        }
        Object.assign(organization, dto)
        
        const updatedOrganization= this.organizationRepository.save(organization)

        this.logger.log( `Organization updated: organizationId=${id}`,)

        return updatedOrganization;
    }


    async softDelete(id:string){
       const organization = await this.findById(id);
       
       if(!organization)throw new NotFoundException('Organization not found')
       await this.organizationRepository.softDelete(organization.id);
       this.logger.log(
         `Organization soft deleted: organizationId=${id}`,
       );

       return {
         message: 'Organization deleted successfully',
       };
    }

    async restore(id: string) {
      const organization = await this.organizationRepository.findOne({
        where: { id },
        withDeleted: true,
      });
    
      if (!organization) {
         this.logger.warn(
           `Organization restore failed: organizationId=${id} not found`,
         );
        throw new NotFoundException('Organization not found');
      }
    
      if (!organization.deletedAt) {
        this.logger.warn(
          `Organization restore rejected: organizationId=${id} is not deleted`,
        );

        throw new ConflictException('Organization is not deleted');
      }
    
      await this.organizationRepository.restore(organization.id);

      this.logger.log(
        `Organization restored: organizationId=${id}`,
      );
    
      return {
        message: 'Organization restored successfully',
      };
    }

}
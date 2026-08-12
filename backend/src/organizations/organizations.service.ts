import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organizations.entity';
import { Repository } from 'typeorm';
import {CreateOrganizationDto} from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrganizationsService {
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
        throw new ConflictException('Organization with the same name or slug already exists')
      }
      const webhookSecret = randomBytes(32).toString('hex');
      const organization = this.organizationRepository.create({...createOrganizationDto, webhookSecret})  //did not use await here bcs create is not an async operation
      return await this.organizationRepository.save(organization)
    }

    async findAll(){
        return this.organizationRepository.find({
            order:{
                createdAt:'DESC'
            }
        })
    }
    
    async findByWebhookSecret(webhookSecret: string) {
       return this.organizationRepository.findOne({
      where: { webhookSecret },
    });
    }

    async findById(id:string){
        const organization= this.organizationRepository.findOne({
            where:{id}
        })

        if(!organization){
            throw new NotFoundException('Organization not found')
        }
        return organization
    }

    async update(id:string, dto:UpdateOrganizationDto){
        const organization= await this.organizationRepository.findOne({
            where:{id}
        })
        if(!organization)throw new NotFoundException('Organization not found')
        Object.assign(organization, dto)
        
        return this.organizationRepository.save(organization)
    }


    async softDelete(id:string){
       const organization = await this.findById(id);
       
       if(!organization)throw new NotFoundException('Organization not found')
       await this.organizationRepository.softDelete(organization.id);
       
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
        throw new NotFoundException('Organization not found');
      }
    
      if (!organization.deletedAt) {
        throw new ConflictException('Organization is not deleted');
      }
    
      await this.organizationRepository.restore(organization.id);
    
      return {
        message: 'Organization restored successfully',
      };
    }

}
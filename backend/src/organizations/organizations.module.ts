import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './entities/organizations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  imports:[TypeOrmModule.forFeature([Organization]),],
  exports:[OrganizationsService]
})
export class OrganizationsModule {}

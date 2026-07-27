import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incidents.entity';
@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService],
  imports: [
    TypeOrmModule.forFeature([Incident]),
  ],
})
export class IncidentsModule {}

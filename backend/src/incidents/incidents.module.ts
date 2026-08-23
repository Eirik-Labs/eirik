import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incidents.entity';
import { HttpModule } from '@nestjs/axios';
import { AiModule } from 'src/ai/ai.module';
@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService],
  imports: [
    TypeOrmModule.forFeature([Incident]),
    HttpModule,
    AiModule,
  ],
  exports:[IncidentsService]
})
export class IncidentsModule {}

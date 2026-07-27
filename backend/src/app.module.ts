import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { IncidentsModule } from './incidents/incidents.module';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true       // without isGlobal:true, each module needs to import ConfigModule
    }),
   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',

    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),

    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),

    database: config.get<string>('DB_NAME'),

    autoLoadEntities: true,  //loads all the entities automatically

    synchronize: false,  // does not apply schema changes directly, migrations are required

    logging: true, // logs the running queries
  }),
}),
    WebhookModule, IncidentsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

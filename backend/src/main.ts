import './instrumentation';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { logger } from './common/logger/logger.config'
import { MetricsInterceptor } from './metrics/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger
  });
  
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,})    
  )

  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
  app.get(MetricsInterceptor),
  );
  
  const config = new DocumentBuilder()
  .setTitle('Eirik API')
  .setDescription('Eirik incident management and observability API')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token',
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

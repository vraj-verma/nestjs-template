import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './errors/allExceptions';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter Template')
    .setDescription('A clean and modular NestJS starter template with JWT auth, user management, and validation.')
    .setVersion('1.0')
    .addTag('NestJS Starter')
    .addServer('http://localhost:7001')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'Header',
      },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const API_PORT = 7001
  await app.listen(API_PORT, () => console.info(`server started at: ${API_PORT}`));
}
bootstrap();

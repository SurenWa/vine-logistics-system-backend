import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
//import { SeedService } from './seed/seed.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // const seedService = app.get(SeedService, { strict: false });

    // await seedService.seedProducts();

    app.enableCors();
    app.use(helmet());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    const config = new DocumentBuilder()
        .setTitle('Vine Logistics System')
        .setDescription('Vine Logistics system API description')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(5000);
}
bootstrap();

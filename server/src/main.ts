// backend/src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { RolesGuard } from './users/common/guards/roles.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './users/common/filters/all-exceptions.filter';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow CORS for all origins (or restrict to only http://localhost:8081)
  app.enableCors({
    origin: 'http://localhost:8081', // for Expo web
    credentials: true,
  });

  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Payment Dashboard API')
    .setDescription('Docs for all backend endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  const usersService = app.get(UsersService);
  const existing = await usersService.findByUsername('admin');
  if (!existing) {
    await usersService.createUser('admin', 'admin123', 'admin');
    console.log('✅ Admin user created: admin/admin123');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();

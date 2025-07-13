import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const exists = await usersService.findByUsername('admin');
    if (!exists) {
        await usersService.createUser('admin', 'admin123', 'admin');
        console.log('✅ Admin user created');
    } else {
        console.log('ℹ️ Admin user already exists.');
    }


    await app.close();
}
seed();

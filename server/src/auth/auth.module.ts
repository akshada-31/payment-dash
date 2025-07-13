import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // ✅ Import it
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    UsersModule, // ✅ Required for UsersService
    PassportModule,
    JwtModule.register({ secret: 'supersecret', signOptions: { expiresIn: '1d' }, }), // Or use ConfigModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }

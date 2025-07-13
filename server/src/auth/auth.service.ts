import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            console.log('⛔ User not found');
            throw new UnauthorizedException('User not found');
        }

        console.log('🟡 User fetched:', user);
        console.log('🔒 bcrypt test:', await bcrypt.compare('admin123', user.password));

        const isValid = await bcrypt.compare(password, user.password);
        console.log('🟡 Password match:', isValid);

        if (!isValid) throw new UnauthorizedException('Invalid password');

        return { id: user.id, username: user.username, role: user.role };
    }


    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);
        console.log('🟢 Logged in:', user);

        const payload = { sub: user.id, username: user.username, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

}

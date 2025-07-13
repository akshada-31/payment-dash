import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './common/decorators/roles.decorators';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // applies to all routes
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // GET /users (admin only)
    @Roles('admin')
    @Get()
    async findAll(@Request() req) {
        console.log('🔍 req.user:', req.user);
        return this.usersService.findAll();
    }

    // POST /users → create new user (admin only)
    @Roles('admin')
    @Post()
    async createUser(
        @Body() body: { username: string; password: string; role?: string },
    ) {
        return this.usersService.createUser(
            body.username,
            body.password,
            body.role || 'viewer',
        );
    }

    // DELETE /users/:id (admin only)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.usersService.deleteUser(+id);
        return { message: 'User deleted' };
    }
}

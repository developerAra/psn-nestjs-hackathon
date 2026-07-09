import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    @Roles(['ADMIN'])
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}

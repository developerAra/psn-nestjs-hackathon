import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    getAllUsers() {
        return this.prismaService.user.findMany();
    }

    async getUserById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!user) { throw new NotFoundException(`User with ID: ${id} not found`); }
        return user;
    }

}

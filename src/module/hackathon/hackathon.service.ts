import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateHackathonDto } from '../dto/create-hackathon.dto';
import { UpdateHackathonDto } from '../dto/update-hackathon.dto';

@Injectable()
export class HackathonService {
    constructor(private readonly prismaService: PrismaService) { }

    async getHackathons() {
        return this.prismaService.hackathon.findMany();
    }

    async getHackathonById(id: string) {
        const hackathon = await this.prismaService.hackathon.findUnique({
            where: { id },
        });
        if (!hackathon) {
            throw new NotFoundException(`Hackathon with ID ${id} not found`);
        }
        return hackathon;
    }

    async createHackathon(authorId: string, hackathonData: CreateHackathonDto) {
        //find first user with the given authorId
        const user = await this.prismaService.user.findUnique({
            where: { id: authorId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${authorId} not found`);
        }

        //if user is existing, proceed to create the hackathon with the given data and authorId
        return this.prismaService.hackathon.create({
            data: {
                ...hackathonData,
                authorId
            },
        });
    }

    async updateHackathon(id: string, hackathonUpdateData: UpdateHackathonDto) {
        const hackathon = await this.prismaService.hackathon.findUnique({
            where: { id },
        });
        if (!hackathon) {
            throw new NotFoundException(`Hackathon with ID ${id} not found`);
        }

        return this.prismaService.hackathon.update({
            where: { id },
            data: hackathonUpdateData,
        });
    }

    async deleteHackathon(id: string) {
        const hackathon = await this.prismaService.hackathon.findUnique({
            where: { id },
        });
        if (!hackathon) {
            throw new NotFoundException(`Hackathon with ID ${id} not found`);
        }

        return this.prismaService.hackathon.delete({
            where: { id },
        });
    }

    async joinHackathon(hackathonId: string, userId: string) {
        //check first if user is already a participant of the hackathon
        const existingParticipant = await this.prismaService.hackathonParticipant.findFirst({
            where: {
                hackathonId,
                userId,
            },
        });

        if (existingParticipant) {
            throw new BadRequestException(`User has already joined the hackathon with ID ${hackathonId}`);
        }

        const hackathon = await this.prismaService.hackathon.findUnique({
            where: { id: hackathonId },
        });

        if (!hackathon) {
            throw new NotFoundException(`Hackathon with ID ${hackathonId} not found`);
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        const isHackathonActive = hackathon.isActive;
        if (!isHackathonActive) {
            throw new BadRequestException(`Hackathon with ID ${hackathonId} is not active. You cannot join an inactive hackathon.`);
        }

        //if user is participant and hackathon are is active, proceed to create the participant to join the hackathon
        return this.prismaService.hackathonParticipant.create({
            data: {
                hackathonId,
                userId,
            },
        });
    }
}

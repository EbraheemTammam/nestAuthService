import { Injectable } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dtos/user-create.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    
    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: UserCreateDto) {
        await this.prisma.user.create({ data })
    }
}

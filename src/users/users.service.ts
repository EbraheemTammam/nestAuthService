import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dtos/user-create.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    
    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: UserCreateDto): Promise<{ sucess: boolean, error?: string }> {
        try {
            await this.prisma.user.create({ data });
            return { sucess: true };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return {
                        sucess: false,
                        error: 'A user with this email already exists'
                    };
                }
            }
        }

        return { sucess: false, error: 'An unkowm error occured' };
    }
}

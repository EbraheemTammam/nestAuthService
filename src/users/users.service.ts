import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dtos/user-create.dto';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {}
    
    async findOne(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async create(data: UserCreateDto): Promise<{ success: boolean, error?: string }> {
        try {
            data.password = await argon2.hash(
                data.password, 
                {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    timeCost: 3, 
                }
            );
            
            await this.userModel.create(data);
            return { success: true };
        } catch (error: any) {
            if (error.code === 11000) {
                return {
                    success: false,
                    error: 'A user with this email already exists',
                };
            }
            else console.error(error);
        }

        return { success: false, error: 'An unkowm error occured' };
    }

    async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return argon2.verify(hashedPassword, plainTextPassword);
    }

    async changePassword(
        user: { userId: string, email: string, name: string }, 
        oldPassword: string, 
        newPassword: string
    ) {
        const existingUser = await this.findOne(user.email) as User;
        const isOldPasswordMatch = await this.verifyPassword(oldPassword, existingUser.password);
        if (!isOldPasswordMatch) throw new BadRequestException('Old password is not correct');

        const hashedPassword = await argon2.hash(
            newPassword, 
            {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3, 
            }
        );

        await this.userModel.findByIdAndUpdate(
            user.userId,
            { password: hashedPassword },
            { returnDocument: 'after' }
        );
    }
}

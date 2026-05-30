import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/../generated/prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async login(user: Omit<User, 'password'>): Promise<TokenDto> {
        const userPaylod: UserDto = { ...user };
        const accessToken = await this.jwtService.signAsync(userPaylod);
        
        return { accessToken };
    }

    async validateUser(email: string, plainPassword: string) {
        const startTime = Date.now();
        let authenticatedUser: Omit<User, 'password'> | null = null;

        try {
            const user = await this.userService.findOne(email);
            if (user) {
                const isPasswordValid = await this.userService.verifyPassword(plainPassword, user.password);
                if (isPasswordValid) {
                    const { password, ...result } = user;
                    authenticatedUser = result;
                }
            }
        } finally {
            const minExecutionTime = 300;
            const elapsedTime = Date.now() - startTime;
            
            if (elapsedTime < minExecutionTime) {
                await new Promise(resolve => setTimeout(resolve, minExecutionTime - elapsedTime));
            }

            if (!authenticatedUser) throw new UnauthorizedException('Invalid Credentials');
        }
        
        return authenticatedUser;
    }
}

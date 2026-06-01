import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { UserCreateDto } from 'src/users/dtos/user-create.dto';
import { PasswordChangeDto } from './dtos/password-change.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() request) {
        return await this.authService.login(request.user);
    }

    @Public()
    @Post('signup')
    async signup(@Body() signupDto: UserCreateDto) {
        return await this.usersService.create(signupDto);
    }

    @Post('logout')
    async logout(@Req() req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.authService.logout(token);
    }

    @Patch('change_password')
    async changePassword(
        @Req() req: any, 
        @Body() passwordChangeDto: PasswordChangeDto
    ) {
        await this.usersService.changePassword(
            req.user,
            passwordChangeDto.oldPassword,
            passwordChangeDto.newPassword
        );
    }
}

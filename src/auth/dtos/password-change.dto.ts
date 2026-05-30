import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class PasswordChangeDto {
    @IsString()
    @IsNotEmpty()
    oldPassword!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1
    },
    {
        message:
        'Password must contain uppercase, lowercase, number, symbol and be at least 8 chars long',
    })
    newPassword!: string;
}
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class UserCreateDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name!: string;
    
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
    password!: string;
}
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
    role?: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}

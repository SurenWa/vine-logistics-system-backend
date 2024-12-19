import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuperAdminLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}

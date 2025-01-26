import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubadminDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User Code is required' })
    @IsString()
    userCode: string;
}

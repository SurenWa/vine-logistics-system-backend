import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSubuserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User Code is required' })
    @IsString()
    userCode: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    rfid: string;
}

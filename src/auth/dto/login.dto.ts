import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty()
    identifier: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubadminDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    userCode: string;
}

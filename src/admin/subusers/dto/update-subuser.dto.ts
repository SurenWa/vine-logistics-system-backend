import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubuserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    userCode: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    rfid: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateManufacturerDto {
    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ required: false })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    webAddress?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    @ApiProperty({ required: false })
    description?: string;
}

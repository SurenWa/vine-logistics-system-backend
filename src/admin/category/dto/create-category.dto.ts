import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ required: false })
    brandName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    country?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    city?: string;
}

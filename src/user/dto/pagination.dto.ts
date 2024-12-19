// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, default: '' })
    search?: string = '';

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @ApiProperty({ required: false })
    categoryId?: number;

    @IsOptional()
    @ApiProperty({ required: false })
    page?: number = 0;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false, minimum: 5, maximum: 25, default: 10 })
    rowsPerPage?: number = 10;
}

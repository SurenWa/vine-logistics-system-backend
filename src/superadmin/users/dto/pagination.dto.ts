// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, default: '' })
    search?: string = '';

    @IsOptional()
    //@Transform(({ value }) => parseInt(value) + 1)
    @ApiProperty({ required: false, default: 0 })
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false, minimum: 5, maximum: 25, default: 10 })
    rowsPerPage?: number = 10;
}

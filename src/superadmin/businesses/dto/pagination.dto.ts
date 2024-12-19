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
    @ApiProperty({ required: false, minimum: 1, default: 1 })
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false, minimum: 5, maximum: 25, default: 10 })
    rowsPerPage?: number = 10;
}

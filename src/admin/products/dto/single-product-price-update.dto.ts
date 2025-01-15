// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SingleProductPriceUpdatePaginationDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, default: '' })
    search?: string = '';

    @IsOptional()
    @ApiProperty({ required: false })
    page?: number = 0;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false, minimum: 5, maximum: 25000, default: 75 })
    rowsPerPage?: number = 10;
}

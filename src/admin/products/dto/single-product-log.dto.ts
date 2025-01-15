// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum ProductLogType {
    SALESREGISTERED = 'SALESREGISTERED',
    STOCKADDED = 'STOCKADDED',
    PRICEADJUSTED = 'PRICEADJUSTED',
}

export class SingleProductLogPaginationDto {
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

    @IsOptional()
    @IsEnum(ProductLogType)
    @ApiProperty({
        required: false,
        enum: ProductLogType,
        enumName: 'ProductLogType',
        description: 'Filter by product log type',
    })
    logType?: ProductLogType;
}

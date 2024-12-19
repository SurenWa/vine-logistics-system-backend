// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class UserOrderPaginationDto {
    @IsOptional()
    @ApiProperty({ required: false, default: 0 })
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false, minimum: 5, maximum: 25, default: 10 })
    rowsPerPage?: number = 10;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @ApiProperty({ required: false })
    fromDate?: Date;

    @IsOptional()
    @Transform(({ value }) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999); // Set to end of the day
        return date;
    })
    @IsDate()
    @ApiProperty({ required: false })
    tillDate?: Date;

    // Set tillDate to end of the day
}

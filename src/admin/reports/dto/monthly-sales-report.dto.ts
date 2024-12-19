// pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MonthlySalesReportDto {
    @IsOptional()
    @ApiProperty({ required: false, default: new Date().getFullYear() })
    year?: number;
}

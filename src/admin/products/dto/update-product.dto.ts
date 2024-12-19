import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
    @IsString()
    @MaxLength(300)
    @IsOptional()
    @ApiProperty({ required: false })
    name?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    year?: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false })
    barCode?: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    setResPriceToCurrPrice?: boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    @Transform(({ value }) => {
        // Check if the value is a string and contains a comma
        if (typeof value === 'string' && value.includes(',')) {
            // Replace ',' with '.' and parse as float
            return parseFloat(value.replace(',', '.'));
        }
        // Parse value as float
        return parseFloat(value);
    })
    costPriceExcludingVat?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    @Transform(({ value }) => {
        // Check if the value is a string and contains a comma
        if (typeof value === 'string' && value.includes(',')) {
            // Replace ',' with '.' and parse as float
            return parseFloat(value.replace(',', '.'));
        }
        // Parse value as float
        return parseFloat(value);
    })
    retailPriceExcludingVat?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    stockBalance?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    minimumStockBalance?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    maximumStockBalance?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    manufacturerId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    supplierId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    categoryId?: number;
}

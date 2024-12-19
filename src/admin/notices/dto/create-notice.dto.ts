import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsString,
    IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class ProductDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    stockCount: number;
}

export class CreateNoticeDto {
    @ApiProperty({ required: true })
    @IsDateString()
    date: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiProperty({ type: [ProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
}

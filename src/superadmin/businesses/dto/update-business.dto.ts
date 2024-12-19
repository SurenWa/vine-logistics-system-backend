import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateBusinessDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Business Id is required' })
    @IsNumber()
    businessId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    businessName: string;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ required: false })
    businessAddress?: string;

    // @IsNumber()
    // @IsOptional()
    // @ApiProperty({ required: false })
    // businessNumber?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    businessNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    telephoneNumber?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: true })
    isActive?: boolean = true;
}

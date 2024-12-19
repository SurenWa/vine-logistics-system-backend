import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSupplierDto {
    @IsString()
    @MaxLength(300)
    @IsOptional()
    @ApiProperty({ required: false })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    address?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    telephone?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ required: false })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    postalCode?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    place: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    country?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    customerNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    bankAccount?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    webAddress?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    paymentInformation?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    @ApiProperty({ required: false })
    description?: string;
}

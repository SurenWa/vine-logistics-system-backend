import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateOrderProposalDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    productId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    quantity?: number;
}

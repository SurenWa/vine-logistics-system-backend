import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateOrderProposalDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    productId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    quantity?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOrderproposalDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    orderProposalId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    @Transform(({ value }) => parseInt(value))
    receivedQuantity?: number;
}

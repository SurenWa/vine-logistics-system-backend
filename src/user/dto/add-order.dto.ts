import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderProductDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    cartId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    productId: number;
}

export class AddOrderDto {
    @ApiProperty({ type: [OrderProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    items: OrderProductDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ReserveProductDto {
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

export class AddReservationDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    message: string;

    @ApiProperty({ type: [ReserveProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReserveProductDto)
    items: ReserveProductDto[];
}

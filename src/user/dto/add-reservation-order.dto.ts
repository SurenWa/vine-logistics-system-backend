import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddReserveOrderDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    reserveCheckoutId: number;
}

export class AddReservationOrderDto {
    @ApiProperty({ type: [AddReserveOrderDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddReserveOrderDto)
    items: AddReserveOrderDto[];
}

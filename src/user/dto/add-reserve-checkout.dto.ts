import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddReserveCheckoutDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Reservation Id is required' })
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    reserveId: number;
}

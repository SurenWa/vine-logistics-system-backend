import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddProductToCartDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'User Code is required' })
    @IsNumber()
    //@Transform(({ value }) => parseInt(value))
    productId: number;
}

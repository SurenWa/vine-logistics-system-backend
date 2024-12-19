import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserCodeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'User Code is required' })
    @IsString()
    userCode: string;
}

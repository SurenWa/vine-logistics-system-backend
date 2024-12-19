import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
    // @ApiProperty()
    // email: string;

    @ApiProperty()
    id: number;

    @ApiProperty()
    businessId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Manufacturers } from '@prisma/client';

export class ManufacturerEntity implements Manufacturers {
    constructor(partial: Partial<ManufacturerEntity>) {
        Object.assign(this, partial);
    }

    businessId: number;

    @ApiProperty()
    id: number;

    @ApiProperty({ required: false, nullable: true })
    name: string | null;

    @ApiProperty({ required: false, nullable: true })
    webAddress: string | null;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

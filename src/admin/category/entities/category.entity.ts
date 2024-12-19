import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '@prisma/client';

export class CategoryEntity implements Categories {
    constructor(partial: Partial<CategoryEntity>) {
        Object.assign(this, partial);
    }
    businessId: number;
    @ApiProperty()
    id: number;

    @ApiProperty()
    brandName: string;

    @ApiProperty({ required: false, nullable: true })
    country: string | null;

    @ApiProperty({ required: false, nullable: true })
    city: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

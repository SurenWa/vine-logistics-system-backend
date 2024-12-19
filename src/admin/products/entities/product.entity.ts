import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Products } from '@prisma/client';

export class ProductEntity implements Products {
    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }

    businessId: number;

    @ApiProperty()
    id: number;

    @ApiProperty({ required: false, nullable: true })
    name: string | null;

    @ApiProperty({ required: false, nullable: true })
    year: number | null;

    @ApiProperty({ required: false, nullable: true })
    barCode: bigint | null;

    @ApiProperty({ required: false })
    isActive: boolean;

    @ApiProperty({ required: false })
    setResPriceToCurrPrice: boolean;

    @ApiProperty({ required: false, nullable: true })
    costPriceExcludingVat: Prisma.Decimal | null;

    @ApiProperty({ required: false, nullable: true })
    markupPercent: Prisma.Decimal | null;

    @ApiProperty({ required: false, nullable: true })
    retailPriceExcludingVat: Prisma.Decimal | null;

    @ApiProperty({ required: false, nullable: true })
    retailPriceIncludingVat: Prisma.Decimal | null;

    @ApiProperty({ required: false, nullable: true })
    stockBalance: number | null;

    @ApiProperty({ required: false, nullable: true })
    previousStockBalance: number | null;

    @ApiProperty({ required: false, nullable: true })
    onTheWayInQuantity: number | null;

    @ApiProperty({ required: false, nullable: true })
    reservationAvailable: number | null;

    @ApiProperty({ required: false, nullable: true })
    reservedQuantity: number | null;

    @ApiProperty({ required: false, nullable: true })
    minimumStockBalance: number | null;

    @ApiProperty({ required: false, nullable: true })
    maximumStockBalance: number | null;

    @ApiProperty({ required: false, nullable: true })
    manufacturerId: number | null;

    @ApiProperty({ required: false, nullable: true })
    categoryId: number | null;

    @ApiProperty({ required: false, nullable: true })
    supplierId: number | null;

    @ApiProperty({ required: false, nullable: true })
    createdBy: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

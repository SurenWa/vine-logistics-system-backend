import { ApiProperty } from '@nestjs/swagger';
import { Suppliers } from '@prisma/client';

export class SupplierEntity implements Suppliers {
    constructor(partial: Partial<SupplierEntity>) {
        Object.assign(this, partial);
    }

    businessId: number;

    @ApiProperty()
    id: number;

    @ApiProperty({ required: false, nullable: true })
    name: string | null;

    @ApiProperty({ required: false, nullable: true })
    address: string | null;

    @ApiProperty({ required: false, nullable: true })
    telephone: string | null;

    @ApiProperty({ required: false, nullable: true })
    email: string | null;

    @ApiProperty({ required: false, nullable: true })
    postalCode: string | null;

    @ApiProperty({ required: false, nullable: true })
    place: string | null;

    @ApiProperty({ required: false, nullable: true })
    country: string | null;

    @ApiProperty({ required: false, nullable: true })
    customerNumber: string | null;

    @ApiProperty({ required: false, nullable: true })
    bankAccount: string | null;

    @ApiProperty({ required: false, nullable: true })
    webAddress: string | null;

    @ApiProperty({ required: false, nullable: true })
    paymentInformation: string | null;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

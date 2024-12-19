import { Businesses } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// model Businesses {
//     id              Int      @id @default(autoincrement())
//     businessName    String   @unique
//     businessAddress String?
//     businessNumber  Int?
//     telephoneNumber String?
//     isActive        Boolean  @default(true)
//     createdAt       DateTime @default(now())
//     updatedAt       DateTime @updatedAt
// }

export class BusinessEntity implements Businesses {
    @ApiProperty()
    id: number;

    @ApiProperty()
    businessName: string;

    @ApiProperty({ required: false, nullable: true })
    businessAddress: string | null;

    @ApiProperty({ required: false, nullable: true })
    businessNumber: string | null;

    @ApiProperty({ required: false, nullable: true })
    telephoneNumber: string | null;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

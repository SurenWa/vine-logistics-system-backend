import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// model Manufacturers {
//     id              Int      @id @default(autoincrement())
//     name            String?
//     webAddress      String?
//     description     String?
//     business        Businesses? @relation(fields: [businessId], references: [id], onDelete: Cascade)
//     businessId Int?
//     createdAt       DateTime @default(now())
//     updatedAt       DateTime @updatedAt
// }

export class CreateManufacturerDto {
    @IsString()
    @ApiProperty({ required: true })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    webAddress?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description?: string;
}

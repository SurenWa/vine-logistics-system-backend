// model Suppliers {
//     id                 Int         @id @default(autoincrement())
//     name               String?
//     address            String?
//     telephone          String?
//     email              String?
//     postalCode         Int?
//     place              String?
//     country            String?
//     customerNumber     Int?
//     bankAccount        Int?
//     webAddress         String?
//     paymentInformation String?
//     description        String?
//     business           Businesses? @relation(fields: [businessId], references: [id], onDelete: Cascade)
//     businessId         Int?
//     products           Products[]
//     createdAt          DateTime    @default(now())
//     updatedAt          DateTime    @updatedAt
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSupplierDto {
    @IsString()
    @MaxLength(300)
    @ApiProperty({ required: true })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    address?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    telephone?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ required: false })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    postalCode?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    place: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    country?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    customerNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    bankAccount?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    webAddress?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    paymentInformation?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    @ApiProperty({ required: false })
    description?: string;
}

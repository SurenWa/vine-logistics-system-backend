// model User {
//     id         Int         @id @default(autoincrement())
//     name       String?
//     email      String?     @unique
//     username   String?
//     password   String
//     pinCode    Int?
//     userCode   String?
//     rfid       Int?
//     role       Role
//     createdAt  DateTime    @default(now())
//     updatedAt  DateTime    @updatedAt
//     business   Businesses? @relation(fields: [businessId], references: [id])
//     businessId Int?
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsEmail } from 'class-validator';
import { CreateBusinessDto } from 'src/superadmin/businesses/dto/create-business.dto';

export class CreateAdminUserDto extends CreateBusinessDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Pin Code is required' })
    @IsNumber()
    pinCode: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;
}

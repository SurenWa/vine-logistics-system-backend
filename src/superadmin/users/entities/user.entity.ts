import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { BusinessEntity } from 'src/superadmin/businesses/entities/business.entity';

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

export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    pinCode: number;

    @ApiProperty()
    userCode: string;

    @ApiProperty()
    rfid: string;

    @ApiProperty()
    businessId: number;

    @ApiProperty()
    role: $Enums.Role;

    @ApiProperty()
    createdBy: $Enums.Role;

    @ApiProperty({ type: BusinessEntity })
    business?: BusinessEntity;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    // constructor({ department, ...data }: Partial<DepartmentEntity>) {
    //     Object.assign(this, data);

    //     if (department) {
    //       this.department = new UserEntity(department);
    //     }
    //   }
    // static create(partial: Partial<UserEntity>): UserEntity {
    //     return new UserEntity(partial, partial.department);
    // }
}

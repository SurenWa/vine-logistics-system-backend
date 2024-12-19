import { ApiProperty } from '@nestjs/swagger';

export class SubuserEntity {
    constructor(partial: Partial<SubuserEntity>) {
        Object.assign(this, partial);
    }
    @ApiProperty()
    id: number;

    @ApiProperty({ required: false, nullable: true })
    username: string | null;

    @ApiProperty({ required: false, nullable: true })
    userCode: string | null;

    @ApiProperty({ required: false, nullable: true })
    rfid: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

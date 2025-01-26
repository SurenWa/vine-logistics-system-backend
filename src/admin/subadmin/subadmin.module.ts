import { Module } from '@nestjs/common';
import { SubadminService } from './subadmin.service';
import { SubadminController } from './subadmin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [SubadminController],
    providers: [SubadminService],
    imports: [PrismaModule],
})
export class SubadminModule {}

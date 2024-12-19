import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [BusinessesController],
    providers: [BusinessesService],
    imports: [PrismaModule],
    exports: [BusinessesService],
})
export class BusinessesModule {}

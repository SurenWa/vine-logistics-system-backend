import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [ManufacturersController],
    providers: [ManufacturersService],
    imports: [PrismaModule],
    exports: [ManufacturersService],
})
export class ManufacturersModule {}

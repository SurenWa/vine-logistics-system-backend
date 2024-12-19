import { Module } from '@nestjs/common';
import { SubusersService } from './subusers.service';
import { SubusersController } from './subusers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [SubusersController],
    providers: [SubusersService],
    imports: [PrismaModule],
})
export class SubusersModule {}

import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfgenerateModule } from '../pdfgenerate/pdfgenerate.module';

@Module({
    controllers: [NoticesController],
    providers: [NoticesService],
    imports: [PrismaModule, PdfgenerateModule],
})
export class NoticesModule {}

import { Module } from '@nestjs/common';
import { OrderproposalService } from './orderproposal.service';
import { OrderproposalController } from './orderproposal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfgenerateModule } from '../pdfgenerate/pdfgenerate.module';

@Module({
    controllers: [OrderproposalController],
    providers: [OrderproposalService],
    imports: [PrismaModule, PdfgenerateModule],
})
export class OrderproposalModule {}

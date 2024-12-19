import { Module } from '@nestjs/common';
import { PdfgenerateService } from './pdfgenerate.service';

@Module({
    providers: [PdfgenerateService],
    exports: [PdfgenerateService],
})
export class PdfgenerateModule {}

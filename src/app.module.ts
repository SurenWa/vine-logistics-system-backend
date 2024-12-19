import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessesModule } from './superadmin/businesses/businesses.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './superadmin/users/users.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './admin/suppliers/suppliers.module';
import { CategoryModule } from './admin/category/category.module';
//import { SeedService } from './seed/seed.service';
import { ManufacturersModule } from './admin/manufacturers/manufacturers.module';
import { ProductsModule } from './admin/products/products.module';
import { NoticesModule } from './admin/notices/notices.module';
import { PdfgenerateModule } from './admin/pdfgenerate/pdfgenerate.module';
import { SubusersModule } from './admin/subusers/subusers.module';
import { UserModule } from './user/user.module';
import { ReportsModule } from './admin/reports/reports.module';
import { OrderproposalModule } from './admin/orderproposal/orderproposal.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // no need to import into other modules
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        BusinessesModule,
        PrismaModule,
        UsersModule,
        MailModule,
        AuthModule,
        SuppliersModule,
        CategoryModule,
        ProductsModule,
        ManufacturersModule,
        NoticesModule,
        PdfgenerateModule,
        SubusersModule,
        UserModule,
        ReportsModule,
        OrderproposalModule,
    ],
    controllers: [AppController],
    providers: [AppService],
    //providers: [AppService, SeedService],
})
export class AppModule {}

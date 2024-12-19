import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BusinessesModule } from 'src/superadmin/businesses/businesses.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [PrismaModule, BusinessesModule, MailModule],
    exports: [UsersService],
})
export class UsersModule {}

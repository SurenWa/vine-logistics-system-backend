import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
//import { UserEntity } from 'src/users/entities/user.entity';
import { CreateAdminUserDto } from 'src/superadmin/users/dto/create-admin-user.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: CreateAdminUserDto) {
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Velkommen til Vine-logistikksystemet',
            template: './createAdminUser', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });
    }
}

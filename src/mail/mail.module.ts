import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { UsersModule } from 'src/superadmin/users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    secure: false,
                    auth: {
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"Vine-logistikksystemet" <${config.get(
                        'MAIL_FROM',
                    )}>`,
                },
                template: {
                    //dir: join(__dirname, 'templates'),
                    dir: __dirname + '/templates',
                    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => UsersModule),
    ],
    providers: [MailService],
    exports: [MailService], // 👈 export for DI
})
export class MailModule {}

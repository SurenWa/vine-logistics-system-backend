import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/superadmin/users/users.module';
import {
    SuperAdminJwtStrategy,
    AdminJwtStrategy,
    CurrentUserJwtStrategy,
    UserJwtStrategy,
} from './strategies';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' }, // e.g. 30s, 7d, 24h
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        SuperAdminJwtStrategy,
        AdminJwtStrategy,
        CurrentUserJwtStrategy,
        UserJwtStrategy,
    ],
})
export class AuthModule {}

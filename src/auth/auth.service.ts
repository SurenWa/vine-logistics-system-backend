import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(identifier: string, password: string): Promise<AuthEntity> {
        // Step 1: Fetch a user with the given email
        // const user = await this.prisma.user.findUnique({
        //     where: { email: email },
        // });

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        // If no user is found, throw an error
        if (!user) {
            throw new NotFoundException('Ingen bruker funnet');
        }

        // Step 2: Check if the password is correct
        const isPasswordValid = await argon.verify(user.password, password);

        // If password does not match, throw an error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Ugyldig passord');
        }

        // Step 3: Generate a JWT containing the user's ID and return it
        return {
            accessToken: this.jwtService.sign({
                userId: user.id,
                businessId: user.businessId,
            }),
        };
    }

    async superadminlogin(userId: number, email: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });

        Logger.log('User admin', user);

        if (!user) {
            throw new NotFoundException(
                `Ingen bruker funnet for e-post: ${email}`,
            );
        }

        if (user.role !== 'ADMIN') {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                businessId: user.businessId,
            },
        });

        return {
            accessToken: this.jwtService.sign({
                userId,
                businessId: user.businessId,
            }),
        };
    }
}

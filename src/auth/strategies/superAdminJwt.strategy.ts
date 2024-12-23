//src/auth/jwt.strategy.ts
import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ExtractJwt } from 'passport-jwt';
//import { Strategy } from 'passport-local';

@Injectable()
export class SuperAdminJwtStrategy extends PassportStrategy(
    Strategy,
    'superadminjwt',
) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { userId: number }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.userId,
                },
            });

            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }

            //throw new UnauthorizedException('Unauthorized');

            if (user.role !== 'SUPERADMIN') {
                throw new UnauthorizedException('Unauthorized');
            }

            return user;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

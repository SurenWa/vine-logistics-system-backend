import {
    createParamDecorator,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/entity/jwtPayload.entity';

export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        try {
            const request = context.switchToHttp().getRequest();
            const user = request.user as JwtPayload;
            //console.log(user);
            return user.id;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    },
);

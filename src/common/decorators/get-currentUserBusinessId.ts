import {
    createParamDecorator,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/entity/jwtPayload.entity';

export const GetCurrentUserBusinessId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        try {
            const request = context.switchToHttp().getRequest();
            const user = request.user as JwtPayload;
            return user.businessId;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    },
);

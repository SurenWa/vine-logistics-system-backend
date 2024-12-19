import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { SuperAdminLoginDto } from './dto/superadminlogin.dto';
import { UserEntity } from 'src/superadmin/users/entities/user.entity';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { UsersService } from 'src/superadmin/users/users.service';
import { SuperAdminJwtAuthGuard } from 'src/common/guards';
import { CurrentUserJwtAuthGuard } from 'src/common/guards';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    // @Post('login')
    // @ApiOkResponse({ type: AuthEntity })
    // login(@Body() { email, password }: LoginDto) {
    //     return this.authService.login(email, password);
    // }

    @Post('login')
    @ApiOkResponse({ type: AuthEntity })
    async login(@Body() { identifier, password }: LoginDto) {
        return this.authService.login(identifier, password);
    }

    @Post('superadminlogin')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: AuthEntity })
    superadminlogin(
        @GetCurrentUserId() userId: number,
        @Body() { email }: SuperAdminLoginDto,
    ) {
        return this.authService.superadminlogin(userId, email);
    }

    @Get('/current-user')
    @UseGuards(CurrentUserJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity })
    async getUserProfile(
        @GetCurrentUserId() userId: number,
    ): Promise<UserEntity> {
        return this.usersService.findOneAdmin(userId);
    }
}

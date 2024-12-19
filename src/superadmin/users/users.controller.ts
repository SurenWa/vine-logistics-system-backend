import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { SuperAdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create-admin-user')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    createAdmin(
        @GetCurrentUserId() userId: number,
        @Body() createAdminUserDto: CreateAdminUserDto,
    ) {
        return this.usersService.createAdmin(userId, createAdminUserDto);
    }

    @Get('/get-all-admin-users')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    findAllAdmins(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAllAdmins(
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-one-admin-user/:id')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    findOneAdmin(@Param('id') id: string) {
        return this.usersService.findOneAdmin(+id);
    }

    @Patch('/update-one-admin/:id')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    updateOneAdmin(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateAdminUserDto,
    ) {
        return this.usersService.updateOneAdmin(+id, updateUserDto);
    }

    @Delete('/delete-one-admin/:id')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    @Post('/generate-unique-pincode')
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    async generateUniquePinCode(): Promise<{ pinCode: number }> {
        const pinCode = await this.usersService.generateUniquePinCode();
        return { pinCode };
    }
}

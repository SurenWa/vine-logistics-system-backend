import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { SubadminService } from './subadmin.service';
import { CreateSubadminDto } from './dto/create-subadmin.dto';
import { UpdateSubadminDto } from './dto/update-subadmin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

@Controller('subadmin')
@ApiTags('subadmin')
export class SubadminController {
    constructor(private readonly subadminService: SubadminService) {}

    @Post('/create-sub-admin')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    create(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createSubadminDto: CreateSubadminDto,
    ) {
        return this.subadminService.createSubAdmin(
            userId,
            businessId,
            createSubadminDto,
        );
    }

    @Get('/get-all-admins')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllAdmins(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.subadminService.findAllAdmins(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-one-subadmin/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneSubadmin(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.subadminService.findOneSubadmin(userId, businessId, id);
    }

    @Patch('/update-subadmin/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateSubadmin(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateSubadminDto: UpdateSubadminDto,
    ) {
        return this.subadminService.updateSubadmin(
            userId,
            businessId,
            id,
            updateSubadminDto,
        );
    }

    @Delete('/delete-subadmin/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeSubadmin(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.subadminService.removeSubadmin(userId, businessId, id);
    }
}

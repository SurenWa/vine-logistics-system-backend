import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

@Controller('notices')
@ApiTags('notices')
export class NoticesController {
    constructor(private readonly noticesService: NoticesService) {}

    @Post('/create-notice-and-bulk-product-update')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    createNoticeAndUpdateProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createNoticeDto: CreateNoticeDto,
    ) {
        return this.noticesService.createNoticeAndUpdateProducts(
            userId,
            businessId,
            createNoticeDto,
        );
    }

    @Get('/get-all-notices')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllNotices(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.noticesService.findAllNotices(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }
}

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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('category')
@ApiTags('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('/create-category')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    createCategory(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createCategoryDto: CreateCategoryDto,
    ) {
        return this.categoryService.createCategory(
            userId,
            businessId,
            createCategoryDto,
        );
    }

    @Get('/get-all-categories')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllCategories(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.categoryService.findAllCategories(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-total-categories')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findTotalCategories(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.categoryService.findTotalCategories(userId, businessId);
    }

    @Get('/get-one-category/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneCategory(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categoryService.findOneCategory(userId, businessId, id);
    }

    @Patch('/update-category/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.updateCategory(
            userId,
            businessId,
            id,
            updateCategoryDto,
        );
    }

    @Delete('/delete-category/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeCategory(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categoryService.removeCategory(userId, businessId, id);
    }
}

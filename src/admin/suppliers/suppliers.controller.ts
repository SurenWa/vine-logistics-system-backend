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

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

@Controller('suppliers')
@ApiTags('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @Post('/create-supplier')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    createSupplier(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createSupplierDto: CreateSupplierDto,
    ) {
        return this.suppliersService.createSupplier(
            userId,
            businessId,
            createSupplierDto,
        );
    }

    @Get('/get-all-suppliers')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllSuppliers(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.suppliersService.findAllSuppliers(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-total-suppliers')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findTotalSuppliers(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.suppliersService.findTotalSuppliers(userId, businessId);
    }

    @Get('/get-one-supplier/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneSupplier(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.suppliersService.findOneSupplier(userId, businessId, id);
    }

    @Patch('/update-supplier/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateManufacturer(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateSupplierDto: UpdateSupplierDto,
    ) {
        return this.suppliersService.updateSupplier(
            userId,
            businessId,
            id,
            updateSupplierDto,
        );
    }

    @Delete('/delete-supplier/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeManufacturer(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.suppliersService.removeSupplier(userId, businessId, id);
    }
}

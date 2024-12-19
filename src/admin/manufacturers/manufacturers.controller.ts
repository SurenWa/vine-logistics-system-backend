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

import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

@Controller('manufacturers')
@ApiTags('manufacturers')
export class ManufacturersController {
    constructor(private readonly manufacturersService: ManufacturersService) {}

    @Post('/create-manufacturer')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    createManufacturer(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createManufacturerDto: CreateManufacturerDto,
    ) {
        return this.manufacturersService.createManufacturer(
            userId,
            businessId,
            createManufacturerDto,
        );
    }

    @Get('/get-all-manufacturers')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllManufacturers(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.manufacturersService.findAllManufacturers(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-total-manufacturers')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findTotalManufacturers(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.manufacturersService.findTotalManufacturers(
            userId,
            businessId,
        );
    }

    @Get('/get-one-manufacturer/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneManufacturer(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.manufacturersService.findOneManufacturer(
            userId,
            businessId,
            id,
        );
    }

    @Patch('/update-manufacturer/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateManufacturer(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateManufacturerDto: UpdateManufacturerDto,
    ) {
        return this.manufacturersService.updateManufacturer(
            userId,
            businessId,
            id,
            updateManufacturerDto,
        );
    }

    @Delete('/delete-manufacturer/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeManufacturer(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.manufacturersService.removeManufacturer(
            userId,
            businessId,
            id,
        );
    }
}

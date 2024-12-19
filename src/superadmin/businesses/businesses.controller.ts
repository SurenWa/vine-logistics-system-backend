import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PaginationDto } from './dto/pagination.dto';
import { BusinessEntity } from './entities/business.entity';
import { SuperAdminJwtAuthGuard } from 'src/common/guards';

@Controller('businesses')
@ApiTags('businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) {}

    @Post('create-business')
    @ApiCreatedResponse({ type: BusinessEntity })
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    create(@Body() createBusinessDto: CreateBusinessDto) {
        return this.businessesService.create(createBusinessDto);
    }

    @Get('get-all-businesses')
    @ApiOkResponse({ type: BusinessEntity, isArray: true })
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    findAll(@Query() paginationDto: PaginationDto) {
        // console.log(paginationDto.page);
        return this.businessesService.findAll(
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('get-one-business/:id')
    @ApiOkResponse({ type: BusinessEntity })
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.businessesService.findOne(id);
    }

    @Patch('update-business/:id')
    @ApiOkResponse({ type: BusinessEntity })
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBusinessDto: UpdateBusinessDto,
    ) {
        return this.businessesService.update(id, updateBusinessDto);
    }

    @Delete('delete-business/:id')
    @ApiOkResponse({ type: BusinessEntity })
    @UseGuards(SuperAdminJwtAuthGuard)
    @ApiBearerAuth()
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.businessesService.remove(id);
    }
}

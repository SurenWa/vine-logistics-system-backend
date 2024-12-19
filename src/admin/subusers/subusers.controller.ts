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
import { SubusersService } from './subusers.service';
import { CreateSubuserDto } from './dto/create-subuser.dto';
import { UpdateSubuserDto } from './dto/update-subuser.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

@Controller('subusers')
@ApiTags('subusers')
export class SubusersController {
    constructor(private readonly subusersService: SubusersService) {}

    @Post('/create-sub-user')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    create(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createSubuserDto: CreateSubuserDto,
    ) {
        return this.subusersService.createSubUser(
            userId,
            businessId,
            createSubuserDto,
        );
    }

    @Get('/get-all-subusers')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllManufacturers(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.subusersService.findAllSubusers(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-one-subuser/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneSubuser(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.subusersService.findOneSubuser(userId, businessId, id);
    }

    @Patch('/update-subuser/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateSubuser(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateSubuserDto: UpdateSubuserDto,
    ) {
        return this.subusersService.updateSubuser(
            userId,
            businessId,
            id,
            updateSubuserDto,
        );
    }

    @Delete('/delete-subuser/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeSubuser(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.subusersService.removeSubuser(userId, businessId, id);
    }
}

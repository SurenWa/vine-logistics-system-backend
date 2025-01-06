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
import { OrderproposalService } from './orderproposal.service';
import { CreateOrderProposalDto } from './dto/create-orderproposal.dto';
import { UpdateOrderproposalDto } from './dto/update-orderproposal.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/get-order-proposal-pagination.dto';
import { GetAllOrderProposalProductsDto } from './dto/get-all-order-proposal-products.dto';

@Controller('orderproposal')
@ApiTags('orderproposal')
export class OrderproposalController {
    constructor(private readonly orderproposalService: OrderproposalService) {}

    @Get('/get-all-order-proposal-products')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllOrderProposalProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() getAllOrderProposalProductsDto: GetAllOrderProposalProductsDto,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.orderproposalService.getAllOrderProposalProducts(
            userId,
            businessId,
            getAllOrderProposalProductsDto.search,
            getAllOrderProposalProductsDto.page,
            getAllOrderProposalProductsDto.rowsPerPage,
            getAllOrderProposalProductsDto.categoryId,
            getAllOrderProposalProductsDto.supplierId,
            getAllOrderProposalProductsDto.manufacturerId,
            getAllOrderProposalProductsDto.year,
        );
    }

    @Post('/create-order-proposal')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    createOrderProposal(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createOrderProposalDto: CreateOrderProposalDto,
    ) {
        return this.orderproposalService.createOrderProposal(
            userId,
            businessId,
            createOrderProposalDto,
        );
    }

    @Get('/get-all-order-proposals')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.orderproposalService.findAllOrderProposals(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
        );
    }

    @Get('/get-one-order-proposal/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneOrderProposal(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.orderproposalService.findOneOrderProposal(
            userId,
            businessId,
            id,
        );
    }

    @Patch('/update-order-proposal/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateOrderProposalDto: UpdateOrderproposalDto,
    ) {
        return this.orderproposalService.updateOrderProposal(
            userId,
            businessId,
            id,
            updateOrderProposalDto,
        );
    }

    @Delete('/delete-order-proposal/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeCategory(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.orderproposalService.removeOrderProposal(
            userId,
            businessId,
            id,
        );
    }
}

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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';
import { SingleProductSalesPaginationDto } from './dto/single-product-sales.dto';
import { SingleProductStockUpdatePaginationDto } from './dto/single-product-stock-update.dto';
import { SingleProductPriceUpdatePaginationDto } from './dto/single-product-price-update.dto';
import { SingleProductLogPaginationDto } from './dto/single-product-log.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post('/create-product')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    create(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() createProductDto: CreateProductDto,
    ) {
        return this.productsService.createProduct(
            userId,
            businessId,
            createProductDto,
        );
    }

    @Get('/get-all-products')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findAllProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.productsService.findAllProducts(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
            paginationDto.categoryId,
            paginationDto.supplierId,
            paginationDto.manufacturerId,
            paginationDto.year,
        );
    }

    @Get('/get-one-product/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findOneProduct(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productsService.findOneProduct(userId, businessId, id);
    }

    @Patch('/update-product/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(
            userId,
            businessId,
            id,
            updateProductDto,
        );
    }

    @Delete('/delete-product/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeProduct(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productsService.removeProduct(userId, businessId, id);
    }

    @Post('/generate-unique-barcode')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    async generateUniqueBarCode(): Promise<{ barCode: number }> {
        const barCode = await this.productsService.generateUniqueBarCode();
        return { barCode };
    }

    @Get('/get-single-product-sales-data/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findSingleProductSales(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query()
        singleProductSalesPaginationDto: SingleProductSalesPaginationDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.productsService.singleProductSales(
            userId,
            businessId,
            id,
            singleProductSalesPaginationDto.search,
            singleProductSalesPaginationDto.page,
            singleProductSalesPaginationDto.rowsPerPage,
        );
    }

    @Get('/get-single-product-stock-update-data/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findSingleProductStockUpdate(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query()
        singleProductStockUpdatePaginationDto: SingleProductStockUpdatePaginationDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.productsService.findSingleProductStockUpdate(
            userId,
            businessId,
            id,
            singleProductStockUpdatePaginationDto.search,
            singleProductStockUpdatePaginationDto.page,
            singleProductStockUpdatePaginationDto.rowsPerPage,
        );
    }

    @Get('/get-single-product-price-update-data/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findSingleProductPriceUpdate(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query()
        singleProductPriceUpdatePaginationDto: SingleProductPriceUpdatePaginationDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.productsService.findSingleProductPriceUpdate(
            userId,
            businessId,
            id,
            singleProductPriceUpdatePaginationDto.search,
            singleProductPriceUpdatePaginationDto.page,
            singleProductPriceUpdatePaginationDto.rowsPerPage,
        );
    }

    @Get('/get-single-product-log-data/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    findSingleProductLog(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query()
        singleProductLogPaginationDto: SingleProductLogPaginationDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.productsService.findSingleProductLog(
            userId,
            businessId,
            id,
            singleProductLogPaginationDto.search,
            singleProductLogPaginationDto.page,
            singleProductLogPaginationDto.rowsPerPage,
            singleProductLogPaginationDto.logType,
        );
    }
}

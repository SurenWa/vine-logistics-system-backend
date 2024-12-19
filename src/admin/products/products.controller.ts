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
    Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { PaginationDto } from './dto/pagination.dto';

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
}

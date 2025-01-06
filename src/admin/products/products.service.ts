import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

function convertPrismaDecimalToNumber(decimal: string | null): number | null {
    if (!decimal) return null;
    return parseFloat(decimal);
}

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}
    async createProduct(
        userId: number,
        businessId: number,
        createProductDto: CreateProductDto,
    ): Promise<{ message: string }> {
        //Logger.log(createProductDto);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        // If barCode is not provided, generate a unique barCode
        if (!createProductDto.barCode) {
            createProductDto.barCode = await this.generateUniqueBarCode();
        } else {
            // If barCode is provided, check if it already exists
            const existingProduct = await this.prisma.products.findFirst({
                where: {
                    barCode: createProductDto.barCode,
                },
            });

            if (existingProduct) {
                throw new BadRequestException(
                    'Strekkode finnes allerede. Vennligst bruk en annen strekkode.',
                );
            }
        }

        const markupPercent =
            ((Number(createProductDto.retailPriceExcludingVat) -
                Number(createProductDto.costPriceExcludingVat)) /
                Number(createProductDto.costPriceExcludingVat)) *
            100;

        //Logger.log('profit', markupPercent);

        const retailPriceIncludingVat =
            createProductDto.retailPriceExcludingVat +
            (25 / 100) * createProductDto.retailPriceExcludingVat;

        const createProduct = await this.prisma.products.create({
            data: {
                ...createProductDto,
                businessId,
                markupPercent: markupPercent,
                retailPriceIncludingVat: retailPriceIncludingVat,
                reservationAvailable: createProductDto.stockBalance,
                createdBy: user.username,
                onTheWayInQuantity: 0,
                reservedQuantity: 0,
            },
        });

        if (!createProduct) {
            throw new NotFoundException('Product creation denied');
        }
        return { message: 'Product created successfully' };
    }

    async findAllProducts(
        userId: number,
        businessId: number,
        search: string,
        page: number,
        rowsPerPage: number,
        categoryId: number,
        supplierId: number,
        manufacturerId: number,
        year: number,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const offset = page * rowsPerPage;

            const query: Prisma.ProductsFindManyArgs = {
                where: {
                    businessId,
                    categoryId,
                    supplierId,
                    manufacturerId,
                    year,
                    name: { contains: search },
                },
                orderBy: {
                    name: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const products = await this.prisma.products.findMany({
                ...query,
                include: {
                    category: true,
                    manufacturer: true,
                    supplier: true,
                },
            });

            if (!products) {
                throw new NotFoundException('Products not found');
            }

            const serializedProducts = products.map((product) => ({
                ...product,
                costPriceExcludingVat: convertPrismaDecimalToNumber(
                    product.costPriceExcludingVat.toString(),
                ),

                markupPercent: convertPrismaDecimalToNumber(
                    product.markupPercent.toString(),
                ),
                retailPriceExcludingVat: convertPrismaDecimalToNumber(
                    product.retailPriceExcludingVat.toString(),
                ),
                retailPriceIncludingVat: convertPrismaDecimalToNumber(
                    product.retailPriceIncludingVat.toString(),
                ),
                barCode: String(product.barCode), // Convert BigInt to string
                // Add conversions for other BigInt properties if needed
            }));

            const totalCount = await this.prisma.products.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                serializedProducts,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneProduct(userId: number, businessId: number, id: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const product = await this.prisma.products.findUnique({
                where: { id: id },
                include: {
                    category: true,
                    manufacturer: true,
                    supplier: true,
                },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            const serializedProduct = {
                ...product,
                costPriceExcludingVat: convertPrismaDecimalToNumber(
                    product.costPriceExcludingVat.toString(),
                ),
                markupPercent: convertPrismaDecimalToNumber(
                    product.markupPercent.toString(),
                ),
                retailPriceExcludingVat: convertPrismaDecimalToNumber(
                    product.retailPriceExcludingVat.toString(),
                ),
                retailPriceIncludingVat: convertPrismaDecimalToNumber(
                    product.retailPriceIncludingVat.toString(),
                ),
                barCode: product.barCode.toString(),
            };

            return serializedProduct;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateProduct(
        userId: number,
        businessId: number,
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const product = await this.prisma.products.findFirst({
            where: {
                id,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (BigInt(updateProductDto.barCode) !== product.barCode) {
            // Check if the new barcode already exists in the database
            const existingProduct = await this.prisma.products.findFirst({
                where: {
                    barCode: updateProductDto.barCode,
                },
            });

            if (existingProduct) {
                throw new BadRequestException(
                    'Strekkode finnes allerede. Vennligst bruk en annen strekkode.',
                );
            }
        }

        const markupPercent =
            ((Number(updateProductDto.retailPriceExcludingVat) -
                Number(updateProductDto.costPriceExcludingVat)) /
                Number(updateProductDto.costPriceExcludingVat)) *
            100;

        //console.log(markupPercent);

        const retailPriceIncludingVat =
            updateProductDto.retailPriceExcludingVat +
            (25 / 100) * updateProductDto.retailPriceExcludingVat;

        const reservationAvailable = updateProductDto.stockBalance
            ? updateProductDto.stockBalance - product.reservedQuantity
            : product.stockBalance - product.reservedQuantity;

        const updatedProduct = await this.prisma.products.update({
            where: { id },
            data: {
                ...updateProductDto,
                businessId,
                markupPercent: markupPercent,
                retailPriceIncludingVat: retailPriceIncludingVat,
                reservationAvailable: reservationAvailable,
                createdBy: user.username,
            },
        });

        if (!updatedProduct) {
            throw new Error('Product not found');
        }

        // Find all related ReserveProducts
        const relatedReserveProducts =
            await this.prisma.reserveProduct.findMany({
                where: { productId: id },
            });

        await Promise.all(
            relatedReserveProducts.map(async (reserveProduct) => {
                await this.prisma.reserveProduct.update({
                    where: { id: reserveProduct.id },
                    data: {
                        currentRetailPriceIncludingVat: retailPriceIncludingVat,
                    },
                });
            }),
        );

        return {
            message: 'Product updated Successfully',
        };
    }

    async removeProduct(
        userId: number,
        businessId: number,
        id: number,
    ): Promise<{ message: string }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            await this.prisma.products.delete({
                where: { id },
            });
            return {
                message: 'Product deleted successfully',
            };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async generateUniqueBarCode(): Promise<number> {
        let barCode: number;
        const min = 1010010;
        const max = 9999999;
        do {
            barCode = Math.floor(min + Math.random() * (max - min + 1));
            const existingBarcode = await this.prisma.products.findFirst({
                where: {
                    barCode,
                },
            });
            if (!existingBarcode) {
                break;
            }
        } while (true);
        return barCode;
    }
}

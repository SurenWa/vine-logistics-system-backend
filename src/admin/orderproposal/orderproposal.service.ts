import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderProposalDto } from './dto/create-orderproposal.dto';
import { UpdateOrderproposalDto } from './dto/update-orderproposal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfgenerateService } from '../pdfgenerate/pdfgenerate.service';
import { Prisma } from '@prisma/client';

function convertPrismaDecimalToNumber(decimal: string | null): number | null {
    if (!decimal) return null;
    return parseFloat(decimal);
}

@Injectable()
export class OrderproposalService {
    constructor(
        private prisma: PrismaService,
        private pdfGenerate: PdfgenerateService,
    ) {}

    async getAllOrderProposalProducts(
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
                    stockBalance: {
                        lt: this.prisma.products.fields.maximumStockBalance, // Ensure this property exists in your schema
                    },
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
    async createOrderProposal(
        userId: number,
        businessId: number,
        createOrderProposalDto: CreateOrderProposalDto,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const { username, productId, quantity } = createOrderProposalDto;

            const product = await this.prisma.products.findUnique({
                where: {
                    id: productId,
                },
                include: {
                    manufacturer: true,
                },
            });

            Logger.log(product);

            if (!product) {
                throw new UnauthorizedException('PRODUCT NOT FOUND');
            }

            // Format the current date
            // Format the current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            const pdf = await this.pdfGenerate.generateOrderProposalPDF(
                `Bestillingsforslag av ${username}`,
                formattedDate,
                `Bestillingsforslag til ${product?.name}`,
                product?.name,
                product?.manufacturer?.name,
                quantity,
            );

            await this.prisma.orderProposal.create({
                data: {
                    userId,
                    businessId,
                    supplierId: product.supplierId,
                    productId: product.id,
                    pdfUrl: pdf,
                    orderedQuantity: quantity,
                    receivedQuantity: 0,
                    pendingQuantity: quantity,
                },
            });

            await this.prisma.products.update({
                where: {
                    id: product.id,
                },
                data: {
                    onTheWayInQuantity: {
                        increment: quantity,
                    },
                },
            });

            return { message: 'Order Proposal Created' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllOrderProposals(
        userId: number,
        businessId: number,
        search: string,
        page: number,
        rowsPerPage: number,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const offset = page * rowsPerPage;

            const query: Prisma.OrderProposalFindManyArgs = {
                where: {
                    businessId,
                    product: { name: { contains: search } },
                },
                include: {
                    product: {
                        select: {
                            name: true,
                            supplier: { select: { name: true } },
                        },
                    },
                },
                orderBy: {
                    id: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const orderProposals = await this.prisma.orderProposal.findMany({
                ...query,
            });

            if (!orderProposals) {
                throw new NotFoundException('Order Proposals not found');
            }

            const totalCount = await this.prisma.orderProposal.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                orderProposals,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneOrderProposal(userId: number, businessId: number, id: number) {
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

            const orderProposal = await this.prisma.orderProposal.findUnique({
                where: { id },
                include: {
                    product: {
                        select: {
                            name: true,
                            supplier: { select: { name: true } },
                        },
                    },
                },
            });

            if (!orderProposal) {
                throw new Error('Category not found');
            }

            return orderProposal;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateOrderProposal(
        userId: number,
        businessId: number,
        id: number,
        updateOrderProposalDto: UpdateOrderproposalDto,
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

            const { orderProposalId, receivedQuantity } =
                updateOrderProposalDto;

            const orderProposal = await this.prisma.orderProposal.findUnique({
                where: { id },
            });

            if (!orderProposal) {
                throw new BadRequestException(
                    'Order Proposal does not exists.',
                );
            }

            const totalReceivedQuantity =
                orderProposal.receivedQuantity + receivedQuantity;
            const receivedStatus =
                totalReceivedQuantity >= orderProposal.orderedQuantity;

            await this.prisma.orderProposal.update({
                where: { id: orderProposalId },
                data: {
                    receivedStatus,
                    receivedQuantity: {
                        increment: receivedQuantity,
                    },
                    pendingQuantity: {
                        decrement: receivedQuantity,
                    },
                },
            });

            await this.prisma.products.update({
                where: { id: orderProposal.productId },
                data: {
                    onTheWayInQuantity: {
                        decrement: receivedQuantity,
                    },
                    stockBalance: {
                        increment: receivedQuantity,
                    },
                    reservationAvailable: {
                        increment: receivedQuantity,
                    },
                },
            });

            return {
                message: 'Order Proposal updated successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeOrderProposal(
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

            const orderProposal = await this.prisma.orderProposal.findUnique({
                where: { id },
            });

            await this.prisma.products.update({
                where: { id: orderProposal.productId },
                data: {
                    onTheWayInQuantity: {
                        decrement: orderProposal.orderedQuantity,
                    },
                },
            });

            await this.prisma.orderProposal.delete({
                where: { id },
            });
            return {
                message: 'Order Proposal deleted successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

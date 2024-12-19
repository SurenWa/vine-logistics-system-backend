import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Products } from '@prisma/client';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

function convertPrismaDecimalToNumber(decimal: string | null): number | null {
    // if (!decimal) return null;
    // return parseFloat(decimal);
    if (!decimal) return null;
    const parsedValue = parseFloat(decimal);
    if (isNaN(parsedValue)) return null;
    return parseFloat(parsedValue.toFixed(2));
}

export interface OrderStats {
    totalSum: number;
    orderCount: number;
    reserveCount: number;
}

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) {}

    async getSalesReport(
        userId: number,
        businessId: number,
        page: number,
        rowsPerPage: number,
        categoryId: number,
        fromDate: Date,
        toDate: Date,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const offset = page * rowsPerPage;

            const query: Prisma.OrderProductFindManyArgs = {
                where: {
                    businessId,
                    categoryId,
                    createdAt: {
                        gte: fromDate, // Greater than or equal to fromDate
                        lte: toDate, // Less than or equal to toDate
                    },
                },
                include: {
                    product: {
                        select: {
                            name: true,
                            year: true,
                            manufacturer: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            let sumReport: any;
            let sums: any;
            if (categoryId) {
                Logger.log('category id in sales report', categoryId);
                //query.where.categoryId = categoryId;

                // Calculate sums for products in the given category
                sums = await this.prisma.orderProduct.aggregate({
                    where: {
                        businessId,
                        categoryId,
                        createdAt: {
                            gte: fromDate,
                            lte: toDate,
                        },
                    },
                    _sum: {
                        costPriceExcludingVat: true,
                        retailPriceExcludingVat: true,
                        retailPriceIncludingVat: true,
                        quantity: true,
                    },
                });

                // Assign sums to query response
                sumReport = {
                    costPriceExcludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.costPriceExcludingVat.toString(),
                        ) || 0,
                    retailPriceExcludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.retailPriceExcludingVat.toString(),
                        ) || 0,
                    retailPriceIncludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.retailPriceIncludingVat.toString(),
                        ) || 0,
                    quantitySum: sums._sum.quantity || 0,
                };
            } else {
                // Calculate sums for all products
                sums = await this.prisma.orderProduct.aggregate({
                    where: {
                        businessId,
                        createdAt: {
                            gte: fromDate,
                            lte: toDate,
                        },
                    },
                    _sum: {
                        costPriceExcludingVat: true,
                        retailPriceExcludingVat: true,
                        retailPriceIncludingVat: true,
                        quantity: true,
                    },
                });

                // Assign sums to query response
                sumReport = {
                    costPriceExcludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.costPriceExcludingVat.toString(),
                        ) || 0,
                    retailPriceExcludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.retailPriceExcludingVat.toString(),
                        ) || 0,
                    retailPriceIncludingVatSum:
                        convertPrismaDecimalToNumber(
                            sums._sum.retailPriceIncludingVat.toString(),
                        ) || 0,
                    quantitySum: sums._sum.quantity || 0,
                };
            }

            const report = await this.prisma.orderProduct.findMany(query);

            if (!report) {
                throw new NotFoundException('Order not found');
            }

            const serializedReport = report.map((r) => ({
                ...r,
                costPriceExcludingVat: convertPrismaDecimalToNumber(
                    r.costPriceExcludingVat.toString(),
                ),

                retailPriceExcludingVat: convertPrismaDecimalToNumber(
                    r.retailPriceExcludingVat.toString(),
                ),
                retailPriceIncludingVat: convertPrismaDecimalToNumber(
                    r.retailPriceIncludingVat.toString(),
                ),
            }));

            const totalCount = await this.prisma.orderProduct.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                serializedReport,
                sumReport,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Errore',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getOrdersReport(
        userId: number,
        businessId: number,
        page: number,
        rowsPerPage: number,
        fromDate: Date,
        toDate: Date,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const offset = page * rowsPerPage;

            const query: Prisma.OrdersFindManyArgs = {
                where: {
                    businessId,
                    createdAt: {
                        gte: fromDate,
                        lte: toDate,
                    },
                },
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    //products: true,
                    products: {
                        select: {
                            id: true,
                            createdAt: true,
                            product: {
                                select: {
                                    name: true,
                                },
                            },
                            quantity: true,
                            retailPriceIncludingVat: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const orders = await this.prisma.orders.findMany(query);

            if (!orders) {
                throw new NotFoundException('Order not found');
            }

            const serializedOrders = orders.map((order) => ({
                ...order,
                totalSum: convertPrismaDecimalToNumber(
                    order.totalSum.toString(),
                ),
                products: (order as any).products.map((product) => ({
                    ...product,
                    retailPriceIncludingVat: convertPrismaDecimalToNumber(
                        product.retailPriceIncludingVat.toString(),
                    ),
                })),
            }));

            const totalCount = await this.prisma.orders.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                serializedOrders,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Errore',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getSorReport(
        userId: number,
        businessId: number,
    ): Promise<{
        thisMonth: OrderStats;
        lastMonth: OrderStats;
    }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }
        const currentDate = new Date();
        const thisMonthStart = startOfMonth(currentDate);
        const lastMonthStart = startOfMonth(subMonths(currentDate, 1));

        const [thisMonthStats, lastMonthStats] = await Promise.all([
            this.getOrderStatistics(thisMonthStart, businessId),
            this.getOrderStatistics(lastMonthStart, businessId),
        ]);

        return {
            thisMonth: thisMonthStats,
            lastMonth: lastMonthStats,
        };
    }

    async getOrderStatistics(
        startDate: Date,
        businessId: number,
    ): Promise<OrderStats> {
        const endDate = endOfMonth(startDate);

        const thisMonthTotalSum = await this.prisma.orders.aggregate({
            _sum: {
                totalSum: true,
            },
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    {
                        businessId: businessId,
                    },
                ],
            },
        });

        const thisMonthOrderCount = await this.prisma.orders.count({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    {
                        businessId: businessId,
                    },
                ],
            },
        });

        const thisMonthReservesCount = await this.prisma.reserves.count({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    {
                        businessId: businessId,
                    },
                ],
            },
        });

        return {
            totalSum: thisMonthTotalSum?._sum.totalSum
                ? convertPrismaDecimalToNumber(
                      thisMonthTotalSum._sum.totalSum.toString(),
                  )
                : 0,
            orderCount: thisMonthOrderCount,
            reserveCount: thisMonthReservesCount,
        };
    }

    async getOrderTotalsByMonth(
        userId: number,
        businessId: number,
        year: number,
    ): Promise<{ monthlyTotals: number[]; yearlyTotal: number }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }
        const monthlyTotals = await this.getMonthlyTotals(year, businessId);
        const yearlyTotal = monthlyTotals.reduce((acc, curr) => acc + curr, 0);
        return { monthlyTotals, yearlyTotal };
    }

    private async getMonthlyTotals(
        year: number,
        businessId: number,
    ): Promise<number[]> {
        const monthlyTotals: number[] = [];
        for (let i = 1; i <= 12; i++) {
            const startDate = new Date(year, i - 1, 1);
            const endDate = new Date(year, i, 0, 23, 59, 59, 999);

            const monthlyTotal = await this.prisma.orders.aggregate({
                _sum: {
                    totalSum: true,
                },
                where: {
                    AND: [
                        {
                            createdAt: {
                                gte: startDate.toISOString(),
                                lte: endDate.toISOString(),
                            },
                        },
                        {
                            businessId: businessId,
                        },
                    ],
                },
            });

            const totalSum = monthlyTotal._sum
                ? monthlyTotal._sum.totalSum
                : null;

            // Push totalSum or 0 to monthlyTotals
            monthlyTotals.push(
                convertPrismaDecimalToNumber(totalSum?.toString()) || 0,
            );
        }
        return monthlyTotals;
    }

    async getOrderTotalsByYear(
        userId: number,
        businessId: number,
        year: number,
    ): Promise<{
        output: { year: number; data: number[] }[];
        yearlySales: Record<number, number>;
    }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const currentYearData = await this.getMonthlyTotalss(year, businessId);
        const currentYearTotal = currentYearData.reduce(
            (acc, curr) => acc + curr,
            0,
        );

        const previousYearsData: { year: number; data: number[] }[] = [];
        const yearlySales: Record<number, number> = {};

        for (let i = 0; i < 3; i++) {
            const prevYear = year - i;
            const monthlyTotals = await this.getMonthlyTotalss(
                prevYear,
                businessId,
            );
            const yearlyTotal = monthlyTotals.reduce(
                (acc, curr) => acc + curr,
                0,
            );

            previousYearsData.push({ year: prevYear, data: monthlyTotals });
            yearlySales[prevYear] = yearlyTotal;
        }

        return { output: previousYearsData, yearlySales };
    }

    private async getMonthlyTotalss(
        year: number,
        businessId: number,
    ): Promise<number[]> {
        const monthlyTotals: number[] = [];
        for (let i = 1; i <= 12; i++) {
            const startDate = new Date(year, i - 1, 1);
            const endDate = new Date(year, i, 0, 23, 59, 59, 999);

            const monthlyTotal = await this.prisma.orders.aggregate({
                _sum: {
                    totalSum: true,
                },
                where: {
                    AND: [
                        {
                            createdAt: {
                                gte: startDate.toISOString(),
                                lte: endDate.toISOString(),
                            },
                        },
                        {
                            businessId: businessId,
                        },
                    ],
                },
            });

            const totalSum = monthlyTotal._sum
                ? monthlyTotal._sum.totalSum
                : null;

            // Push totalSum or 0 to monthlyTotals
            monthlyTotals.push(
                convertPrismaDecimalToNumber(totalSum?.toString()) || 0,
            );
        }
        return monthlyTotals;
    }

    async getTopSellingProducts(userId: number, businessId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const topSoldProductsData = await this.prisma.orderProduct.groupBy({
            by: ['productId', 'retailPriceIncludingVat'],
            _sum: {
                quantity: true,
            },
            where: {
                businessId: businessId,
            },
            orderBy: {
                _count: {
                    productId: 'desc',
                },
            },
            take: 6,
        });

        // Fetch detailed product information for the top sold products
        const topSoldProducts = await Promise.all(
            topSoldProductsData.map(async (productData) => {
                const product = await this.prisma.products.findUnique({
                    where: {
                        id: productData.productId,
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                });
                return {
                    product: {
                        id: product.id,
                        name: product.name,
                        retailPriceIncludingVat: convertPrismaDecimalToNumber(
                            productData.retailPriceIncludingVat.toString(),
                        ),
                    },
                    totalQuantity: productData._sum.quantity,
                    totalRetailPrice:
                        productData._sum.quantity *
                        parseFloat(
                            productData.retailPriceIncludingVat.toString(),
                        ),
                };
            }),
        );

        return topSoldProducts;
    }

    async getReservationReport(
        userId: number,
        businessId: number,
        page: number,
        rowsPerPage: number,
        fromDate: Date,
        toDate: Date,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const offset = page * rowsPerPage;

            const query: Prisma.ReservesFindManyArgs = {
                where: {
                    businessId,
                    createdAt: {
                        gte: fromDate,
                        lte: toDate,
                    },
                },
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    //products: true,
                    products: {
                        select: {
                            id: true,
                            createdAt: true,
                            product: {
                                select: {
                                    name: true,
                                    setResPriceToCurrPrice: true,
                                },
                            },
                            quantity: true,
                            currentRetailPriceIncludingVat: true,
                            reserveRetailPriceIncludingVat: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const reserves = await this.prisma.reserves.findMany(query);

            if (!reserves) {
                throw new NotFoundException('Reserves not found');
            }

            const serializedReserves = reserves.map((reserve) => ({
                ...reserve,
                products: (reserve as any).products.map((product) => ({
                    ...product,
                    reserveRetailPriceIncludingVat:
                        convertPrismaDecimalToNumber(
                            product.reserveRetailPriceIncludingVat.toString(),
                        ),
                    currentRetailPriceIncludingVat:
                        convertPrismaDecimalToNumber(
                            product.currentRetailPriceIncludingVat.toString(),
                        ),
                })),
            }));

            const totalCount = await this.prisma.reserves.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                serializedReserves,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Errore',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeReservationReport(
        userId: number,
        businessId: number,
        reservationId: number,
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

            const reservation = await this.prisma.reserves.findUnique({
                where: { id: reservationId },
                include: { products: true },
            });

            // Update product reservedQuantity and reservationAvailable for each product associated with the reservation
            for (const reserveProduct of reservation.products) {
                await this.prisma.products.update({
                    where: { id: reserveProduct.productId },
                    data: {
                        reservedQuantity: {
                            decrement: reserveProduct.quantity,
                        },
                        reservationAvailable: {
                            increment: reserveProduct.quantity,
                        },
                    },
                });
            }

            await this.prisma.reserves.delete({
                where: { id: reservationId },
            });

            const reserveCheck = await this.prisma.reserveCheckout.findFirst({
                where: { reserveId: reservationId },
            });

            if (reserveCheck) {
                await this.prisma.reserveCheckout.delete({
                    where: { id: reserveCheck.id },
                });
            }

            return {
                message: 'Reservation deleted successfully',
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

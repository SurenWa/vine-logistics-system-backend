import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Prisma, ProductLogType } from '@prisma/client';

// import { Prisma } from '@prisma/client';

// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddOrderDto } from './dto/add-order.dto';
import { AddReservationDto } from './dto/add-reservation.dto';
import { AddReservationOrderDto } from './dto/add-reservation-order.dto';

function convertPrismaDecimalToNumber(decimal: string | null): number | null {
    if (!decimal) return null;
    return parseFloat(decimal);
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async validateUserCode(
        userId: number,
        businessId: number,
        userCode: string,
    ): Promise<{ isValidUserCode: boolean }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        if (user.userCode !== userCode) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        return {
            isValidUserCode: true,
        };
    }

    async findAllProductsForUser(
        userId: number,
        businessId: number,
        search: string,
        page: number,
        rowsPerPage: number,
        categoryId: number,
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
                    OR: [
                        { name: { contains: search } },
                        { barCode: Number(search) || undefined }, // Adjusted for exact match with number
                    ],
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
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async addProductToCart(
        userId: number,
        businessId: number,
        productId: number,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const product = await this.prisma.products.findUnique({
            where: { id: productId },
        });

        if (product.businessId !== businessId) {
            throw new UnauthorizedException('INVALID PRODUCT');
        }

        // Find user's cart or create a new one if not exists
        let cart = await this.prisma.carts.findUnique({
            where: { userId },
            include: { products: true },
        });

        if (!cart) {
            cart = await this.prisma.carts.create({
                data: {
                    userId,
                    products: { create: [{ productId }] },
                },
                include: { products: true },
            });
        } else {
            // Check if the product already exists in the cart
            const existingProduct = cart.products.find(
                (product) => product.productId === productId,
            );

            if (existingProduct) {
                throw new NotFoundException(
                    'Product already exists in the cart',
                );
            }

            // Add the product to the cart
            cart = await this.prisma.carts.update({
                where: { userId },
                include: { products: true },
                data: {
                    products: {
                        create: [{ productId }],
                    },
                },
            });
        }

        return cart;
    }

    async getUserCart(userId: number, businessId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        // Fetch cart for the given userId
        const cart = await this.prisma.carts.findUnique({
            where: { userId },
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                retailPriceIncludingVat: true,
                                stockBalance: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const serializedCart = cart.products.map((product) => ({
            ...product,
            retailPriceIncludingVat: convertPrismaDecimalToNumber(
                product.product.retailPriceIncludingVat.toString(),
            ),
        }));

        return serializedCart;
    }

    async removeProductFromCart(
        userId: number,
        businessId: number,
        cartId: number,
        productId: number,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        // Delete the item from the cart
        const deletedItem = await this.prisma.cartProduct.deleteMany({
            where: {
                productId,
                cartId,
            },
        });

        if (deletedItem.count === 0) {
            throw new NotFoundException('Item not found in the cart');
        }

        return {
            message: 'Item removed successfully',
        };
    }

    async addOrder(userId: number, businessId: number, items: AddOrderDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        // Check if all OrderItems have the same cartId
        const firstCartId = items?.items[0]?.cartId;
        if (
            !firstCartId ||
            items.items.some((item) => item.cartId !== firstCartId)
        ) {
            throw new BadRequestException(
                'All OrderItems must have the same cartId',
            );
        }
        let totalSum = 0;

        // Create the order
        const orderNumber = await this.generateOrderNumber();
        const order = await this.prisma.orders.create({
            data: {
                orderNumber,
                totalSum,
                user: { connect: { id: userId } },
                business: { connect: { id: businessId } },
                products: {
                    createMany: {
                        data: items.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
            },
            include: {
                products: true,
            },
        });

        // Update OrderProduct and Product entities
        for (const item of items.items) {
            const product = await this.prisma.products.findUnique({
                where: { id: item.productId },
                select: {
                    stockBalance: true,
                    costPriceExcludingVat: true,
                    retailPriceExcludingVat: true,
                    retailPriceIncludingVat: true,
                    categoryId: true,
                    businessId: true,
                    reservedQuantity: true,
                },
            });

            if (!product) {
                throw new BadRequestException('Product with ID not found');
            }

            const totalQuantityBeforeOrder = product.stockBalance;
            const totalQuantityAfterOrder =
                totalQuantityBeforeOrder - item.quantity;
            const costPriceExcludingVat = convertPrismaDecimalToNumber(
                product.costPriceExcludingVat.toString(),
            );
            const retailPriceExcludingVat = convertPrismaDecimalToNumber(
                product.retailPriceExcludingVat.toString(),
            );
            const retailPriceIncludingVat = convertPrismaDecimalToNumber(
                product.retailPriceIncludingVat.toString(),
            );

            totalSum += retailPriceIncludingVat * item.quantity;

            // Update OrderProduct with additional fields
            const orderProduct = await this.prisma.orderProduct.findFirst({
                where: {
                    AND: [{ orderId: order.id }, { productId: item.productId }],
                },
            });
            await this.prisma.orderProduct.update({
                where: { id: orderProduct.id },
                data: {
                    username: user.username,
                    categoryId: product.categoryId,
                    userId,
                    totalQuantityBeforeOrder,
                    totalQuantityAfterOrder,
                    costPriceExcludingVat,
                    retailPriceExcludingVat,
                    retailPriceIncludingVat,
                    businessId: product.businessId,
                },
            });

            // Update Product stock balance
            await this.prisma.products.update({
                where: { id: item.productId },
                data: {
                    stockBalance: totalQuantityAfterOrder,
                    reservationAvailable:
                        totalQuantityAfterOrder - product.reservedQuantity,
                },
            });

            await this.prisma.productLog.create({
                data: {
                    userId,
                    businessId,
                    productId: item.productId,
                    username: user?.username,
                    details: `Mengde: ${item.quantity} , Kjøpt av: ${user?.username}`,
                    type: ProductLogType.SALESREGISTERED,
                },
            });
        }

        await this.prisma.orders.update({
            where: { id: order.id },
            data: {
                totalSum,
            },
        });

        await this.prisma.carts.delete({
            where: {
                id: firstCartId,
            },
        });

        return {
            message: 'Order created',
            orderNumber: order.orderNumber,
        };
    }

    async generateOrderNumber(): Promise<number> {
        // Logic to generate unique order number
        const latestOrder = await this.prisma.orders.findFirst({
            orderBy: { orderNumber: 'desc' },
        });
        const latestOrderNumber = latestOrder ? latestOrder.orderNumber : 999; // Start from 1000 if no orders exist
        return latestOrderNumber + 1;
    }

    async getUserOrder(
        userId: number,
        businessId: number,
        page: number,
        rowsPerPage: number,
        fromDate: Date,
        toDate: Date,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const offset = page * rowsPerPage;

        const query: Prisma.OrderProductFindManyArgs = {
            where: {
                userId,
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

        const order = await this.prisma.orderProduct.findMany(query);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const totalCount = await this.prisma.orderProduct.count({
            where: query.where,
        });

        const totalPages = Math.ceil(totalCount / rowsPerPage);

        return {
            order,
            pagination: { page, rowsPerPage, totalPages, totalCount },
        };
    }

    async findAllProducts(
        userId: number,
        businessId: number,
        search: string,
        page: number,
        rowsPerPage: number,
        categoryId: number,
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
                select: {
                    id: true,
                    name: true,
                    retailPriceIncludingVat: true,
                    year: true,
                    stockBalance: true,
                    manufacturer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!products) {
                throw new NotFoundException('Products not found');
            }

            const serializedProducts = products.map((product) => ({
                ...product,
                retailPriceIncludingVat: convertPrismaDecimalToNumber(
                    product.retailPriceIncludingVat.toString(),
                ),
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
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findTotalCategoriesForUser(userId: number, businessId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const categories = await this.prisma.categories.findMany({
                where: { businessId },
            });

            if (!categories || categories.length === 0) {
                throw new NotFoundException('categories not found');
            }

            return categories;
        } catch (error) {
            //console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Errore',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async generateReservationNumber(): Promise<string> {
        // Logic to generate unique reservation number
        const latestReservation = await this.prisma.reserves.findFirst({
            orderBy: { reserveNumber: 'desc' },
            select: {
                reserveNumber: true,
            },
        });

        let latestReserveNumber = 9999; // Start from R10000 if no reservations exist
        if (latestReservation) {
            const reserveNumberString = latestReservation.reserveNumber;
            const numberPart = reserveNumberString.replace(/[^\d]/g, ''); // Extracts only digits
            latestReserveNumber = parseInt(numberPart, 10); // Parses the extracted number as an integer
        }

        const nextReserveNumber = latestReserveNumber + 1;
        return 'R' + nextReserveNumber;
    }

    async addReservation(
        userId: number,
        businessId: number,
        items: AddReservationDto,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        // Check if all ReserveItems have the same cartId
        const firstCartId = items?.items[0]?.cartId;
        if (
            !firstCartId ||
            items.items.some((item) => item.cartId !== firstCartId)
        ) {
            throw new BadRequestException(
                'All ReserveItems must have the same cartId',
            );
        }

        // Create the reservation
        const reserveNumber = await this.generateReservationNumber();
        const reserve = await this.prisma.reserves.create({
            data: {
                reserveNumber: reserveNumber,
                reservationDate: items?.date,
                message: items?.message,
                user: { connect: { id: userId } },
                business: { connect: { id: businessId } },
                products: {
                    createMany: {
                        data: items.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
            },
            include: {
                products: true,
            },
        });

        // Update ReserveProduct and Reserve entities
        for (const item of items.items) {
            const product = await this.prisma.products.findUnique({
                where: { id: item.productId },
                select: {
                    retailPriceIncludingVat: true,
                    retailPriceExcludingVat: true,
                    costPriceExcludingVat: true,
                    reservedQuantity: true,
                    categoryId: true,
                    businessId: true,
                    stockBalance: true,
                },
            });

            if (!product) {
                throw new BadRequestException('Product with ID not found');
            }

            const retailPriceIncludingVat = convertPrismaDecimalToNumber(
                product.retailPriceIncludingVat.toString(),
            );

            // Update OrderProduct with additional fields
            const reserveProduct = await this.prisma.reserveProduct.findFirst({
                where: {
                    AND: [
                        { reserveId: reserve.id },
                        { productId: item.productId },
                    ],
                },
            });
            await this.prisma.reserveProduct.update({
                where: { id: reserveProduct.id },
                data: {
                    username: user.username,
                    categoryId: product.categoryId,
                    userId,
                    reserveCostPriceExcludingVat: product.costPriceExcludingVat,
                    reserveRetailPriceExcludingVat:
                        product.retailPriceExcludingVat,
                    reserveRetailPriceIncludingVat: retailPriceIncludingVat,
                    currentRetailPriceIncludingVat: retailPriceIncludingVat,
                    businessId: product.businessId,
                },
            });

            // Update Product stock balance
            await this.prisma.products.update({
                where: { id: item.productId },
                data: {
                    reservedQuantity: product.reservedQuantity + item?.quantity,
                    reservationAvailable:
                        product.stockBalance -
                        (item.quantity + product.reservedQuantity),
                },
            });
        }

        // await this.prisma.orders.update({
        //     where: { id: order.id },
        //     data: {
        //         totalSum,
        //     },
        // });

        await this.prisma.carts.delete({
            where: {
                id: firstCartId,
            },
        });

        return {
            message: 'Reservation created',
        };
    }

    async getUserReservationReport(
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
                    userId,
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

    async addReserveCheckout(
        userId: number,
        businessId: number,
        reserveId: number,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const reserveCheckout = await this.prisma.reserveCheckout.create({
            data: {
                businessId,
                userId,
                reserveId,
            },
        });

        return reserveCheckout;
    }

    async getReserveCheckout(userId: number, businessId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const reserveCheckout = await this.prisma.reserveCheckout.findMany({
                where: { userId },
            });

            return {
                reserveCheckout,
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

    async removeReserveCheckout(
        userId: number,
        businessId: number,
        reserveId: number,
    ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            // Find the reservation entry with the provided reserveId
            const reservation = await this.prisma.reserveCheckout.findFirst({
                where: { reserveId },
            });

            // If reservation not found, throw an error
            if (!reservation) {
                throw new Error('Reservation not found');
            }

            // Delete the reservation entry
            await this.prisma.reserveCheckout.delete({
                where: { id: reservation.id },
            });

            return {
                message: 'Reservation removed from checkout successfully',
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

    async removeReservation(
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

            if (user.id !== reservation.userId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

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

    async removeReservationItem(
        userId: number,
        businessId: number,
        reservationItemId: number,
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

            const reservationItem = await this.prisma.reserveProduct.findUnique(
                {
                    where: { id: reservationItemId },
                    include: { reserve: true },
                },
            );

            if (!reservationItem) {
                throw new UnauthorizedException('Reservation item not found');
            }

            if (user.id !== reservationItem.userId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            if (!reservationItem.reserve) {
                throw new Error('Reservation not found');
            }

            // Update product reservedQuantity and reservationAvailable
            await this.prisma.products.update({
                where: { id: reservationItem.productId },
                data: {
                    reservedQuantity: {
                        decrement: reservationItem.quantity,
                    },
                    reservationAvailable: {
                        increment: reservationItem.quantity,
                    },
                },
            });

            const reserveProductsCount = await this.prisma.reserveProduct.count(
                {
                    where: { reserveId: reservationItem?.reserveId },
                },
            );

            if (reserveProductsCount === 1) {
                // Delete the entire reservation
                await this.prisma.reserves.delete({
                    where: { id: reservationItem.reserveId },
                });
                const reserveCheck =
                    await this.prisma.reserveCheckout.findFirst({
                        where: { reserveId: reservationItem.reserve.id },
                    });

                if (reserveCheck) {
                    await this.prisma.reserveCheckout.delete({
                        where: { id: reserveCheck.id },
                    });
                }
            } else {
                // Delete only the reservation item
                await this.prisma.reserveProduct.delete({
                    where: { id: reservationItemId },
                });
            }
            return {
                message: 'Reservation Item deleted successfully',
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

    async addReservationOrder(
        userId: number,
        businessId: number,
        addReservationOrderDto: AddReservationOrderDto,
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

            // Loop through each reservation order DTO
            for (const dto of addReservationOrderDto.items) {
                // Find the corresponding reservation order data
                const reserveCheckout =
                    await this.prisma.reserveCheckout.findUnique({
                        where: { id: dto.reserveCheckoutId },
                    });
                //Logger.log(reserveCheckout);
                const reserves = await this.prisma.reserves.findUnique({
                    where: { id: reserveCheckout.reserveId },
                    include: {
                        products: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
                //total sum
                let totalSum = 0;
                const orderNumber = await this.generateOrderNumber();
                const order = await this.prisma.orders.create({
                    data: {
                        orderNumber,
                        totalSum,
                        user: { connect: { id: userId } },
                        business: { connect: { id: businessId } },
                        products: {
                            createMany: {
                                data: reserves.products.map((item) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                })),
                            },
                        },
                    },
                    include: {
                        products: true,
                    },
                });

                Logger.log(reserves);
                //const totalQuantityBeforeOrder = product.stockBalance;
                // Calculate total quantity before the order
                for (const product of reserves.products) {
                    const totalQuantityBeforeOrder =
                        product.product.stockBalance;
                    const totalQuantityAfterOrder =
                        totalQuantityBeforeOrder - product.quantity;
                    const reservedQuantity =
                        product.product.reservedQuantity - product.quantity;
                    const reservationAvailable =
                        totalQuantityAfterOrder - reservedQuantity;

                    const costPriceExcludingVat = product.product
                        .setResPriceToCurrPrice
                        ? convertPrismaDecimalToNumber(
                              product.product.costPriceExcludingVat.toString(),
                          )
                        : convertPrismaDecimalToNumber(
                              product.reserveCostPriceExcludingVat.toString(),
                          );
                    const retailPriceExcludingVat = product.product
                        .setResPriceToCurrPrice
                        ? convertPrismaDecimalToNumber(
                              product.product.retailPriceExcludingVat.toString(),
                          )
                        : convertPrismaDecimalToNumber(
                              product.reserveRetailPriceExcludingVat.toString(),
                          );

                    const retailPriceIncludingVat = product.product
                        .setResPriceToCurrPrice
                        ? convertPrismaDecimalToNumber(
                              product.product.retailPriceIncludingVat.toString(),
                          )
                        : convertPrismaDecimalToNumber(
                              product.reserveRetailPriceIncludingVat.toString(),
                          );

                    totalSum += retailPriceIncludingVat * product.quantity;

                    // Update OrderProduct with additional fields
                    const orderProduct =
                        await this.prisma.orderProduct.findFirst({
                            where: {
                                AND: [
                                    { orderId: order.id },
                                    { productId: product.product.id },
                                ],
                            },
                        });

                    await this.prisma.orderProduct.update({
                        where: { id: orderProduct.id },
                        data: {
                            username: user.username,
                            categoryId: product.categoryId,
                            userId,
                            totalQuantityBeforeOrder,
                            totalQuantityAfterOrder,
                            costPriceExcludingVat,
                            retailPriceExcludingVat,
                            retailPriceIncludingVat,
                            businessId: product.businessId,
                        },
                    });

                    // Update Product stock balance
                    await this.prisma.products.update({
                        where: { id: product.product.id },
                        data: {
                            stockBalance: totalQuantityAfterOrder,
                            reservedQuantity,
                            reservationAvailable,
                        },
                    });
                }

                await this.prisma.orders.update({
                    where: { id: order.id },
                    data: {
                        totalSum,
                    },
                });

                await this.prisma.reserves.delete({
                    where: { id: reserveCheckout.reserveId },
                });

                await this.prisma.reserveCheckout.delete({
                    where: { id: dto.reserveCheckoutId },
                });
            }

            return {
                message: 'Reservation order added successfully',
            };
        } catch (error) {
            Logger.log(error);
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

import {
    Injectable,
    UnauthorizedException,
    HttpException,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfgenerateService } from '../pdfgenerate/pdfgenerate.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoticesService {
    constructor(
        private prisma: PrismaService,
        private pdfGenerate: PdfgenerateService,
    ) {}
    async createNoticeAndUpdateProducts(
        userId: number,
        businessId: number,
        createNoticeDto: CreateNoticeDto,
    ): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }
        const { username, message, products } = createNoticeDto;

        // Step 1: Search products by ID
        const productsToUpdate = await this.prisma.products.findMany({
            where: {
                id: {
                    in: products.map((product) => product.id),
                },
            },
        });

        // Step 2: Update previousStockCount and stockCount values
        const updateProducts = productsToUpdate.map(async (product) => {
            const { id, stockCount } = products.find(
                (p) => p.id === product.id,
            );

            // Step 3: Set previousStockCount to current stockCount
            await this.prisma.products.update({
                where: { id },
                data: {
                    previousStockBalance: product.stockBalance,
                    stockBalance: stockCount,
                    reservationAvailable: stockCount - product.reservedQuantity,
                },
            });

            return product;
        });

        await Promise.all(updateProducts);

        const updatedProducts = await this.prisma.products.findMany({
            where: {
                id: {
                    in: products.map((product) => product.id),
                },
            },
            include: {
                manufacturer: true,
            },
        });

        // Generate formatted createdAt timestamp
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];

        const pdf = await this.pdfGenerate.generateStockUpdatePDF(
            `Varetelling av ${username}`,
            formattedDate,
            createNoticeDto.message,
            updatedProducts,
        );

        // Step 4: Create a new notice entry
        await this.prisma.notices.create({
            data: {
                date: formattedDate,
                username,
                businessId,
                pdfUrl: pdf,
                message,
                products: {
                    create: products.map((product) => ({
                        product: { connect: { id: product.id } },
                    })),
                },
            },
            include: {
                products: true,
            },
        });

        return {
            message: 'Notice created and products updated successfully',
        };
    }

    async findAllNotices(
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

            const query: Prisma.NoticesFindManyArgs = {
                where: {
                    businessId,
                    message: { contains: search },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const notices = await this.prisma.notices.findMany(query);

            if (!notices) {
                throw new NotFoundException('Notice not found');
            }

            const totalCount = await this.prisma.notices.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                notices,
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
}

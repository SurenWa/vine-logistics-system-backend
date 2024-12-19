import { Prisma } from '@prisma/client';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async createCategory(
        userId: number,
        businessId: number,
        createCategoryDto: CreateCategoryDto,
    ): Promise<{ message: string }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const createCategory = await this.prisma.categories.create({
                data: { ...createCategoryDto, businessId },
            });

            if (!createCategory) {
                throw new NotFoundException('Category creation denied');
            }
            return { message: 'Category created successfully' };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllCategories(
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

            const query: Prisma.CategoriesFindManyArgs = {
                where: {
                    businessId,
                    OR: [
                        { brandName: { contains: search } },
                        { country: { contains: search } },
                        { city: { contains: search } },
                    ],
                },
                orderBy: {
                    brandName: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const categories = await this.prisma.categories.findMany(query);

            if (!categories) {
                throw new NotFoundException('Categories not found');
            }

            const totalCount = await this.prisma.categories.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                categories,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findTotalCategories(userId: number, businessId: number) {
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

    async findOneCategory(userId: number, businessId: number, id: number) {
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

            const category = await this.prisma.categories.findUnique({
                where: { id: id },
            });

            if (!category) {
                throw new Error('Category not found');
            }

            return new CategoryEntity(category);
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateCategory(
        userId: number,
        businessId: number,
        id: number,
        updateCategoryDto: UpdateCategoryDto,
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

            const updatedCategory = await this.prisma.categories.update({
                where: { id },
                data: {
                    ...updateCategoryDto,
                },
            });

            if (!updatedCategory) {
                throw new Error('Category not found');
            }

            return {
                message: 'Category updated Successfully',
            };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeCategory(
        userId: number,
        businessId: number,
        id: number,
    ): Promise<{ message: string }> {
        // console.log(userId);
        // console.log(businessId);

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

            await this.prisma.categories.delete({
                where: { id },
            });
            return {
                message: 'Category deleted successfully',
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

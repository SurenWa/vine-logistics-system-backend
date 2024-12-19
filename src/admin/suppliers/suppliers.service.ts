import { Prisma } from '@prisma/client';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierEntity } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
    constructor(private prisma: PrismaService) {}
    async createSupplier(
        userId: number,
        businessId: number,
        createSupplierDto: CreateSupplierDto,
    ): Promise<{ message: string }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const createSupplier = await this.prisma.suppliers.create({
                data: { ...createSupplierDto, businessId },
            });

            if (!createSupplier) {
                throw new NotFoundException('Supplier creation denied');
            }
            return { message: 'Supplier created successfully' };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllSuppliers(
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

            const query: Prisma.SuppliersFindManyArgs = {
                where: {
                    businessId,
                    name: { contains: search },
                },
                orderBy: {
                    name: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const suppliers = await this.prisma.suppliers.findMany(query);

            if (!suppliers) {
                throw new NotFoundException('Suppliers not found');
            }

            const totalCount = await this.prisma.suppliers.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                suppliers,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findTotalSuppliers(userId: number, businessId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const suppliers = await this.prisma.suppliers.findMany({
                where: { businessId },
            });

            if (!suppliers || suppliers.length === 0) {
                throw new NotFoundException('suppliers not found');
            }

            return suppliers;
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneSupplier(userId: number, businessId: number, id: number) {
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

            const supplier = await this.prisma.suppliers.findUnique({
                where: { id: id },
            });

            if (!supplier) {
                throw new Error('Supplier not found');
            }

            return new SupplierEntity(supplier);
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateSupplier(
        userId: number,
        businessId: number,
        id: number,
        updateSupplierDto: UpdateSupplierDto,
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

            const updatedSupplier = await this.prisma.suppliers.update({
                where: { id },
                data: {
                    ...updateSupplierDto,
                },
            });

            if (!updatedSupplier) {
                throw new Error('Supplier not found');
            }

            return {
                message: 'Supplier updated Successfully',
            };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeSupplier(
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

            await this.prisma.suppliers.delete({
                where: { id },
            });
            return {
                message: 'Supplier deleted successfully',
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

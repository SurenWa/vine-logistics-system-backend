import { Prisma } from '@prisma/client';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ManufacturerEntity } from './entities/manufacturer.entity';

@Injectable()
export class ManufacturersService {
    constructor(private prisma: PrismaService) {}
    async createManufacturer(
        userId: number,
        businessId: number,
        createManufacturerDto: CreateManufacturerDto,
    ): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const createManufacturer = await this.prisma.manufacturers.create({
            data: { ...createManufacturerDto, businessId },
        });

        if (!createManufacturer) {
            throw new NotFoundException('Manufacturer creation denied');
        }
        return { message: 'Manufacturer created successfully' };
    }

    async findAllManufacturers(
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

            const query: Prisma.ManufacturersFindManyArgs = {
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

            const manufacturers = await this.prisma.manufacturers.findMany(
                query,
            );

            if (!manufacturers) {
                throw new NotFoundException('Manufacturers not found');
            }

            const totalCount = await this.prisma.manufacturers.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                manufacturers,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findTotalManufacturers(userId: number, businessId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (user.businessId !== businessId) {
                throw new UnauthorizedException('ACCESS DENIED');
            }

            const manufacturers = await this.prisma.manufacturers.findMany({
                where: { businessId },
            });

            if (!manufacturers || manufacturers.length === 0) {
                throw new NotFoundException('Manufacturers not found');
            }

            return manufacturers;
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneManufacturer(userId: number, businessId: number, id: number) {
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

            const manufacturer = await this.prisma.manufacturers.findUnique({
                where: { id: id },
            });

            if (!manufacturer) {
                throw new Error('Manufacturer not found');
            }

            return new ManufacturerEntity(manufacturer);
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateManufacturer(
        userId: number,
        businessId: number,
        id: number,
        updateManufacturerDto: UpdateManufacturerDto,
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

        const updatedManufacturer = await this.prisma.manufacturers.update({
            where: { id },
            data: {
                ...updateManufacturerDto,
            },
        });

        if (!updatedManufacturer) {
            throw new Error('Manufacturer not found');
        }

        return {
            message: 'Manufacturer updated Successfully',
        };
    }

    async removeManufacturer(
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

            await this.prisma.manufacturers.delete({
                where: { id },
            });
            return {
                message: 'Manufacturer deleted successfully',
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

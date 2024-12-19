import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BusinessEntity } from './entities/business.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) {}

    async create(createBusinessDto: CreateBusinessDto) {
        const createBusiness = await this.prisma.businesses.create({
            data: createBusinessDto,
        });
        if (!createBusiness) {
            throw new NotFoundException('Business creation denied');
        }
        return createBusiness;
    }

    async findAll(search: string, page: number, rowsPerPage: number) {
        try {
            const offset = (page - 1) * rowsPerPage;

            const query: Prisma.BusinessesFindManyArgs = {
                where: {
                    // Add conditions for search if needed
                    businessName: {
                        contains: search, // Search by businessName
                    },
                },
                orderBy: {
                    // Add ordering logic if needed
                    businessName: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };
            // return `This action returns all businesses`;
            const businesses = await this.prisma.businesses.findMany(query);
            if (!businesses) {
                throw new NotFoundException('Businesses not found');
            }

            const totalCount = await this.prisma.businesses.count({
                where: query.where,
            });
            const totalPages = Math.ceil(totalCount / rowsPerPage);
            return {
                businesses,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const business = await this.prisma.businesses.findUnique({
                where: { id },
            });
            if (!business) {
                throw new NotFoundException('Businesses not found');
            }
            return business;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(
        id: number,
        updateBusinessDto: UpdateBusinessDto,
    ): Promise<{ message: string; business: BusinessEntity }> {
        try {
            const updatedBusiness = await this.prisma.businesses.update({
                where: { id },
                data: updateBusinessDto,
            });
            if (updatedBusiness === null) {
                throw new NotFoundException(
                    `Business with ${id} cannot be updated.`,
                );
            }
            return {
                message: 'Business Updated Successfully',
                business: updatedBusiness,
            };
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async remove(
        id: number,
    ): Promise<{ message: string; business: BusinessEntity }> {
        try {
            const deletedBusiness = await this.prisma.businesses.delete({
                where: { id },
            });
            if (!deletedBusiness) {
                throw new NotFoundException(
                    `Business with ${id} does not exists.`,
                );
            }
            return {
                message: 'Business deleted successfully',
                business: deletedBusiness,
            };
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CreateSubadminDto } from './dto/create-subadmin.dto';
import { UpdateSubadminDto } from './dto/update-subadmin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubadminService {
    constructor(private prisma: PrismaService) {}

    async createSubAdmin(
        userId: number,
        businessId: number,
        createSubadminDto: CreateSubadminDto,
    ): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if (user.businessId !== businessId) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
            throw new UnauthorizedException('Ingen tillatelse');
        }

        const userCodeExists = await this.prisma.user.findUnique({
            where: {
                userCode: createSubadminDto.userCode,
            },
        });

        if (userCodeExists) {
            throw new BadRequestException(
                'Brukerkode eksisterer allerede. Vennligst velg en annen brukerkode.',
            );
        }

        const hashedPassword = await argon.hash(createSubadminDto.password);

        await this.prisma.user.create({
            data: {
                name: createSubadminDto.name,
                email: createSubadminDto.email,
                userCode: createSubadminDto.userCode,
                password: hashedPassword,
                role: 'SUBADMIN',
                businessId,
                createdBy: user.role,
            },
        });

        return {
            message: 'SubAdmin created successfully',
        };
    }

    async findAllAdmins(
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

            const query: Prisma.UserFindManyArgs = {
                where: {
                    businessId,
                    role: 'SUBADMIN',
                    name: { contains: search },
                },
                orderBy: {
                    name: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const admins = await this.prisma.user.findMany(query);

            if (!admins) {
                throw new NotFoundException('Admins not found');
            }

            const totalCount = await this.prisma.user.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                admins,
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

    async findOneSubadmin(userId: number, businessId: number, id: number) {
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

            const subadmin = await this.prisma.user.findUnique({
                where: { id: id },
            });

            if (!subadmin) {
                throw new Error('Subadmin not found');
            }

            // Filter properties
            const filteredSubadmin = {
                id: subadmin.id,
                name: subadmin.name,
                email: subadmin.email,
                userCode: subadmin?.userCode,
            };

            return filteredSubadmin;
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateSubadmin(
        userId: number,
        businessId: number,
        id: number,
        updateSubadminDto: UpdateSubadminDto,
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

        const subadmin = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!subadmin) {
            throw new Error('Subadmin not found');
        }

        if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
            throw new UnauthorizedException('Ingen tillatelse');
        }

        const hashedPassword = await argon.hash(updateSubadminDto.password);

        const updatedSubadmin = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateSubadminDto,
                password: hashedPassword,
            },
        });

        if (!updatedSubadmin) {
            throw new Error('Subadmin not found');
        }

        return {
            message: 'Subadmin updated Successfully',
        };
    }

    async removeSubadmin(
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

            if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
                throw new UnauthorizedException('Ingen tillatelse');
            }

            await this.prisma.user.delete({
                where: { id },
            });
            return {
                message: 'Subadmin deleted successfully',
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error; // Re-throw UnauthorizedException as-is
            }
            Logger.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

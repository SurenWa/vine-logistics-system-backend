import {
    Injectable,
    UnauthorizedException,
    HttpException,
    HttpStatus,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

import { CreateSubuserDto } from './dto/create-subuser.dto';
import { UpdateSubuserDto } from './dto/update-subuser.dto';
import { ValidateUserCodeDto } from './dto/validate-usercode.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubuserEntity } from './entities/subuser.entity';

@Injectable()
export class SubusersService {
    constructor(private prisma: PrismaService) {}

    async createSubUser(
        userId: number,
        businessId: number,
        createSubuserDto: CreateSubuserDto,
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

        const userCodeExists = await this.prisma.user.findUnique({
            where: {
                userCode: createSubuserDto.userCode,
            },
        });

        if (userCodeExists) {
            throw new BadRequestException(
                'Brukerkode eksisterer allerede. Vennligst velg en annen brukerkode.',
            );
        }

        const hashedPassword = await argon.hash(createSubuserDto.password);

        await this.prisma.user.create({
            data: {
                username: createSubuserDto.username,
                userCode: createSubuserDto.userCode,
                password: hashedPassword,
                rfid: createSubuserDto.rfid,
                role: 'USER',
                businessId,
                createdBy: user.role,
            },
        });

        return {
            message: 'User created successfully',
        };
    }

    async findAllSubusers(
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
                    role: 'USER',
                    username: { contains: search },
                },
                orderBy: {
                    name: 'asc',
                },
                skip: offset,
                take: rowsPerPage,
            };

            const subusers = await this.prisma.user.findMany(query);

            if (!subusers) {
                throw new NotFoundException('Subusers not found');
            }

            const totalCount = await this.prisma.user.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);

            return {
                subusers,
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

    async findOneSubuser(userId: number, businessId: number, id: number) {
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

            const subuser = await this.prisma.user.findUnique({
                where: { id: id },
            });

            if (!subuser) {
                throw new Error('Subuser not found');
            }

            // Filter properties
            const filteredSubuser = {
                id: subuser.id,
                username: subuser.username,
                userCode: subuser.userCode,
                rfid: subuser.rfid,
                createdAt: subuser.createdAt,
                updatedAt: subuser.updatedAt,
            };

            return new SubuserEntity(filteredSubuser);
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateSubuser(
        userId: number,
        businessId: number,
        id: number,
        updateSubuserDto: UpdateSubuserDto,
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

        const subuser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (updateSubuserDto.userCode !== subuser.userCode) {
            const userCodeExists = await this.prisma.user.findUnique({
                where: {
                    userCode: updateSubuserDto.userCode,
                },
            });

            if (userCodeExists) {
                throw new BadRequestException(
                    'Brukerkode eksisterer allerede. Vennligst velg en annen brukerkode.',
                );
            }
        }

        const hashedPassword = await argon.hash(updateSubuserDto.password);

        const updatedSubuser = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateSubuserDto,
                password: hashedPassword,
            },
        });

        if (!updatedSubuser) {
            throw new Error('Subuser not found');
        }

        return {
            message: 'Subuser updated Successfully',
        };
    }

    async removeSubuser(
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

            await this.prisma.user.delete({
                where: { id },
            });
            return {
                message: 'User deleted successfully',
            };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async validateUserCode(
        userId: number,
        businessId: number,
        validateUserCodeDto: ValidateUserCodeDto,
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

        if (user.userCode !== validateUserCodeDto.userCode) {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        return {
            isValidUserCode: true,
        };
    }
}

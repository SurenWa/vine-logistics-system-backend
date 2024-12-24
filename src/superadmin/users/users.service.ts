import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { BusinessesService } from 'src/superadmin/businesses/businesses.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private businessesService: BusinessesService,
        private mailService: MailService,
    ) {}
    async createAdmin(
        userId: number,
        createAdminUserDto: CreateAdminUserDto,
    ): Promise<{ message: string }> {
        const {
            name,
            pinCode,
            email,
            password,
            businessName,
            businessAddress,
            businessNumber,
            telephoneNumber,
            isActive,
        } = createAdminUserDto;
        //console.log(createAdminUserDto);

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if (user.role !== 'SUPERADMIN') {
            throw new UnauthorizedException('ACCESS DENIED');
        }

        const emailExists = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (emailExists) {
            throw new BadRequestException(
                'E-post finnes allerede. Bruk en annen e-post.',
            );
        }

        const pinCodeExists = await this.prisma.user.findUnique({
            where: {
                pinCode: pinCode,
            },
        });

        if (pinCodeExists) {
            throw new BadRequestException(
                'Pinkoden finnes allerede. Velg en annen pinkode',
            );
        }

        const business = await this.businessesService.create({
            businessName,
            businessAddress,
            businessNumber,
            telephoneNumber,
            isActive,
        });
        //console.log(business);
        //await this.mailService.sendUserConfirmation(createAdminUserDto);

        const hashedPassword = await argon.hash(password);

        await this.prisma.user.create({
            data: {
                name,
                pinCode,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                businessId: business.id,
                createdBy: user.role,
            },
        });

        return {
            message: 'Admin user created successfully',
        };
    }

    async findAllAdmins(search: string, page: number, rowsPerPage: number) {
        try {
            const offset = page * rowsPerPage;

            const query: Prisma.UserFindManyArgs = {
                where: {
                    role: 'ADMIN',
                    // Add conditions for search if needed
                    business: {
                        businessName: {
                            contains: search, // Search by businessName
                        },
                    },
                },
                include: {
                    business: true,
                },
                orderBy: {
                    business: {
                        // Add ordering logic if needed
                        businessName: 'asc',
                    },
                },
                skip: offset,
                take: rowsPerPage,
            };

            const adminUsers = await this.prisma.user.findMany(query);

            if (!adminUsers) {
                throw new NotFoundException('Users fetching denied');
            }

            const totalCount = await this.prisma.user.count({
                where: query.where,
            });

            const totalPages = Math.ceil(totalCount / rowsPerPage);
            return {
                adminUsers,
                pagination: { page, rowsPerPage, totalPages, totalCount },
            };
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneAdmin(id: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: id },
                include: {
                    business: true,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return new UserEntity(user);
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateOneAdmin(
        userId: number,
        updateAdminUserDto: UpdateAdminUserDto,
    ): Promise<{ message: string; user: UserEntity }> {
        const {
            name,
            pinCode,
            email,
            businessName,
            businessAddress,
            businessNumber,
            telephoneNumber,
            isActive,
        } = updateAdminUserDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User does not exist.');
        }

        if (email !== user.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (existingEmail) {
                throw new BadRequestException(
                    'E-post finnes allerede. Bruk en annen e-post.',
                );
            }
        }

        if (pinCode !== user.pinCode) {
            const pinCodeExists = await this.prisma.user.findUnique({
                where: {
                    pinCode: pinCode,
                },
            });

            if (pinCodeExists) {
                throw new BadRequestException(
                    'Pinkoden finnes allerede. Velg en annen pinkode',
                );
            }
        }

        await this.prisma.businesses.update({
            where: { id: user.businessId },
            data: {
                businessName,
                businessAddress,
                businessNumber,
                telephoneNumber,
                isActive,
            },
        });

        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                pinCode,
                email,
            },
        });

        return {
            message: 'User and business updated Successfully',
            user: updatedUser,
        };
    }

    async remove(id: number): Promise<{ message: string; user: UserEntity }> {
        try {
            const deletedUser = await this.prisma.user.delete({
                where: { id },
                include: { business: true },
            });
            if (!deletedUser) {
                throw new NotFoundException(`User does not exists.`);
            }
            return { message: 'Admin deleted successfully', user: deletedUser };
        } catch (error) {
            //console.log(error);
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async generateUniquePinCode(): Promise<number> {
        let pinCode: number;
        const min = 1000;
        const max = 9999;
        do {
            pinCode = Math.floor(min + Math.random() * (max - min + 1));
            const existingBusiness = await this.prisma.user.findFirst({
                where: {
                    pinCode,
                },
            });
            if (!existingBusiness) {
                break;
            }
        } while (true);
        return pinCode;
    }
}

//include: { business: { include: { products: true } } }

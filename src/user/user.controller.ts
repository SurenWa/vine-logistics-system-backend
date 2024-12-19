import {
    Controller,
    //Get,
    Post,
    Body,
    //Patch,
    //Param,
    //Delete,
    UseGuards,
    Get,
    Query,
    Delete,
    ParseIntPipe,
    Param,
    Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
//import { CreateSubuserDto } from 'src/admin/subusers/dto/create-subuser.dto';
import { ValidateUserCodeDto } from './dto/validate-usercode.dto';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { UserJwtAuthGuard } from 'src/common/guards';
import { PaginationDto } from './dto/pagination.dto';
import { AddOrderDto } from './dto/add-order.dto';
import { UserOrderPaginationDto } from './dto/user-order-pagination.dto';
import { AddReservationDto } from './dto/add-reservation.dto';
import { UserReservationPaginationDto } from './dto/user-reservation-pagination.dto';
import { AddReserveCheckoutDto } from './dto/add-reserve-checkout.dto';
import { DeleteReserveCheckoutDto } from './dto/delete-reserve-checkout.dto';
import { AddReservationOrderDto } from './dto/add-reservation-order.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/validate-usercode')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    create(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() validateUserCodeDto: ValidateUserCodeDto,
    ) {
        return this.userService.validateUserCode(
            userId,
            businessId,
            validateUserCodeDto.userCode,
        );
    }

    @Get('/get-all-products-for-user')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    findAllProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.userService.findAllProductsForUser(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
            paginationDto.categoryId,
        );
    }

    @Post('/add-product-to-cart')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    addProductToCart(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() addProductToCartDto: AddProductToCartDto,
    ) {
        return this.userService.addProductToCart(
            userId,
            businessId,
            addProductToCartDto.productId,
        );
    }

    @Get('/get-cart')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    getUserCart(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.userService.getUserCart(userId, businessId);
    }

    @Delete('/remove-cart-item/:productId/:cartId')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    removeProduct(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('productId', ParseIntPipe) productId: number,
        @Param('cartId', ParseIntPipe) cartId: number,
    ) {
        return this.userService.removeProductFromCart(
            userId,
            businessId,
            cartId,
            productId,
        );
    }

    @Post('/add-order')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    addOrder(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() addOrderDto: AddOrderDto,
    ) {
        return this.userService.addOrder(userId, businessId, addOrderDto);
    }

    @Get('/get-user-order')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    getUserOrder(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() userorderpaginationDto: UserOrderPaginationDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.userService.getUserOrder(
            userId,
            businessId,
            userorderpaginationDto.page,
            userorderpaginationDto.rowsPerPage,
            userorderpaginationDto.fromDate,
            userorderpaginationDto.tillDate,
        );
    }

    @Post('/add-reservation')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    addReservation(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() addReservationDto: AddReservationDto,
    ) {
        return this.userService.addReservation(
            userId,
            businessId,
            addReservationDto,
        );
    }

    @Get('/get-user-reservation')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    getUserReservationReport(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() userreservationpaginationDto: UserReservationPaginationDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.userService.getUserReservationReport(
            userId,
            businessId,
            userreservationpaginationDto.page,
            userreservationpaginationDto.rowsPerPage,
            userreservationpaginationDto.fromDate,
            userreservationpaginationDto.tillDate,
        );
    }

    @Get('/get-all-user-products')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    findAllUserProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() paginationDto: PaginationDto,
    ) {
        //Logger.log('productquery', PaginationDto);
        return this.userService.findAllProducts(
            userId,
            businessId,
            paginationDto.search,
            paginationDto.page,
            paginationDto.rowsPerPage,
            paginationDto.categoryId,
        );
    }

    @Get('/get-total-categories-for-user')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    findTotalCategories(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.userService.findTotalCategoriesForUser(userId, businessId);
    }

    @Post('/add-reserve-checkout')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    addReserveCheckout(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() addReserveCheckoutDto: AddReserveCheckoutDto,
    ) {
        return this.userService.addReserveCheckout(
            userId,
            businessId,
            addReserveCheckoutDto.reserveId,
        );
    }

    @Get('/get-reserve-checkout')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    getReserveCheckout(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        return this.userService.getReserveCheckout(userId, businessId);
    }

    @Delete('/delete-reserve-checkout')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    removeReserveCheckout(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() deleteReserveCheckoutDto: DeleteReserveCheckoutDto,
    ) {
        return this.userService.removeReserveCheckout(
            userId,
            businessId,
            deleteReserveCheckoutDto.reserveId,
        );
    }

    @Delete('/delete-reservation/:id')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    removeReservation(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.userService.removeReservation(
            userId,
            businessId,
            reservationId,
        );
    }

    @Delete('/delete-reservation-item/:id')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    removeReservationItem(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) reservationItemId: number,
    ) {
        return this.userService.removeReservationItem(
            userId,
            businessId,
            reservationItemId,
        );
    }

    @Post('/add-reservation-order')
    @ApiBearerAuth()
    @UseGuards(UserJwtAuthGuard)
    addReservationOrder(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Body() addReservationOrderDto: AddReservationOrderDto,
    ) {
        return this.userService.addReservationOrder(
            userId,
            businessId,
            addReservationOrderDto,
        );
    }
}

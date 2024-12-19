import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Logger,
    ParseIntPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserBusinessId } from 'src/common/decorators/get-currentUserBusinessId';
import { SalesPaginationDto } from './dto/sales-pagination.dto';
import { OrdersPaginationDto } from './dto/orders-paginate.dto';
import { MonthlySalesReportDto } from './dto/monthly-sales-report.dto';
import { ReservationReportPaginationDto } from './dto/reservation-report-pagination.dto';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('/get-sales-report')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getSalesReport(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() salespaginationDto: SalesPaginationDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getSalesReport(
            userId,
            businessId,
            salespaginationDto.page,
            salespaginationDto.rowsPerPage,
            salespaginationDto.categoryId,
            salespaginationDto.fromDate,
            salespaginationDto.toDate,
        );
    }

    @Get('/get-orders-report')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getOrdersReport(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() orderspaginationDto: OrdersPaginationDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getOrdersReport(
            userId,
            businessId,
            orderspaginationDto.page,
            orderspaginationDto.rowsPerPage,
            orderspaginationDto.fromDate,
            orderspaginationDto.toDate,
        );
    }

    @Get('/get-sor-report')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getSorReport(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getSorReport(userId, businessId);
    }

    @Get('/get-monthly-sales-report')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getOrderTotalsByMonth(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        //year: number,
        @Query() monthlySalesReportDto: MonthlySalesReportDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getOrderTotalsByMonth(
            userId,
            businessId,
            monthlySalesReportDto.year,
        );
    }

    @Get('/get-monthly-sales-report-bar-chart')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getOrderTotalsByYear(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() monthlySalesReportDto: MonthlySalesReportDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getOrderTotalsByYear(
            userId,
            businessId,
            monthlySalesReportDto.year,
        );
    }

    @Get('/get-top-selling-products')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getTopSellingProducts(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getTopSellingProducts(userId, businessId);
    }

    @Get('/get-reservation-report')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    getReservationReport(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Query() reservationReportPaginationDto: ReservationReportPaginationDto,
    ) {
        //Logger.log(userorderpaginationDto.tillDate);
        return this.reportsService.getReservationReport(
            userId,
            businessId,
            reservationReportPaginationDto.page,
            reservationReportPaginationDto.rowsPerPage,
            reservationReportPaginationDto.fromDate,
            reservationReportPaginationDto.tillDate,
        );
    }

    @Delete('/delete-reservation-report/:id')
    @ApiBearerAuth()
    @UseGuards(AdminJwtAuthGuard)
    removeReservation(
        @GetCurrentUserId() userId: number,
        @GetCurrentUserBusinessId() businessId: number,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.reportsService.removeReservationReport(
            userId,
            businessId,
            reservationId,
        );
    }
}

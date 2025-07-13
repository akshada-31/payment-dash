import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payments.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAll(@Query() query): Promise<Payment[]> {
        return this.paymentsService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    getStats() {
        return this.paymentsService.getStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getOne(@Param('id') id: string): Promise<Payment | null> {
        return this.paymentsService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() data: Partial<Payment>): Promise<Payment> {
        return this.paymentsService.create(data);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from './payments.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepo: Repository<Payment>,
    ) { }

    async findAll(query): Promise<Payment[]> {
        const { status, method, from, to, page = 1, limit = 10 } = query;
        const filters: any = {};

        if (status) filters.status = status;
        if (method) filters.method = method;
        if (from && to) {
            filters.createdAt = Between(new Date(from), new Date(to));
        }

        return this.paymentsRepo.find({
            where: filters,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(id: number): Promise<Payment | null> {
        return this.paymentsRepo.findOne({ where: { id } });
    }

    async create(data: Partial<Payment>): Promise<Payment> {
        const payment = this.paymentsRepo.create(data);
        return this.paymentsRepo.save(payment);
    }

    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        const totalToday = await this.paymentsRepo.count({
            where: { createdAt: Between(today, new Date()) },
        });

        const totalWeek = await this.paymentsRepo.count({
            where: { createdAt: Between(weekAgo, new Date()) },
        });

        const failedCount = await this.paymentsRepo.count({
            where: { status: 'failed' },
        });

        const revenueByDay = await this.paymentsRepo.query(`
    SELECT DATE("createdAt") as date, SUM(amount)::float AS revenue
    FROM payment
    WHERE "createdAt" >= NOW() - INTERVAL '7 days'
    GROUP BY date
    ORDER BY date ASC
  `);

        return {
            totalRevenue: (revenueByDay || []).reduce((sum, item) => sum + (item.revenue || 0), 0),
            totalPaymentsToday: totalToday,
            totalPaymentsThisWeek: totalWeek,
            failedTransactions: failedCount,
            revenueLast7Days: Array(7).fill(0).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const day = date.toISOString().split('T')[0];

                const dayData = revenueByDay.find(r => {
                    const revenueDate = typeof r.date === 'string' ? r.date : r.date?.toISOString?.();
                    return revenueDate?.startsWith(day);
                });

                return dayData ? Number(dayData.revenue) : 0;
            }),

        };
    }
}

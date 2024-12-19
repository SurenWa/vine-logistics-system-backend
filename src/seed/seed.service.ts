// seed.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import seedData from 'src/seed/data/sample.products.json';
//import sampleUsers from 'src/seed/data/sample-users.json'; // Assuming seed data is stored in a JSON file

@Injectable()
export class SeedService {
    constructor(private readonly prisma: PrismaService) {}

    async seedProducts() {
        for (const productData of seedData) {
            await this.prisma.products.create({
                data: {
                    name: productData.name,
                    year: productData.year,
                    barCode: productData.barCode,
                    isActive: Boolean(productData.isActive), // Convert to boolean
                    costPriceExcludingVat: productData.costPriceExcludingVat,
                    markupPercent: productData.markupPercent,
                    retailPriceExcludingVat:
                        productData.retailPriceExcludingVat,
                    retailPriceIncludingVat:
                        productData.retailPriceIncludingVat,
                    stockBalance: productData.stockBalance,
                    minimumStockBalance: productData.minimumStockBalance,
                    maximumStockBalance: productData.maximumStockBalance,
                    manufacturerId: productData.manufacturerId,
                    categoryId: productData.categoryId,
                    supplierId: productData.supplierId,
                    businessId: productData.businessId,
                    createdAt: new Date(productData.createdAt), // Convert to Date
                    updatedAt: new Date(productData.updatedAt), // Convert to Date
                },
            });
        }
        console.log('Product seeded successfully.');
    }

    // async seedUsers() {
    //     for (const usersData of sampleUsers) {
    //         await this.prisma.user.create({
    //             data: usersData,
    //         });
    //     }
    //     console.log('Businesses seeded successfully.');
    // }
}

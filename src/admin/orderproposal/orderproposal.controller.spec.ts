import { Test, TestingModule } from '@nestjs/testing';
import { OrderproposalController } from './orderproposal.controller';
import { OrderproposalService } from './orderproposal.service';

describe('OrderproposalController', () => {
    let controller: OrderproposalController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderproposalController],
            providers: [OrderproposalService],
        }).compile();

        controller = module.get<OrderproposalController>(
            OrderproposalController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

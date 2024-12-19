import { Test, TestingModule } from '@nestjs/testing';
import { OrderproposalService } from './orderproposal.service';

describe('OrderproposalService', () => {
    let service: OrderproposalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrderproposalService],
        }).compile();

        service = module.get<OrderproposalService>(OrderproposalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SubusersService } from './subusers.service';

describe('SubusersService', () => {
    let service: SubusersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubusersService],
        }).compile();

        service = module.get<SubusersService>(SubusersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
